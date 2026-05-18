<template>
	<div>
		<div class="flex items-center gap-3 mb-6">
			<h2 class="text-lg font-extrabold text-gray-900 tracking-tight">Related Products</h2>
			<div class="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
		</div>

		<!-- Skeleton -->
		<div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
			<div v-for="n in 5" :key="n" class="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
		</div>

		<div
			v-else-if="products.length"
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
		>
			<SingleProduct
				v-for="product in products"
				:key="product.slug"
				:product="product"
			/>
		</div>

		<div v-else class="flex flex-col items-center justify-center py-12 text-center">
			<Icon name="mdi:package-variant" size="32" class="text-gray-300 mb-2" />
			<p class="text-gray-400 text-sm">No related products found</p>
		</div>
	</div>
</template>

<script setup>
import { useProductStore } from "@/stores/product";

const productStore = useProductStore();
const route = useRoute();

const products = ref([]);
const loading = ref(false);

onMounted(() => {
	loading.value = true;
	productStore
		.fetchRelatedProducts({ product: route?.params?.slug })
		.then((d) => {
			products.value = d;
			loading.value = false;
		})
		.catch((e) => {
			console.log(e);
			loading.value = false;
		});
});
</script>
