<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div
			class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"
				>
					<Icon name="mdi:map-marker-outline" size="16" class="text-primary" />
				</div>
				<div>
					<span class="text-sm font-black text-gray-800">Shipping Address</span>
					<p class="text-[11px] text-gray-400 font-medium">
						Where should we deliver?
					</p>
				</div>
			</div>
			<button
				v-if="getProfile"
				type="button"
				class="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
				@click="addressChooserModalOpen = true"
			>
				<Icon name="mdi:map-marker-multiple-outline" size="13" />
				Saved Addresses
			</button>
		</div>

		<div class="p-5 sm:p-6">
			<!-- Selected address card -->
			<div v-if="selectedAddress" class="mb-5">
				<div
					class="flex items-start justify-between gap-3 p-4 rounded-xl border-2 border-primary/20 bg-primary/5"
				>
					<div class="flex gap-3">
						<div
							class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
						>
							<Icon
								name="mdi:map-marker-check-outline"
								size="16"
								class="text-primary"
							/>
						</div>
						<div class="flex flex-col gap-0.5">
							<p class="text-sm font-bold text-gray-800">
								{{ selectedAddress.full_name }}
							</p>
							<p class="text-xs text-gray-500 flex items-center gap-1">
								<Icon name="mdi:phone-outline" size="11" />{{
									selectedAddress.phone
								}}
							</p>
							<p class="text-xs text-gray-500">{{ selectedAddress.address }}</p>
							<p class="text-xs text-gray-400">
								{{ selectedAddress.city }},
								{{ selectedAddress.state_detail?.name }},
								{{ selectedAddress.country_detail?.name }}
							</p>
						</div>
					</div>
					<button
						type="button"
						class="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
						@click="selectedAddress = null"
					>
						<Icon name="mdi:close" size="15" />
					</button>
				</div>
			</div>

			<!-- Form -->
			<form
				v-if="!selectedAddress"
				@submit.prevent="handleFormSubmit"
				class="flex flex-col gap-5"
			>
				<!-- Row 1: Full Name + Country -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- Full Name -->
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Full Name <span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.full_name.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<Icon
								name="mdi:account-outline"
								size="16"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.full_name.value.value"
								type="text"
								placeholder="Your full name"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.full_name.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.full_name.errorMessage.value
							}}
						</p>
					</div>

					<!-- Country -->
					<div
						class="flex flex-col gap-1.5"
						v-click-outside="() => (countryDropdownOpen = false)"
					>
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Country <span class="text-red-400 normal-case">*</span></label
						>
						<div class="relative">
							<button
								type="button"
								class="w-full flex items-center h-11 rounded-xl border-2 bg-gray-50 px-3.5 gap-2 transition-all text-left"
								:class="
									formData.country.errorMessage.value
										? 'border-red-300'
										: countryDropdownOpen
											? 'border-primary bg-white ring-2 ring-primary/10'
											: 'border-gray-200 hover:border-gray-300'
								"
								@click="countryDropdownOpen = !countryDropdownOpen"
							>
								<Icon
									name="mdi:earth"
									size="16"
									class="text-gray-400 shrink-0"
								/>
								<span
									class="flex-1 text-sm truncate"
									:class="
										selectedCountryName ? 'text-gray-800' : 'text-gray-400'
									"
								>
									{{ selectedCountryName || "Select country" }}
								</span>
								<Icon
									name="mdi:chevron-down"
									size="15"
									class="text-gray-400 shrink-0 transition-transform duration-200"
									:class="countryDropdownOpen ? 'rotate-180' : ''"
								/>
							</button>
							<Transition name="dropdown">
								<div
									v-if="countryDropdownOpen"
									class="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
								>
									<div
										class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50"
									>
										<Icon
											name="mdi:magnify"
											size="15"
											class="text-gray-400 shrink-0"
										/>
										<input
											v-model="countrySearch"
											type="text"
											placeholder="Search country..."
											class="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
											@click.stop
										/>
										<button
											v-if="countrySearch"
											type="button"
											@click.stop="countrySearch = ''"
											class="text-gray-300 hover:text-gray-500"
										>
											<Icon name="mdi:close" size="13" />
										</button>
									</div>
									<div class="max-h-48 overflow-y-auto">
										<button
											v-for="country in filteredCountries"
											:key="country.id"
											type="button"
											class="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between"
											:class="
												formData.country.value.value === country.id
													? 'bg-primary/5 text-primary font-semibold'
													: 'text-gray-700'
											"
											@click="selectCountry(country)"
										>
											{{ country.name }}
											<Icon
												v-if="formData.country.value.value === country.id"
												name="mdi:check"
												size="14"
												class="text-primary"
											/>
										</button>
										<div
											v-if="filteredCountries.length === 0"
											class="px-4 py-4 text-sm text-gray-400 text-center"
										>
											No country found
										</div>
									</div>
								</div>
							</Transition>
						</div>
						<p
							v-if="formData.country.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.country.errorMessage.value
							}}
						</p>
					</div>
				</div>

				<!-- Row 2: State + City -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- State -->
					<div
						class="flex flex-col gap-1.5"
						v-click-outside="() => (stateDropdownOpen = false)"
					>
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>State / Province
							<span class="text-red-400 normal-case">*</span></label
						>
						<div class="relative">
							<button
								type="button"
								:disabled="!formData.country.value.value"
								class="w-full flex items-center h-11 rounded-xl border-2 bg-gray-50 px-3.5 gap-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
								:class="
									formData.state.errorMessage.value
										? 'border-red-300'
										: stateDropdownOpen
											? 'border-primary bg-white ring-2 ring-primary/10'
											: 'border-gray-200 hover:border-gray-300'
								"
								@click="stateDropdownOpen = !stateDropdownOpen"
							>
								<Icon
									name="mdi:map-outline"
									size="16"
									class="text-gray-400 shrink-0"
								/>
								<span
									class="flex-1 text-sm truncate"
									:class="selectedStateName ? 'text-gray-800' : 'text-gray-400'"
								>
									{{
										selectedStateName ||
										(formData.country.value.value
											? "Select state / province"
											: "Select country first")
									}}
								</span>
								<Icon
									v-if="loadingStates"
									name="mdi:loading"
									size="15"
									class="text-gray-400 shrink-0 animate-spin"
								/>
								<Icon
									v-else
									name="mdi:chevron-down"
									size="15"
									class="text-gray-400 shrink-0 transition-transform duration-200"
									:class="stateDropdownOpen ? 'rotate-180' : ''"
								/>
							</button>
							<Transition name="dropdown">
								<div
									v-if="stateDropdownOpen && states.length"
									class="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
								>
									<div
										class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50"
									>
										<Icon
											name="mdi:magnify"
											size="15"
											class="text-gray-400 shrink-0"
										/>
										<input
											v-model="stateSearch"
											type="text"
											placeholder="Search state..."
											class="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
											@click.stop
										/>
										<button
											v-if="stateSearch"
											type="button"
											@click.stop="stateSearch = ''"
											class="text-gray-300 hover:text-gray-500"
										>
											<Icon name="mdi:close" size="13" />
										</button>
									</div>
									<div class="max-h-48 overflow-y-auto">
										<button
											v-for="state in filteredStates"
											:key="state.id"
											type="button"
											class="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between"
											:class="
												formData.state.value.value === state.id
													? 'bg-primary/5 text-primary font-semibold'
													: 'text-gray-700'
											"
											@click="selectState(state)"
										>
											{{ state.name }}
											<Icon
												v-if="formData.state.value.value === state.id"
												name="mdi:check"
												size="14"
												class="text-primary"
											/>
										</button>
										<div
											v-if="filteredStates.length === 0"
											class="px-4 py-4 text-sm text-gray-400 text-center"
										>
											No state found
										</div>
									</div>
								</div>
							</Transition>
						</div>
						<p
							v-if="formData.state.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.state.errorMessage.value
							}}
						</p>
					</div>

					<!-- City -->
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>City <span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.city.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<Icon
								name="mdi:city-variant-outline"
								size="16"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.city.value.value"
								type="text"
								placeholder="Your city"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.city.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.city.errorMessage.value
							}}
						</p>
					</div>
				</div>

				<!-- Row 3: Address + Zip -->
				<div class="grid grid-cols-3 gap-4">
					<div class="flex flex-col gap-1.5 col-span-2">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Address <span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.address.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<Icon
								name="mdi:home-outline"
								size="16"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.address.value.value"
								type="text"
								placeholder="Street address"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.address.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.address.errorMessage.value
							}}
						</p>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Zip / Postal
							<span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.zip.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<input
								v-model="formData.zip.value.value"
								type="text"
								placeholder="00000"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.zip.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.zip.errorMessage.value
							}}
						</p>
					</div>
				</div>

				<!-- Row 4: Email + Phone -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Email <span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.email.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<Icon
								name="mdi:email-outline"
								size="16"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.email.value.value"
								type="email"
								placeholder="your@email.com"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.email.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.email.errorMessage.value
							}}
						</p>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-bold text-gray-500 uppercase tracking-wider"
							>Phone <span class="text-red-400 normal-case">*</span></label
						>
						<div
							class="flex items-center h-11 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.phone.errorMessage.value
									? 'border-red-300 focus-within:border-red-400'
									: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
							"
						>
							<Icon
								name="mdi:phone-outline"
								size="16"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.phone.value.value"
								type="tel"
								placeholder="+1 (555) 000-0000"
								class="flex-1 h-full text-sm outline-none bg-transparent"
							/>
						</div>
						<p
							v-if="formData.phone.errorMessage.value"
							class="text-[11px] text-red-500 font-medium flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.phone.errorMessage.value
							}}
						</p>
					</div>
				</div>

				<div class="h-px bg-gray-100" />

				<!-- Save address -->
				<label
					v-if="getProfile"
					class="flex items-center gap-3 cursor-pointer group"
					@click="
						formData.save_address.value.value =
							!formData.save_address.value.value
					"
				>
					<div
						class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
						:class="
							formData.save_address.value.value
								? 'bg-primary border-primary'
								: 'border-gray-300 group-hover:border-primary/40'
						"
					>
						<Icon
							v-if="formData.save_address.value.value"
							name="mdi:check"
							size="11"
							class="text-white"
						/>
					</div>
					<div class="flex items-center gap-1.5">
						<Icon name="mdi:bookmark-outline" size="14" class="text-gray-400" />
						<span class="text-xs text-gray-600 font-medium"
							>Save this address for future orders</span
						>
					</div>
				</label>

				<!-- T&C -->
				<label
					class="flex items-center gap-3 cursor-pointer group"
					@click.prevent="formData.t_c.value.value = !formData.t_c.value.value"
				>
					<div
						class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
						:class="
							formData.t_c.value.value
								? 'bg-primary border-primary'
								: 'border-gray-300 group-hover:border-primary/40'
						"
					>
						<Icon
							v-if="formData.t_c.value.value"
							name="mdi:check"
							size="11"
							class="text-white"
						/>
					</div>
					<span class="text-xs text-gray-500 leading-relaxed">
						I accept the
						<a
							:href="getBasicSettings?.t_c"
							target="_blank"
							class="text-primary font-semibold hover:underline"
							@click.stop
							>Terms & Conditions</a
						>
						and
						<a
							:href="getBasicSettings?.privacy_policy"
							target="_blank"
							class="text-primary font-semibold hover:underline"
							@click.stop
							>Privacy Policy.</a
						>
					</span>
				</label>

				<!-- Error -->
				<div
					v-if="error_msg"
					class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
				>
					<Icon name="mdi:alert-circle-outline" size="15" class="shrink-0" />{{
						error_msg
					}}
				</div>

				<!-- Submit -->
				<button
					type="submit"
					:disabled="loading"
					class="w-full relative flex items-center justify-center gap-2 h-12 rounded-[10px] bg-accent text-white font-bold text-sm hover:bg-accent-dark active:scale-[0.98] transition-all shadow-md shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
				>
					<div
						class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 pointer-events-none"
					/>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="16"
						class="animate-spin relative"
					/>
					<Icon v-else name="mdi:lock-outline" size="15" class="relative" />
					<span class="relative">Continue to Payment</span>
					<Icon
						v-if="!loading"
						name="mdi:arrow-right"
						size="15"
						class="relative"
					/>
				</button>
			</form>

			<!-- With selected address -->
			<div v-else class="flex flex-col gap-5">
				<label
					class="flex items-center gap-3 cursor-pointer group"
					@click.prevent="formData.t_c.value.value = !formData.t_c.value.value"
				>
					<div
						class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
						:class="
							formData.t_c.value.value
								? 'bg-primary border-primary'
								: 'border-gray-300 group-hover:border-primary/40'
						"
					>
						<Icon
							v-if="formData.t_c.value.value"
							name="mdi:check"
							size="11"
							class="text-white"
						/>
					</div>
					<span class="text-xs text-gray-500 leading-relaxed">
						I accept the
						<a
							:href="getBasicSettings?.t_c"
							target="_blank"
							class="text-primary font-semibold hover:underline"
							@click.stop
							>Terms & Conditions</a
						>
						and
						<a
							:href="getBasicSettings?.privacy_policy"
							target="_blank"
							class="text-primary font-semibold hover:underline"
							@click.stop
							>Privacy Policy.</a
						>
					</span>
				</label>

				<div
					v-if="error_msg"
					class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
				>
					<Icon name="mdi:alert-circle-outline" size="15" class="shrink-0" />{{
						error_msg
					}}
				</div>

				<button
					type="button"
					:disabled="loading"
					class="w-full relative flex items-center justify-center gap-2 h-12 rounded-[10px] bg-accent text-white font-bold text-sm hover:bg-accent-dark active:scale-[0.98] transition-all shadow-md shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
					@click="handleFormSubmitWithSelectedAddress"
				>
					<div
						class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 pointer-events-none"
					/>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="16"
						class="animate-spin relative"
					/>
					<Icon v-else name="mdi:lock-outline" size="15" class="relative" />
					<span class="relative">Continue to Payment</span>
					<Icon
						v-if="!loading"
						name="mdi:arrow-right"
						size="15"
						class="relative"
					/>
				</button>
			</div>
		</div>
	</div>

	<ModalsChooseAddress
		v-if="addressChooserModalOpen"
		:isOpenModal="addressChooserModalOpen"
		@close="handleChooseAddressClose"
	/>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useUtilityStore } from "@/stores/utility";
