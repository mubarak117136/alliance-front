<template>
	<ul :class="listClass">
		<li v-for="item in items" :key="item.id">
			<NuxtLink
				:to="`/stores/${item.slug}`"
				class="block uppercase transition-colors leading-snug [overflow-wrap:anywhere]"
				:class="linkClass"
			>
				{{ item.name }}
			</NuxtLink>
			<FooterCategoryTree
				v-if="item.children?.length"
				:items="item.children"
				:depth="depth + 1"
			/>
		</li>
	</ul>
</template>

<script setup>
const props = defineProps({
	items: { type: Array, required: true },
	// 1 = direct children of a top-level category
	depth: { type: Number, default: 1 },
});

const listClass = computed(() => {
	if (props.depth === 1) return "mt-3 space-y-2";
	if (props.depth === 2) return "mt-1.5 mb-1 space-y-1";
	return "mt-1 mb-1 ml-1 pl-2.5 border-l border-white/10 space-y-1";
});

const linkClass = computed(() => {
	if (props.depth === 1)
		return "font-sans font-semibold text-[12px] tracking-wide text-white/85 hover:text-accent";
	if (props.depth === 2)
		return "font-sans font-medium text-[10.5px] tracking-wider text-white/50 hover:text-white";
	return "font-sans font-medium text-[10px] tracking-wider text-white/40 hover:text-white";
});
</script>
