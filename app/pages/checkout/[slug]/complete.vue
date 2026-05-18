<template>
	<div class="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Stepper -->
		<div class="max-w-md mx-auto mb-8">
			<CheckoutStepper :step="3" />
		</div>

		<!-- Loading skeleton -->
		<div
			v-if="loading && !order"
			class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8"
		>
			<!-- Left skeleton -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="h-1 bg-gray-200 animate-pulse" />
				<div class="px-6 py-8 flex flex-col items-center gap-5">
					<div class="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
					<div class="flex flex-col items-center gap-2 w-full">
						<div class="h-7 w-48 rounded-xl bg-gray-200 animate-pulse" />
						<div class="h-4 w-72 rounded-lg bg-gray-100 animate-pulse" />
					</div>
					<div class="h-10 w-64 rounded-xl bg-gray-100 animate-pulse" />
					<div class="w-full max-w-sm flex flex-col gap-4 mt-2">
						<div v-for="i in 4" :key="i" class="flex items-start gap-3">
							<div
								class="w-7 h-7 rounded-full bg-gray-200 animate-pulse shrink-0"
							/>
							<div class="flex flex-col gap-1.5 flex-1 pt-1">
								<div class="h-3.5 w-28 rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-48 rounded bg-gray-100 animate-pulse" />
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-3 w-full mt-2">
						<div class="h-11 w-full rounded-xl bg-gray-200 animate-pulse" />
						<div class="h-11 w-full rounded-xl bg-gray-100 animate-pulse" />
					</div>
				</div>
				<div class="px-6 py-3 border-t border-gray-100 flex justify-center">
					<div class="h-3.5 w-40 rounded bg-gray-100 animate-pulse" />
				</div>
			</div>

			<!-- Right skeleton -->
			<div class="flex flex-col gap-4">
				<div
					class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
				>
					<div
						class="px-5 py-4 border-b border-gray-100 flex items-center gap-3"
					>
						<div class="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
						<div class="h-4 w-32 rounded bg-gray-200 animate-pulse" />
					</div>
					<div class="px-4 py-3 flex flex-col gap-3">
						<div v-for="i in 3" :key="i" class="flex gap-3 py-2">
							<div
								class="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0"
							/>
							<div class="flex-1 flex flex-col gap-2 pt-1">
								<div class="h-3 w-full rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
							</div>
							<div class="w-12 flex flex-col gap-1.5 items-end pt-1">
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
				<div class="bg-white border border-gray-100 rounded-2xl p-5 flex gap-3">
					<div class="w-8 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
					<div class="flex flex-col gap-2 flex-1">
						<div class="h-3.5 w-24 rounded bg-gray-200 animate-pulse" />
						<div class="h-3 w-40 rounded bg-gray-100 animate-pulse" />
						<div class="h-3 w-32 rounded bg-gray-100 animate-pulse" />
					</div>
				</div>
			</div>
		</div>

		<!-- Two-column layout -->
		<div
			v-else
			class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start"
		>
			<!-- Left: Completion card -->
			<CheckoutPaymentComplete />

			<!-- Right: Sidebar -->
			<div class="flex flex-col gap-4 lg:sticky lg:top-[100px]">
				<!-- Order summary -->
				<CheckoutPaymentProducts :data="order" />

				<!-- Shipping address -->
				<CheckoutPaymentShippingAddress
					v-if="order?.shipping_address"
					:data="order.shipping_address"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";
import { useSaleStore } from "@/stores/sale";

const route = useRoute();
const saleStore = useSaleStore();

const loading = ref(true);
const order = ref(null);

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

useHead({ title: "Order Confirmed — Thank You!" });
</script>
