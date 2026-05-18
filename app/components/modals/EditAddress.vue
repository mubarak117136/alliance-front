<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close(false)" />
		</Transition>
		<Transition name="modal-pop">
			<div class="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
				<div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto">
					<!-- Header -->
					<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
						<div class="flex items-center gap-2.5">
							<div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
								<Icon name="mdi:map-marker-outline" size="14" class="text-gray-500" />
							</div>
							<span class="text-sm font-semibold text-gray-800">Edit Address</span>
						</div>
						<button
							type="button"
							class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
							@click="close(false)"
						>
							<Icon name="mdi:close" size="15" />
						</button>
					</div>

					<!-- Form -->
					<form class="px-5 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto overflow-x-hidden" @submit.prevent="handleFormSubmit">
						<!-- Full name + City -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">Full Name <span class="text-red-400">*</span></label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.full_name.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<Icon name="mdi:account-outline" size="14" class="text-gray-400 shrink-0" />
									<input
										v-model="formData.full_name.value.value"
										type="text"
										placeholder="Full name"
										class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
									/>
								</div>
								<p v-if="formData.full_name.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.full_name.errorMessage.value }}
								</p>
							</div>

							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">City <span class="text-red-400">*</span></label>
								<div class="relative" v-click-outside="() => cityOpen = false">
									<div
										class="flex items-center h-10 rounded-xl border bg-gray-50 transition-all px-3 gap-2 cursor-pointer"
										:class="formData.city_input.errorMessage.value ? 'border-red-300' : cityOpen ? 'border-primary bg-white' : 'border-gray-200'"
										@click="cityOpen = !cityOpen"
									>
										<Icon name="mdi:map-outline" size="14" class="text-gray-400 shrink-0" />
										<input
											v-model="citySearch"
											type="text"
											placeholder="Select city"
											class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
											@input="cityOpen = true"
											@click.stop="cityOpen = true"
										/>
										<Icon name="mdi:chevron-down" size="13" class="text-gray-400 shrink-0 transition-transform duration-200" :class="cityOpen ? 'rotate-180' : ''" />
									</div>
									<Transition name="dropdown">
										<div v-if="cityOpen && filteredCities.length > 0" class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto">
											<button
												v-for="city in filteredCities"
												:key="city.name"
												type="button"
												class="w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between"
												:class="formData.city_input.value.value === city.name ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'"
												@click="selectCity(city.name)"
											>
												{{ city.name }}
												<Icon v-if="formData.city_input.value.value === city.name" name="mdi:check" size="12" class="text-primary" />
											</button>
										</div>
									</Transition>
								</div>
								<p v-if="formData.city_input.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.city_input.errorMessage.value }}
								</p>
							</div>
						</div>

						<!-- Address -->
						<div class="flex flex-col gap-1.5">
							<label class="text-xs font-medium text-gray-500">Address <span class="text-red-400">*</span></label>
							<div
								class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
								:class="formData.address.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
							>
								<Icon name="mdi:home-outline" size="14" class="text-gray-400 shrink-0" />
								<input
									v-model="formData.address.value.value"
									type="text"
									placeholder="Street address"
									class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
								/>
							</div>
							<p v-if="formData.address.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
								<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.address.errorMessage.value }}
							</p>
						</div>

						<!-- Email + Phone -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">Email</label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.email.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<Icon name="mdi:email-outline" size="14" class="text-gray-400 shrink-0" />
									<input
										v-model="formData.email.value.value"
										type="email"
										placeholder="Email address"
										class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
									/>
								</div>
								<p v-if="formData.email.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.email.errorMessage.value }}
								</p>
							</div>

							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">Phone <span class="text-red-400">*</span></label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.phone.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<Icon name="mdi:phone-outline" size="14" class="text-gray-400 shrink-0" />
									<input
										v-model="formData.phone.value.value"
										type="tel"
										placeholder="Phone number"
										class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
									/>
								</div>
								<p v-if="formData.phone.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.phone.errorMessage.value }}
								</p>
							</div>
						</div>

						<!-- Default toggle -->
						<label class="flex items-center gap-3 cursor-pointer select-none py-1">
							<div
								class="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
								:class="formData.is_default.value.value ? 'bg-primary' : 'bg-gray-200'"
								@click="formData.is_default.value.value = !formData.is_default.value.value"
							>
								<span
									class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
									:class="formData.is_default.value.value ? 'translate-x-4' : 'translate-x-0'"
								/>
							</div>
							<span class="text-xs font-medium text-gray-600">Set as default address</span>
						</label>

						<!-- Error -->
						<div v-if="error_msg" class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
							<Icon name="mdi:alert-circle-outline" size="13" class="shrink-0" />{{ error_msg }}
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 mt-1">
							<!-- Remove on the left -->
							<button
								type="button"
								:disabled="loading"
								class="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-xs font-medium text-red-400 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-60"
								@click.prevent="handleRemoveAddress"
							>
								<Icon name="mdi:trash-can-outline" size="13" />
								Remove
							</button>
							<!-- Cancel + Save on the right -->
							<div class="flex items-center gap-2">
								<button
									type="button"
									class="h-9 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 transition-all"
									@click="close(false)"
								>
									Cancel
								</button>
								<button
									type="submit"
									:disabled="loading"
									class="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
								>
									<Icon v-if="loading" name="mdi:loading" size="13" class="animate-spin" />
									<Icon v-else name="mdi:content-save-outline" size="13" />
									Save
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useUtilityStore } from "@/stores/utility";
import { useUserStore } from "@/stores/user";

