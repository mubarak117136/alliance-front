<template>
	<div class="flex flex-col gap-4">
		<!-- Header -->
		<div>
			<h2 class="text-base font-bold text-gray-900">Change Password</h2>
			<p class="text-xs text-gray-400 mt-0.5">Update your account password</p>
		</div>

		<!-- Form card -->
		<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
				<div
					class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"
				>
					<Icon name="mdi:lock-outline" size="15" class="text-gray-400" />
				</div>
				<span class="text-sm font-semibold text-gray-700"
					>Password Settings</span
				>
			</div>

			<form class="p-5 flex flex-col gap-4" @submit.prevent="handleFormSubmit">
				<!-- Current password -->
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-medium text-gray-500">
						Current Password <span class="text-red-400">*</span>
					</label>
					<div
						class="flex items-center h-11 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
						:class="
							formData.old_password.errorMessage.value
								? 'border-red-300'
								: 'border-gray-200 focus-within:border-primary'
						"
					>
						<Icon
							name="mdi:lock-outline"
							size="15"
							class="text-gray-400 shrink-0"
						/>
						<input
							v-model="formData.old_password.value.value"
							:type="visible ? 'text' : 'password'"
							placeholder="Enter current password"
							class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
						/>
						<button
							type="button"
							class="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
							@click="visible = !visible"
						>
							<Icon
								:name="visible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
								size="15"
							/>
						</button>
					</div>
					<p
						v-if="formData.old_password.errorMessage.value"
						class="text-[11px] text-red-500 flex items-center gap-1"
					>
						<Icon name="mdi:alert-circle-outline" size="11" />{{
							formData.old_password.errorMessage.value
						}}
					</p>
				</div>

				<div class="h-px bg-gray-100" />

				<!-- New + Confirm password -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label class="text-xs font-medium text-gray-500">
							New Password <span class="text-red-400">*</span>
						</label>
						<div
							class="flex items-center h-11 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.new_password.errorMessage.value
									? 'border-red-300'
									: 'border-gray-200 focus-within:border-primary'
							"
						>
							<Icon
								name="mdi:lock-reset"
								size="15"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.new_password.value.value"
								:type="newVisible ? 'text' : 'password'"
								placeholder="New password"
								class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
							/>
							<button
								type="button"
								class="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
								@click="newVisible = !newVisible"
							>
								<Icon
									:name="newVisible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
									size="15"
								/>
							</button>
						</div>
						<p
							v-if="formData.new_password.errorMessage.value"
							class="text-[11px] text-red-500 flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.new_password.errorMessage.value
							}}
						</p>
					</div>

					<div class="flex flex-col gap-1.5">
						<label class="text-xs font-medium text-gray-500">
							Confirm Password <span class="text-red-400">*</span>
						</label>
						<div
							class="flex items-center h-11 rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 gap-2"
							:class="
								formData.new_password2.errorMessage.value
									? 'border-red-300'
									: 'border-gray-200 focus-within:border-primary'
							"
						>
							<Icon
								name="mdi:lock-check-outline"
								size="15"
								class="text-gray-400 shrink-0"
							/>
							<input
								v-model="formData.new_password2.value.value"
								:type="newVisible2 ? 'text' : 'password'"
								placeholder="Retype new password"
								class="flex-1 h-full text-sm outline-none bg-transparent text-gray-700"
							/>
							<button
								type="button"
								class="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
								@click="newVisible2 = !newVisible2"
							>
								<Icon
									:name="
										newVisible2 ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
									"
									size="15"
								/>
							</button>
						</div>
						<p
							v-if="formData.new_password2.errorMessage.value"
							class="text-[11px] text-red-500 flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="11" />{{
								formData.new_password2.errorMessage.value
							}}
						</p>
					</div>
				</div>

				<!-- Error -->
				<div
					v-if="error_msg"
					class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs"
				>
					<Icon name="mdi:alert-circle-outline" size="13" class="shrink-0" />{{
						error_msg
					}}
				</div>

				<!-- Submit -->
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
						<Icon v-else name="mdi:lock-check-outline" size="14" />
						Update Password
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const toast = useToast();

const loading = ref(false);
const error_msg = ref(null);
const visible = ref(false);
const newVisible = ref(false);
const newVisible2 = ref(false);

const validationSchema = yup.object().shape({
	old_password: yup
		.string()
		.required("Current password required")
		.min(8, "Minimum 8 characters"),
	new_password: yup
		.string()
		.required("New password required")
		.min(8, "Minimum 8 characters"),
	new_password2: yup
		.string()
		.required("Please retype password")
		.min(8, "Minimum 8 characters")
		.oneOf([yup.ref("new_password")], "Passwords do not match"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	old_password: useField("old_password", validationSchema),
	new_password: useField("new_password", validationSchema),
	new_password2: useField("new_password2", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	userStore
		.changePassword(values)
		.then(() => {
			loading.value = false;
			error_msg.value = null;
			toast.success("Password updated!");
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
});

useHead({ title: "Change Password" });
</script>
