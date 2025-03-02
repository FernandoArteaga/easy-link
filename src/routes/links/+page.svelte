<script lang="ts">
	import { goto } from '$app/navigation';
	import { CornerDownRight, Link, Sun, Moon, Eraser } from 'lucide-svelte';
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
	<div class="bg-surface-50-950 sticky -top-4 z-10 pb-12">
		<nav class="w-full flex flex-row flex-wrap justify-end items-center space-x-2 py-8">
			<button class={navButton} onclick={changeTheme}>
				{#if themeStore.isLight()}
					<Moon size={14} />
				{:else}
					<Sun size={14} />
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
						<Eraser size={16} />
					</button>
				{:else}
					<div class="ig-cell preset-tonal">
						<Link size={16} />
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
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
		<LinksList />
	</div>
</div>
