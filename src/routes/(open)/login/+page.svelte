<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import SignInForm from '$lib/components/SignInForm.svelte'
	import SignUpForm from '$lib/components/SignUpForm.svelte'
</script>

<div class="mx-auto flex h-svh w-full max-w-96 items-center justify-center">
	<Tabs defaultValue="sign-in" composite>
		<Tabs.List>
			<Tabs.Trigger class="flex-1" value="sign-in">Sign in</Tabs.Trigger>
			<Tabs.Trigger class="flex-1" value="sign-up">Sign up</Tabs.Trigger>
			<Tabs.Indicator />
		</Tabs.List>
		<Tabs.Content value="sign-in">
			<SignInForm />
		</Tabs.Content>
		<Tabs.Content value="sign-up">
			<SignUpForm />
		</Tabs.Content>
	</Tabs>
</div>
