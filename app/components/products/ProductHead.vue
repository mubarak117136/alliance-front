<template>
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-6 lg:gap-10">
		<ProductsProductImageBlock :images="data?.images" />
		<ProductsProductInformationBlock :data="data" />
	</div>
</template>

<script setup>
defineProps({ data: { type: Object, default: null } });
</script>
