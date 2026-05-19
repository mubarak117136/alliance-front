<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div
			class="relative flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60"
		>
			<div
				class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent/60 to-transparent"
			/>
			<div
				class="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center"
			>
				<Icon name="mdi:credit-card-outline" size="18" class="text-accent" />
			</div>
			<div>
				<span class="text-[15px] font-black text-gray-900 leading-tight"
					>Secure Payment</span
				>
				<p class="text-[11px] text-gray-400 font-medium">
					Your card info is encrypted and never stored
				</p>
			</div>
		</div>

		<div class="p-5 flex flex-col gap-5">
			<!-- Accepted cards -->
			<div class="flex items-center gap-2">
				<span class="text-[11px] text-gray-400 font-medium">Accepted:</span>
				<div class="flex items-center gap-1.5">
					<div
						v-for="card in cards"
						:key="card"
						class="h-6 px-2 rounded-md bg-gray-100 flex items-center justify-center"
					>
						<span class="text-[10px] font-black text-gray-500">{{ card }}</span>
					</div>
				</div>
				<div class="flex-1" />
				<div
					class="flex items-center gap-1 text-[10px] text-green-600 font-semibold"
				>
					<Icon name="mdi:lock-outline" size="11" class="text-green-500" />
					SSL Secured
				</div>
			</div>

			<!-- Stripe form -->
			<CheckoutPaymentGatewaysStripe @error="handleError" />

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

const route = useRoute();

const error_msg = ref(null);

const cards = ["VISA", "MC", "AMEX"];

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
