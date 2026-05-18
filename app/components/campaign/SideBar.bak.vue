<template>
	<v-row class="ma-0 pa-0">
		<v-col cols="12" class="d-flex flex-column ga-4">
			<CampaignFiltersCategory :data="data?.all_categories" />
			<CampaignFiltersBrand :data="data?.all_brands" />
		</v-col>
	</v-row>
</template>

<script setup>
import { useRoute } from "#vue-router";

const route = useRoute();

const { data } = defineProps({
	data: null,
});

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
