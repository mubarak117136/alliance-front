<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
			<div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
				<Icon name="mdi:receipt-text-outline" size="16" class="text-primary" />
			</div>
			<span class="text-sm font-black text-gray-800">Order Summary</span>
		</div>

		<!-- Loading skeleton -->
		<div v-if="!data" class="flex flex-col gap-2 p-4">
			<div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-gray-100 animate-pulse" />
		</div>

		<CheckoutPaymentMyCartItemsPayment v-else :data="data" />
	</div>
</template>

<script setup>
const { data } = defineProps({ data: null });
</script>
