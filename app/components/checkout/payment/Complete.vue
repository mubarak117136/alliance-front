<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Top accent bar -->
		<div class="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400" />

		<div class="px-6 py-8 flex flex-col items-center text-center">
			<!-- Success icon -->
			<div class="relative mb-6">
				<div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
					<div class="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
						<Icon name="mdi:check" size="30" class="text-white" />
					</div>
				</div>
				<!-- Pulse ring -->
				<div class="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
			</div>

			<!-- Heading -->
			<h2 class="text-2xl font-black text-gray-900 tracking-tight mb-1">Order Confirmed!</h2>
			<p class="text-sm text-gray-500 font-medium mb-5">
				Thank you for your order. We've received it and will start processing right away.
			</p>

			<!-- Order ID badge -->
			<div class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 mb-6">
				<Icon name="mdi:receipt-text-outline" size="15" class="text-gray-400 shrink-0" />
				<span class="text-xs text-gray-500 font-medium">Order ID</span>
				<div class="w-px h-3.5 bg-gray-200" />
				<span class="text-sm font-black text-gray-800 tracking-wide font-mono">{{ route?.params?.slug }}</span>
			</div>

			<!-- What's next timeline -->
			<div class="w-full max-w-sm mb-7">
				<div class="flex flex-col gap-0">
					<div v-for="(step, i) in nextSteps" :key="i" class="flex items-start gap-3">
						<div class="flex flex-col items-center">
							<div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
								:class="i === 0 ? 'bg-green-500' : 'bg-gray-100'">
								<Icon :name="step.icon" size="13" :class="i === 0 ? 'text-white' : 'text-gray-400'" />
							</div>
							<div v-if="i < nextSteps.length - 1" class="w-px h-6 bg-gray-200 mt-0.5" />
						</div>
						<div class="pb-3 pt-1 text-left">
							<p class="text-xs font-bold" :class="i === 0 ? 'text-gray-800' : 'text-gray-400'">{{ step.title }}</p>
							<p class="text-[11px] text-gray-400 mt-0.5">{{ step.desc }}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-3 w-full">
				<NuxtLink
					v-if="getProfile"
					to="/account/orders"
					class="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
				>
					<Icon name="mdi:package-variant" size="16" />
					Track My Order
				</NuxtLink>
				<button
					type="button"
					class="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
					@click="handleBack"
				>
					<Icon name="mdi:storefront-outline" size="16" />
					Continue Shopping
				</button>
			</div>
		</div>

		<!-- Footer strip -->
		<div class="px-6 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-center">
			<NuxtLink to="/contact-us" class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium hover:text-primary transition-colors">
				<Icon name="mdi:headset" size="12" />
				<span>Need help? Contact support</span>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { getProfile } = storeToRefs(userStore);

const nextSteps = [
	{ icon: "mdi:check-circle-outline", title: "Order Received", desc: "We've received your order and payment confirmation." },
	{ icon: "mdi:package-variant-closed", title: "Being Prepared", desc: "Your items are being packed at our warehouse." },
	{ icon: "mdi:truck-fast-outline", title: "Out for Delivery", desc: "Your order will be shipped to your address soon." },
	{ icon: "mdi:map-marker-check-outline", title: "Delivered", desc: "Sit back and wait for your order to arrive!" },
];

const handleBack = () => router.push("/");
</script>
