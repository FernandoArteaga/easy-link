<script lang="ts">
	import { goto } from '$app/navigation';
	import { CornerDownRight, Link2 } from 'lucide-svelte';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { createLink } from '$lib/firestore/links';
	import sessionStore from '$lib/stores/session.svelte';
	import LinksList from '$lib/components/LinksList.svelte';

	let inputLink: string | undefined = $state(undefined);

	let submit = async () => {
		if (!inputLink) return;
		if (!sessionStore.user) return;
		const newLink: Firestore.CreateLink = {
			url: inputLink
		};
		await createLink(sessionStore.user.uid, newLink);
		inputLink = undefined;
	};
	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				sessionStore.signOut();
				goto('/login');
			})
			.catch((error) => {
				console.error(error);
			});
	};
</script>

<div class="mx-auto flex max-w-4/5 flex-col justify-center pb-12 sm:max-w-lg">
	<div class="bg-surface-50-950 sticky -top-4 z-10 space-y-10 py-12">
		<nav class="btn-group preset-outlined-surface-200-800 w-full flex-col p-2 md:flex-row-reverse">
			<button type="button" class="btn btn-sm preset-filled w-fit" onclick={handleLogout}>
				Sign out
			</button>
		</nav>
		<div class="w-full">
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">
					<Link2 size={16} />
				</div>
				<input
					bind:value={inputLink}
					name="link"
					class="ig-input"
					type="text"
					placeholder="Add link"
				/>
				<button class="ig-btn preset-filled bg-secondary-500" type="submit" onclick={submit}>
					<CornerDownRight size={16} />
				</button>
			</div>
		</div>
	</div>

	<div class="space-y-4 overflow-auto">
		<LinksList />
	</div>
</div>
