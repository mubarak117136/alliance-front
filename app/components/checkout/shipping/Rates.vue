<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div
			class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60"
		>
			<div
				class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"
			>
				<Icon name="mdi:truck-fast-outline" size="16" class="text-primary" />
			</div>
			<span class="text-sm font-black text-gray-800"
				>Select Shipping Service</span
			>
		</div>

		<!-- Services list -->
		<div
			v-if="getShippingServices?.services?.length"
			class="flex flex-col gap-2.5 p-4"
		>
			<label
				v-for="(item, idx) in getShippingServices.services"
				:key="'srv_' + idx"
				class="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150"
				:class="
					selected === idx
						? 'border-accent bg-accent/5 shadow-sm shadow-accent/15'
						: 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
				"
			>
				<div class="flex-1 min-w-0">
					<p
						class="text-sm font-bold"
						:class="selected === idx ? 'text-gray-900' : 'text-gray-700'"
					>
						{{ item.provider }}
					</p>
					<p
						class="text-xs"
						:class="selected === idx ? 'text-gray-500' : 'text-gray-400'"
					>
						{{ item.service_name }}
					</p>
				</div>

				<span
					class="text-sm font-black shrink-0"
					:class="selected === idx ? 'text-accent' : 'text-gray-600'"
					>${{ item.rate }}</span
				>

				<input
					type="radio"
					class="sr-only"
					:value="idx"
					v-model="selected"
					@change="handleSelect(item)"
				/>
			</label>
		</div>

		<!-- Empty state -->
		<div v-else class="flex flex-col items-center py-8 px-4 text-center">
			<Icon name="mdi:truck-outline" size="28" class="text-gray-200 mb-2" />
			<p class="text-xs text-gray-400 font-medium">
				Fill in the shipping address to see available rates
			</p>
		</div>
	</div>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";

const saleStore = useSaleStore();
const { getShippingServices } = storeToRefs(saleStore);

const selected = ref(null);

const handleSelect = (item) => {
	saleStore.selectedShippingService = item;
	saleStore.shippingCost = item.rate ?? 0;
};

// Reset selection when services change
watch(
	() => getShippingServices.value,
	() => {
		selected.value = null;
		saleStore.selectedShippingService = null;
	},
);
</script>
