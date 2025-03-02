<script lang="ts">
	import SignForm from '$lib/components/SignForm.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let group = $state('signin');
</script>

<div class="mx-auto flex h-svh max-w-96 items-center justify-center">
	<Tabs bind:value={group} fluid classes="p-4 ">
		{#snippet list()}
			<Tabs.Control value="signin">Sign in</Tabs.Control>
			<Tabs.Control value="signup">Sign up</Tabs.Control>
		{/snippet}
		{#snippet content()}
			<Tabs.Panel value="signin">
				<SignForm formType="signin" />
			</Tabs.Panel>
			<Tabs.Panel value="signup">
				<SignForm formType="signup" />
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</div>
