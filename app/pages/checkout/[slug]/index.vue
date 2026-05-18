<template>
	<div class="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Stepper -->
		<div class="max-w-md mx-auto mb-8">
			<CheckoutStepper :step="2" />
		</div>

		<!-- Page title -->
		<div class="mb-6">
			<h1 class="text-xl font-black text-gray-900 tracking-tight">Payment</h1>
			<p class="text-sm text-gray-400 mt-0.5">
				Choose a payment method to complete your order
			</p>
		</div>

		<!-- Loading skeleton -->
		<div v-if="loading && !order" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
			<!-- Left: Payment method skeleton -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<!-- Header -->
				<div class="relative flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
					<div class="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 animate-pulse" />
					<div class="w-9 h-9 rounded-xl bg-gray-200 animate-pulse" />
					<div class="flex flex-col gap-1.5">
						<div class="h-4 w-36 rounded bg-gray-200 animate-pulse" />
						<div class="h-3 w-44 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
				<div class="p-5 flex flex-col gap-5">
					<!-- Online payment label -->
					<div class="flex flex-col gap-3">
						<div class="flex items-center gap-2">
							<div class="h-3 w-32 rounded bg-gray-200 animate-pulse" />
							<div class="flex-1 h-px bg-gray-100" />
							<div class="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
						</div>
						<!-- Gateway grid -->
						<div class="grid grid-cols-2 gap-3">
							<div class="h-[7.5rem] rounded-2xl bg-gray-100 animate-pulse" />
							<div class="h-[7.5rem] rounded-2xl bg-gray-100 animate-pulse" />
							<div class="h-[7.5rem] rounded-2xl bg-gray-100 animate-pulse" />
						</div>
					</div>
					<!-- OR divider -->
					<div class="flex items-center gap-3">
						<div class="flex-1 h-px bg-gray-100" />
						<div class="h-3 w-6 rounded bg-gray-100 animate-pulse" />
						<div class="flex-1 h-px bg-gray-100" />
					</div>
					<!-- CoD section -->
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<div class="h-3 w-36 rounded bg-gray-200 animate-pulse" />
							<div class="flex-1 h-px bg-gray-100" />
							<div class="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
						</div>
						<div class="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
							<div class="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0" />
							<div class="flex-1 flex flex-col gap-2">
								<div class="h-4 w-36 rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-52 rounded bg-gray-100 animate-pulse" />
							</div>
							<div class="w-8 h-8 rounded-xl bg-gray-200 animate-pulse shrink-0" />
						</div>
					</div>
					<!-- Security strip -->
					<div class="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
						<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
						<div class="w-px h-3 bg-gray-200" />
						<div class="h-3 w-24 rounded bg-gray-100 animate-pulse" />
						<div class="w-px h-3 bg-gray-200" />
						<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
			</div>

			<!-- Right: Sidebar skeleton -->
			<div class="flex flex-col gap-4">
				<!-- Coupon skeleton -->
				<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
					<div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
						<div class="flex items-center gap-3">
							<div class="w-7 h-7 rounded-lg bg-gray-200 animate-pulse" />
							<div class="h-4 w-28 rounded bg-gray-200 animate-pulse" />
						</div>
					</div>
					<div class="px-5 py-4 flex gap-2">
						<div class="flex-1 h-10 rounded-xl bg-gray-100 animate-pulse" />
						<div class="h-10 w-16 rounded-xl bg-gray-200 animate-pulse" />
					</div>
				</div>

				<!-- Order summary skeleton -->
				<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
					<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
						<div class="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
						<div class="h-4 w-28 rounded bg-gray-200 animate-pulse" />
					</div>
					<div class="px-4 py-3 flex flex-col gap-3">
						<div v-for="i in 2" :key="i" class="flex gap-3 py-2">
							<div class="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0" />
							<div class="flex-1 flex flex-col gap-2 pt-1">
								<div class="h-3 w-full rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
							</div>
							<div class="w-12 flex flex-col gap-1.5 items-end pt-1 shrink-0">
								<div class="h-4 w-10 rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-8 rounded bg-gray-100 animate-pulse" />
							</div>
						</div>
					</div>
					<div class="px-5 py-4 border-t border-gray-100 flex flex-col gap-2">
						<div v-for="i in 3" :key="i" class="flex justify-between">
							<div class="h-3.5 w-20 rounded bg-gray-100 animate-pulse" />
							<div class="h-3.5 w-16 rounded bg-gray-200 animate-pulse" />
						</div>
					</div>
				</div>

				<!-- Delivery address skeleton -->
				<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
					<div class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
						<div class="w-7 h-7 rounded-lg bg-gray-200 animate-pulse" />
						<div class="h-4 w-32 rounded bg-gray-200 animate-pulse" />
					</div>
					<div class="px-5 py-4 flex gap-3">
						<div class="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0" />
						<div class="flex flex-col gap-2 flex-1">
							<div class="h-3.5 w-24 rounded bg-gray-200 animate-pulse" />
							<div class="h-3 w-36 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-44 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-28 rounded bg-gray-100 animate-pulse" />
						</div>
					</div>
				</div>

				<!-- Trust badges skeleton -->
				<div class="grid grid-cols-3 gap-2">
					<div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-gray-100 animate-pulse" />
				</div>
			</div>
		</div>

		<!-- Two-column layout -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
			<!-- Left: Payment methods -->
			<CheckoutPaymentMethod />

			<!-- Right: Sidebar -->
			<div class="flex flex-col gap-4 lg:sticky lg:top-[100px]">
				<!-- Coin (logged in only) -->
				<CheckoutPaymentCoin
					v-if="getProfile"
					:data="order"
					@refresh="handleFetchOrder"
				/>

				<!-- Coupon -->
				<CheckoutPaymentCoupon
					:data="order"
					@refresh="handleFetchOrder"
				/>

				<!-- Order summary -->
				<CheckoutPaymentProducts :data="order" />

				<!-- Shipping address -->
				<CheckoutPaymentShippingAddress
					v-if="order?.shipping_address"
					:data="order.shipping_address"
				/>

				<!-- Trust badges -->
				<div class="grid grid-cols-3 gap-2">
					<div
						v-for="t in trustItems"
						:key="t.label"
						class="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-white border border-gray-100 text-center"
					>
						<Icon :name="t.icon" size="16" class="text-primary" />
						<span class="text-[10px] font-semibold text-gray-500 leading-tight">{{ t.label }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";
import { useSaleStore } from "@/stores/sale";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const saleStore = useSaleStore();
const userStore = useUserStore();

const { getProfile } = storeToRefs(userStore);

const loading = ref(true);
const order = ref(null);

const trustItems = [
	{ icon: "mdi:lock-outline", label: "Secure Checkout" },
	{ icon: "mdi:truck-fast-outline", label: "Fast Delivery" },
	{ icon: "mdi:refresh", label: "Easy Returns" },
];

const handleFetchOrder = () => {
	loading.value = true;
	saleStore
		.orderDetail(route?.params?.slug)
		.then((d) => {
			loading.value = false;
			order.value = d;
		})
		.catch(() => {
			loading.value = false;
		});
};

onMounted(() => {
	handleFetchOrder();
});

useHead({ title: "Payment — Checkout" });
</script>
