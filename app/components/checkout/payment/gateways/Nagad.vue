<template>
	<button
		type="button"
		class="group w-full h-30 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
		:class="
			loading
				? 'border-gray-200 opacity-70 cursor-not-allowed bg-gray-50'
				: 'border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 hover:shadow-sm'
		"
		:disabled="loading"
		@click="handleNagadPayment"
	>
		<img
			src="@/assets/images/gateways/nagad.png"
			alt="Nagad"
			class="w-full h-full object-cover"
		/>

		<div
			v-if="loading"
			class="absolute inset-0 flex items-center justify-center bg-white/90"
		>
			<Icon name="mdi:loading" size="20" class="animate-spin text-orange-500" />
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

const handleNagadPayment = () => {
	loading.value = true;
	saleStore
		.nagadPayment({ order_id: route?.params?.slug })
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
