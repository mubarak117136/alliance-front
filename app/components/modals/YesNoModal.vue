<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close(false)" />
		</Transition>
		<Transition name="modal-pop">
			<div class="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
				<div class="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto">
					<!-- Header -->
					<div class="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
						<div class="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
							<Icon name="mdi:alert-outline" size="15" class="text-orange-400" />
						</div>
						<span class="text-sm font-semibold text-gray-800">Are you sure?</span>
					</div>

					<!-- Body -->
					<div class="px-5 py-4">
						<p class="text-sm text-gray-500">This action is not reversible.</p>
					</div>

					<!-- Footer -->
					<div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
						<button
							type="button"
							class="h-9 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 transition-all"
							@click="close(false)"
						>
							No, cancel
						</button>
						<button
							type="button"
							class="h-9 px-4 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all"
							@click="close(true)"
						>
							Yes, confirm
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
defineProps({ isOpenModal: false });
const emit = defineEmits();
const close = (status) => emit("close", status);
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.2s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }
.modal-pop-enter-active, .modal-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
