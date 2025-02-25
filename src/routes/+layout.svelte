<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="container mx-auto p-4">
{@render children()}
</main>