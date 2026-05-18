<template>
	<div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
			<!-- Sidebar (desktop) -->
			<div class="hidden lg:block lg:sticky lg:top-[100px]">
				<CampaignSideBar :data="data?.campaignData" />
			</div>

			<!-- Content -->
			<div class="flex flex-col gap-4">
				<!-- Cover image + Countdown overlay -->
				<div
					v-if="data?.campaignData?.cover_image"
					class="relative rounded-2xl overflow-hidden"
				>
					<img
						:src="HOST + data.campaignData.cover_image.original.src"
						:alt="data.campaignData.cover_image.original.alt"
						class="w-full object-cover"
					/>
					<!-- Gradient overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"
					/>

					<!-- Countdown pinned to bottom -->
					<div
						class="absolute bottom-0 inset-x-0 px-4 sm:px-6 py-4 flex items-end justify-between gap-4 flex-wrap"
					>
						<!-- Campaign name + ends-in label -->
						<div>
							<p class="text-white/70 text-xs font-medium mb-0.5">
								Limited time offer
							</p>
							<h2
								class="text-white text-base sm:text-lg font-bold leading-tight drop-shadow"
							>
								{{ data.campaignData.name }}
							</h2>
						</div>

						<!-- Countdown boxes -->
						<client-only>
							<VueCountdown
								:time="remainingSeconds"
								v-slot="{ days, hours, minutes, seconds }"
							>
								<div class="flex items-center gap-2">
									<div
										v-for="unit in [
											{ v: days, l: 'Days' },
											{ v: hours, l: 'Hrs' },
											{ v: minutes, l: 'Min' },
											{ v: seconds, l: 'Sec' },
										]"
										:key="unit.l"
										class="flex flex-col items-center gap-0.5"
									>
										<div
											class="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-base sm:text-lg tabular-nums"
										>
											{{ String(unit.v).padStart(2, "0") }}
										</div>
										<span class="text-white/70 text-[10px] font-medium">{{
											unit.l
										}}</span>
									</div>
								</div>
							</VueCountdown>
						</client-only>
					</div>
				</div>

				<!-- Toolbar -->
				<div class="flex items-center justify-between gap-3 flex-wrap">
					<div class="flex items-center gap-2">
						<!-- Mobile filter trigger -->
						<button
							type="button"
							class="flex lg:hidden items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
							@click="mobileCampaignFilterOpen = true"
						>
							<Icon name="mdi:filter-variant" size="15" class="text-gray-400" />
							Filters
						</button>
						<h1 class="text-sm font-semibold text-gray-800">
							{{ data?.campaignData?.name }}
							<span class="text-gray-400 font-normal">({{ totalItem }})</span>
						</h1>
					</div>

					<!-- Sort -->
					<div class="relative" v-click-outside="() => (sortOpen = false)">
						<button
							type="button"
							class="flex items-center gap-2 h-9 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all min-w-[160px] justify-between"
							@click="sortOpen = !sortOpen"
						>
							<span>{{ currentSortLabel }}</span>
							<Icon
								name="mdi:chevron-down"
								size="14"
								class="text-gray-400 transition-transform duration-200 shrink-0"
								:class="sortOpen ? 'rotate-180' : ''"
							/>
						</button>
						<Transition name="dropdown">
							<div
								v-if="sortOpen"
								class="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
							>
								<button
									v-for="opt in sortOrderTypeChoice"
									:key="opt.value"
									type="button"
									class="w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between"
									:class="
										sortOrder === opt.value
											? 'bg-primary/5 text-primary font-medium'
											: 'text-gray-600 hover:bg-gray-50'
									"
									@click="handleSortSelect(opt.value)"
								>
									{{ opt.title }}
									<Icon
										v-if="sortOrder === opt.value"
										name="mdi:check"
										size="13"
										class="text-primary"
									/>
								</button>
							</div>
						</Transition>
					</div>
				</div>

				<!-- Skeleton -->
				<div
					v-if="loading"
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
				>
					<div
						v-for="n in 12"
						:key="n"
						class="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse"
					>
						<div class="aspect-square bg-gray-100" />
						<div class="p-3 flex flex-col gap-2">
							<div class="h-3 bg-gray-100 rounded-full w-3/4" />
							<div class="h-3 bg-gray-100 rounded-full w-1/2" />
						</div>
					</div>
				</div>

				<!-- Products grid -->
				<div
					v-else-if="products.length"
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
				>
					<SingleProduct
						v-for="(product, idx) in products"
						:key="'p_' + idx"
						:product="product"
					/>
				</div>

				<!-- Empty state -->
				<div
					v-else
					class="flex flex-col items-center justify-center py-16 gap-3 text-center"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center"
					>
						<Icon
							name="mdi:package-variant-remove"
							size="24"
							class="text-gray-400"
						/>
					</div>
					<p class="text-sm font-medium text-gray-500">No products found</p>
					<p class="text-xs text-gray-400">Try adjusting your filters</p>
				</div>

				<!-- Pagination -->
				<div
					v-if="totalPage > 1"
					class="flex items-center justify-center gap-1.5 pt-2"
				>
					<button
						type="button"
						class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
						:disabled="currentPage === 1"
						@click="currentPage--"
					>
						<Icon name="mdi:chevron-left" size="16" />
					</button>
					<button
						v-for="page in paginationPages"
						:key="page"
						type="button"
						class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
						:class="
							page === currentPage
								? 'bg-primary text-white'
								: page === '...'
									? 'cursor-default text-gray-400'
									: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
						"
						:disabled="page === '...'"
						@click="page !== '...' && (currentPage = page)"
					>
						{{ page }}
					</button>
					<button
						type="button"
						class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
						:disabled="currentPage === totalPage"
						@click="currentPage++"
					>
						<Icon name="mdi:chevron-right" size="16" />
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile filter drawer -->
		<ClientOnly>
			<MobileCampaignFilter
				v-if="mobileCampaignFilterOpen"
				:data="data?.campaignData"
				@close="mobileCampaignFilterOpen = false"
			/>
		</ClientOnly>
	</div>
