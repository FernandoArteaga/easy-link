<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import SignForm from './SignForm.svelte';

	let group = $state('signin');
</script>

<div class="mx-auto flex h-svh max-w-96 items-center justify-center">
	<Tabs bind:value={group} fluid>
		{#snippet list()}
			<Tabs.Control value="signin">Sign in</Tabs.Control>
			<Tabs.Control value="signup">Sign up</Tabs.Control>
		{/snippet}
		{#snippet content()}
			<div class="p-4">
				<Tabs.Panel value="signin">
					<SignForm formType="signin" />
				</Tabs.Panel>
				<Tabs.Panel value="signup">
					<SignForm formType="signup" />
				</Tabs.Panel>
			</div>
		{/snippet}
	</Tabs>
</div>
