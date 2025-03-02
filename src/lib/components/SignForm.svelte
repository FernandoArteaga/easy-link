<script lang="ts">
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { AtSign, RectangleEllipsis } from 'lucide-svelte';
	import type { AuthError } from 'firebase/auth';
	import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

	type Props = {
		formType: 'signin' | 'signup';
	};
	let { formType }: Props = $props();
	export const toast: ToastContext = getContext('toast');

	let inputEmail: string = $state('');
	let inputPwd: string = $state('');
	let disabled = $derived(inputEmail === '' || inputPwd === '');

	let handleErrorMessages = (error: AuthError) => {
		let message = error.message;
		switch (error.code) {
			case 'auth/user-not-found':
				message = 'User not found. Please sign up 😃';
				break;
			case 'auth/password-does-not-meet-requirements':
				message =
					'The password does not meet the requirements. It must be at least 6 characters long and contain at least: one uppercase letter, one lowercase letter, and one number.';
				break;
			case 'auth/email-already-in-use':
				message = 'Email already in use. Please sign in 😃';
				break;
			case 'auth/invalid-credential':
				message = 'Your email or password is incorrect. Please try again 😃';
				break;
			default:
				message = error.message;
		}
		toast.create({
			title: 'Error',
			description: message,
			type: 'error'
		});
	};

	let submit = (e: SubmitEvent) => {
		e.preventDefault();
		if (formType === 'signin') {
			signIn();
		} else {
			signUp();
		}
	};
	let signIn = () => {
		signInWithEmailAndPassword(auth, inputEmail, inputPwd)
			.then(() => {
				goto('/links');
			})
			.catch((error) => {
				handleErrorMessages(error);
			});
	};
	let signUp = () => {
		createUserWithEmailAndPassword(auth, inputEmail, inputPwd)
			.then(() => {
				goto('/links');
			})
			.catch((error) => {
				handleErrorMessages(error);
			});
	};
</script>

<div class="flex flex-col items-center space-y-4">
	<!--    <button-->
	<!--        type="button"-->
	<!--        class="btn preset-filled-secondary-500 w-full"-->
	<!--    >-->
	<!--        Sign in with Google-->
	<!--    </button>-->
	<!--    <p>-&#45;&#45; Or -&#45;&#45;</p>-->
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
