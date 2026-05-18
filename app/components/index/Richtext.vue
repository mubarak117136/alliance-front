<template>
	<div class="richtext" v-html="data?.desc" />
</template>

<script setup>
defineProps({
	data: { type: Object, default: null },
});
</script>

<style scoped>
.richtext {
	color: #6b7280;
	font-size: 0.9375rem;
	line-height: 1.8;
}

/* ── Paragraphs ── */
.richtext :deep(p) {
	margin-bottom: 0.75rem;
	text-align: justify;
}

/* ── Headings ── */
.richtext :deep(h1) {
	color: #111827;
	font-size: 1.75rem;
	font-weight: 800;
	letter-spacing: -0.02em;
	margin-top: 2rem;
	margin-bottom: 0.75rem;
	line-height: 1.25;
	padding-left: 1rem;
	border-left: 4px solid #f97316;
}

.richtext :deep(h2) {
	color: #1565c0;
	font-size: 1.125rem;
	font-weight: 700;
	margin-top: 1.75rem;
	margin-bottom: 0.5rem;
	padding-left: 0.75rem;
	border-left: 3px solid #f97316;
	line-height: 1.35;
}

.richtext :deep(h3) {
	color: #1f2937;
	font-size: 1rem;
	font-weight: 700;
	margin-top: 1.5rem;
	margin-bottom: 0.4rem;
	padding-left: 0.625rem;
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

/* ── Bold / Italic ── */
.richtext :deep(strong),
.richtext :deep(b) {
	font-weight: 600;
	color: #374151;
}
.richtext :deep(em),
.richtext :deep(i) {
	font-style: italic;
}

/* ── Links ── */
.richtext :deep(a) {
	color: #1565c0;
	text-decoration: underline;
	text-underline-offset: 2px;
	font-weight: 500;
	transition: color 0.15s;
}
.richtext :deep(a:hover) {
	color: #f97316;
}

/* ── Lists ── */
.richtext :deep(ul),
.richtext :deep(ol) {
	margin-left: 1.25rem;
	margin-bottom: 0.75rem;
	color: #6b7280;
	font-size: 0.875rem;
	line-height: 1.8;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}
.richtext :deep(ul) {
	list-style-type: disc;
}
.richtext :deep(ol) {
	list-style-type: decimal;
}
.richtext :deep(li > ul),
.richtext :deep(li > ol) {
	margin-top: 0.25rem;
	margin-bottom: 0;
}

/* ── Blockquote ── */
.richtext :deep(blockquote) {
	border-left: 4px solid #1565c0;
	background: #eff6ff;
	color: #1e40af;
	padding: 0.875em 1.25em;
	border-radius: 0 12px 12px 0;
	margin: 1.25em 0;
	font-style: italic;
	font-size: 0.9375rem;
}

/* ── Horizontal rule ── */
.richtext :deep(hr) {
	border: none;
	height: 1px;
	background: linear-gradient(to right, #1565c020, #e5e7eb, transparent);
	margin: 2em 0;
}

/* ── Images ── */
.richtext :deep(img) {
	max-width: 100%;
	height: auto;
	border-radius: 12px;
	margin: 1em 0;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ── Tables ── */
.richtext :deep(table) {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;
	margin: 1.25em 0;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 0 0 1px #e5e7eb;
}
.richtext :deep(th) {
	background: #eff6ff;
	font-weight: 700;
	color: #1565c0;
	text-align: left;
	padding: 0.625em 0.875em;
	border-bottom: 2px solid #bfdbfe;
}
.richtext :deep(td) {
	padding: 0.5em 0.875em;
	border-bottom: 1px solid #f3f4f6;
	color: #6b7280;
}
.richtext :deep(tr:last-child td) {
	border-bottom: none;
}
.richtext :deep(tr:hover td) {
	background: #f9fafb;
}

/* ── Code ── */
.richtext :deep(code) {
	background: #f3f4f6;
	color: #1565c0;
	font-size: 0.85em;
	padding: 0.15em 0.45em;
	border-radius: 6px;
	font-family: ui-monospace, monospace;
}
.richtext :deep(pre) {
	background: #1e293b;
	color: #e2e8f0;
	padding: 1em 1.25em;
	border-radius: 12px;
	overflow-x: auto;
	font-size: 0.875rem;
	margin: 1.25em 0;
}
.richtext :deep(pre code) {
	background: transparent;
	color: inherit;
	padding: 0;
}
</style>
