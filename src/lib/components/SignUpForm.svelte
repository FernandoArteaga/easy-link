<script lang="ts">
	import { Lock, Mail } from '@lucide/svelte'
	import { createUserWithEmailAndPassword } from 'firebase/auth'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { auth } from '#lib/firebase.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import InputField from '#lib/components/InputField.svelte'
	import { btn } from '#lib/utils/styles.ts'
	import { createUser } from '#lib/firestore/users.ts'

	const toast = toasterCtx.getCtx()

	let inputEmail: string = $state('')
	let inputPwd: string = $state('')
	let inputConfirmPwd: string = $state('')
	let disabled = $derived(inputEmail === '' || inputPwd === '' || inputPwd !== inputConfirmPwd)

	let submit = (e: SubmitEvent) => {
		e.preventDefault()
		createUserWithEmailAndPassword(auth, inputEmail, inputPwd)
			.then(async (credentials) => {
				await createUser(credentials.user.uid)
				await goto(resolve('links'))
			})
			.catch((error) => {
				toast.create({
					description: handleErrorMessages(error),
					type: 'error',
				})
			})
	}
</script>

<div>
	<form class="flex w-full flex-col gap-4" onsubmit={submit}>
		<InputField
			name="email"
			type="email"
			label="Email"
			placeholder="you@example.com"
			autocomplete="email"
			bind:value={inputEmail}
			attr={{ required: true }}
		>
			{#snippet icon()}
				<Mail size={20} class="flex-none" aria-hidden="true" />
			{/snippet}
		</InputField>
		<InputField
			name="new-password"
			type="password"
			label="Password"
			autocomplete="new-password"
			canReveal
			bind:value={inputPwd}
			attr={{ minlength: 6, maxlength: 64, required: true }}
		>
			{#snippet icon()}
				<Lock size={20} class="flex-none" aria-hidden="true" />
			{/snippet}
		</InputField>
		<InputField
			name="confirm-password"
			type="password"
			label="Confirm password"
			autocomplete="new-password"
			canReveal
			bind:value={inputConfirmPwd}
			attr={{ minlength: 6, maxlength: 64, required: true }}
		>
			{#snippet icon()}
				<Lock size={20} class="flex-none" aria-hidden="true" />
			{/snippet}
		</InputField>
		<button type="submit" class="{btn('primary', true)} mt-2 h-13" {disabled}>Create account</button
		>
	</form>
</div>
