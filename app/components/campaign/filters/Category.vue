<template>
	<div class="flex flex-col gap-1">
		<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">Categories</h3>
		<button
			type="button"
			class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left"
			:class="!route.query.category ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'"
			@click="handleCategoryClick(null)"
		>
			<span class="flex-1 truncate">All</span>
			<Icon v-if="!route.query.category" name="mdi:check" size="13" class="text-primary shrink-0" />
		</button>
		<button
			v-for="(item, idx) in data"
			:key="'cat_' + idx"
			type="button"
			class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left"
			:class="route.query.category === item.category__slug ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'"
			@click="handleCategoryClick(item)"
		>
			<span class="flex-1 truncate">{{ item.category__name }}</span>
			<Icon
				:name="route.query.category === item.category__slug ? 'mdi:check' : 'mdi:chevron-right'"
				size="13"
				class="shrink-0"
				:class="route.query.category === item.category__slug ? 'text-primary' : 'text-gray-400'"
			/>
		</button>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";

const route = useRoute();
const router = useRouter();

const { data } = defineProps({ data: null });

const handleCategoryClick = (item) => {
	if (!item) {
		const query = { ...route.query };
		delete query.category;
		router.push({ query });
	} else {
		router.push({ query: { category: item.category__slug } });
	}
};
</script>
