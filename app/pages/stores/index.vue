<template>
	<div class="w-full max-w-[1280px] mx-auto px-2 sm:px-4 lg:px-6 py-6">
		<div class="flex gap-5 items-start">
			<!-- ── Sidebar (desktop) ── -->
			<aside class="hidden lg:block w-72 shrink-0 sticky top-[90px]">
				<StoresSideBar />
			</aside>

			<!-- ── Main content ── -->
			<div class="flex-1 min-w-0">
				<!-- Toolbar -->
				<!-- Mobile toolbar -->
				<div class="lg:hidden mb-4">
					<!-- Title row -->
					<div class="flex items-baseline gap-2 mb-3">
						<h1
							class="text-xl font-black text-gray-900 tracking-tight leading-tight"
						>
							{{
								selectedSearch
									? `Results for "${selectedSearch}"`
									: selectedCategoryObj?.name ?? "All Products"
							}}
						</h1>
						<span class="text-xs text-gray-400 font-medium"
							>{{ totalItem }} results</span
						>
					</div>
					<!-- Controls row -->
					<div class="flex items-center gap-2">
						<button
							class="flex items-center gap-1.5 text-sm font-semibold rounded-full px-4 py-2 border-2 transition-colors shrink-0"
							:class="
								hasActiveFilters
									? 'bg-primary text-white border-primary'
									: 'bg-white text-gray-700 border-gray-200'
							"
							@click="drawerOpen = true"
						>
							<Icon name="mdi:filter-variant" size="15" />
							Filters
							<span
								v-if="hasActiveFilters"
								class="w-4 h-4 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center leading-none"
								>{{ activeFilterCount }}</span
							>
						</button>

						<div class="ml-auto relative flex items-center">
							<Icon
								name="mdi:sort"
								size="15"
								class="absolute left-3 text-gray-400 pointer-events-none"
							/>
							<select
								v-model="sortOrder"
								class="appearance-none text-sm border border-gray-200 rounded-full pl-8 pr-8 py-2 outline-none focus:border-primary bg-white text-gray-700 cursor-pointer"
								@change="handleUpdateSortOrder"
							>
								<option
									v-for="opt in sortOrderTypeChoice"
									:key="opt.value"
									:value="opt.value"
								>
									{{ opt.label }}
								</option>
							</select>
							<Icon
								name="mdi:chevron-down"
								size="14"
								class="absolute right-3 text-gray-400 pointer-events-none"
							/>
						</div>
					</div>
				</div>

				<!-- Desktop toolbar -->
				<div class="hidden lg:flex items-center gap-3 mb-4">
					<div>
						<h1
							class="text-lg font-extrabold text-gray-900 tracking-tight leading-tight"
						>
							{{
								selectedSearch
									? `Results for "${selectedSearch}"`
									: selectedCategoryObj?.name ?? "All Products"
							}}
						</h1>
						<p class="text-xs text-gray-400">{{ totalItem }} products found</p>
					</div>
					<div class="flex items-center gap-2 ml-auto">
						<span class="text-xs text-gray-400 shrink-0">Sort by:</span>
						<select
							v-model="sortOrder"
							class="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary bg-white text-gray-700 cursor-pointer"
							@change="handleUpdateSortOrder"
						>
							<option
								v-for="opt in sortOrderTypeChoice"
								:key="opt.value"
								:value="opt.value"
							>
								{{ opt.label }}
							</option>
						</select>
					</div>
				</div>

				<!-- Active filter chips -->
				<div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
					<span
						v-if="selectedSearch"
						class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full"
					>
						<Icon name="mdi:magnify" size="12" />
						"{{ selectedSearch }}"
						<button @click="removeSearch">
							<Icon name="mdi:close" size="12" />
						</button>
					</span>
					<span
						v-for="cat in selectedCategories"
						:key="'c' + cat"
						class="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full"
					>
						{{ findNestedObj(getCategories.value, "slug", cat)?.name ?? cat }}
						<button @click="removeCategory(cat)">
							<Icon name="mdi:close" size="12" />
						</button>
					</span>
					<span
						v-if="selectedBrand"
						class="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent font-medium px-2.5 py-1 rounded-full"
					>
						{{ selectedBrand }}

						<button @click="removeBrand">
							<Icon name="mdi:close" size="12" />
						</button>
					</span>
				</div>

				<!-- Loading skeleton -->
				<div
					v-if="loading"
					class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
				>
					<div
						v-for="n in 16"
						:key="'sk' + n"
						class="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]"
					/>
				</div>

				<template v-else>
					<!-- Products grid -->
					<div
						v-if="products.length"
						class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
					>
						<SingleProduct
							v-for="product in products"
							:key="product.slug"
							:product="product"
						/>
					</div>

					<!-- Empty state -->
					<div
						v-else
						class="flex flex-col items-center justify-center py-20 text-center"
					>
						<div
							class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"
						>
							<Icon
								name="mdi:package-variant"
								class="text-gray-300"
								size="32"
							/>
						</div>
						<p class="text-gray-500 font-semibold">No products found</p>
						<p class="text-gray-400 text-sm mt-1">
							Try adjusting or clearing your filters
						</p>
						<button
							class="mt-4 text-sm text-primary font-semibold hover:text-accent transition-colors"
							@click="clearFilters"
						>
							Clear filters
						</button>
					</div>
				</template>

				<!-- Pagination -->
				<div
					v-if="totalPage > 1"
					class="flex items-center justify-center gap-1.5 mt-8"
				>
					<button
						:disabled="currentPage === 1"
						class="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
						@click="currentPage--"
					>
						<Icon name="mdi:chevron-left" size="18" />
					</button>

					<!-- Mobile: current / total -->
					<span class="sm:hidden text-sm text-gray-600 font-semibold px-2">
						{{ currentPage }} / {{ totalPage }}
					</span>

					<!-- Desktop: full page numbers -->
					<template
						class="hidden sm:contents"
						v-for="page in pageNumbers"
						:key="'p' + page"
					>
						<span
							v-if="page === '...'"
							class="hidden sm:flex w-9 h-9 items-center justify-center text-gray-400 text-sm"
							>…</span
						>
						<button
							v-else
							class="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-sm font-semibold transition-all border"
							:class="
								page === currentPage
									? 'bg-primary text-white border-primary shadow-sm'
									: 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
							"
							@click="currentPage = page"
						>
							{{ page }}
						</button>
					</template>

					<button
						:disabled="currentPage === totalPage"
						class="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
						@click="currentPage++"
					>
						<Icon name="mdi:chevron-right" size="18" />
					</button>
				</div>
			</div>
		</div>

		<!-- ── Mobile filter drawer ── -->
		<MobileStoreFilter
			:open="drawerOpen"
			:filtered-count="totalItem"
			@close="drawerOpen = false"
		/>
	</div>
