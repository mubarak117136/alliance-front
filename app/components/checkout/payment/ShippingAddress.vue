<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
			<div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
				<Icon name="mdi:map-marker-outline" size="14" class="text-primary" />
			</div>
			<span class="text-sm font-black text-gray-800">Delivery Address</span>
		</div>

		<div class="px-5 py-4 flex gap-3">
			<div class="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
				<Icon name="mdi:map-marker-check-outline" size="15" class="text-primary" />
			</div>
			<div class="flex flex-col gap-1 min-w-0">
				<p class="text-sm font-bold text-gray-800">{{ data?.full_name }}</p>
				<p class="text-xs text-gray-500 flex items-center gap-1">
					<Icon name="mdi:phone-outline" size="11" />{{ data?.phone }}
				</p>
				<p class="text-xs text-gray-500 truncate">{{ data?.address }}</p>
				<p class="text-xs text-gray-400">{{ data?.city_detail?.name }}, Bangladesh</p>
			</div>
		</div>
	</div>
</template>

<script setup>
const { data } = defineProps({ data: null });
</script>

<style scoped>
.bg-primary\/8 { background-color: rgb(21 101 192 / 0.08); }
</style>
