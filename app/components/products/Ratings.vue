<template>
	<div>
		<template v-if="items.length">
			<!-- Overview card -->
			<div class="flex flex-col sm:flex-row gap-6 mb-8 p-6 rounded-2xl border border-gray-100 bg-gray-50">
				<!-- Avg score -->
				<div class="flex flex-col items-center justify-center gap-1 shrink-0">
					<p class="text-5xl font-black text-gray-900">{{ stats?.avg_rating ?? "—" }}</p>
					<div class="flex items-center gap-0.5">
						<Icon
							v-for="s in 5"
							:key="s"
							:name="s <= Math.round(stats?.avg_rating ?? 0) ? 'mdi:star' : 'mdi:star-outline'"
							size="16"
							class="text-yellow-400"
						/>
					</div>
					<p class="text-xs text-gray-400">{{ stats?.rating_count ?? 0 }} ratings</p>
				</div>

				<!-- Star bars -->
				<div class="flex-1 flex flex-col justify-center gap-2">
					<div
						v-for="star in [5, 4, 3, 2, 1]"
						:key="star"
						class="flex items-center gap-2"
					>
						<span class="text-xs text-gray-500 w-4 text-right shrink-0">{{ star }}</span>
						<Icon name="mdi:star" size="13" class="text-yellow-400 shrink-0" />
						<div class="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
							<div
								class="h-full rounded-full bg-yellow-400 transition-all duration-500"
								:style="{ width: barWidth(star) }"
							/>
						</div>
						<span class="text-xs text-gray-400 w-4 shrink-0">{{ starCount(star) }}</span>
					</div>
				</div>
			</div>

			<!-- Review list -->
			<div class="flex flex-col gap-4 mb-6">
				<div
					v-for="(item, idx) in items"
					:key="'r_' + idx"
					class="p-4 rounded-2xl border border-gray-100 bg-white"
				>
					<div class="flex items-start justify-between gap-2 mb-2">
						<div>
							<p class="text-sm font-semibold text-gray-800">{{ item?.user?.full_name }}</p>
							<div class="flex items-center gap-0.5 mt-0.5">
								<Icon
									v-for="s in 5"
									:key="s"
									:name="s <= item.rating ? 'mdi:star' : 'mdi:star-outline'"
									size="13"
									class="text-yellow-400"
								/>
							</div>
						</div>
						<span class="text-xs text-gray-400 shrink-0">{{ dayjs(item?.creation_time).fromNow() }}</span>
					</div>
					<div class="text-sm text-gray-500 leading-relaxed" v-html="item?.review" />
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="totalPage > 1" class="flex items-center justify-center gap-1.5">
				<button
					:disabled="currentPage === 1"
					class="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
					@click="currentPage--"
				>
					<Icon name="mdi:chevron-left" size="16" />
				</button>
				<button
					v-for="p in totalPage"
					:key="p"
					class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold border transition-all"
					:class="p === currentPage
						? 'bg-primary text-white border-primary'
						: 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'"
					@click="currentPage = p"
				>
					{{ p }}
				</button>
				<button
					:disabled="currentPage === totalPage"
					class="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
					@click="currentPage++"
				>
					<Icon name="mdi:chevron-right" size="16" />
				</button>
			</div>
		</template>

		<!-- Empty -->
		<div v-else class="flex flex-col items-center justify-center py-16 text-center">
			<Icon name="mdi:star-off-outline" size="32" class="text-gray-300 mb-2" />
			<p class="text-gray-400 text-sm">No reviews yet</p>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { calculateTotalPage } from "@/utils/utils";

const userStore = useUserStore();
const dayjs = useDayjs();

const props = defineProps({
	productId: { type: [Number, String], default: null },
});

const loading = ref(false);
const items = ref([]);
const stats = ref(null);
const currentPage = ref(1);
const totalPage = ref(0);
const limit = 12;

function starCount(star) {
	const key = `total_${star}star`;
	return stats.value?.star_count?.[key] ?? 0;
}

function barWidth(star) {
	const total = stats.value?.rating_count ?? 0;
	if (!total) return "0%";
	return Math.round((starCount(star) / total) * 100) + "%";
}

const fetchRatings = () => {
	loading.value = true;
	userStore
		.fetchRatings({ limit, offset: (currentPage.value - 1) * limit, product: props.productId })
		.then((d) => {
			items.value = d.results;
			totalPage.value = calculateTotalPage(d.count, limit);
			loading.value = false;
		})
		.catch((e) => { console.log(e); loading.value = false; });
};

const fetchStats = () => {
	userStore
		.fetchRatingStats({ product: props.productId })
		.then((d) => { stats.value = d; })
		.catch((e) => { console.log(e); });
};

onMounted(() => {
	fetchRatings();
	fetchStats();
});

watch(currentPage, () => fetchRatings());
</script>
