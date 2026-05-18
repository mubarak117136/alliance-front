<template>
	<div v-if="props?.data?.carts?.length > 0" class="flex flex-col">
		<!-- Items -->
		<div class="px-4 py-3 flex flex-col divide-y divide-gray-100">
			<div
				v-for="(item, idx) in props.data.carts"
				:key="'pi_' + idx"
				class="flex gap-3 py-3"
			>
				<!-- Thumbnail -->
				<div class="shrink-0 relative">
					<NuxtLink
						:to="{
							name: 'products-slug',
							params: { slug: item?.product_detail?.slug },
						}"
						target="_blank"
						class="block"
					>
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
					</NuxtLink>
					<span
						class="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center"
					>
						{{ item.total_item }}
					</span>
				</div>

				<!-- Info -->
				<div class="flex-1 min-w-0">
					<NuxtLink
						:to="{
							name: 'products-slug',
							params: { slug: item?.product_detail?.slug },
						}"
						target="_blank"
						class="text-xs font-bold text-gray-700 leading-snug line-clamp-2 hover:text-primary transition-colors"
					>
						{{ item?.product_detail?.name }}
					</NuxtLink>
					<div class="flex flex-wrap gap-1 mt-1">
						<span
							v-if="cartItemVariantResolver(item)"
							class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/10"
						>
							{{ cartItemVariantResolver(item) }}
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
						}}{{ cartItemSinglePriceResolver(item)?.toLocaleString() }}
					</p>
				</div>
			</div>
		</div>

		<!-- Totals -->
		<div
			class="px-5 py-4 border-t border-gray-100 flex flex-col gap-2 bg-gray-50/40"
		>
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-500 font-medium">Products</span>
				<span class="font-bold text-gray-700"
					>{{ currency }}{{ calculateCartTotal.toLocaleString() }}</span
				>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-500 font-medium">Shipping</span>
				<span
					class="font-bold"
					:class="
						(props.data?.shipping_price?.price ?? 0) > 0
							? 'text-gray-700'
							: 'text-green-600'
					"
				>
					{{
						(props.data?.shipping_price?.price ?? 0) > 0
							? currency + props.data.shipping_price.price.toLocaleString()
							: "Free"
					}}
				</span>
			</div>

			<div
				v-if="props.data?.coupon"
				class="flex items-center justify-between text-sm"
			>
				<span class="text-gray-500 font-medium flex items-center gap-1">
					<Icon
						name="mdi:tag-outline"
						size="13"
						class="text-green-500"
					/>Discount
				</span>
				<span class="font-bold text-green-600"
					>− {{ props.data.coupon.discount_amount.toLocaleString()
					}}{{ currency }}</span
				>
			</div>
			<div class="h-px bg-gray-200" />
			<div class="flex items-center justify-between">
				<span class="text-sm font-bold text-gray-700">Grand Total</span>
				<span class="text-lg font-black text-gray-900"
					>{{ getGrandTotal.toLocaleString() }}{{ currency }}</span
				>
			</div>
		</div>
	</div>

	<!-- Empty -->
	<div v-else class="flex flex-col items-center py-10 text-center px-4">
		<Icon name="mdi:cart-outline" size="28" class="text-gray-300 mb-2" />
		<p class="text-gray-400 text-sm font-medium">Your cart is empty</p>
	</div>
</template>

<script setup>
import { isObjectEmpty, convertObjToString } from "@/utils/utils";

const config = useRuntimeConfig();

const props = defineProps({ data: null });

const HOST = config.public.HOST;
const currency = config.public.currency;

const cartItemVariantResolver = (item) => {
	if (props?.data?.status?.type == 1) return item?.variant_detail?.name;
	return item?.variant_data?.name;
};

const cartItemSinglePriceResolver = (item) => {
	if (props?.data?.status?.type == 1) return item?.variant_detail?.price;
	return item?.variant_data?.price;
};

const calculateCartTotal = computed(() => {
	return (props?.data?.carts ?? []).reduce(
		(sum, item) => sum + (item?.price ?? 0),
		0,
	);
});

const getGrandTotal = computed(() => {
	let total =
		calculateCartTotal.value + (props?.data?.shipping_price?.price ?? 0);
	if (props?.data?.coupon) total -= props.data.coupon.discount_amount ?? 0;
	if (props?.data?.coin) total -= props.data.coin.amount ?? 0;
	return total;
});
</script>

<style scoped>
.bg-primary\/8 {
	background-color: rgb(21 101 192 / 0.08);
}
</style>
