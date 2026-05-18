<template>
	<div class="flex flex-col gap-4">
		<!-- Header -->
		<div>
			<h2 class="text-base font-bold text-gray-900">My Reviews</h2>
			<p class="text-xs text-gray-400 mt-0.5">
				{{ totalCount > 0 ? `${totalCount} review${totalCount > 1 ? 's' : ''}` : 'Your product reviews' }}
			</p>
		</div>

		<!-- Skeleton -->
		<div v-if="loading" class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<div class="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100">
				<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-24 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
			</div>
			<div class="flex flex-col">
				<div v-for="i in 5" :key="i" class="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
					<div class="w-10 h-10 rounded-lg bg-gray-100 animate-pulse shrink-0" />
					<div class="flex-1 flex flex-col gap-1.5">
						<div class="h-3.5 w-40 rounded bg-gray-100 animate-pulse" />
						<div class="h-3 w-56 rounded bg-gray-100 animate-pulse" />
					</div>
					<div class="hidden sm:flex gap-0.5">
						<div v-for="s in 5" :key="s" class="w-3 h-3 rounded bg-gray-100 animate-pulse" />
					</div>
					<div class="h-3 w-20 rounded bg-gray-100 animate-pulse hidden sm:block" />
				</div>
			</div>
		</div>

		<!-- Reviews list -->
		<div v-else-if="items.length > 0" class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<!-- Table header -->
			<div class="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100">
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Product</span>
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-24 text-center">Rating</span>
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-48">Review</span>
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-24 text-right">Date</span>
			</div>

			<!-- Rows -->
			<div class="flex flex-col">
				<div
					v-for="(item, idx) in items"
					:key="'item_' + idx"
					class="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
				>
					<!-- Product -->
					<div class="flex items-center gap-3 min-w-0">
						<NuxtLink
							:to="'/products/' + item?.product?.slug"
							class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0 block"
						>
							<img
								:src="HOST + item?.product?.default_image?.original?.src"
								:alt="item?.product?.default_image?.original?.alt"
								class="w-full h-full object-cover"
							/>
						</NuxtLink>
						<NuxtLink
							:to="'/products/' + item?.product?.slug"
							class="text-xs font-medium text-gray-700 line-clamp-2 leading-snug hover:text-primary transition-colors"
						>
							{{ item?.product?.name }}
						</NuxtLink>
					</div>

					<!-- Rating stars -->
					<div class="w-24 flex items-center justify-center gap-0.5">
						<template v-for="s in 5" :key="s">
							<Icon
								:name="s <= item.rating ? 'mdi:star' : 'mdi:star-outline'"
								size="14"
								:class="s <= item.rating ? 'text-yellow-400' : 'text-gray-200'"
							/>
						</template>
					</div>

					<!-- Review text -->
					<div class="w-48">
						<p v-if="item?.review" class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ item.review }}</p>
						<span v-else class="text-xs text-gray-300 italic">No comment</span>
					</div>

					<!-- Date -->
					<div class="w-24 text-right">
						<span class="text-[11px] text-gray-400">{{ dayjs(item?.creation_time).format("DD MMM YYYY") }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div v-else class="bg-white border border-gray-100 rounded-2xl flex flex-col items-center py-14 text-center px-4">
			<div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
				<Icon name="mdi:star-outline" size="22" class="text-gray-300" />
			</div>
			<p class="text-sm font-medium text-gray-600 mb-1">No reviews yet</p>
			<p class="text-xs text-gray-400">Reviews you write on products will appear here</p>
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
				v-for="p in totalPage" :key="p"
				class="w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all"
				:class="p === currentPage ? 'bg-primary text-white border-primary font-semibold' : 'border-gray-200 text-gray-500 hover:border-gray-300'"
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
import { useUserStore } from "@/stores/user";
import { calculateTotalPage, deepCopy } from "@/utils/utils";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const dayjs = useDayjs();

const loading = ref(true);
const items = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalCount = ref(0);

const HOST = computed(() => config.public.HOST);

const handleFetchItems = () => {
	loading.value = true;
	if (route?.query?.offset) offset.value = route.query.offset;
	const params = { limit: limit.value, offset: offset.value };
	userStore
		.fetchReviews(params)
		.then((d) => {
			loading.value = false;
			items.value = d.results;
			totalCount.value = d.count;
			totalPage.value = calculateTotalPage(d.count, 12);
		})
		.catch(() => { loading.value = false; });
};

onMounted(() => { handleFetchItems(); });

watch(() => currentPage.value, (val) => {
	offset.value = val * limit.value - limit.value;
	const query = deepCopy(route.query);
	query["limit"] = limit.value;
	query["offset"] = offset.value;
	router.push({ query });
});

watch(() => route, (val) => {
	if ((val?.query?.limit == 12 && val?.query?.offset == 0) || (!val?.query?.limit && !val?.query?.offset)) {
		currentPage.value = 1;
	}
	handleFetchItems();
}, { deep: true });

useHead({ title: "My Reviews" });
</script>