</template>

<script setup>
import { deepCopy, findNestedObj, calculateTotalPage } from "@/utils/utils";
import { useProductStore } from "@/stores/product";

const route = useRoute();
const router = useRouter();
const utilityStore = useUtilityStore();
const productStore = useProductStore();
const { getCategories } = storeToRefs(utilityStore);

const LIMIT = 36;

// ── Product list ──
const products = ref([]);
const loading = ref(false);
const totalPage = ref(0);
const totalItem = ref(0);

// ── Sort ──
const sortOrder = ref(
	route.query.sort_order ? Number(route.query.sort_order) : "",
);
const sortOrderTypeChoice = [
	{ label: "Default", value: "" },
	{ label: "Price (Low to High)", value: 1 },
	{ label: "Price (High to Low)", value: 2 },
	{ label: "Old to New", value: 3 },
	{ label: "New to Old", value: 4 },
];

// ── Pagination ──
const currentPage = ref(
	route.query.offset ? Math.floor(Number(route.query.offset) / LIMIT) + 1 : 1,
);
const drawerOpen = ref(false);

// ── Category ──
const selectedCategoryObj = computed(() => {
	if (!route.params.category) return null;
	return findNestedObj(getCategories.value, "slug", route.params.category);
});

// ── Filter state ──
const selectedCategories = computed(() => {
	const val = route.query.categories;
	return val ? val.split(",") : [];
});
const selectedBrand = computed(() => route.query.brand ?? "");
const selectedSearch = computed(() => route.query.search ?? "");
const hasActiveFilters = computed(
	() =>
		!!(
			route.query.categories ||
			route.query.brand ||
			route.query.price_min ||
			route.query.price_max ||
			route.query.search
		),
);
const activeFilterCount = computed(
	() =>
		selectedCategories.value.length +
		(selectedBrand.value ? 1 : 0) +
		(route.query.price_min ? 1 : 0) +
		(route.query.price_max ? 1 : 0) +
		(selectedSearch.value ? 1 : 0),
);

// ── Fetch ──
const handleProductFetch = () => {
	loading.value = true;
	const params = deepCopy(route.query);
	if (!params["limit"]) params["limit"] = LIMIT;
	if (!params["offset"]) params["offset"] = 0;
	if (route.params?.category) params["category"] = route.params.category;

	productStore
		.fetchProducts(params)
		.then((d) => {
			loading.value = false;
			products.value = d.results;
			totalPage.value = calculateTotalPage(d.count, LIMIT);
			totalItem.value = d.count;
		})
		.catch((e) => {
			loading.value = false;
			console.log(e);
		});
};

onMounted(() => {
	if (route.query.sort_order) sortOrder.value = Number(route.query.sort_order);
	if (route.query.offset)
		currentPage.value = Math.floor(Number(route.query.offset) / LIMIT) + 1;
	handleProductFetch();
});

watch(currentPage, (val) => {
	const query = deepCopy(route.query);
	query["limit"] = LIMIT;
	query["offset"] = val * LIMIT - LIMIT;
	router.push({ query });
});

watch(
	() => route,
	(val) => {
		if (val?.query?.limit == LIMIT && val?.query?.offset == 0)
			currentPage.value = 1;
		if (!val?.query?.limit && !val?.query?.offset) currentPage.value = 1;
		handleProductFetch();
	},
	{ deep: true },
);

