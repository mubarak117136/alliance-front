<template>
	<Transition name="fade">
		<div
			v-if="open"
			class="fixed inset-0 bg-black/50 z-50 lg:hidden"
			@click="emit('close')"
		/>
	</Transition>

	<Transition name="slide-up">
		<div
			v-if="open"
			class="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col"
		>
			<!-- Header -->
			<div class="flex items-center justify-end px-5 py-3 border-b border-gray-100 shrink-0">
				<button @click="emit('close')">
					<Icon name="mdi:close" size="20" class="text-gray-500" />
				</button>
			</div>

			<!-- Sidebar filters -->
			<div class="overflow-y-auto flex-1">
				<StoresSideBar />
			</div>

			<!-- Footer CTA -->
			<div class="px-5 py-4 border-t border-gray-100 shrink-0">
				<button
					class="w-full bg-primary text-white font-semibold text-sm py-3 rounded-xl"
					@click="emit('close')"
				>
					Show {{ filteredCount }} products
				</button>
			</div>
		</div>
	</Transition>
</template>

<script setup>
const props = defineProps({
	open: { type: Boolean, default: false },
	filteredCount: { type: Number, default: 0 },
});

const emit = defineEmits(["close"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateY(100%);
}
</style>
