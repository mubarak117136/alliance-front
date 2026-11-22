<template>
	<!-- Top level: always-visible section headers -->
	<div v-if="depth === 0">
		<section v-for="item in items" :key="item.id">
			<NuxtLink
				:to="`/stores/${item.slug}`"
				class="relative block px-7 py-3.5 bg-gray-100 border-b border-gray-200 font-condensed font-bold text-[22px] leading-tight uppercase tracking-tight transition-colors hover:text-accent [overflow-wrap:anywhere]"
				:class="isActive(item) ? 'text-accent' : 'text-gray-900'"
				@click="onNavigate?.()"
			>
				<span
					v-if="isActive(item)"
					class="absolute left-0 inset-y-0 w-1.5 bg-accent"
				/>
				{{ item.name }}
			</NuxtLink>
			<MobileCategoryAccordion
				v-if="item.children?.length"
				:items="item.children"
				:depth="1"
				:active-slug="activeSlug"
				:on-navigate="onNavigate"
			/>
		</section>
	</div>

	<!-- Level 2+: rows, chevron expands deeper levels -->
	<ul v-else :class="depth > 1 ? 'bg-gray-50' : 'bg-white'">
		<li v-for="item in items" :key="item.id" class="border-b border-gray-200">
			<div class="relative flex items-stretch">
				<span
					v-if="isActive(item)"
					class="absolute left-0 inset-y-0 w-1.5 bg-accent z-10"
				/>
				<NuxtLink
					:to="`/stores/${item.slug}`"
					class="flex-1 min-w-0 flex items-center pr-2 uppercase transition-colors hover:text-accent [overflow-wrap:anywhere]"
					:class="[
						rowClass,
						isActive(item) ? 'text-accent font-semibold' : colorClass,
					]"
					:style="{ paddingLeft: `${28 + (depth - 1) * 16}px` }"
					@click="onNavigate?.()"
				>
					{{ item.name }}
				</NuxtLink>
				<button
					v-if="item.children?.length"
					type="button"
					class="w-14 shrink-0 flex items-center justify-center text-gray-800 hover:text-accent transition-colors"
					:aria-expanded="openId === item.id"
					:aria-label="`${openId === item.id ? 'Collapse' : 'Expand'} ${item.name}`"
					@click="toggle(item.id)"
				>
					<Icon
						name="mdi:chevron-right"
						:size="depth === 1 ? '28' : '22'"
						class="transition-transform duration-200"
						:class="openId === item.id ? 'rotate-90' : ''"
					/>
				</button>
			</div>

			<div
				v-if="item.children?.length"
				class="grid transition-[grid-template-rows] duration-200 ease-out"
				:class="openId === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
				:inert="openId !== item.id"
			>
				<div class="overflow-hidden border-t border-gray-200 -mb-px">
					<MobileCategoryAccordion
						:items="item.children"
						:depth="depth + 1"
						:active-slug="activeSlug"
						:on-navigate="onNavigate"
					/>
				</div>
			</div>
		</li>
	</ul>
</template>

<script setup>
const props = defineProps({
	items: { type: Array, required: true },
	depth: { type: Number, default: 0 },
	activeSlug: { type: String, default: null },
	onNavigate: { type: Function, default: null },
});

const containsSlug = (node, slug) =>
	!!slug &&
	(node.slug === slug ||
		(node.children ?? []).some((c) => containsSlug(c, slug)));

const isActive = (item) => !!props.activeSlug && item.slug === props.activeSlug;

// Single-open accordion per level; auto-expand the branch holding the active category
const openId = ref(
	props.items.find(
		(i) =>
			i.children?.length &&
			i.slug !== props.activeSlug &&
			containsSlug(i, props.activeSlug),
	)?.id ?? null,
);

const toggle = (id) => {
	openId.value = openId.value === id ? null : id;
};

const rowClass = computed(() => {
	if (props.depth === 1) return "py-4 text-[15px] font-medium tracking-wider";
	if (props.depth === 2) return "py-3 text-[13px] font-medium tracking-wide";
	return "py-2.5 text-xs font-medium tracking-wide";
});

const colorClass = computed(() => {
	if (props.depth === 1) return "text-gray-800";
	if (props.depth === 2) return "text-gray-600";
	return "text-gray-500";
});
</script>
