<template>
	<section class="w-full max-w-[1280px] mx-auto px-2 sm:px-4 lg:px-6 mt-10">
		<div
			class="relative rounded-2xl overflow-hidden border border-primary/10 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60"
		>
			<!-- Top accent line -->
			<div
				class="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-accent"
			/>

			<div class="px-5 py-8 sm:px-10 sm:py-10">
				<!-- Header -->
				<div class="flex items-start gap-4 mb-6">
					<div>
						<h1
							class="text-gray-800 text-sm sm:text-lg font-extrabold leading-snug tracking-tight"
						>
							{{ block.value.title }}
						</h1>
					</div>
				</div>

				<div
					class="h-px bg-gradient-to-r from-primary/20 via-gray-200 to-transparent mb-6"
				/>

				<!-- Content -->
				<div class="seo-content" v-html="block.value.desc" />
			</div>
		</div>
	</section>
</template>

<script setup>
defineProps({
	block: {
		type: Object,
		required: true,
	},
});
</script>

<style>
.seo-content p {
	color: #6b7280;
	font-size: 0.875rem;
	line-height: 1.8;
	margin-bottom: 0.75rem;
}

.seo-content h2 {
	color: #1565c0;
	font-size: 0.9375rem;
	font-weight: 700;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	padding-left: 0.75rem;
	border-left: 3px solid #f97316;
}

.seo-content h3 {
	color: #1f2937;
	font-size: 0.875rem;
	font-weight: 700;
	margin-top: 1.25rem;
	margin-bottom: 0.4rem;
	padding-left: 0.5rem;
	border-left: 2px solid #1565c0;
}

.seo-content h4,
.seo-content h5 {
	color: #374151;
	font-size: 0.875rem;
	font-weight: 600;
	margin-top: 1rem;
	margin-bottom: 0.4rem;
}

.seo-content b,
.seo-content strong {
	font-weight: 600;
	color: #374151;
}

.seo-content a {
	color: #1565c0;
	text-decoration: underline;
	text-underline-offset: 2px;
	font-weight: 500;
}

.seo-content a:hover {
	color: #f97316;
}

.seo-content ul,
.seo-content ol {
	margin-left: 1.25rem;
	margin-bottom: 0.75rem;
	color: #6b7280;
	font-size: 0.875rem;
	line-height: 1.8;
}
</style>
