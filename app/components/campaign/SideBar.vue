<template>
	<div class="flex flex-col gap-5">
		<div v-if="data?.all_categories?.length" class="bg-white border border-gray-100 rounded-2xl p-4">
			<CampaignFiltersCategory :data="data?.all_categories" />
		</div>
		<div v-if="data?.all_brands?.length" class="bg-white border border-gray-100 rounded-2xl p-4">
			<CampaignFiltersBrand :data="data?.all_brands" />
		</div>
	</div>
</template>

<script setup>
const { data } = defineProps({ data: null });
</script>
