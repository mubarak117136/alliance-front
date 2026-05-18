<template>
	<div
		class="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
		>
			<div class="flex items-center gap-2.5">
				<div
					class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
				>
					<Icon name="mdi:filter-variant" size="15" class="text-primary" />
				</div>
				<span class="text-sm font-bold text-gray-800">Filters</span>
				<span
					v-if="activeCount > 0"
					class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none"
				>
					{{ activeCount }}
				</span>
			</div>
			<button
				v-if="hasActiveFilters"
				class="text-xs text-accent font-semibold px-2.5 py-1 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
				@click="clearFilters"
			>
				Reset all
			</button>
		</div>

		<StoresFiltersCategory />
		<StoresFiltersPriceRange :data="apiPriceRange" />
		<StoresFiltersBrand :brands="brands" />
		<StoresFiltersAttributes v-if="apiAttrs.length" :data="apiAttrs" />
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";

const route = useRoute();
const router = useRouter();

const { brands, apiPriceRange, apiAttrs, fetchFilters } = useProductFilters();

onMounted(() => fetchFilters());
watch(() => route.params.category, () => fetchFilters());

const attrSlugs = computed(() => apiAttrs.value.map((a) => a.slug));

const hasActiveFilters = computed(
	() =>
		!!(
			route.query.categories ||
			route.query.brand ||
			route.query.price_min ||
			route.query.price_max ||
			attrSlugs.value.some((s) => route.query[s])
		),
);

const activeCount = computed(() => {
	let count = 0;
	if (route.query.categories) count += route.query.categories.split(",").length;
	if (route.query.brand) count += 1;
	if (route.query.price_min) count += 1;
	if (route.query.price_max) count += 1;
	count += attrSlugs.value.filter((s) => route.query[s]).length;
	return count;
});

function clearFilters() {
	const query = deepCopy(route.query);
	delete query["categories"];
	delete query["brand"];
	delete query["price_min"];
	delete query["price_max"];
	for (const slug of attrSlugs.value) delete query[slug];
	query["offset"] = 0;
	router.push({ query });
}
</script>
