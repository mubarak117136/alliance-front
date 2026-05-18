<template>
	<v-sheet rounded class="pa-4 elevation-0 bg-surface-light">
		<div class="d-flex ga-2 align-center cursor-pointer" @click="handleBack">
			Categories
		</div>
		<v-divider class="mt-2"></v-divider>
		<v-list density="compact" class="bg-surface-light">
			<v-list-item
				v-for="(item, idx) in data"
				:key="'categories_' + idx"
				color="primary"
				@click="handleCategoryClick(item)"
				class=""
				:active="route?.query?.category == item?.category__slug"
			>
				<template v-slot:append>
					<v-icon icon="mdi-chevron-right" size="small"></v-icon>
				</template>

				<v-list-item-title class="text-body-2">{{
					item.category__name
				}}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-sheet>
</template>

<script setup>
import { useRoute } from "#vue-router";

const route = useRoute();
const router = useRouter();

const { data } = defineProps({
	data: null,
});

const handleCategoryClick = (item) => {
	router.push({ query: { category: item?.category__slug } });
};
</script>

<style scoped lang="scss"></style>
