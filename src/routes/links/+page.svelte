<script lang="ts">
	import { goto } from '$app/navigation';
	import { CornerDownRight, Link2, X, Sun, Moon } from 'lucide-svelte';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { createLink } from '$lib/firestore/links';
	import sessionStore from '$lib/stores/session.svelte';
	import themeStore from '$lib/stores/theme.svelte';
	import LinksList from '$lib/components/LinksList.svelte';
	import sanitize from '$lib/utils/sanitizer';

	let inputLink: string | undefined = $state(undefined);

	let submit = async () => {
		if (!inputLink) return;
		const newLink: Firestore.CreateLink = {
			url: sanitize(inputLink),
		};
		await createLink(sessionStore.user!.uid, newLink);
		inputLink = undefined;
	}

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				sessionStore.signOut();
				goto('/login');
			})
			.catch((error) => {
				console.error(error);
			});
	}

	const changeTheme = () => {
		themeStore.theme = themeStore.theme === 'light' ? 'dark' : 'light'
	}

	const navButton = 'btn btn-sm preset-filled w-fit min-w-20';
</script>

<div class="mx-auto flex max-w-9/10 flex-col justify-center pb-12 sm:max-w-xl">
	<div class="bg-surface-50-950 sticky -top-4 z-10 space-y-10 py-12">
		<nav class="btn-group preset-outlined-surface-200-800 w-full flex-row flex-wrap justify-end p-2">
			<button class={navButton} onclick={changeTheme}>
				{#if themeStore.isLight()}
					<Moon size={16} />
				{:else}
					<Sun size={16} />
				{/if}
			</button>
			<button type="button" class={navButton} onclick={handleLogout}>
				Sign out
			</button>
		</nav>
		<div class="w-full">
			<div class="input-group grid-cols-[auto_1fr_auto]">
				{#if inputLink}
					<button class="ig-cell preset-tonal-primary hover:preset-filled-primary-500 cursor-pointer" onclick={() => (inputLink = undefined)}>
						<X size={16} />
					</button>
				{:else}
					<div class="ig-cell preset-tonal">
						<Link2 size={16} />
					</div>
				{/if}
				<input
					bind:value={inputLink}
					name="link"
					class="ig-input"
					type="text"
					placeholder="Add link"
				/>
				<button class="ig-btn preset-filled-secondary-500" type="submit" onclick={submit}>
					<CornerDownRight size={16} />
				</button>
			</div>
		</div>
	</div>

	<div class="space-y-4 overflow-auto">
		<LinksList />
	</div>
</div>
