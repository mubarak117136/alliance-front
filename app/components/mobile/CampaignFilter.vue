<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close" />
		</Transition>
		<Transition name="slide-left">
			<div class="fixed top-0 left-0 h-full w-72 max-w-[80vw] z-[9999] bg-white shadow-2xl flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
					<div class="flex items-center gap-2">
						<div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
							<Icon name="mdi:filter-variant" size="14" class="text-gray-500" />
						</div>
						<span class="text-sm font-semibold text-gray-800">Filters</span>
					</div>
					<button
						type="button"
						class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
						@click="close"
					>
						<Icon name="mdi:close" size="15" />
					</button>
				</div>

				<!-- Filters -->
				<div class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
					<div v-if="data?.all_categories?.length" class="bg-gray-50 rounded-xl p-3">
						<CampaignFiltersCategory :data="data?.all_categories" />
					</div>
					<div v-if="data?.all_brands?.length" class="bg-gray-50 rounded-xl p-3">
						<CampaignFiltersBrand :data="data?.all_brands" />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { useRoute } from "#vue-router";

const route = useRoute();
const emit = defineEmits();
const { data } = defineProps({ data: null });

const close = () => emit("close");

watch(() => route.fullPath, () => close());
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.25s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.25s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