// ── Actions ──
const handleUpdateSortOrder = () => {
	const query = deepCopy(route.query);
	query["offset"] = 0;
	if (sortOrder.value === "") delete query["sort_order"];
	else query["sort_order"] = sortOrder.value;
	router.push({ query });
};

function clearFilters() {
	const query = deepCopy(route.query);
	delete query["categories"];
	delete query["brand"];
	delete query["price_min"];
	delete query["price_max"];
	delete query["search"];
	query["offset"] = 0;
	router.push({ query });
}

function removeSearch() {
	const query = deepCopy(route.query);
	delete query["search"];
	query["offset"] = 0;
	router.push({ query });
}

function removeCategory(cat) {
	const next = selectedCategories.value.filter((c) => c !== cat);
	const query = deepCopy(route.query);
	if (next.length) query["categories"] = next.join(",");
	else delete query["categories"];
	query["offset"] = 0;
	router.push({ query });
}

function removeBrand() {
	const query = deepCopy(route.query);
	delete query["brand"];
	query["offset"] = 0;
	router.push({ query });
}

// ── Pagination display ──
const pageNumbers = computed(() => {
	const total = totalPage.value;
	const cur = currentPage.value;
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	if (cur <= 4) return [1, 2, 3, 4, 5, "...", total];
	if (cur >= total - 3)
		return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
	return [1, "...", cur - 1, cur, cur + 1, "...", total];
});

// ── SEO ─────────────────────────────────────────────────────────────────────

const config = useRuntimeConfig();
const requestURL = useRequestURL();
const { getBasicSettings: basic } = storeToRefs(utilityStore);
const HOST = computed(() => config.public.HOST);

const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");
const isCategory = computed(() => !!route.params.category);

// Walk up parent_slug chain to build [root → ... → current]
const buildCategoryChain = (slug) => {
	if (!slug) return [];
	const cat = findNestedObj(getCategories.value ?? [], "slug", slug);
	if (!cat) return [];
	return [
		...buildCategoryChain(cat.parent_slug),
		{ name: cat.name, slug: cat.slug },
	];
};
const categoryChain = computed(() =>
	isCategory.value ? buildCategoryChain(route.params.category) : [],
);

const getTitle = computed(() => {
	if (isCategory.value)
		return (
			selectedCategoryObj.value?.meta_title ||
			selectedCategoryObj.value?.name ||
			"All Products"
		);
	return `All Products`;
});
const getDescription = computed(() => {
	if (isCategory.value)
		return (
			selectedCategoryObj.value?.meta_description ||
			`Shop ${selectedCategoryObj.value?.name} products at ${basic.value?.company_name ?? ""}.`
		);
	return `Shop all products at ${basic.value?.company_name ?? ""}. Find medical devices, equipment and healthcare products in Bangladesh.`;
});
const getKeywords = computed(() =>
	isCategory.value ? selectedCategoryObj.value?.meta_keywords || "" : "",
);
const ogImage = computed(() => {
	if (isCategory.value) {
		const src = selectedCategoryObj.value?.cover_image_detail?.original?.src;
		if (src) return `${HOST.value}${src}`;
	}
	const src = basic.value?.logo?.original?.src;
	return src ? `${HOST.value}${src}` : "";
});
const siteName = computed(() => basic.value?.company_name ?? "");

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
	const base = siteUrl.value;

	const breadcrumbItems = [
		{ "@type": "ListItem", position: 1, name: "Home", item: base },
		...(isCategory.value
			? categoryChain.value.map((cat, i) => ({
					"@type": "ListItem",
					position: i + 2,
					name: cat.name,
					item: `${base}/stores/${cat.slug}`,
				}))
			: [
					{
						"@type": "ListItem",
						position: 2,
						name: "All Products",
						item: `${base}/stores`,
					},
				]),
	];

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "CollectionPage",
					"@id": `${pageUrl.value}/#webpage`,
					url: pageUrl.value,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					isPartOf: { "@id": `${base}/#website` },
					publisher: { "@id": `${base}/#organization` },
					...(ogImage.value && {
						primaryImageOfPage: {
							"@type": "ImageObject",
							url: ogImage.value,
							contentUrl: ogImage.value,
						},
					}),
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: breadcrumbItems,
					},
					...(isCategory.value &&
						selectedCategoryObj.value && {
							about: {
								"@type": "Thing",
								name: selectedCategoryObj.value.name,
								...(selectedCategoryObj.value.meta_description && {
									description: selectedCategoryObj.value.meta_description,
								}),
							},
						}),
				},
			],
		}),
	};
});

useHead({
	title: getTitle,
	meta: [
		{ name: "robots", content: "index, follow" },
		{ name: "description", content: getDescription },
		{ name: "keywords", content: getKeywords },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: siteName },
		{ property: "og:title", content: getTitle },
		{ property: "og:description", content: getDescription },
		{ property: "og:image", content: ogImage },
		{ property: "og:url", content: pageUrl },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: getTitle },
		{ name: "twitter:description", content: getDescription },
		{ name: "twitter:image", content: ogImage },
	],
	link: [{ rel: "canonical", href: pageUrl }],
	script: [jsonLD],
});
</script>