import { useSaleStore } from "@/stores/sale";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";

const config = useRuntimeConfig();
const utilityStore = useUtilityStore();
const saleStore = useSaleStore();
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const { getCountries, getBasicSettings } = storeToRefs(utilityStore);
const { getProfile } = storeToRefs(userStore);
const { getSelectedShippingService } = storeToRefs(saleStore);

const HOST = config.public.HOST;

const loading = ref(false);
const loadingStates = ref(false);
const error_msg = ref(null);
const addressChooserModalOpen = ref(false);
const selectedAddress = ref(null);
const states = ref([]);

// Country dropdown
const countryDropdownOpen = ref(false);
const countrySearch = ref("");
const selectedCountryName = ref("");

const filteredCountries = computed(() => {
	const list = getCountries.value ?? [];
	if (!countrySearch.value) return list;
	return list.filter((c) =>
		c.name.toLowerCase().includes(countrySearch.value.toLowerCase()),
	);
});

function selectCountry(country) {
	formData.country.value.value = country.id;
	selectedCountryName.value = country.name;
	countryDropdownOpen.value = false;
	countrySearch.value = "";
	formData.state.value.value = null;
	selectedStateName.value = "";
	states.value = [];
	handleChangeCountry();
}

// State dropdown
const stateDropdownOpen = ref(false);
const stateSearch = ref("");
const selectedStateName = ref("");

