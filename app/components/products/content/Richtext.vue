<template>
	<div class="richtext" v-html="data?.richtext" />
</template>

<script setup>
defineProps({ data: { type: Object, default: null } });
</script>

<style scoped>
.richtext {
	color: #4b5563;
	font-size: 0.9375rem;
	line-height: 1.85;
}

.richtext :deep(p) {
	margin-bottom: 1rem;
}

.richtext :deep(h2) {
	color: #1565c0;
	font-size: 1.15rem;
	font-weight: 800;
	margin-top: 2rem;
	margin-bottom: 0.6rem;
	padding-left: 0.875rem;
	border-left: 3px solid #f97316;
	letter-spacing: -0.01em;
}
.richtext :deep(h3) {
	color: #1f2937;
	font-size: 1rem;
	font-weight: 700;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	padding-left: 0.75rem;
	border-left: 2px solid #1565c0;
}
.richtext :deep(h4),
.richtext :deep(h5),
.richtext :deep(h6) {
	color: #374151;
	font-size: 0.9375rem;
	font-weight: 600;
	margin-top: 1.25rem;
	margin-bottom: 0.4rem;
}

.richtext :deep(strong),
.richtext :deep(b) {
	font-weight: 700;
	color: #111827;
}

.richtext :deep(em) {
	color: #6b7280;
}

.richtext :deep(a) {
	color: #1565c0;
	font-weight: 500;
	text-decoration: underline;
	text-underline-offset: 3px;
	transition: color 0.15s;
}
.richtext :deep(a:hover) {
	color: #f97316;
}

.richtext :deep(ul) {
	list-style: none;
	margin-left: 0;
	margin-bottom: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0;
}
.richtext :deep(ul li) {
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	padding-left: 0.25rem;
}
.richtext :deep(ul li::before) {
	content: "";
	display: inline-block;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #1565c0;
	margin-top: 0.55em;
	flex-shrink: 0;
}

.richtext :deep(ol) {
	list-style: decimal;
	margin-left: 1.5rem;
	margin-bottom: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0;
}
.richtext :deep(ol li) {
	padding-left: 0.25rem;
}

.richtext :deep(blockquote) {
	border-left: 3px solid #e5e7eb;
	padding: 0.5rem 1rem;
	margin: 1rem 0;
	background: #f9fafb;
	border-radius: 0 0.5rem 0.5rem 0;
	color: #6b7280;
	font-style: italic;
}

.richtext :deep(table) {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;
	margin-bottom: 1rem;
}
.richtext :deep(th) {
	background: #f3f4f6;
	color: #374151;
	font-weight: 700;
	padding: 0.6rem 0.875rem;
	border: 1px solid #e5e7eb;
	text-align: left;
}
.richtext :deep(td) {
	padding: 0.55rem 0.875rem;
	border: 1px solid #e5e7eb;
	color: #4b5563;
}
.richtext :deep(tr:hover td) {
	background: #f9fafb;
}

.richtext :deep(img) {
	max-width: 100%;
	border-radius: 0.75rem;
	margin: 0.75rem 0;
}

.richtext :deep(hr) {
	border: none;
	border-top: 1px solid #e5e7eb;
	margin: 1.5rem 0;
}
</style>
