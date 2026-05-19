<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close(false)" />
		</Transition>
		<Transition name="modal-pop">
			<div class="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
				<div class="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto">
					<!-- Header -->
					<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
						<div class="flex items-center gap-2.5">
							<div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
								<Icon name="mdi:map-marker-plus-outline" size="14" class="text-gray-500" />
							</div>
							<span class="text-sm font-semibold text-gray-800">Add New Address</span>
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
					<form class="px-5 py-4 flex flex-col gap-3 max-h-[75vh] overflow-y-auto overflow-x-hidden" @submit.prevent="handleFormSubmit">
						<!-- Full Name -->
						<div class="flex flex-col gap-1.5">
							<label class="text-xs font-medium text-gray-500">Full Name <span class="text-red-400">*</span></label>
							<div
								class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
								:class="formData.full_name.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
							>
								<Icon name="mdi:account-outline" size="14" class="text-gray-400 shrink-0" />
								<input v-model="formData.full_name.value.value" type="text" placeholder="Full name" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
							</div>
							<p v-if="formData.full_name.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
								<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.full_name.errorMessage.value }}
							</p>
						</div>

						<!-- Country + State -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<!-- Country -->
							<div class="flex flex-col gap-1.5" v-click-outside="() => (countryOpen = false)">
								<label class="text-xs font-medium text-gray-500">Country <span class="text-red-400">*</span></label>
								<div class="relative">
									<button
										type="button"
										class="w-full flex items-center h-10 rounded-xl border bg-gray-50 px-3 gap-2 transition-all text-left"
										:class="formData.country.errorMessage.value ? 'border-red-300' : countryOpen ? 'border-primary bg-white' : 'border-gray-200'"
										@click="countryOpen = !countryOpen"
									>
										<Icon name="mdi:earth" size="14" class="text-gray-400 shrink-0" />
										<span class="flex-1 text-sm truncate" :class="selectedCountryName ? 'text-gray-700' : 'text-gray-400'">
											{{ selectedCountryName || "Select country" }}
										</span>
										<Icon name="mdi:chevron-down" size="13" class="text-gray-400 shrink-0 transition-transform duration-200" :class="countryOpen ? 'rotate-180' : ''" />
									</button>
									<Transition name="dropdown">
										<div v-if="countryOpen" class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
											<div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
												<Icon name="mdi:magnify" size="13" class="text-gray-400 shrink-0" />
												<input v-model="countrySearch" type="text" placeholder="Search..." class="flex-1 text-sm outline-none bg-transparent" @click.stop />
											</div>
											<div class="max-h-44 overflow-y-auto">
												<button
													v-for="c in filteredCountries" :key="c.id" type="button"
													class="w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between"
													:class="formData.country.value.value === c.id ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'"
													@click="selectCountry(c)"
												>
													{{ c.name }}
													<Icon v-if="formData.country.value.value === c.id" name="mdi:check" size="12" class="text-primary" />
												</button>
												<div v-if="filteredCountries.length === 0" class="px-4 py-4 text-xs text-gray-400 text-center">No country found</div>
											</div>
										</div>
									</Transition>
								</div>
								<p v-if="formData.country.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.country.errorMessage.value }}
								</p>
							</div>

							<!-- State -->
							<div class="flex flex-col gap-1.5" v-click-outside="() => (stateOpen = false)">
								<label class="text-xs font-medium text-gray-500">State / Province <span class="text-red-400">*</span></label>
								<div class="relative">
									<button
										type="button"
										:disabled="!formData.country.value.value"
										class="w-full flex items-center h-10 rounded-xl border bg-gray-50 px-3 gap-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
										:class="formData.state.errorMessage.value ? 'border-red-300' : stateOpen ? 'border-primary bg-white' : 'border-gray-200'"
										@click="stateOpen = !stateOpen"
									>
										<Icon name="mdi:map-outline" size="14" class="text-gray-400 shrink-0" />
										<span class="flex-1 text-sm truncate" :class="selectedStateName ? 'text-gray-700' : 'text-gray-400'">
											{{ selectedStateName || (formData.country.value.value ? "Select state" : "Select country first") }}
										</span>
										<Icon v-if="loadingStates" name="mdi:loading" size="13" class="text-gray-400 animate-spin" />
										<Icon v-else name="mdi:chevron-down" size="13" class="text-gray-400 shrink-0 transition-transform duration-200" :class="stateOpen ? 'rotate-180' : ''" />
									</button>
									<Transition name="dropdown">
										<div v-if="stateOpen && states.length" class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
											<div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
												<Icon name="mdi:magnify" size="13" class="text-gray-400 shrink-0" />
												<input v-model="stateSearch" type="text" placeholder="Search..." class="flex-1 text-sm outline-none bg-transparent" @click.stop />
											</div>
											<div class="max-h-44 overflow-y-auto">
												<button
													v-for="s in filteredStates" :key="s.id" type="button"
													class="w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between"
													:class="formData.state.value.value === s.id ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'"
													@click="selectState(s)"
												>
													{{ s.name }}
													<Icon v-if="formData.state.value.value === s.id" name="mdi:check" size="12" class="text-primary" />
												</button>
												<div v-if="filteredStates.length === 0" class="px-4 py-4 text-xs text-gray-400 text-center">No state found</div>
											</div>
										</div>
									</Transition>
								</div>
								<p v-if="formData.state.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.state.errorMessage.value }}
								</p>
							</div>
						</div>

						<!-- City + Zip -->
						<div class="grid grid-cols-2 gap-3">
							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">City <span class="text-red-400">*</span></label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.city.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<Icon name="mdi:city-variant-outline" size="14" class="text-gray-400 shrink-0" />
									<input v-model="formData.city.value.value" type="text" placeholder="City" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
								</div>
								<p v-if="formData.city.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.city.errorMessage.value }}
								</p>
							</div>
							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">Zip / Postal <span class="text-red-400">*</span></label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.zip.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<input v-model="formData.zip.value.value" type="text" placeholder="00000" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
								</div>
								<p v-if="formData.zip.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
									<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.zip.errorMessage.value }}
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
								<input v-model="formData.address.value.value" type="text" placeholder="Street address" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
							</div>
							<p v-if="formData.address.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
								<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.address.errorMessage.value }}
							</p>
						</div>

						<!-- Email + Phone -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div class="flex flex-col gap-1.5">
								<label class="text-xs font-medium text-gray-500">Email <span class="text-red-400">*</span></label>
								<div
									class="flex items-center h-10 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
									:class="formData.email.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
								>
									<Icon name="mdi:email-outline" size="14" class="text-gray-400 shrink-0" />
									<input v-model="formData.email.value.value" type="email" placeholder="Email address" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
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
									<input v-model="formData.phone.value.value" type="tel" placeholder="Phone number" class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700" />
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
						<div class="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 mt-1">
							<button type="button" class="h-9 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 transition-all" @click="close(false)">
								Cancel
							</button>
							<button
								type="submit"
								:disabled="loading"
								class="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
							>
								<Icon v-if="loading" name="mdi:loading" size="13" class="animate-spin" />
								<Icon v-else name="mdi:map-marker-plus-outline" size="13" />
								Add Address
							</button>
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

