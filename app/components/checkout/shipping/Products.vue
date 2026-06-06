<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-4">
		<!-- Header -->
		<div
			class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60"
		>
			<div
				class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"
			>
				<Icon name="mdi:receipt-text-outline" size="16" class="text-primary" />
			</div>
			<span class="text-sm font-black text-gray-800">Order Summary</span>
		</div>

		<div v-if="getCarts.length > 0" class="flex flex-col">
			<!-- Cart items -->
			<div class="px-4 py-3 flex flex-col divide-y divide-gray-100">
				<div
					v-for="(item, idx) in getCarts"
					:key="'os_' + idx"
					class="flex gap-3 py-3"
				>
					<!-- Thumbnail -->
					<div class="shrink-0 relative">
						<div
							class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
						>
							<img
								v-if="item?.product_detail?.default_image"
								:src="HOST + item.product_detail.default_image.original.src"
								:alt="item.product_detail.default_image.original.alt"
								class="w-full h-full object-cover"
							/>
							<div
								v-else
								class="w-full h-full flex items-center justify-center"
							>
								<Icon
									name="mdi:image-off-outline"
									size="14"
									class="text-gray-300"
								/>
							</div>
						</div>
						<span
							class="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center"
						>
							{{ item.total_item }}
						</span>
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<p
							class="text-xs font-bold text-gray-700 leading-snug line-clamp-2"
						>
							{{ item?.product_detail?.name }}
						</p>
						<div class="flex flex-wrap gap-1 mt-1">
							<span
								v-if="item?.variant_detail?.humanise_name || item?.variant_detail?.name"
								class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/10"
							>
								{{ item?.variant_detail?.humanise_name || item?.variant_detail?.name }}
							</span>
							<span
								v-if="!isObjectEmpty(item?.static_attribute_data)"
								class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500"
							>
								{{ convertObjToString(item?.static_attribute_data) }}
							</span>
						</div>
					</div>

					<!-- Price -->
					<div class="shrink-0 text-right">
						<p class="text-sm font-black text-accent">
							{{ currency }}{{ item?.price?.toLocaleString() }}
						</p>
						<p class="text-[10px] text-gray-400">
							{{ item.total_item }} × {{ currency
							}}{{ item?.variant_detail?.price?.toLocaleString() }}
						</p>
					</div>
				</div>
			</div>

			<!-- Totals -->
			<div
				class="px-5 py-4 border-t border-gray-100 flex flex-col gap-2.5 bg-gray-50/40"
			>
				<div class="flex items-center justify-between text-sm">
					<span class="text-gray-500 font-medium">Products</span>
					<span class="font-bold text-gray-700"
						>{{ currency }}{{ getCartTotal?.toLocaleString() }}</span
					>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-gray-500 font-medium">Shipping</span>
					<span
						class="font-bold"
						:class="getShippingCost > 0 ? 'text-gray-700' : 'text-green-600'"
					>
						{{
							getShippingCost > 0
								? currency + getShippingCost.toLocaleString()
								: "Free"
						}}
					</span>
				</div>
				<div class="h-px bg-gray-200" />
				<div class="flex items-center justify-between">
					<span class="text-sm font-bold text-gray-700">Grand Total</span>
					<span class="text-lg font-black text-gray-900"
						>{{ currency }}{{ grandTotal.toLocaleString() }}</span
					>
				</div>
			</div>
		</div>

		<!-- Empty -->
		<div v-else class="flex flex-col items-center py-10 text-center px-4">
			<Icon name="mdi:cart-outline" size="28" class="text-gray-300 mb-2" />
			<p class="text-gray-400 text-sm font-medium">Your cart is empty</p>
		</div>
	</div>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";
import { isObjectEmpty, convertObjToString } from "@/utils/utils";

const config = useRuntimeConfig();
const saleStore = useSaleStore();

const { getCarts, getCartTotal, getShippingCost } = storeToRefs(saleStore);
const HOST = config.public.HOST;
const currency = config.public.currency;

const grandTotal = computed(
	() => (getCartTotal.value ?? 0) + (getShippingCost.value ?? 0),
);
</script>

<style scoped>
.bg-primary\/8 {
	background-color: rgb(21 101 192 / 0.08);
}
</style>
