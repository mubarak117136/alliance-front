<template>
	<div class="min-h-screen bg-white lg:bg-gray-50 flex items-stretch">
		<!-- ── Left panel (hidden on mobile) ── -->
		<div class="hidden lg:block lg:w-1/2 p-5">
			<div class="relative w-full h-full rounded-2xl overflow-hidden">
				<img
					src="/images/forget-password.png"
					alt="Wellmed"
					class="absolute inset-0 w-full h-full object-cover"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
				/>

				<!-- Floating logo badge top-left -->
				<NuxtLink
					to="/"
					class="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-2"
				>
					<img
						v-if="logoUrl"
						:src="logoUrl"
						:alt="getBasicSettings?.logo?.original?.alt ?? 'Logo'"
						class="h-12 w-auto object-contain"
					/>
					<div
						v-else
						class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center"
					>
						<Icon name="mdi:heart-pulse" class="text-white" size="15" />
					</div>
				</NuxtLink>

				<!-- Bottom trust -->
				<div
					class="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3"
				>
					<div class="flex -space-x-2">
						<div
							v-for="n in 4"
							:key="n"
							class="w-7 h-7 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center"
						>
							<Icon name="mdi:account" class="text-white" size="14" />
						</div>
					</div>
					<p class="text-white text-xs font-medium">
						Join <span class="font-bold">50,000+</span> happy customers
					</p>
				</div>
			</div>
		</div>

		<!-- ── Right panel ── -->
		<div class="flex-1 flex items-center justify-center px-5 py-10 sm:px-10">
			<div class="w-full max-w-sm">
				<!-- Mobile brand -->
				<div class="flex flex-col items-center mb-10 lg:hidden">
					<NuxtLink
						to="/"
						class="flex items-center gap-2 mb-6 bg-primary/90 rounded-2xl px-4 py-2.5 shadow-md"
					>
						<img
							v-if="logoUrl"
							:src="logoUrl"
							:alt="getBasicSettings?.logo?.original?.alt ?? 'Logo'"
							class="h-8 w-auto object-contain"
						/>
						<div v-else class="w-8 h-8 flex items-center justify-center">
							<Icon name="mdi:heart-pulse" class="text-white" size="20" />
						</div>
					</NuxtLink>
					<div
						class="h-px w-16 bg-gradient-to-r from-primary to-accent rounded-full"
					/>
				</div>

				<!-- ── Step 1: Verify OTP ── -->
				<template v-if="step === 1">
					<div class="mb-8">
						<h1 class="text-gray-900 text-2xl font-bold tracking-tight">
							Enter verification code
						</h1>
						<p class="text-gray-500 text-sm mt-1">We sent a code to</p>
						<p class="text-primary font-semibold text-sm mt-0.5 truncate">
							{{ username || "—" }}
						</p>
						<p class="text-gray-400 text-xs mt-1">
							Check your inbox or spam folder
						</p>
					</div>

					<!-- OTP boxes -->
					<div class="flex gap-2 sm:gap-3 mb-6">
						<input
							v-for="(_, i) in otpDigits"
							:key="i"
							:ref="
								(el) => {
									if (el) otpRefs[i] = el;
								}
							"
							v-model="otpDigits[i]"
							type="text"
							inputmode="numeric"
							maxlength="1"
							class="flex-1 min-w-0 aspect-square text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none"
							:class="
								hasOtpError
									? 'border-red-400 bg-red-50 text-red-600'
									: otpDigits[i]
										? 'border-primary bg-primary/5 text-primary'
										: 'border-gray-200 bg-white text-gray-800 focus:border-primary focus:bg-primary/5'
							"
							@input="onOtpInput(i, $event)"
							@keydown="onOtpKeydown(i, $event)"
							@paste.prevent="onOtpPaste($event)"
						/>
					</div>

					<!-- Error -->
					<div
						v-if="error_msg"
						class="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5 mb-4"
					>
						<Icon
							name="mdi:alert-circle-outline"
							size="15"
							class="mt-0.5 shrink-0"
						/>
						{{ error_msg }}
					</div>

					<!-- Next button -->
					<button
						type="button"
						:disabled="loading || otpCode.length < 6"
						class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
						@click="handleVerifyCode"
					>
						<Icon
							v-if="loading"
							name="mdi:loading"
							size="17"
							class="animate-spin"
						/>
						{{ loading ? "Verifying..." : "Next" }}
					</button>

					<!-- Resend -->
					<p class="text-center text-sm text-gray-500 mt-4">
						Didn't receive the code?
						<button
							type="button"
							:disabled="loading"
							class="text-primary hover:text-accent font-semibold transition-colors ml-1 disabled:opacity-50"
							@click="handleCodeResend"
						>
							Resend
						</button>
					</p>
				</template>

				<!-- ── Step 2: New Password ── -->
				<template v-else>
					<div class="mb-8">
						<div
							class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
						>
							<Icon name="mdi:lock-reset" class="text-primary" size="28" />
						</div>
						<h1 class="text-gray-900 text-2xl font-bold tracking-tight">
							Set new password
						</h1>
						<p class="text-gray-500 text-sm mt-1">
							Choose a strong password for your account.
						</p>
					</div>

					<form
						@submit.prevent="handleChangePassword"
						class="flex flex-col gap-4"
					>
						<!-- New Password -->
						<div>
							<label class="block text-sm font-medium text-gray-500 mb-1.5"
								>* New Password</label
							>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
								>
									<Icon
										name="mdi:lock-outline"
										class="text-gray-400"
										size="17"
									/>
								</div>
								<input
									v-model="formData.password.value.value"
									:type="showPassword ? 'text' : 'password'"
									placeholder="Min. 8 characters"
									class="w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all duration-200 outline-none"
									:class="
										formData.password.errorMessage.value
											? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
											: 'border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
									"
								/>
								<button
									type="button"
									@click="showPassword = !showPassword"
									class="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
								>
									<Icon
										:name="
											showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
										"
										size="17"
									/>
								</button>
							</div>
							<p
								v-if="formData.password.errorMessage.value"
								class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
							>
								<Icon name="mdi:alert-circle-outline" size="13" />{{
									formData.password.errorMessage.value
								}}
							</p>
						</div>

						<!-- Confirm Password -->
						<div>
							<label class="block text-sm font-medium text-gray-500 mb-1.5"
								>* Confirm Password</label
							>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
								>
									<Icon
										name="mdi:lock-outline"
										class="text-gray-400"
										size="17"
									/>
								</div>
								<input
									v-model="formData.retype_password.value.value"
									:type="showRetypePassword ? 'text' : 'password'"
									placeholder="Repeat your password"
									class="w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all duration-200 outline-none"
									:class="
										formData.retype_password.errorMessage.value
											? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
											: 'border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
									"
								/>
								<button
									type="button"
									@click="showRetypePassword = !showRetypePassword"
									class="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
								>
									<Icon
										:name="
											showRetypePassword
												? 'mdi:eye-off-outline'
												: 'mdi:eye-outline'
										"
										size="17"
									/>
								</button>
							</div>
							<p
								v-if="formData.retype_password.errorMessage.value"
								class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
							>
								<Icon name="mdi:alert-circle-outline" size="13" />{{
									formData.retype_password.errorMessage.value
								}}
							</p>
						</div>

						<!-- Error -->
						<div
							v-if="error_msg"
							class="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5"
						>
							<Icon
								name="mdi:alert-circle-outline"
								size="15"
								class="mt-0.5 shrink-0"
							/>
							{{ error_msg }}
						</div>

						<!-- Submit -->
						<button
							type="submit"
							:disabled="loading"
							class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-2"
						>
							<Icon
								v-if="loading"
								name="mdi:loading"
								size="17"
								class="animate-spin"
							/>
							{{ loading ? "Saving..." : "Confirm" }}
						</button>
					</form>
				</template>

				<!-- Divider -->
				<div class="flex items-center gap-3 my-6">
					<div class="flex-1 h-px bg-gray-200" />
					<span class="text-gray-400 text-xs">or</span>
					<div class="flex-1 h-px bg-gray-200" />
				</div>

				<p class="text-center text-sm text-gray-500">
					Remember your password?
					<NuxtLink
						to="/signin"
						class="text-primary hover:text-accent font-semibold transition-colors ml-1"
					>
						Sign in
					</NuxtLink>
				</p>

				<NuxtLink
					to="/"
					class="flex items-center justify-center gap-1.5 w-full text-gray-400 hover:text-primary text-xs font-medium mt-4 transition-colors"
				>
					<Icon name="mdi:arrow-left" size="14" />
					Continue shopping
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
definePageMeta({ layout: false });

