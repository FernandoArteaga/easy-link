<script lang="ts">
	import { goto } from '$app/navigation';
	import { CornerDownRight, Link2 } from 'lucide-svelte';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import sessionStore from '$lib/stores/session.svelte';
	import Links from '$lib/components/Links.svelte';

	let inputLink: string | undefined = $state(undefined)

	let submit = (e: SubmitEvent) => {
		e.preventDefault();
		console.log(inputLink);
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

<div class="mx-auto flex max-w-4/5 flex-col justify-center space-y-10 py-12 sm:max-w-lg">
	<nav class="btn-group preset-outlined-surface-200-800 flex-col p-2 md:flex-row-reverse">
		<button type="button" class="btn btn-sm preset-filled w-fit" onclick={handleLogout}
			>Sign out</button
		>
	</nav>
	<form class="w-full space-y-8" onsubmit={submit}>
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
			<button class="ig-btn preset-filled bg-secondary-500" type="submit">
				<CornerDownRight size={16} />
			</button>
		</div>
	</form>
	<div class="space-y-4">
		<Links />
	</div>
</div>
