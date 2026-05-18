<template>
	<div class="flex flex-col gap-1">
		<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">Brands</h3>
		<button
			type="button"
			class="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
			:class="!selectedBrand ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'"
			@click="selectBrand('')"
		>
			<span>All Brands</span>
			<Icon v-if="!selectedBrand" name="mdi:check" size="13" class="text-primary" />
		</button>
		<button
			v-for="(item, idx) in data"
			:key="'brand_' + idx"
			type="button"
			class="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
			:class="selectedBrand === item.brand__slug ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'"
			@click="selectBrand(item.brand__slug)"
		>
			<span>{{ item.brand__name }}</span>
			<Icon v-if="selectedBrand === item.brand__slug" name="mdi:check" size="13" class="text-primary" />
		</button>
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";
import { useRoute } from "#vue-router";

const route = useRoute();
const router = useRouter();

const { data } = defineProps({ data: null });

const selectedBrand = ref("");

const selectBrand = (slug) => {
	selectedBrand.value = slug;
	const query = deepCopy(route.query);
	if (!slug) {
		delete query.brand;
	} else {
		query.brand = slug;
	}
	query.offset = 0;
	router.push({ query });
};

onMounted(() => {
	if (route.query.brand) selectedBrand.value = route.query.brand;
});
</script>