import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";
import { useRoute } from "#vue-router";
import { useReCaptcha } from "vue-recaptcha-v3";

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const recaptcha = useReCaptcha();

const config = useRuntimeConfig();
const utilityStore = useUtilityStore();
const { getBasicSettings } = storeToRefs(utilityStore);
const logoUrl = computed(() => {
	const src = getBasicSettings.value?.logo?.original?.src;
	return src ? `${config.public.HOST}${src}` : null;
});

const error_msg = ref("");
const loading = ref(false);
const username = ref("");
const mode = ref("");
const step = ref(1);
const showPassword = ref(false);
const showRetypePassword = ref(false);

const validationSchema = yup.object().shape({
	code: yup.string().required(),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
	retype_password: yup
		.string()
		.required("Please confirm your password")
		.min(8)
		.oneOf([yup.ref("password")], "Passwords do not match"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	code: useField("code", validationSchema),
	password: useField("password", validationSchema),
	retype_password: useField("retype_password", validationSchema),
};

// OTP state
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const hasOtpError = ref(false);

const otpCode = computed(() => otpDigits.value.join(""));

watch(otpCode, (val) => {
	formData.code.value.value = val;
	if (val.length === 6) hasOtpError.value = false;
});

function onOtpInput(i, e) {
	const val = e.target.value.replace(/\D/g, "").slice(-1);
	otpDigits.value[i] = val;
	if (val && i < 5) nextTick(() => otpRefs.value[i + 1]?.focus());
}

function onOtpKeydown(i, e) {
	if (e.key === "Backspace" && !otpDigits.value[i] && i > 0) {
		nextTick(() => otpRefs.value[i - 1]?.focus());
	}
}

function onOtpPaste(e) {
	const text =
		(e.clipboardData || navigator.clipboard)
			.getData?.("text")
			?.replace(/\D/g, "")
			.slice(0, 6) ?? "";
	for (let i = 0; i < 6; i++) otpDigits.value[i] = text[i] ?? "";
	nextTick(() => otpRefs.value[Math.min(text.length, 5)]?.focus());
}

const handleVerifyCode = async () => {
	if (otpCode.value.length < 6) {
		hasOtpError.value = true;
		error_msg.value = "Please enter the complete 6-digit code";
		return;
	}

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("verifycode");

	loading.value = true;
	error_msg.value = "";

	userStore
		.verifyCodeForForgetPassword({
			username: username.value,
			code: otpCode.value,
			g_recaptcha_response: token,
		})
		.then((d) => {
			loading.value = false;
			if (d.verify_status === true) {
				toast.success("OTP verified successfully!");
				step.value = 2;
			} else {
				hasOtpError.value = true;
				error_msg.value = d.verify_error_msg || "Invalid OTP!";
			}
		})
		.catch((e) => {
			loading.value = false;
			hasOtpError.value = true;
			error_msg.value = "";
			var err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
};

const handleCodeResend = async () => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("signin");

	userStore
		.sendVerificationCode({
			username: username.value,
			g_recaptcha_response: token,
		})
		.then(() => {
			loading.value = false;
			toast.success("Verification code sent successfully!");
		})
		.catch((e) => {
			loading.value = false;
			var err_msg = "";
			if (e.response.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				error_msg.value = err_msg;
			} else {
				toast.error("Something went wrong!");
			}
		});
};

const handleChangePassword = handleSubmit(async (values) => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("signin");

	values["g_recaptcha_response"] = token;
	values["username"] = username.value;
	delete values["retype_password"];

	userStore
		.forgetPassword(values)
		.then(() => {
			loading.value = false;
			toast.success("Password successfully reset!");
			router.push({ name: "signin" });
		})
		.catch((e) => {
			loading.value = false;
			error_msg.value = "";
			var err_msg = "";
			if (e.response.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				error_msg.value = err_msg;
			} else {
				toast.error("Something went wrong!");
			}
		});
});

onMounted(() => {
	if (route.query) {
		username.value = route.query.username;
		mode.value = route.query.mode;
	}
	if (!username.value || !mode.value) {
		router.push({ name: "signin" });
	}
});

useHead({ title: "Reset password" });
</script>
