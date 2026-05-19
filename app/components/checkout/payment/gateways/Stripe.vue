<template>
	<div class="flex flex-col gap-4">
		<!-- Card input -->
		<div class="flex flex-col gap-2">
			<label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Details</label>
			<div
				id="card-element"
				class="rounded-xl border-2 bg-gray-50 transition-all px-4 py-4"
				:class="cardError ? 'border-red-300' : 'border-gray-200'"
			></div>
			<p v-if="cardError" class="text-[11px] text-red-500 font-medium flex items-center gap-1">
				<Icon name="mdi:alert-circle-outline" size="11" />{{ cardError }}
			</p>
		</div>

		<!-- Pay button -->
		<button
			type="button"
			:disabled="loading || !stripeReady"
			class="w-full relative flex items-center justify-center gap-2 h-12 rounded-[10px] bg-accent text-white font-bold text-sm hover:bg-accent-dark active:scale-[0.98] transition-all shadow-md shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
			@click="handlePay"
		>
			<div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 pointer-events-none" />
			<Icon v-if="loading" name="mdi:loading" size="16" class="animate-spin relative" />
			<Icon v-else name="mdi:credit-card-outline" size="15" class="relative" />
			<span class="relative">{{ loading ? "Processing…" : "Pay Now" }}</span>
		</button>
	</div>
</template>

<script setup>
import { loadStripe } from "@stripe/stripe-js";
import { useSaleStore } from "@/stores/sale";

const emit = defineEmits(["error"]);

const route = useRoute();
const router = useRouter();
const saleStore = useSaleStore();

const config = useRuntimeConfig();

const loading = ref(false);
const cardError = ref(null);
const stripeReady = ref(false);

let stripe = null;
let cardElement = null;

onMounted(async () => {
	stripe = await loadStripe(config.public.stripePublicKey);
	const elements = stripe.elements();
	cardElement = elements.create("card", {
		hidePostalCode: true,
		style: {
			base: {
				fontSize: "15px",
				lineHeight: "1.5",
				color: "#1f2937",
				fontFamily: "'Inter', sans-serif",
				fontSmoothing: "antialiased",
				"::placeholder": { color: "#9ca3af" },
				iconColor: "#6b7280",
			},
			invalid: {
				color: "#ef4444",
				iconColor: "#ef4444",
			},
		},
	});
	cardElement.mount("#card-element");
	cardElement.on("change", (e) => {
		cardError.value = e.error?.message ?? null;
	});
	stripeReady.value = true;
});

const handlePay = async () => {
	if (!stripe || !cardElement) return;

	loading.value = true;
	cardError.value = null;

	const { token, error } = await stripe.createToken(cardElement);

	if (error) {
		cardError.value = error.message;
		loading.value = false;
		return;
	}

	saleStore
		.stripePayment({ order_id: route?.params?.slug, source: token.id })
		.then((d) => {
			loading.value = false;
			if (d?.charge === true) {
				router.push({ name: "checkout-slug-complete", params: { slug: route?.params?.slug } });
			}
		})
		.catch((e) => {
			loading.value = false;
			let msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) msg += `${value}`;
			} else {
				msg = "Payment failed. Please try again.";
			}
			emit("error", msg);
		});
};
</script>
