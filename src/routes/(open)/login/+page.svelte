<script lang="ts">
	import SignInForm from '#lib/components/SignInForm.svelte'
	import SignUpForm from '#lib/components/SignUpForm.svelte'

	type Mode = 'sign-in' | 'sign-up'
	let mode = $state<Mode>('sign-in')
	const options: { value: Mode; label: string }[] = [
		{ value: 'sign-in', label: 'Sign in' },
		{ value: 'sign-up', label: 'Sign up' },
	]
</script>

<div class="mx-auto flex w-full max-w-sm flex-col gap-6 px-5 pt-12 pb-8 sm:pt-20">
	<img src="/logo.png" alt="" class="size-16" />
	<div>
		<h1 class="text-[32px] leading-9 font-extrabold tracking-[-0.02em]">
			Your links,<br />everywhere.
		</h1>
		<p class="text-ink-muted mt-2 text-[15px] leading-[22px] font-medium">
			Save a link on one device, open it on another.
		</p>
	</div>
	<div class="bg-surface-2 grid grid-cols-2 rounded-md p-1" role="tablist" aria-label="Account">
		{#each options as option (option.value)}
			{@const selected = mode === option.value}
			<button
				type="button"
				role="tab"
				id={`tab-${option.value}`}
				aria-selected={selected}
				aria-controls="auth-panel"
				class="h-10 rounded-[9px] text-sm leading-[18px] font-bold transition-colors {selected
					? 'bg-surface text-ink shadow-card'
					: 'text-ink-muted'}"
				onclick={() => (mode = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
	<div id="auth-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>
		{#if mode === 'sign-in'}
			<SignInForm />
		{:else}
			<SignUpForm />
		{/if}
	</div>
</div>