</template>

<script setup>
import { useProductStore } from "@/stores/product";
import { useUtilityStore } from "@/stores/utility";
import { calculateTotalPage, deepCopy } from "@/utils/utils";
import { useRoute } from "#vue-router";
import { storeToRefs } from "pinia";

const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const requestURL = useRequestURL();
const dayjs = useDayjs();

const HOST = computed(() => config.public.HOST);

const products = ref([]);
const loading = ref(false);
const sortOrder = ref("");
const sortOpen = ref(false);
const mobileCampaignFilterOpen = ref(false);

const currentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalItem = ref(0);

const sortOrderTypeChoice = [
	{ title: "Default", value: "" },
	{ title: "Price (Low to High)", value: 1 },
	{ title: "Price (High to Low)", value: 2 },
	{ title: "Old to New", value: 3 },
	{ title: "New to Old", value: 4 },
];

const currentSortLabel = computed(
	() =>
		sortOrderTypeChoice.find((o) => o.value === sortOrder.value)?.title ??
		"Sort by",
);

const handleProductFetch = () => {
	loading.value = true;
	const params = { ...route.query };
	if (!params.limit) params.limit = 12;
	if (!params.offset) params.offset = 0;
	params.campaign = route.params.slug;
	if (route.params.category) params.category = route.params.category;

	productStore
		.fetchCampaignProduct(params)
		.then((d) => {
			loading.value = false;
			products.value = d.results;
			totalPage.value = calculateTotalPage(d.count, 12);
			totalItem.value = d.count;
		})
		.catch(() => {
			loading.value = false;
		});
};

const { data } = await useAsyncData(
	`campaign-${route.params.slug}`,
	async () => {
		let campaignData = null;
		await nuxtApp.runWithContext(async () => {
			await productStore
				.fetchCampaignDetail(route.params.slug)
				.then((d) => {
					campaignData = d;
				})
				.catch(() => {});
		});
		return { campaignData };
	},
);

const utilityStore = useUtilityStore();
const { getBasicSettings: basic } = storeToRefs(utilityStore);

const campaignData = computed(() => data.value?.campaignData);
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");
const siteUrl = computed(() => requestURL?.origin ?? "");
const siteName = computed(() => basic.value?.company_name ?? "");

const getTitle = computed(() =>
	campaignData.value?.name
		? `${campaignData.value.name} | ${siteName.value}`
		: siteName.value,
);
const getDescription = computed(() =>
	campaignData.value?.name
		? `Shop the ${campaignData.value.name} campaign. Limited time offer with great deals on selected products.`
		: "",
);
const getOGImage = computed(() => {
	const src = campaignData.value?.cover_image?.original?.src;
	return src ? `${HOST.value}${src}` : "";
});

useHead({
	title: getTitle,
	meta: [
		{ name: "description", content: getDescription },
		{ name: "robots", content: "index, follow" },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: siteName },
		{ property: "og:title", content: getTitle },
		{ property: "og:description", content: getDescription },
		{ property: "og:image", content: getOGImage },
		{ property: "og:url", content: pageUrl },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: getTitle },
		{ name: "twitter:description", content: getDescription },
		{ name: "twitter:image", content: getOGImage },
	],
	link: [{ rel: "canonical", href: pageUrl }],
});

onMounted(() => {
	if (route.query.limit && route.query.limit != 12) {
		limit.value = 12;
	} else if (route.query.limit) {
		limit.value = route.query.limit;
	}
	if (route.query.offset) {
		offset.value = route.query.offset;
		currentPage.value = route.query.offset / limit.value + 1;
	}
	if (route.query.sort_order) {
		sortOrder.value = parseInt(route.query.sort_order);
	}
	handleProductFetch();
});

const remainingSeconds = computed(() => {
	const date2 = dayjs(data?.value?.campaignData?.end_date);
	return date2.diff(dayjs());
});

const handleSortSelect = (val) => {
	sortOrder.value = val;
	sortOpen.value = false;
	const query = deepCopy(route.query);
	query.offset = 0;
	if (val === "") {
		delete query.sort_order;
	} else {
		query.sort_order = val;
	}
	router.push({ query });
};

const paginationPages = computed(() => {
	const pages = [];
	const total = totalPage.value;
	const current = currentPage.value;
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
	() => currentPage.value,
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
			currentPage.value = 1;
		}
		handleProductFetch();
	},
	{ deep: true },
);
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
