<template>
	<v-sheet rounded class="pa-4 elevation-0 bg-surface-light">
		<div class="d-flex ga-2 align-center cursor-pointer">Brands</div>
		<v-divider class="mt-2 mb-2"></v-divider>
		<v-radio-group
			v-model="selectedBrand"
			@update:modelValue="handleBrandChange"
		>
			<v-radio label="All" value=""></v-radio>
			<v-radio
				v-for="(item, idx) in data"
				:key="'brands_' + idx"
				:label="item?.brand__name"
				:value="item?.brand__slug"
			></v-radio>
		</v-radio-group>
	</v-sheet>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";
import { useRoute } from "#vue-router";

const route = useRoute();
const router = useRouter();

const { data } = defineProps({
	data: null,
});

const loading = ref(false);
const selectedBrand = ref("");

const handleBrandChange = () => {
	const query = deepCopy(route.query);
	if (selectedBrand.value == "") {
		delete query["brand"];
	} else {
		query["brand"] = selectedBrand.value;
	}
	query["offset"] = 0;
	router.push({ query: query });
};

onMounted(() => {
	if (route?.query?.brand) {
		selectedBrand.value = route?.query?.brand;
	}
});
</script>

<style scoped lang="scss"></style>
