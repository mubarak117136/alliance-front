<template>
	<div class="flex flex-col gap-4">
		<!-- Header -->
		<div class="flex items-center justify-between gap-3">
			<div>
				<h2 class="text-base font-bold text-gray-900">Orders</h2>
				<p class="text-xs text-gray-400 mt-0.5">
					{{
						totalCount > 0
							? `${totalCount} order${totalCount > 1 ? "s" : ""} found`
							: "Your order history"
					}}
				</p>
			</div>
			<FiltersOrderStatus />
		</div>

		<!-- Skeleton -->
		<div
			v-if="loading"
			class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
		>
			<!-- Header row -->
			<div
				class="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100"
			>
				<div class="h-3 w-14 rounded bg-gray-100 animate-pulse" />
				<div class="h-3 w-8 rounded bg-gray-100 animate-pulse w-12" />
				<div class="h-3 w-16 rounded bg-gray-100 animate-pulse w-28" />
				<div class="h-3 w-14 rounded bg-gray-100 animate-pulse w-28" />
				<div class="w-5" />
			</div>
			<!-- Rows — vary widths so it looks natural -->
			<div class="flex flex-col">
				<div
					v-for="(w, i) in skeletonRows"
					:key="i"
					class="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0"
				>
					<!-- Order ID + date -->
					<div class="flex-1 flex flex-col gap-1.5">
						<div
							class="h-3.5 rounded bg-gray-100 animate-pulse"
							:style="{ width: w.id }"
						/>
						<div
							class="h-3 rounded bg-gray-100 animate-pulse"
							:style="{ width: w.date }"
						/>
					</div>
					<!-- QTY -->
					<div class="hidden sm:block w-12 flex justify-center">
						<div class="h-3 w-4 rounded bg-gray-100 animate-pulse mx-auto" />
					</div>
					<!-- Amount -->
					<div class="hidden sm:block w-28 text-right">
						<div
							class="h-3.5 rounded bg-gray-100 animate-pulse ml-auto"
							:style="{ width: w.amount }"
						/>
					</div>
					<!-- Status badge -->
					<div class="w-28 flex justify-center">
						<div
							class="h-6 rounded-full bg-gray-100 animate-pulse"
							:style="{ width: w.status }"
						/>
					</div>
					<!-- Arrow -->
					<div class="w-5 flex justify-center">
						<div class="h-4 w-4 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
			</div>
		</div>

		<!-- Orders list -->
		<div
			v-else-if="orders.length > 0"
			class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
		>
			<!-- Table header -->
			<div
				class="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100"
			>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
					>Order</span
				>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-12 text-center"
					>Qty</span
				>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28 text-right"
					>Amount</span
				>
				<span
					class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28 text-center"
					>Status</span
				>
				<span class="w-5" />
			</div>

			<!-- Rows -->
			<div class="flex flex-col">
				<button
					v-for="(item, idx) in orders"
					:key="'order_' + idx"
					type="button"
					class="w-full text-left flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
					@click="handleOrderDetail(item)"
				>
					<!-- Order info -->
					<div class="flex-1 min-w-0 flex flex-col gap-0.5">
						<span class="text-sm font-semibold text-gray-800 font-mono">{{
							item?.order_id
						}}</span>
						<span class="text-[11px] text-gray-400">{{
							dayjs(item?.creation_time).format("DD MMM YYYY")
						}}</span>
					</div>

					<!-- QTY -->
					<div class="w-12 text-center hidden sm:block shrink-0">
						<span class="text-xs text-gray-500">{{ item?.total_item }}</span>
					</div>

					<!-- Amount -->
					<div class="w-28 text-right hidden sm:block shrink-0">
						<span class="text-sm font-semibold text-gray-700"
							>{{ currency }}{{ item?.order_amount?.toLocaleString() }}</span
						>
					</div>

					<!-- Status badge -->
					<div class="w-28 flex justify-center shrink-0">
						<span
							class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
							:class="statusClass(item?.status?.type)"
						>
							<span
								class="w-1.5 h-1.5 rounded-full shrink-0"
								:class="statusDotClass(item?.status?.type)"
							/>
							{{ orderStatusTypeToText(item?.status?.type) }}
						</span>
					</div>

					<!-- Arrow -->
					<div class="w-5 flex items-center justify-center shrink-0">
						<Icon
							name="mdi:chevron-right"
							size="16"
							class="text-gray-300 group-hover:text-gray-500 transition-colors"
						/>
					</div>
				</button>
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
				<Icon name="lucide:receipt" size="20" class="text-gray-300" />
			</div>
			<p class="text-sm font-semibold text-gray-600 mb-1">No orders found</p>
			<p class="text-xs text-gray-400">You haven't placed any orders yet</p>
			<NuxtLink
				to="/"
				class="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
			>
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
						: 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
import {
	orderStatusTypeToText,
	calculateTotalPage,
	deepCopy,
} from "@/utils/utils";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const saleStore = useSaleStore();
const dayjs = useDayjs();

const currency = config.public.currency;

const loading = ref(true);
const orders = ref([]);

const skeletonRows = [
	{ id: "148px", date: "80px", amount: "64px", status: "90px" },
	{ id: "160px", date: "72px", amount: "48px", status: "76px" },
	{ id: "148px", date: "80px", amount: "56px", status: "80px" },
	{ id: "156px", date: "76px", amount: "72px", status: "76px" },
	{ id: "148px", date: "80px", amount: "48px", status: "90px" },
	{ id: "152px", date: "72px", amount: "60px", status: "80px" },
	{ id: "160px", date: "80px", amount: "52px", status: "76px" },
	{ id: "148px", date: "76px", amount: "64px", status: "90px" },
	{ id: "156px", date: "72px", amount: "56px", status: "76px" },
	{ id: "148px", date: "80px", amount: "48px", status: "80px" },
	{ id: "152px", date: "76px", amount: "68px", status: "90px" },
	{ id: "160px", date: "80px", amount: "52px", status: "76px" },
];
const currentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalCount = ref(0);

const statusClass = (type) => {
	const map = {
		1: "bg-yellow-50 text-yellow-600",
		2: "bg-blue-50 text-blue-600",
		3: "bg-indigo-50 text-indigo-600",
		4: "bg-green-50 text-green-600",
		5: "bg-orange-50 text-orange-500",
		6: "bg-red-50 text-red-500",
	};
	return map[type] ?? "bg-gray-50 text-gray-500";
};

const statusDotClass = (type) => {
	const map = {
		1: "bg-yellow-400",
		2: "bg-blue-400",
		3: "bg-indigo-400",
		4: "bg-green-500",
		5: "bg-orange-400",
		6: "bg-red-400",
	};
	return map[type] ?? "bg-gray-300";
};

const handleFetchOrders = () => {
	loading.value = true;
	if (route?.query?.offset) offset.value = route.query.offset;
	const params = { limit: limit.value, offset: offset.value };
	if (route?.query?.status) params["status"] = route.query.status;
	saleStore
		.fetchOrders(params)
		.then((d) => {
			loading.value = false;
			orders.value = d.results;
			totalCount.value = d.count;
			totalPage.value = calculateTotalPage(d.count, 12);
		})
		.catch(() => {
			loading.value = false;
		});
};

const handleOrderDetail = (item) => {
	router.push(`/account/orders/${item?.order_id}`);
};

onMounted(() => {
	handleFetchOrders();
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
		handleFetchOrders();
	},
	{ deep: true },
);

useHead({ title: "My Orders" });
</script>
