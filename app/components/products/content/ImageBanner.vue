<template>
	<div
		v-if="data?.image"
		class="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 cursor-zoom-in"
		@click="lightboxOpen = true"
	>
		<!-- Image -->
		<img
			:src="HOST + data.image.original.src"
			:alt="data.image.original.alt"
			class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
		/>

		<!-- Hover overlay -->
		<div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
			<div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
				<Icon name="mdi:magnify-plus-outline" size="16" class="text-gray-700" />
				<span class="text-xs font-semibold text-gray-700">Click to enlarge</span>
			</div>
		</div>
	</div>

	<!-- Lightbox -->
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="lightboxOpen"
				class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
				@click.self="lightboxOpen = false"
			>
				<div class="relative max-w-5xl w-full">
					<img
						:src="HOST + data.image.original.src"
						:alt="data.image.original.alt"
						class="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
					/>
					<button
						class="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
						@click="lightboxOpen = false"
					>
						<Icon name="mdi:close" size="18" class="text-gray-700" />
					</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
const config = useRuntimeConfig();
const HOST = config.public.HOST;
defineProps({ data: { type: Object, default: null } });

const lightboxOpen = ref(false);

onMounted(() => {
	const handler = (e) => { if (e.key === "Escape") lightboxOpen.value = false; };
	window.addEventListener("keydown", handler);
	onUnmounted(() => window.removeEventListener("keydown", handler));
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
