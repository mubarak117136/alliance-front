<template>
	<button
		type="button"
		class="group w-full h-30 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
		:class="
			loading
				? 'border-gray-200 opacity-70 cursor-not-allowed bg-gray-50'
				: 'border-gray-200 bg-white hover:border-pink-400 hover:bg-pink-50/50 hover:shadow-sm'
		"
		:disabled="loading"
		@click="handleBkashPayment"
	>
		<img
			src="@/assets/images/gateways/bkash.png"
			alt="bKash"
			class="w-full h-full object-cover"
		/>

		<div
			v-if="loading"
			class="absolute inset-0 flex items-center justify-center bg-white/90"
		>
			<Icon name="mdi:loading" size="20" class="animate-spin text-pink-500" />
		</div>
	</button>
</template>

<script setup>
import { useRoute } from "#vue-router";
import { useSaleStore } from "@/stores/sale";

const route = useRoute();
const saleStore = useSaleStore();

const props = defineProps({ data: null });
const emit = defineEmits(["error"]);

const loading = ref(false);

const handleBkashPayment = () => {
	loading.value = true;
	saleStore
		.bkashPayment({ order_id: route?.params?.slug })
		.then((d) => {
			loading.value = false;
			location.href = d?.redirect_url;
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				emit("error", err_msg);
			} else {
				emit("error", "Something went wrong!");
			}
		});
};
</script>
