<template>
	<div class="flex flex-col gap-4">
		<!-- Page title -->
		<div>
			<h2 class="text-base font-bold text-gray-900">My Account</h2>
			<p class="text-xs text-gray-400 mt-0.5">
				Manage your personal information
			</p>
		</div>

		<!-- Skeleton -->
		<template v-if="pageLoading">
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
					<div class="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
					<div class="h-4 w-40 rounded bg-gray-100 animate-pulse" />
				</div>
				<div class="p-5 flex flex-col gap-4">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-28 rounded bg-gray-100 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
					</div>
					<div class="h-9 w-32 rounded-xl bg-gray-100 animate-pulse" />
				</div>
			</div>

			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div
					class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
				>
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
						<div class="h-4 w-36 rounded bg-gray-100 animate-pulse" />
					</div>
					<div class="flex gap-2">
						<div class="h-6 w-28 rounded-full bg-gray-100 animate-pulse" />
						<div class="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
					</div>
				</div>
				<div class="p-5 flex flex-col gap-4">
					<div class="flex items-center justify-between">
						<div class="h-4 w-32 rounded bg-gray-100 animate-pulse" />
						<div class="h-9 w-36 rounded-xl bg-gray-100 animate-pulse" />
					</div>
					<div class="rounded-xl border border-gray-100 overflow-hidden">
						<div
							class="bg-gray-50 px-4 py-2.5 flex gap-8 border-b border-gray-100"
						>
							<div
								v-for="i in 4"
								:key="i"
								class="h-3 w-16 rounded bg-gray-100 animate-pulse"
							/>
						</div>
						<div
							v-for="i in 4"
							:key="i"
							class="flex gap-8 px-4 py-3 border-b border-gray-50 last:border-0"
						>
							<div class="h-3 w-20 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-32 rounded bg-gray-100 animate-pulse" />
							<div class="h-3 w-10 rounded bg-gray-100 animate-pulse" />
							<div class="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- Real content -->
		<template v-else>
			<!-- Profile form card -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
					<div
						class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"
					>
						<Icon
							name="mdi:account-edit-outline"
							size="15"
							class="text-gray-400"
						/>
					</div>
					<span class="text-sm font-semibold text-gray-700"
						>Profile Information</span
					>
				</div>

				<form
					class="p-5 flex flex-col gap-4"
					@submit.prevent="handleFormSubmit"
				>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<!-- Full name -->
						<div class="flex flex-col gap-1.5">
							<label class="text-xs font-medium text-gray-500">
								Full Name <span class="text-red-400">*</span>
							</label>
							<div
								class="flex items-center h-11 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
								:class="
									formData.full_name.errorMessage.value
										? 'border-red-300'
										: 'border-gray-200 focus-within:border-primary'
								"
							>
								<Icon
									name="mdi:account-outline"
									size="15"
									class="text-gray-400 shrink-0"
								/>
								<input
									v-model="formData.full_name.value.value"
									type="text"
									placeholder="Your full name"
									class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
								/>
							</div>
							<p
								v-if="formData.full_name.errorMessage.value"
								class="text-[11px] text-red-500 flex items-center gap-1"
							>
								<Icon name="mdi:alert-circle-outline" size="11" />{{
									formData.full_name.errorMessage.value
								}}
							</p>
						</div>

						<!-- Username -->
						<div class="flex flex-col gap-1.5">
							<label class="text-xs font-medium text-gray-500">
								Email <span class="text-red-400">*</span>
							</label>
							<div
								class="flex items-center h-11 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
								:class="
									formData.username.errorMessage.value
										? 'border-red-300'
										: 'border-gray-200 focus-within:border-primary'
								"
							>
								<Icon name="mdi:at" size="15" class="text-gray-400 shrink-0" />
								<input
									v-model="formData.username.value.value"
									type="text"
									placeholder="Enter YourEmail"
									class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
								/>
							</div>
							<p
								v-if="formData.username.errorMessage.value"
								class="text-[11px] text-red-500 flex items-center gap-1"
							>
								<Icon name="mdi:alert-circle-outline" size="11" />{{
									formData.username.errorMessage.value
								}}
							</p>
						</div>
					</div>

					<!-- Error -->
					<div
						v-if="error_msg"
						class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs"
					>
						<Icon
							name="mdi:alert-circle-outline"
							size="13"
							class="shrink-0"
						/>{{ error_msg }}
					</div>

					<!-- Save button -->
					<div>
						<button
							type="submit"
							:disabled="loading"
							class="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
						>
							<Icon
								v-if="loading"
								name="mdi:loading"
								size="14"
								class="animate-spin"
							/>
							<Icon v-else name="mdi:content-save-outline" size="14" />
							Save Changes
						</button>
					</div>
				</form>
			</div>

			<!-- Delete account card -->
			<div class="bg-white border border-red-100 rounded-2xl overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-4 border-b border-red-100">
					<div
						class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"
					>
						<Icon
							name="mdi:account-remove-outline"
							size="15"
							class="text-red-500"
						/>
					</div>
					<span class="text-sm font-semibold text-gray-700"
						>Delete Account</span
					>
				</div>
				<div
					class="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<p class="text-sm text-gray-600 font-medium">
							Remove your account permanently
						</p>
						<p class="text-xs text-gray-400 mt-0.5">
							This action cannot be undone. All your data will be deleted.
						</p>
					</div>
					<button
						type="button"
						:disabled="deleteLoading"
						class="shrink-0 flex items-center gap-2 h-9 px-4 rounded-[10px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
						@click="confirmDelete = true"
					>
						<Icon
							v-if="deleteLoading"
							name="mdi:loading"
							size="14"
							class="animate-spin"
						/>
						<Icon v-else name="mdi:delete-outline" size="14" />
						Delete Account
					</button>
				</div>
			</div>

			<!-- Confirmation modal -->
			<Teleport to="body">
				<Transition name="fade">
					<div
						v-if="confirmDelete"
						class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
						@click.self="confirmDelete = false"
					>
						<div
							class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
						>
							<div class="flex items-start gap-3">
								<div
									class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0"
								>
									<Icon
										name="mdi:alert-outline"
										size="20"
										class="text-red-500"
									/>
								</div>
								<div>
									<p class="text-sm font-bold text-gray-900">
										Delete your account?
									</p>
									<p class="text-xs text-gray-400 mt-1 leading-relaxed">
										This will permanently remove your account and all associated
										data. This cannot be undone.
									</p>
								</div>
							</div>
							<div class="flex gap-2">
								<button
									type="button"
									class="flex-1 h-10 rounded-[10px] border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
									@click="confirmDelete = false"
								>
									Cancel
								</button>
								<button
									type="button"
									:disabled="deleteLoading"
									class="flex-1 h-10 rounded-[10px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									@click="handleDeleteAccount"
								>
									<Icon
										v-if="deleteLoading"
										name="mdi:loading"
										size="14"
										class="animate-spin"
									/>
									<Icon v-else name="mdi:delete-outline" size="14" />
									Yes, Delete
								</button>
							</div>
						</div>
					</div>
				</Transition>
			</Teleport>
		</template>
	</div>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const { getProfile } = storeToRefs(userStore);