defineProps({ isOpenModal: false });
const emit = defineEmits();

const toast = useToast();
const utilityStore = useUtilityStore();
const userStore = useUserStore();
const { getCountries } = storeToRefs(utilityStore);

const loading = ref(false);
const error_msg = ref("");
const loadingStates = ref(false);
const states = ref([]);

// Country dropdown
const countryOpen = ref(false);
const countrySearch = ref("");
const selectedCountryName = ref("");
const filteredCountries = computed(() => {
	const list = getCountries.value ?? [];
	if (!countrySearch.value) return list;
	return list.filter((c) => c.name.toLowerCase().includes(countrySearch.value.toLowerCase()));
});

// State dropdown
const stateOpen = ref(false);
const stateSearch = ref("");
const selectedStateName = ref("");
const filteredStates = computed(() => {
	if (!stateSearch.value) return states.value;
	return states.value.filter((s) => s.name.toLowerCase().includes(stateSearch.value.toLowerCase()));
});

const selectCountry = (country) => {
	formData.country.value.value = country.id;
	selectedCountryName.value = country.name;
	countryOpen.value = false;
	countrySearch.value = "";
	formData.state.value.value = null;
	selectedStateName.value = "";
	states.value = [];
	loadingStates.value = true;
	utilityStore.fetchStates({ country: country.id })
		.then((d) => { states.value = d ?? []; loadingStates.value = false; })
		.catch(() => { loadingStates.value = false; });
};

const selectState = (state) => {
	formData.state.value.value = state.id;
	selectedStateName.value = state.name;
	stateOpen.value = false;
	stateSearch.value = "";
};

const validationSchema = yup.object().shape({
	full_name: yup.string().required(),
	country: yup.mixed().required(),
	state: yup.mixed().required(),
	city: yup.string().required(),
	zip: yup.string().required(),
	address: yup.string().required(),
	email: yup.string().email().required(),
	phone: yup.string().required(),
	is_default: yup.boolean(),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	full_name: useField("full_name", validationSchema),
	country: useField("country", validationSchema),
	state: useField("state", validationSchema),
	city: useField("city", validationSchema),
	zip: useField("zip", validationSchema),
	address: useField("address", validationSchema),
	email: useField("email", validationSchema),
	phone: useField("phone", validationSchema),
	is_default: useField("is_default", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	userStore
		.createAddress(values)
		.then(() => {
			loading.value = false;
			toast.success("Address added!");
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

const close = (refresh = false) => emit("close", refresh);

onMounted(() => {
	formData.is_default.value.value = false;
	utilityStore.fetchCountries?.().catch?.(() => {});
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
