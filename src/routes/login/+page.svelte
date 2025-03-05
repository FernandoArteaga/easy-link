<script lang="ts">
	import SignInForm from '$lib/components/SignInForm.svelte';
	import SignUpForm from '$lib/components/SignUpForm.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let group = $state('sign-in');
</script>

<div class="mx-auto flex h-svh max-w-96 items-center justify-center">
	<Tabs value={group} onValueChange={(e) => (group = e.value)} classes="p-4" fluid composite>
		{#snippet list()}
			<Tabs.Control value="sign-in">Sign in</Tabs.Control>
			<Tabs.Control value="sign-up">Sign up</Tabs.Control>
		{/snippet}
		{#snippet content()}
			{#if group === 'sign-in'}
				<SignInForm />
			{:else}
				<SignUpForm />
			{/if}
		{/snippet}
	</Tabs>
</div>
