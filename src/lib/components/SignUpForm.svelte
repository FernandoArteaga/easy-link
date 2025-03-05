<script lang="ts">
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { AtSign, RectangleEllipsis } from 'lucide-svelte';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { handleErrorMessages } from '$lib/firestore/authentication';

	export const toast: ToastContext = getContext('toast');

	let inputEmail: string = $state('');
	let inputPwd: string = $state('');
	let disabled = $derived(inputEmail === '' || inputPwd === '');

	let submit = (e: SubmitEvent) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, inputEmail, inputPwd)
			.then(() => {
				goto('/links');
			})
			.catch((error) => {
				toast.create({
					title: 'Error',
					description: handleErrorMessages(error),
					type: 'error'
				});
			});
	};
</script>

<div class="flex flex-col items-center space-y-4">
	<form class="w-full space-y-4" onsubmit={submit}>
		<div class="input-group grid-cols-[auto_1fr_auto]">
			<div class="ig-cell preset-tonal">
				<AtSign size={16} />
			</div>
			<input
				bind:value={inputEmail}
				name="email"
				class="ig-input"
				type="email"
				placeholder="Email"
				autocomplete="email"
				required
			/>
		</div>
		<div class="input-group grid-cols-[auto_1fr_auto]">
			<div class="ig-cell preset-tonal">
				<RectangleEllipsis size={16} />
			</div>
			<input
				bind:value={inputPwd}
				name="password"
				class="ig-input"
				type="password"
				placeholder="Password"
				autocomplete="current-password"
				minlength="6"
				maxlength="64"
				required
			/>
		</div>
		<button type="submit" class="btn preset-filled-primary-500 w-full" {disabled}> Submit </button>
	</form>
</div>
