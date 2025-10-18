<script lang="ts">
	import { getContext } from 'svelte'
	import { AtSign, RectangleEllipsis } from 'lucide-svelte'
	import { createUserWithEmailAndPassword } from 'firebase/auth'
	import { auth } from '$lib/firebase'
	import { goto } from '$app/navigation'
	import { handleErrorMessages } from '$lib/firestore/authentication'
	import InputField from '$lib/components/InputField.svelte'

	export const toast = getContext('toast')

	let inputEmail: string = $state('')
	let inputPwd: string = $state('')
	let inputConfirmPwd: string = $state('')
	let disabled = $derived(inputEmail === '' || inputPwd === '' || inputPwd !== inputConfirmPwd)

	let submit = (e: SubmitEvent) => {
		e.preventDefault()
		createUserWithEmailAndPassword(auth, inputEmail, inputPwd)
			.then(() => {
				goto('/links')
			})
			.catch((error) => {
				toast.create({
					title: 'Error',
					description: handleErrorMessages(error),
					type: 'error',
				})
			})
	}
</script>

<div class="flex flex-col items-center space-y-4">
	<form class="w-full space-y-4" onsubmit={submit}>
		<InputField
			name="email"
			type="email"
			placeholder="Email"
			autocomplete="email"
			bind:value={inputEmail}
			attr={{ required: true }}
		>
			{#snippet icon()}
				<AtSign size={16} />
			{/snippet}
		</InputField>
		<InputField
			name="new-password"
			type="password"
			placeholder="Password"
			autocomplete="new-password"
			canReveal
			bind:value={inputPwd}
			attr={{ minlength: 6, maxlength: 64, required: true }}
		>
			{#snippet icon()}
				<RectangleEllipsis size={16} />
			{/snippet}
		</InputField>
		<InputField
			name="confirm-password"
			type="password"
			placeholder="Confirm password"
			autocomplete="new-password"
			canReveal
			bind:value={inputConfirmPwd}
			attr={{ minlength: 6, maxlength: 64, required: true }}
		>
			{#snippet icon()}
				<RectangleEllipsis size={16} />
			{/snippet}
		</InputField>
		<button type="submit" class="btn preset-filled-primary-500 w-full" {disabled}> Submit </button>
	</form>
</div>
