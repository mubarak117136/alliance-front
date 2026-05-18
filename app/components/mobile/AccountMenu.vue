<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close" />
		</Transition>
		<Transition name="drawer-slide">
			<div class="fixed top-0 left-0 z-[9999] h-full w-[75vw] max-w-[320px] bg-gray-50 flex flex-col shadow-2xl">
				<!-- Header -->
				<div class="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
					<div class="flex items-center gap-2">
						<Icon name="mdi:account-circle-outline" size="18" class="text-primary" />
						<span class="text-sm font-black text-gray-800">My Account</span>
					</div>
					<button class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all" @click="close">
						<Icon name="mdi:close" size="16" />
					</button>
				</div>

				<!-- Sidebar content -->
				<div class="flex-1 overflow-y-auto p-4">
					<AccountSideBar />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
const route = useRoute();
const emit = defineEmits(["close"]);

const close = () => emit("close");

watch(() => route.path, () => close());
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.25s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(-100%); }
</style>
