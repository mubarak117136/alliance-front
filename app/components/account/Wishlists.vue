<template>
	<div class="flex flex-col gap-4">
		<!-- Header -->
		<div>
			<h2 class="text-base font-bold text-gray-900">My Wishlists</h2>
			<p class="text-xs text-gray-400 mt-0.5">
				{{
					totalCount > 0
						? `${totalCount} saved item${totalCount > 1 ? "s" : ""}`
						: "Your saved products"
				}}
			</p>
		</div>

		<!-- Skeleton -->
		<div
			v-if="loading"
			class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
		>
			<div
				class="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100"
			>
				<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-10 rounded bg-gray-100 animate-pulse" />
			</div>
			<div class="flex flex-col">
				<div
					v-for="i in 6"
					:key="i"
					class="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0"
				>
					<div
						class="w-10 h-10 rounded-lg bg-gray-100 animate-pulse shrink-0"
					/>
					<div class="flex-1 flex flex-col gap-1.5">
						<div
							class="h-3.5 rounded bg-gray-100 animate-pulse"
							:style="{ width: 60 + ((i * 13) % 80) + 'px' }"
						/>
						<div class="h-3 w-24 rounded bg-gray-100 animate-pulse" />
					</div>
					<div
						class="h-3 w-20 rounded bg-gray-100 animate-pulse hidden sm:block"
					/>
					<div class="w-7 h-7 rounded-lg bg-gray-100 animate-pulse" />
				</div>
			</div>
		</div>

		<!-- Wishlists list -->
		<div
			v-else-if="items.length > 0"
			class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
		>
			<!-- Table header -->
			<div
				class="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100"
			>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
					>Product</span
				>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28 text-center"
					>Saved On</span
				>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-10 text-center"
					>Remove</span
				>
			</div>

			<!-- Rows -->
			<div class="flex flex-col">
				<div
					v-for="(item, idx) in items"
					:key="'item_' + idx"
					class="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
				>
					<!-- Product -->
					<div class="flex items-center gap-3 min-w-0">
						<NuxtLink
							:to="'/products/' + item?.product_detail?.slug"
							class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0 block"
						>
							<img
								:src="HOST + item?.product_detail?.default_image?.original?.src"
								:alt="item?.product_detail?.default_image?.original?.alt"
								class="w-full h-full object-cover"
							/>
						</NuxtLink>
						<div class="min-w-0">
							<NuxtLink
								:to="'/products/' + item?.product_detail?.slug"
								class="text-xs font-medium text-gray-700 line-clamp-1 leading-snug hover:text-primary transition-colors"
							>
								{{ item?.product_detail?.name }}
							</NuxtLink>
							<p
								v-if="item?.product_detail?.default_price"
								class="text-[11px] text-gray-400 mt-0.5"
							>
								{{ currency
								}}{{ item?.product_detail?.default_price?.toLocaleString() }}
							</p>
						</div>
					</div>

					<!-- Date -->
					<div class="w-28 text-center">
						<span class="text-[11px] text-gray-400">{{
							dayjs(item?.creation_time).format("DD MMM YYYY")
						}}</span>
					</div>

					<!-- Remove -->
					<div class="w-10 flex justify-center">
						<button
							type="button"
							:disabled="removingId === item?.product"
							class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all disabled:opacity-50"
							@click="handleRemoveFromWishlist(item)"
						>
							<Icon
								v-if="removingId === item?.product"
								name="mdi:loading"
								size="13"
								class="animate-spin text-gray-400"
							/>
							<Icon v-else name="mdi:heart-off-outline" size="14" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div
			v-else
			class="bg-white border border-gray-100 rounded-2xl flex flex-col items-center py-14 text-center px-4"
		>
			<div
				class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3"
			>
				<Icon name="mdi:heart-outline" size="22" class="text-gray-300" />
			</div>
			<p class="text-sm font-medium text-gray-600 mb-1">No saved items</p>
			<p class="text-xs text-gray-400">Products you save will appear here</p>
			<NuxtLink
				to="/"
				class="mt-4 inline-flex items-center gap-1.5 h-8 px-4 rounded-xl bg-primary/8 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
			>
				<Icon name="mdi:storefront-outline" size="13" />
				Browse Products
			</NuxtLink>
		</div>

		<!-- Pagination -->
		<div v-if="totalPage > 1" class="flex items-center justify-center gap-1.5">
			<button
				:disabled="currentPage === 1"
				class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
				@click="currentPage--"
			>
				<Icon name="mdi:chevron-left" size="15" />
			</button>
			<button
				v-for="p in totalPage"
				:key="p"
				class="w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all"
				:class="
					p === currentPage
						? 'bg-primary text-white border-primary font-semibold'
						: 'border-gray-200 text-gray-500 hover:border-gray-300'
				"
				@click="currentPage = p"
			>
				{{ p }}
			</button>
			<button
				:disabled="currentPage === totalPage"
				class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
				@click="currentPage++"
			>
				<Icon name="mdi:chevron-right" size="15" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";
import { calculateTotalPage, deepCopy } from "@/utils/utils";
import { useToast } from "vue-toastification";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const saleStore = useSaleStore();
const dayjs = useDayjs();
const toast = useToast();

const loading = ref(true);
const removingId = ref(null);
const items = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalCount = ref(0);

const HOST = computed(() => config.public.HOST);
const currency = config.public.currency;

const handleFetchItems = () => {
	loading.value = true;
	if (route?.query?.offset) offset.value = route.query.offset;
	const params = { limit: limit.value, offset: offset.value };
	saleStore
		.fetchWishlists(params)
		.then((d) => {
			loading.value = false;
			items.value = d.results;
			totalCount.value = d.count;
			totalPage.value = calculateTotalPage(d.count, 12);
		})
		.catch(() => {
			loading.value = false;
		});
};

const handleRemoveFromWishlist = (item) => {
	removingId.value = item?.product;
	saleStore
		.removeFromWishlist({ product: item?.product })
		.then(() => {
			removingId.value = null;
			toast.success("Removed from wishlist");
			handleFetchItems();
		})
		.catch(() => {
			removingId.value = null;
			toast.error("Something went wrong!");
		});
};

onMounted(() => {
	handleFetchItems();
});

watch(
	() => currentPage.value,
	(val) => {
		offset.value = val * limit.value - limit.value;
		const query = deepCopy(route.query);
		query["limit"] = limit.value;
		query["offset"] = offset.value;
		router.push({ query });
	},
);

watch(
	() => route,
	(val) => {
		if (
			(val?.query?.limit == 12 && val?.query?.offset == 0) ||
			(!val?.query?.limit && !val?.query?.offset)
		) {
			currentPage.value = 1;
		}
		handleFetchItems();
	},
	{ deep: true },
);

useHead({ title: "My Wishlists" });
</script>
