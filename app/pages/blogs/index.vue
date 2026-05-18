<template>
	<div class="-mt-[128px] sm:-mt-[88px] lg:-mt-[172px]">
		<!-- Hero -->
		<div
			class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50/60 to-emerald-50/40 border-b border-gray-100"
		>
			<!-- Decorative blobs -->
			<div
				class="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none"
			/>
			<div
				class="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none"
			/>

			<div
				class="relative w-full max-w-[900px] mx-auto px-4 sm:px-6 pt-[156px] sm:pt-[116px] lg:pt-[200px] pb-14 sm:pb-20 flex flex-col items-center text-center gap-5"
			>
				<!-- Badge -->
				<div
					class="flex items-center gap-2 bg-white border border-primary/15 text-primary text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm"
				>
					<Icon name="mdi:post-outline" size="13" />
					Our Blog
				</div>

				<h1
					class="text-3xl sm:text-[44px] font-bold text-gray-800 leading-tight tracking-tight max-w-2xl"
				>
					Explore the <span class="text-primary">WellMed</span> Blogs
				</h1>

				<p
					class="text-sm sm:text-[15px] text-gray-400 leading-relaxed max-w-xl"
				>
					Expert Health Tips, Skincare, Wellness & Medical Device Insights in
					Bangladesh — your trusted source for authentic healthcare knowledge.
				</p>

				<!-- Stats row -->
				<div class="flex items-center gap-6 mt-2">
					<div class="flex items-center gap-1.5 text-xs text-gray-400">
						<Icon
							name="mdi:text-box-multiple-outline"
							size="14"
							class="text-primary/60"
						/>
						<span
							><strong class="text-gray-600 font-semibold">{{
								totalCount
							}}</strong>
							Articles</span
						>
					</div>
					<div class="w-px h-4 bg-gray-200" />
					<div class="flex items-center gap-1.5 text-xs text-gray-400">
						<Icon name="mdi:shape-outline" size="14" class="text-primary/60" />
						<span
							><strong class="text-gray-600 font-semibold">{{
								data?.getCurrentPage?.categories?.length ?? 0
							}}</strong>
							Categories</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Content -->
		<div
			class="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6"
		>
			<!-- Category filter -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<h2 class="text-sm font-semibold text-gray-700">Latest Articles</h2>
					<span class="text-xs text-gray-400">{{ totalCount }} articles</span>
				</div>
				<!-- Pill tabs -->
				<div class="overflow-x-auto scrollbar-hide pb-0.5">
					<div class="flex items-center gap-2 w-max">
						<button
							type="button"
							class="flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-all"
							:class="
								selectedCategory == null
									? 'bg-primary text-white shadow-sm'
									: 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
							"
							@click="handleCategoryClick(null)"
						>
							<Icon name="mdi:view-grid-outline" size="13" />
							All
						</button>
						<button
							v-for="(item, idx) in data?.getCurrentPage?.categories"
							:key="'cat_' + idx"
							type="button"
							class="h-8 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-all"
							:class="
								selectedCategory == item?.id
									? 'bg-primary text-white shadow-sm'
									: 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
							"
							@click="handleCategoryClick(item)"
						>
							{{ item?.title }}
						</button>
					</div>
				</div>
			</div>

			<!-- Skeleton -->
			<div
				v-if="loading"
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
			>
				<div
					v-for="n in 6"
					:key="n"
					class="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse"
				>
					<div class="aspect-[16/9] bg-gray-100" />
					<div class="p-5 flex flex-col gap-3">
						<div class="h-2.5 bg-gray-100 rounded-full w-1/3" />
						<div class="h-3.5 bg-gray-100 rounded-full w-full" />
						<div class="h-3.5 bg-gray-100 rounded-full w-4/5" />
						<div class="h-2.5 bg-gray-100 rounded-full w-full mt-1" />
						<div
							class="flex items-center justify-between pt-3 border-t border-gray-100 mt-1"
						>
							<div class="flex items-center gap-2">
								<div class="w-6 h-6 rounded-full bg-gray-100" />
								<div class="h-2.5 bg-gray-100 rounded-full w-20" />
							</div>
							<div class="h-2.5 bg-gray-100 rounded-full w-16" />
						</div>
					</div>
				</div>
			</div>

			<!-- Blog grid -->
			<div
				v-else-if="items.length"
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
			>
				<BlogsSingleBlog
					v-for="(item, idx) in items"
					:key="'item_' + idx"
					:data="item"
				/>
			</div>

			<!-- Empty state -->
			<div
				v-else
				class="flex flex-col items-center justify-center py-20 gap-3 text-center"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center"
				>
					<Icon name="mdi:post-outline" size="24" class="text-gray-400" />
				</div>
				<p class="text-sm font-medium text-gray-500">No articles found</p>
				<p class="text-xs text-gray-400">Try selecting a different category</p>
			</div>

			<!-- Pagination -->
			<div
				v-if="totalPage > 1"
				class="flex items-center justify-center gap-1.5 py-4"
			>
				<button
					type="button"
					class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
					:disabled="getCurrentPage === 1"
					@click="getCurrentPage--"
				>
					<Icon name="mdi:chevron-left" size="16" />
				</button>
				<button
					v-for="page in paginationPages"
					:key="page"
					type="button"
					class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
					:class="
						page === getCurrentPage
							? 'bg-primary text-white'
							: page === '...'
								? 'cursor-default text-gray-400'
								: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
					"
					:disabled="page === '...'"
					@click="page !== '...' && (getCurrentPage = page)"
				>
					{{ page }}
				</button>
				<button
					type="button"
					class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
					:disabled="getCurrentPage === totalPage"
					@click="getCurrentPage++"
				>
					<Icon name="mdi:chevron-right" size="16" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { deepCopy, calculateTotalPage } from "@/utils/utils";
