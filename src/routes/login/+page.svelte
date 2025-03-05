<script lang="ts">
	import SignInForm from '$lib/components/SignInForm.svelte';
	import SignUpForm from '$lib/components/SignUpForm.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let group = $state('sign-in');
</script>

<div class="mx-auto flex h-svh max-w-96 items-center justify-center">
	<Tabs value={group} onValueChange={(e) => (group = e.value)} fluid classes="p-4 ">
		{#snippet list()}
			<Tabs.Control value="sign-in">Sign in</Tabs.Control>
			<Tabs.Control value="sign-up">Sign up</Tabs.Control>
		{/snippet}
		{#snippet content()}
			<Tabs.Panel value="sign-in">
				<SignInForm />
			</Tabs.Panel>
			<Tabs.Panel value="sign-up">
				<SignUpForm />
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</div>