const filteredStates = computed(() => {
	if (!stateSearch.value) return states.value;
	return states.value.filter((s) =>
		s.name.toLowerCase().includes(stateSearch.value.toLowerCase()),
	);
});

function selectState(state) {
	formData.state.value.value = state.id;
	selectedStateName.value = state.name;
	stateDropdownOpen.value = false;
	stateSearch.value = "";
}

const validationSchema = yup.object().shape({
	full_name: yup.string().required(),
	country: yup.mixed().required(),
	state: yup.mixed().required(),
	city: yup.string().required(),
	address: yup.string().required(),
	zip: yup.string().required(),
	email: yup.string().email().required(),
	phone: yup.string().required(),
	t_c: yup.boolean().required(),
	save_address: yup.boolean().required(),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	full_name: useField("full_name", validationSchema),
	country: useField("country", validationSchema),
	state: useField("state", validationSchema),
	city: useField("city", validationSchema),
	address: useField("address", validationSchema),
	zip: useField("zip", validationSchema),
	email: useField("email", validationSchema),
	phone: useField("phone", validationSchema),
	t_c: useField("t_c", validationSchema),
	save_address: useField("save_address", validationSchema),
};

const handleChangeCountry = () => {
	const countryId = formData.country.value.value;
	if (!countryId) {
		states.value = [];
		return;
	}
	loadingStates.value = true;
	utilityStore
		.fetchStates({ country: countryId })
		.then((d) => {
			states.value = d ?? [];
			loadingStates.value = false;
		})
		.catch(() => {
			loadingStates.value = false;
		});
};

const handleFetchShippingRate = () => {
	loading.value = true;
	const params = selectedAddress.value
		? {
				full_name: selectedAddress.value.full_name,
				country: selectedAddress.value.country,
				state: selectedAddress.value.state,
				city: selectedAddress.value.city,
				zip: selectedAddress.value.zip,
				address: selectedAddress.value.address,
				email: selectedAddress.value.email,
				phone: selectedAddress.value.phone,
			}
		: {
				full_name: formData.full_name.value.value,
				country: formData.country.value.value,
				state: formData.state.value.value,
				city: formData.city.value.value,
				zip: formData.zip.value.value,
				address: formData.address.value.value,
				email: formData.email.value.value,
				phone: formData.phone.value.value,
			};
	saleStore
		.fetchShippingRate(params)
		.then(() => {
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
};

const hanldeCreateOrder = (payload) => {
	loading.value = true;
	saleStore
		.createOrder(payload)
		.then((d) => {
			loading.value = false;
			router.push({ name: "checkout-slug", params: { slug: d.order_id } });
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
};

const handleFormSubmit = handleSubmit((values) => {
	if (!values?.t_c) {
		toast.error("You must agree to our terms!");
		return;
	}
	if (!getSelectedShippingService.value) {
		toast.error("Please select a shipping service!");
		return;
	}
	delete values["t_c"];
	hanldeCreateOrder({
		shipping_address: values,
		shipping_service: getSelectedShippingService.value,
	});
});

const handleFormSubmitWithSelectedAddress = () => {
	if (!formData?.t_c?.value?.value) {
		toast.error("You must agree to our terms!");
		return;
	}
	if (!getSelectedShippingService.value) {
		toast.error("Please select a shipping service!");
		return;
	}
	hanldeCreateOrder({
		shipping_address_id: selectedAddress.value?.id,
		shipping_service: getSelectedShippingService.value,
	});
};

const handleChooseAddressClose = (data = null) => {
	addressChooserModalOpen.value = false;
	if (data) selectedAddress.value = data;
};

watch(
	() => selectedAddress.value,
	(val) => {
		if (val) {
			handleFetchShippingRate();
		} else {
			states.value = [];
			saleStore.selectedShippingService = null;
			saleStore.shippingServices = null;
		}
	},
	{ deep: true },
);

watchEffect(() => {
	if (
		formData.full_name.value.value &&
		formData.country.value.value &&
		formData.state.value.value &&
		formData.city.value.value &&
		formData.zip.value.value &&
		formData.address.value.value &&
		formData.email.value.value &&
		formData.phone.value.value &&
		formData.t_c.value.value === true
	) {
		handleFetchShippingRate();
	}
});

onMounted(() => {
	formData.t_c.value.value = false;
	formData.save_address.value.value = false;
	utilityStore.fetchCountries?.().catch?.(() => {});
});

onBeforeRouteLeave((to, from, next) => {
	selectedAddress.value = null;
	states.value = [];
	saleStore.selectedShippingService = null;
	saleStore.shippingServices = null;
	next();
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