const loading = ref(false);
const deleteLoading = ref(false);
const confirmDelete = ref(false);
const pageLoading = ref(true);
const error_msg = ref(null);

const validationSchema = yup.object().shape({
	full_name: yup.string().required(),
	username: yup.string().required(),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	full_name: useField("full_name", validationSchema),
	username: useField("username", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	userStore
		.changeProfile(values)
		.then((d) => {
			loading.value = false;
			toast.success("Profile updated!");
			if (d?.is_verified == false) {
				router.push({
					name: "validate-otp",
					query: {
						username: d?.username,
						mode: "verification",
						from: "username_change",
					},
				});
			}
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
});

onMounted(() => {
	if (getProfile.value) {
		formData.full_name.value.value = getProfile.value.full_name;
		formData.username.value.value = getProfile.value.username;
	}

	pageLoading.value = false;
});

const handleDeleteAccount = () => {
	deleteLoading.value = true;
	userStore
		.removeProfile()
		.then(() => {
			deleteLoading.value = false;
			confirmDelete.value = false;
			toast.success("Account deleted successfully.");
			router.push("/");
		})
		.catch(() => {
			deleteLoading.value = false;
			confirmDelete.value = false;
			toast.error("Failed to delete account. Please try again.");
		});
};

useHead({ title: "My Account" });
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
