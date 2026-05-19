<template>
	<div class="flex flex-col gap-4">
		<!-- Skeleton -->
		<template v-if="loading">
			<div
				class="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between"
			>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 rounded bg-gray-100 animate-pulse" />
					<div class="h-3.5 w-24 rounded bg-gray-100 animate-pulse" />
				</div>
				<div class="h-3.5 w-36 rounded bg-gray-100 animate-pulse" />
			</div>

			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="px-5 py-3 border-b border-gray-100">
					<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
				</div>
				<div class="px-5 py-5 flex flex-col gap-0">
					<div v-for="i in 3" :key="i" class="flex items-start gap-4 pb-5">
						<div
							class="w-6 h-6 rounded-full bg-gray-100 animate-pulse shrink-0 mt-0.5"
						/>
						<div class="flex flex-col gap-1.5 flex-1">
							<div class="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-40 rounded bg-gray-100 animate-pulse" />
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div
					class="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
				>
					<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
					<div class="h-7 w-32 rounded-lg bg-gray-100 animate-pulse" />
				</div>
				<div class="flex flex-col divide-y divide-gray-50">
					<div
						v-for="i in 3"
						:key="i"
						class="flex items-center gap-4 px-5 py-4"
					>
						<div
							class="w-14 h-14 rounded-xl bg-gray-100 animate-pulse shrink-0"
						/>
						<div class="flex-1 flex flex-col gap-1.5">
							<div class="h-3.5 w-48 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
						</div>
						<div class="h-3.5 w-16 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
				<div
					class="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-2"
				>
					<div v-for="i in 4" :key="i" class="flex justify-between">
						<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
						<div class="h-3 w-16 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
			</div>

			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="px-5 py-3 border-b border-gray-100">
					<div class="h-3 w-32 rounded bg-gray-100 animate-pulse" />
				</div>
				<div class="px-5 py-5 flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div
							class="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0"
						/>
						<div class="flex flex-col gap-1.5 flex-1">
							<div class="h-3.5 w-32 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
						</div>
						<div class="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
					</div>
					<div class="flex items-start gap-3">
						<div
							class="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0"
						/>
						<div class="flex flex-col gap-1.5 flex-1">
							<div class="h-3.5 w-44 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-56 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-32 rounded bg-gray-100 animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- Real content -->
		<template v-else>
			<!-- Header -->
			<div
				class="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between"
			>
				<button
					type="button"
					class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
					@click="handleBack"
				>
					<Icon name="mdi:arrow-left" size="16" />
					Order Details
				</button>
				<div class="flex items-center gap-2">
					<span class="text-xs text-gray-400 hidden sm:block">Order ID</span>
					<span class="text-sm font-semibold text-gray-700 font-mono">{{
						orderDetail?.order_id
					}}</span>
				</div>
			</div>

			<!-- Status timeline -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div
					class="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3"
				>
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
						>Order Status</span
					>
					<div
						v-if="
							orderDetail?.status?.type == 1 || orderDetail?.status?.type == 2
						"
						class="flex items-center gap-2"
					>
						<button
							v-if="orderDetail?.status?.type == 1"
							type="button"
							:disabled="actionLoading"
							class="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
							@click="handlePayNow"
						>
							<Icon name="mdi:credit-card-outline" size="12" />
							Pay Now
						</button>
						<button
							type="button"
							:disabled="actionLoading"
							class="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-red-500 text-xs font-medium hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-60"
							@click="cancelOrderPromptOpen = true"
						>
							<Icon name="mdi:close-circle-outline" size="12" />
							Cancel
						</button>
					</div>
				</div>
				<div class="px-5 py-5">
					<div class="relative flex flex-col">
						<div
							v-for="(item, idx) in orderDetail?.all_status"
							:key="'status_' + idx"
							class="flex items-start gap-4 relative"
						>
							<div
								v-if="idx < orderDetail.all_status.length - 1"
								class="absolute left-3 top-7 bottom-0 w-px bg-gray-100"
							/>
							<div
								class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-0.5"
								:class="timeLineDotClass(item?.type)"
							>
								<Icon :name="timeLineIcon(item?.type)" size="12" />
							</div>
							<div class="flex-1 pb-5">
								<p class="text-sm font-medium text-gray-700">
									{{ orderStatusTypeToText(item?.type) }}
								</p>
								<p class="text-[11px] text-gray-400 mt-0.5">
									{{ dayjs(item?.creation_time).format("DD MMM YYYY, HH:mm") }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Products card -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<!-- Header -->
				<div
					class="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
				>
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
					>
						Products
						<span class="normal-case text-gray-300 font-normal ml-1"
							>({{ orderDetail?.carts?.length }})</span
						>
					</span>
					<a
						:href="HOST + '/invoice/pdf/' + route?.params?.orderid + '/'"
						target="_blank"
						class="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
					>
						<Icon name="mdi:download-outline" size="13" />
						Invoice
					</a>
				</div>

				<!-- Column headers -->
				<div
					class="grid grid-cols-[1fr_auto_auto] gap-3 px-5 py-2 border-b border-gray-50"
				>
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
						>Item</span
					>
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-8 text-center"
						>Qty</span
					>
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-20 text-right"
						>Price</span
					>
				</div>

				<!-- Rows -->
				<div class="flex flex-col divide-y divide-gray-50">
					<div
						v-for="(item, idx) in orderDetail?.carts"
						:key="'item_' + idx"
						class="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-5 py-3 hover:bg-gray-50/60 transition-colors"
					>
						<!-- Item info -->
						<div class="flex items-center gap-3 min-w-0">
							<NuxtLink
								:to="'/products/' + item?.product_detail?.slug"
								class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0 block"
							>
								<img
									:src="
										HOST + item?.product_detail?.default_image?.original?.src
									"
									:alt="item?.product_detail?.default_image?.original?.alt"
									class="w-full h-full object-cover"
								/>
							</NuxtLink>
							<div class="min-w-0">
								<NuxtLink
									:to="'/products/' + item?.product_detail?.slug"
									class="text-xs font-medium text-gray-700 leading-snug line-clamp-1 hover:text-primary transition-colors"
									>{{ item?.product_detail?.name }}</NuxtLink
								>
								<div class="flex flex-wrap gap-1 mt-1">
									<span
										v-if="cartItemVariantResolver(item)"
										class="text-[10px] px-1.5 py-px rounded bg-gray-100 text-gray-400 leading-tight"
									>
										{{ cartItemVariantResolver(item) }}
									</span>
									<span
										v-if="!isObjectEmpty(item?.static_attribute_data ?? {})"
										class="text-[10px] px-1.5 py-px rounded bg-gray-100 text-gray-400 leading-tight"
									>
										{{ convertObjToString(item?.static_attribute_data) }}
									</span>
								</div>
								<div class="flex items-center gap-1.5 mt-1.5">
									<button
										v-if="orderDetail?.status?.type == 4 && !item?.rating"
										type="button"
										class="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
										@click="handleOpenRatingModal(item)"
									>
										<Icon name="mdi:star-outline" size="10" />
										Rate
									</button>
									<span
										v-else-if="item?.rating"
										class="flex items-center gap-0.5 text-[10px] text-gray-400"
									>
										<Icon name="mdi:star" size="10" class="text-yellow-400" />
										Rated
									</span>
									<span
										v-if="
											(orderDetail?.status?.type == 4 ||
												orderDetail?.status?.type == 5 ||
												orderDetail?.status?.type == 6) &&
											(item?.rating || orderDetail?.status?.type != 4)
										"
										class="text-gray-200 text-[10px]"
										>·</span
									>
									<button
										v-if="
											orderDetail?.status?.type == 4 ||
											orderDetail?.status?.type == 5 ||
											orderDetail?.status?.type == 6
										"
										type="button"
										:disabled="actionLoading"
										class="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
										@click="handleAddToCart(item)"
									>
										<Icon name="mdi:cart-plus" size="10" />
										Order Again
									</button>
								</div>
							</div>
						</div>

						<!-- Qty -->
						<div class="w-8 text-center">
							<span class="text-xs text-gray-500">{{ item?.total_item }}</span>
						</div>

						<!-- Price -->
						<div class="w-20 text-right">
							<span class="text-xs font-medium text-gray-700"
								>{{ currency
								}}{{ cartItemPriceResolver(item)?.toLocaleString() }}</span
							>
						</div>
					</div>
				</div>

				<!-- Totals -->
				<div class="border-t border-gray-100 px-5 py-3 flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<span class="text-xs text-gray-400">Products</span>
						<span class="text-xs text-gray-500"
							>{{ currency }}{{ calculateCartTotal?.toLocaleString() }}</span
						>
					</div>
					<div
						v-if="orderDetail?.shipping_price"
						class="flex items-center justify-between"
					>
						<span class="text-xs text-gray-400">
							Shipping
							<span class="text-gray-300">({{ orderDetail.shipping_price.provider }} - {{ orderDetail.shipping_price.service_name }})</span>
						</span>
						<span class="text-xs text-gray-500">
							{{
								orderDetail.shipping_price.price == 0
									? "Free"
									: currency +
										orderDetail.shipping_price.price?.toLocaleString()
							}}
						</span>
					</div>
					<div
						v-if="orderDetail?.coupon"
						class="flex items-center justify-between"
					>
						<span class="text-xs text-gray-400">Coupon</span>
						<span class="text-xs text-green-600"
							>− {{ currency
							}}{{ orderDetail.coupon.discount_amount?.toLocaleString() }}</span
						>
					</div>

					<div
						class="flex items-center justify-between pt-2.5 mt-0.5 border-t border-dashed border-gray-200"
					>
						<span class="text-sm font-semibold text-gray-700">Grand Total</span>
						<span class="text-sm font-semibold text-gray-800"
							>{{ currency }}{{ calculateGrandTotal?.toLocaleString() }}</span
						>
					</div>
				</div>
			</div>

			<!-- Shipping & payment info -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="px-5 py-3 border-b border-gray-100">
					<span
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
						>Shipping & Payment</span
					>
				</div>
				<div class="px-5 py-5 flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div
							class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
						>
							<Icon
								name="mdi:credit-card-outline"
								size="13"
								class="text-gray-400"
							/>
						</div>
						<div>
							<p class="text-xs font-medium text-gray-700">
								{{
									orderDetail?.payment?.cash_on_delivery
										? "Cash on Delivery"
										: "Online Payment"
								}}
							</p>
							<p class="text-[11px] text-gray-400">Payment method</p>
						</div>
						<span
							class="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
							:class="paymentStatusClass(orderDetail?.payment?.status)"
						>
							{{ paymentStatusToText(orderDetail?.payment?.status) }}
						</span>
					</div>

					<div
						v-if="orderDetail?.shipping_address"
						class="flex items-start gap-3"
					>
						<div
							class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5"
						>
							<Icon
								name="mdi:map-marker-outline"
								size="13"
								class="text-gray-400"
							/>
						</div>
						<div class="flex flex-col gap-0.5">
							<p class="text-xs font-medium text-gray-700">
								{{ orderDetail.shipping_address.full_name }}
							</p>
							<p class="text-[11px] text-gray-400 flex items-center gap-1">
								<Icon name="mdi:phone-outline" size="11" />
								{{ orderDetail.shipping_address.phone }}
							</p>
							<p v-if="orderDetail.shipping_address.email" class="text-[11px] text-gray-400 flex items-center gap-1">
								<Icon name="mdi:email-outline" size="11" />
								{{ orderDetail.shipping_address.email }}
							</p>
							<p class="text-[11px] text-gray-400">
								{{ orderDetail.shipping_address.address }}
							</p>
							<p class="text-[11px] text-gray-400">
								{{ orderDetail.shipping_address.city }},
								{{ orderDetail.shipping_address.state_detail?.name }},
								{{ orderDetail.shipping_address.country_detail?.name }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- Cancel order confirmation modal -->
		<ModalsYesNoModal
			v-if="cancelOrderPromptOpen"
			:isOpenModal="cancelOrderPromptOpen"
			@close="handleCancelOrderConfirmation"
		/>

		<!-- Rating modal -->
		<ModalsCreateRating
			v-if="ratingModalOpen"
			:isOpenModal="ratingModalOpen"
			:data="selectedCartItem"
			@close="handleRatingModalClose"
		/>
	</div>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";
import { useUserStore } from "@/stores/user";
import {
	truncateText,
	isObjectEmpty,
	convertObjToString,
	orderStatusTypeToText,
} from "@/utils/utils";
import { useToast } from "vue-toastification";

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const saleStore = useSaleStore();
const userStore = useUserStore();
const dayjs = useDayjs();
const toast = useToast();

const loading = ref(true);
const actionLoading = ref(false);
const orderDetail = ref(null);
const cancelOrderPromptOpen = ref(false);
const ratingModalOpen = ref(false);
const selectedCartItem = ref(null);

const currency = config.public.currency;
const HOST = computed(() => config.public.HOST);

const handleFetchOrder = () => {
	loading.value = true;
	saleStore
		.orderDetail(route?.params?.orderid)
		.then((d) => {
			loading.value = false;
			orderDetail.value = d;
		})
		.catch(() => {
			loading.value = false;
		});
};

onMounted(() => {
	handleFetchOrder();
});

const handleBack = () => {
	router.push({ name: "account-slug-orderid", params: { slug: "orders" } });
};

const handlePayNow = () => {
	router.push({
		name: "checkout-slug",
		params: { slug: orderDetail?.value?.order_id },
	});
};

const cartItemVariantResolver = (item) => {
	if (orderDetail?.value?.status?.type == 1) return item?.variant_detail?.name;
	return item?.variant_data?.name;
};

const cartItemPriceResolver = (item) => {
	if (orderDetail?.value?.status?.type == 1)
		return item?.variant_detail?.price * item?.total_item;
	return item?.variant_data?.price * item?.total_item;
};

const calculateCartTotal = computed(() => {
	let total = 0;
	for (var i = 0; i < orderDetail?.value?.carts?.length; i++) {
		total += cartItemPriceResolver(orderDetail.value.carts[i]);
	}
	return total;
});

const calculateGrandTotal = computed(() => {
	const cartTotal = calculateCartTotal.value;
	const shipping = orderDetail?.value?.shipping_price?.price ?? 0;
	const coupon = orderDetail?.value?.coupon?.discount_amount ?? 0;
	const coin = orderDetail?.value?.coin?.amount ?? 0;
	return cartTotal + shipping - coupon - coin;
});

const timeLineIcon = (type) => {
	const map = {
		1: "mdi:timer-sand",
		2: "mdi:cog-sync-outline",
		3: "mdi:truck-delivery-outline",
		4: "mdi:check-bold",
		5: "mdi:keyboard-return",
		6: "mdi:close",
	};
	return map[type] ?? "mdi:circle-outline";
};

const timeLineDotClass = (type) => {
	if (type == 5 || type == 6) return "bg-red-100 text-red-500";
	return "bg-green-100 text-green-600";
};

const timeLineConnectorColor = (type) => {
	if (type == 5 || type == 6) return "bg-red-200";
	return "bg-green-200";
};

const paymentStatusToText = (status) => {
	if (status == 1) return "Paid";
	if (status == 2) return "Failed";
	return "Pending";
};

const paymentStatusClass = (status) => {
	if (status == 1) return "bg-green-100 text-green-600";
	if (status == 2) return "bg-red-100 text-red-500";
	return "bg-yellow-100 text-yellow-600";
};

const handleCancelOrder = () => {
	actionLoading.value = true;
	saleStore
		.cancelOrder({ order: route?.params?.orderid })
		.then(() => {
			actionLoading.value = false;
			toast.success("Order cancelled!");
			handleFetchOrder();
		})
		.catch((e) => {
			actionLoading.value = false;
			var err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				toast.error(err_msg);
			} else {
				toast.error("Something went wrong!");
			}
		});
};

const handleCancelOrderConfirmation = (status) => {
	if (status == true) handleCancelOrder();
	cancelOrderPromptOpen.value = false;
};

const handleOpenRatingModal = (item) => {
	selectedCartItem.value = item;
	ratingModalOpen.value = true;
};

const handleRatingModalClose = (refresh = false) => {
	if (refresh == true) handleFetchOrder();
	selectedCartItem.value = null;
	ratingModalOpen.value = false;
};

const handleAddToCart = (item) => {
	actionLoading.value = true;
	const payload = {
		product: item?.product_detail?.id,
		variant: item?.variant,
		total_item: item?.total_item,
		static_attribute_data: item?.static_attribute_data,
	};
	saleStore
		.addToCart(payload)
		.then(() => {
			actionLoading.value = false;
			saleStore.cartModalOpen = true;
			toast.success("Successfully added to cart!");
		})
		.catch((e) => {
			actionLoading.value = false;
			var err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				toast.error(err_msg);
			} else {
				toast.error("Something went wrong!");
			}
		});
};

useHead({ title: route?.params?.orderid ?? "Order Details" });
</script>