import { useHomeStore } from "@/stores/home";
import { useUtilityStore } from "@/stores/utility";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const homeStore = useHomeStore();
const utilityStore = useUtilityStore();
const route = useRoute();
const router = useRouter();
const requestURL = useRequestURL();

const { getBasicSettings: basic } = storeToRefs(utilityStore);

const loading = ref(true);
const selectedCategory = ref(null);
const getCurrentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalCount = ref(0);
const items = ref([]);

const HOST = computed(() => config.public.HOST);

const handleFetchItems = () => {
	loading.value = true;

	if (route?.query?.offset) offset.value = route.query.offset;
	if (route?.query?.limit) {
		limit.value = route.query.limit > 12 ? 12 : route.query.limit;
	}

	const params = {
		limit: limit.value,
		offset: offset.value,
		type: "home.BlogDetailPage",
		fields:
			"title,thumbnail,author,short_description,tags,fetch_parent,last_published_at",
		order: "-last_published_at",
	};

	if (route?.query?.category) params.child_of = route.query.category;

	homeStore
		.fetchPage(params)
		.then((d) => {
			totalCount.value = d?.meta?.total_count;
			totalPage.value = calculateTotalPage(d?.meta?.total_count, limit.value);
			items.value = d.items;
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
};

const { data } = await useAsyncData("blogsPageItems", async () => {
	let getCurrentPageData = null;
	await nuxtApp.runWithContext(async () => {
		await homeStore
			.fetchCurrentPage({ html_path: route.path })
			.then((d) => {
				getCurrentPageData = d;
			})
			.catch(() => {});
	});
	return { getCurrentPage: getCurrentPageData };
});

onMounted(() => {
	if (route?.query?.limit) {
		limit.value = route.query.limit != 12 ? 12 : route.query.limit;
	}
	if (route?.query?.offset) {
		offset.value = route.query.offset;
		getCurrentPage.value = route.query.offset / limit.value + 1;
	}
	if (route?.query?.category) {
		selectedCategory.value = route.query.category;
	}
	handleFetchItems();
});

const handleCategoryClick = (item) => {
	const query = deepCopy(route.query);
	if (item) {
		selectedCategory.value = item.id;
		query.category = item.id;
	} else {
		selectedCategory.value = null;
		delete query.category;
	}
	query.limit = 12;
	query.offset = 0;
	router.push({ query });
};

const paginationPages = computed(() => {
	const pages = [];
	const total = totalPage.value;
	const current = getCurrentPage.value;
	if (total <= 7) {
		for (let i = 1; i <= total; i++) pages.push(i);
	} else {
		pages.push(1);
		if (current > 3) pages.push("...");
		for (
			let i = Math.max(2, current - 1);
			i <= Math.min(total - 1, current + 1);
			i++
		)
			pages.push(i);
		if (current < total - 2) pages.push("...");
		pages.push(total);
	}
	return pages;
});

watch(
	() => getCurrentPage.value,
	(val) => {
		offset.value = val * limit.value - limit.value;
		const query = deepCopy(route.query);
		query.limit = limit.value;
		query.offset = offset.value;
		router.push({ query });
	},
);

watch(
	() => route,
	(val) => {
		if (
			(val.query.limit == 12 && val.query.offset == 0) ||
			(!val.query.limit && !val.query.offset)
		) {
			getCurrentPage.value = 1;
		}
		handleFetchItems();
	},
);

// ── SEO ─────────────────────────────────────────────────────────────────────

const page = computed(() => data.value?.getCurrentPage);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");
const siteName = computed(() => basic.value?.company_name ?? "");

const getTitle = computed(
	() =>
		page.value?.meta?.seo_title ||
		page.value?.title ||
		`Blog | ${siteName.value}`,
);
const getDescription = computed(
	() =>
		page.value?.meta?.search_description ||
		`Read the latest health tips, skincare, wellness and medical device insights from ${siteName.value}.`,
);
const getKeywords = computed(() => page.value?.og_keywords || "");
const ogImage = computed(() => {
	const src = page.value?.og_img_original?.original?.src;
	if (src) return `${HOST.value}${src}`;
	const logo = basic.value?.logo?.original?.src;
	return logo ? `${HOST.value}${logo}` : "";
});

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
	const base = siteUrl.value;
	const categories = data.value?.getCurrentPage?.categories ?? [];

	const categoryItemList = categories.length
		? {
				"@type": "ItemList",
				"@id": `${base}/blogs/#categories`,
				name: "Blog Categories",
				itemListElement: categories.map((cat, i) => ({
					"@type": "ListItem",
					position: i + 1,
					name: cat.title,
					url: `${base}/blogs?category=${cat.id}`,
				})),
			}
		: null;

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": ["WebPage", "CollectionPage"],
					"@id": `${base}/blogs/#webpage`,
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
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: base },
							{
								"@type": "ListItem",
								position: 2,
								name: "Blog",
								item: `${base}/blogs`,
							},
						],
					},
				},
				{
					"@type": "Blog",
					"@id": `${base}/blogs/#blog`,
					url: `${base}/blogs`,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					publisher: { "@id": `${base}/#organization` },
					...(totalCount.value && { numberOfItems: totalCount.value }),
				},
				categoryItemList,
			].filter(Boolean),
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

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
