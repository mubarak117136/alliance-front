<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div
			class="relative flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60"
		>
			<div
				class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent"
			/>
			<div
				class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"
			>
				<Icon name="mdi:credit-card-outline" size="18" class="text-primary" />
			</div>
			<div>
				<span class="text-[15px] font-black text-gray-900 leading-tight"
					>Payment Method</span
				>
				<p class="text-[11px] text-gray-400 font-medium">
					Choose how you'd like to pay
				</p>
			</div>
		</div>

		<div class="p-5 flex flex-col gap-5">
			<!-- Online payment section -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1.5">
						<div class="w-1.5 h-1.5 rounded-full bg-primary" />
						<span
							class="text-[11px] font-black text-gray-500 uppercase tracking-wider"
							>Online Payment</span
						>
					</div>
					<div class="flex-1 h-px bg-gray-100" />
					<span
						class="text-[10px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full border border-primary/15"
						>Instant</span
					>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<template
						v-for="(item, idx) in getPaymentGateways"
						:key="'gw_' + idx"
					>
						<CheckoutPaymentGatewaysSSLCommerz
							v-if="item?.provider == 1"
							:data="item"
							@error="handleError"
						/>
						<CheckoutPaymentGatewaysBkash
							v-if="item?.provider == 2"
							:data="item"
							@error="handleError"
						/>
						<CheckoutPaymentGatewaysNagad
							v-if="item?.provider == 3"
							:data="item"
							@error="handleError"
						/>
					</template>
				</div>
			</div>

			<!-- Divider -->
			<div class="flex items-center gap-3">
				<div class="flex-1 h-px bg-gray-100" />
				<span
					class="text-[11px] font-bold text-gray-300 uppercase tracking-widest"
					>or</span
				>
				<div class="flex-1 h-px bg-gray-100" />
			</div>

			<!-- Cash on Delivery -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<div class="w-1.5 h-1.5 rounded-full bg-green-500" />
					<span
						class="text-[11px] font-black text-gray-500 uppercase tracking-wider"
						>Cash on Delivery</span
					>
					<div class="flex-1 h-px bg-gray-100" />
					<span
						class="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200"
						>Pay Later</span
					>
				</div>

				<button
					type="button"
					class="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] relative overflow-hidden"
					:class="
						codLoading
							? 'border-gray-200 opacity-70 cursor-not-allowed bg-gray-50'
							: 'border-gray-200 bg-gradient-to-r from-green-50/60 to-emerald-50/60 hover:border-green-400 hover:from-green-50 hover:to-emerald-50'
					"
					:disabled="codLoading"
					@click="handleCashOnDelivery"
				>
					<!-- Icon -->
					<div
						class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
					>
						<Icon name="mdi:cash-multiple" size="22" class="text-green-600" />
					</div>

					<!-- Text -->
					<div class="flex-1 text-left">
						<p class="text-sm font-black text-gray-800">Cash on Delivery</p>
						<p class="text-xs text-gray-500 font-medium mt-0.5">
							Pay when your order arrives at your door
						</p>
					</div>

					<!-- Arrow / spinner -->
					<div
						class="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
						:class="
							codLoading
								? 'bg-gray-100'
								: 'bg-green-100 group-hover:bg-green-200'
						"
					>
						<Icon
							v-if="codLoading"
							name="mdi:loading"
							size="16"
							class="animate-spin text-green-600"
						/>
						<Icon
							v-else
							name="mdi:arrow-right"
							size="16"
							class="text-green-600 transition-transform group-hover:translate-x-0.5"
						/>
					</div>
				</button>
			</div>

			<!-- Error -->
			<div
				v-if="error_msg"
				class="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
			>
				<Icon
					name="mdi:alert-circle-outline"
					size="15"
					class="shrink-0 mt-0.5"
				/>
				<span>{{ error_msg }}</span>
			</div>

			<!-- Security strip -->
			<div
				class="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
			>
				<div
					class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium"
				>
					<Icon name="mdi:lock-outline" size="12" class="text-gray-400" />
					<span>256-bit SSL</span>
				</div>
				<div class="w-px h-3 bg-gray-200" />
				<div
					class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium"
				>
					<Icon
						name="mdi:shield-check-outline"
						size="12"
						class="text-green-500"
					/>
					<span>Secure Payment</span>
				</div>
				<div class="w-px h-3 bg-gray-200" />
				<div
					class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium"
				>
					<Icon name="mdi:eye-off-outline" size="12" class="text-gray-400" />
					<span>Private & Safe</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";
import { useSaleStore } from "@/stores/sale";
import { useUtilityStore } from "@/stores/utility";

const router = useRouter();
const route = useRoute();
const saleStore = useSaleStore();
const utilityStore = useUtilityStore();

const { getPaymentGateways } = storeToRefs(utilityStore);

const codLoading = ref(false);
const error_msg = ref(null);

const handleCashOnDelivery = () => {
	codLoading.value = true;
	saleStore
		.cashOnDelivary({ order_id: route?.params?.slug })
		.then(() => {
			codLoading.value = false;
			router.push({
				name: "checkout-slug-complete",
				params: { slug: route?.params?.slug },
			});
		})
		.catch((e) => {
			codLoading.value = false;
			let err_msg = "";
			if (e.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
};

const handleError = (msg) => {
	error_msg.value = msg;
};

onMounted(() => {
	const hasError = route?.query?.error;
	if (hasError === "failed") {
		error_msg.value =
			"Payment declined — please check your balance or try another method.";
	} else if (hasError === "cancel") {
		error_msg.value = "Payment was cancelled.";
	} else if (hasError) {
		error_msg.value = "Something went wrong when processing your payment.";
	}
});
</script>

<style scoped>
.bg-primary\/8 {
	background-color: rgb(21 101 192 / 0.08);
}
</style>
