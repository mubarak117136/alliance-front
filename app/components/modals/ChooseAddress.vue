<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div
				class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
				@click.self="close(null)"
			>
				<Transition name="modal-slide">
					<div class="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[85vh]">
						<!-- Header -->
						<div class="relative flex items-center justify-between px-5 py-4 shrink-0">
							<div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
									<Icon name="mdi:map-marker-multiple-outline" size="18" class="text-primary" />
								</div>
								<div>
									<h2 class="text-[15px] font-black text-gray-900 leading-tight">Saved Addresses</h2>
									<p class="text-[11px] text-gray-400 font-medium">Select a delivery address</p>
								</div>
							</div>
							<button
								class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
								@click="close(null)"
							>
								<Icon name="mdi:close" size="16" />
							</button>
						</div>

						<div class="h-px bg-gray-100 mx-5 shrink-0" />

						<!-- Address list -->
						<div class="flex-1 overflow-y-auto px-4 py-3">
							<!-- Loading -->
							<div v-if="loading" class="flex flex-col gap-2">
								<div v-for="i in 3" :key="i" class="h-24 rounded-2xl bg-gray-100 animate-pulse" />
							</div>

							<!-- Items -->
							<div v-else-if="items.length > 0" class="flex flex-col gap-2">
								<button
									v-for="(item, idx) in items"
									:key="'addr_' + idx"
									type="button"
									class="w-full text-left flex gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 active:scale-[0.99]"
									:class="item?.is_default
										? 'border-primary bg-primary/5'
										: 'border-gray-100 bg-gray-50'"
									@click="handleSelectAddress(item)"
								>
									<!-- Icon -->
									<div
										class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
										:class="item?.is_default ? 'bg-primary/15' : 'bg-gray-200'"
									>
										<Icon
											:name="item?.is_default ? 'mdi:map-marker-check' : 'mdi:map-marker-outline'"
											size="18"
											:class="item?.is_default ? 'text-primary' : 'text-gray-400'"
										/>
									</div>

									<!-- Details -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-0.5">
											<p class="text-sm font-bold text-gray-800 truncate">{{ item?.full_name }}</p>
											<span
												v-if="item?.is_default"
												class="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-primary text-white"
											>
												Default
											</span>
										</div>
										<p class="text-xs text-gray-500 flex items-center gap-1">
											<Icon name="mdi:phone-outline" size="11" />
											{{ item?.phone }}
										</p>
										<p v-if="item?.email" class="text-xs text-gray-500 flex items-center gap-1">
											<Icon name="mdi:email-outline" size="11" />
											{{ item?.email }}
										</p>
										<p class="text-xs text-gray-500 truncate mt-0.5">{{ item?.address }}</p>
										<p class="text-xs text-gray-400">{{ item?.city }}, {{ item?.state_detail?.name }}, {{ item?.country_detail?.name }}</p>
									</div>

									<!-- Select indicator -->
									<div class="shrink-0 flex items-center">
										<Icon
											name="mdi:chevron-right"
											size="18"
											:class="item?.is_default ? 'text-primary' : 'text-gray-300'"
										/>
									</div>
								</button>
							</div>

							<!-- Empty -->
							<div v-else class="flex flex-col items-center justify-center py-12 text-center">
								<div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
									<Icon name="mdi:map-marker-off-outline" size="24" class="text-gray-300" />
								</div>
								<p class="text-gray-700 font-bold text-sm mb-1">No saved addresses</p>
								<p class="text-gray-400 text-xs">Add an address from your account profile</p>
							</div>
						</div>

						<!-- Pagination -->
						<div v-if="totalPage > 1" class="shrink-0 px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-1.5">
							<button
								:disabled="currentPage === 1"
								class="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
								@click="currentPage--"
							>
								<Icon name="mdi:chevron-left" size="16" />
							</button>
							<button
								v-for="p in totalPage"
								:key="p"
								class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border transition-all"
								:class="p === currentPage
									? 'bg-primary text-white border-primary'
									: 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'"
								@click="currentPage = p"
							>
								{{ p }}
							</button>
							<button
								:disabled="currentPage === totalPage"
								class="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
								@click="currentPage++"
							>
								<Icon name="mdi:chevron-right" size="16" />
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { calculateTotalPage } from "@/utils/utils";

const props = defineProps({ isOpenModal: { type: Boolean, default: false } });
const emit = defineEmits(["close"]);

const userStore = useUserStore();

const loading = ref(false);
const items = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const limit = 12;

const close = (data = null) => emit("close", data);

const handleFetchAddresses = () => {
	loading.value = true;
	userStore
		.fetchAddresses({ limit, offset: (currentPage.value - 1) * limit })
		.then((d) => {
			loading.value = false;
			items.value = d.results;
			totalPage.value = calculateTotalPage(d.count, limit);
		})
		.catch(() => { loading.value = false; });
};

const handleSelectAddress = (item) => close(item);

onMounted(handleFetchAddresses);
watch(currentPage, handleFetchAddresses);
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-slide-enter-active, .modal-slide-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-slide-enter-from, .modal-slide-leave-to { transform: translateY(20px); }
</style>