const { isOpenModal, data } = defineProps({ isOpenModal: false, data: null });
const emit = defineEmits();

const toast = useToast();
const utilityStore = useUtilityStore();
const userStore = useUserStore();
const { getCities } = storeToRefs(utilityStore);

const loading = ref(false);
const error_msg = ref("");
const cityOpen = ref(false);
const citySearch = ref("");

const filteredCities = computed(() => {
	if (!citySearch.value) return getCities.value ?? [];
	return (getCities.value ?? []).filter(c => c.name.toLowerCase().includes(citySearch.value.toLowerCase()));
});

const selectCity = (name) => {
	formData.city_input.value.value = name;
	citySearch.value = name;
	cityOpen.value = false;
};

const validationSchema = yup.object().shape({
	full_name: yup.string().required(),
	city_input: yup.string().required(),
	address: yup.string().required(),
	email: yup.string().email().nullable(),
	phone: yup.string().required(),
	is_default: yup.boolean(),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	full_name: useField("full_name", validationSchema),
	city_input: useField("city_input", validationSchema),
	address: useField("address", validationSchema),
	email: useField("email", validationSchema),
	phone: useField("phone", validationSchema),
	is_default: useField("is_default", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	userStore
		.updateAddress({ data: values, id: data?.id })
		.then(() => {
			loading.value = false;
			toast.success("Address updated!");
			close(true);
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
});

const handleRemoveAddress = () => {
	loading.value = true;
	userStore
		.deleteAddress(data?.id)
		.then(() => {
			loading.value = false;
			toast.success("Address removed!");
			close(true);
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
};

const close = (refresh = false) => emit("close", refresh);

onMounted(() => {
	loading.value = true;
	utilityStore.fetchShippingCities()
		.then(() => { loading.value = false; })
		.catch(() => { loading.value = false; });

	if (data) {
		formData.full_name.value.value = data?.full_name;
		formData.city_input.value.value = data?.city_detail?.name;
		citySearch.value = data?.city_detail?.name ?? "";
		formData.address.value.value = data?.address;
		formData.email.value.value = data?.email;
		formData.phone.value.value = data?.phone;
		formData.is_default.value.value = data?.is_default;
	}
});
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.2s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }
.modal-pop-enter-active, .modal-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
