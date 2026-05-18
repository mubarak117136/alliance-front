<template>
	<div class="product-table" v-html="data?.table" />
</template>

<script setup>
defineProps({ data: { type: Object, default: null } });
</script>

<style scoped>
.product-table :deep(table) { border-collapse: collapse; width: 100%; font-size: 0.875rem; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #e5e7eb; }
.product-table :deep(th) { background: #eff6ff; font-weight: 700; color: #1565c0; text-align: left; padding: 0.625em 0.875em; border-bottom: 2px solid #bfdbfe; }
.product-table :deep(td) { padding: 0.5em 0.875em; border-bottom: 1px solid #f3f4f6; color: #6b7280; }
.product-table :deep(tr:last-child td) { border-bottom: none; }
.product-table :deep(tr:hover td) { background: #f9fafb; }
</style>
