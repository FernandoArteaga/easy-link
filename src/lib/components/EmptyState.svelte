<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte'

	type Props = {
		Icon: LucideIcon
		title: string
		hint: string
	}
	let { Icon, title, hint }: Props = $props()
</script>

<div class="flex flex-col items-center gap-2 px-6 py-8 text-center">
	<div class="bg-violet-soft text-violet-text mb-2 grid size-16 place-items-center rounded-full">
		<Icon size={28} aria-hidden="true" />
	</div>
	<h3 class="text-[17px] leading-6 font-bold">{title}</h3>
	<p class="text-ink-muted max-w-70 text-[15px] leading-[22px] font-medium">{hint}</p>
</div>
