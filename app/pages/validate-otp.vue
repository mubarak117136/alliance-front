<template>
	<div class="min-h-screen bg-white lg:bg-gray-50 flex items-stretch">
		<!-- ── Left panel (hidden on mobile) ── -->
		<div class="hidden lg:block lg:w-1/2 p-5">
			<div class="relative w-full h-full rounded-2xl overflow-hidden">
				<img
					src="/images/otp.png"
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

				<!-- Icon + Heading -->
				<div class="mb-8">
					<h1 class="text-gray-900 text-2xl font-bold tracking-tight">
						Verify your account
					</h1>
					<p class="text-gray-500 text-sm mt-1">
						We sent a verification code to
					</p>
					<p class="text-primary font-semibold text-sm mt-0.5 truncate">
						{{ formData.username.value.value || "—" }}
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
							hasError
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

				<!-- API error -->
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

				<!-- Verify button -->
				<button
					type="button"
					:disabled="loading || otpCode.length < 6"
					class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
					@click="handleFormSubmit"
				>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="17"
						class="animate-spin"
					/>
					{{ loading ? "Verifying..." : "Verify" }}
				</button>

				<!-- Resend -->
				<p class="text-center text-sm text-gray-500 mt-4">
					Didn't receive the code?
					<button
						type="button"
						class="text-primary hover:text-accent font-semibold transition-colors ml-1 disabled:opacity-50"
						:disabled="loading"
						@click="handleCodeResend"
					>
						Resend
					</button>
				</p>

				<!-- Divider -->
				<div class="flex items-center gap-3 my-6">
					<div class="flex-1 h-px bg-gray-200" />
					<span class="text-gray-400 text-xs">or</span>
					<div class="flex-1 h-px bg-gray-200" />
				</div>

				<!-- Back to sign in -->
				<p class="text-center text-sm text-gray-500">
					Already have an account?
					<NuxtLink
						to="/signin"
						class="text-primary hover:text-accent font-semibold transition-colors ml-1"
					>
						Sign in
					</NuxtLink>
				</p>

				<!-- Continue shopping -->
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
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useReCaptcha } from "vue-recaptcha-v3";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const recaptcha = useReCaptcha();

const config = useRuntimeConfig();
const utilityStore = useUtilityStore();
const { getBasicSettings } = storeToRefs(utilityStore);
const logoUrl = computed(() => {
	const src = getBasicSettings.value?.logo?.original?.src;
	return src ? `${config.public.HOST}${src}` : null;
});

const { getSignUpData } = storeToRefs(userStore);

const error_msg = ref("");
const loading = ref(false);
const mode = ref("");
const from = ref("");

const validationSchema = yup.object().shape({
	username: yup.string().required(),
	code: yup.string().required("Verification code required"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	username: useField("username", validationSchema),
	code: useField("code", validationSchema),
};

// OTP input state
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const hasError = ref(false);

const otpCode = computed(() => otpDigits.value.join(""));

watch(otpCode, (val) => {
	formData.code.value.value = val;
	if (val.length === 6) hasError.value = false;
});

function onOtpInput(i, e) {
	const val = e.target.value.replace(/\D/g, "").slice(-1);
	otpDigits.value[i] = val;
	if (val && i < 5) {
		nextTick(() => otpRefs.value[i + 1]?.focus());
	}
}

function onOtpKeydown(i, e) {
	if (e.key === "Backspace" && !otpDigits.value[i] && i > 0) {
		nextTick(() => otpRefs.value[i - 1]?.focus());
	}
}

function onOtpPaste(e) {
	const text = (e.clipboardData || window.clipboardData)
		.getData("text")
		.replace(/\D/g, "")
		.slice(0, 6);
	for (let i = 0; i < 6; i++) {
		otpDigits.value[i] = text[i] ?? "";
	}
	nextTick(() => otpRefs.value[Math.min(text.length, 5)]?.focus());
}

const handleFormSubmit = handleSubmit(async (values) => {
	if (otpCode.value.length < 6) {
		hasError.value = true;
		error_msg.value = "Please enter the complete 6-digit code";
		return;
	}

	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("validateotp");
	const token1 = await recaptcha?.executeRecaptcha("signup");

	values["g_recaptcha_response"] = token;

	if (getSignUpData.value != null) {
		values["user"] = getSignUpData.value;
		values["user"]["g_recaptcha_response"] = token1;
	}
	if (from.value === "username_change") {
		delete values["user"];
	}

	userStore
		.verificationConfirm(values)
		.then(() => {
			loading.value = false;
			toast.success("Successfully verified!");
			userStore.removeSignupDataFromLocalStorage().catch(() => {});
			router.push("/");
		})
		.catch((e) => {
			loading.value = false;
			hasError.value = true;
			error_msg.value = "";
			var err_msg = "";
			if (e.response.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) {
					err_msg += `${value}`;
				}
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
});

const handleCodeResend = async () => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("coderesend");

	userStore
		.sendVerificationCode({
			username: formData.username.value.value,
			user_checking: false,
			g_recaptcha_response: token,
		})
		.then(() => {
			loading.value = false;
			toast.success("Verification code sent successfully!");
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
};

onMounted(() => {
	userStore.getSignUpDataFromLocalStorage();

	if (route.query) {
		formData.username.value.value = route.query.username;
		mode.value = route.query.mode;
		from.value = route.query.from;
	}
	if (!formData.username.value.value || !mode.value) {
		router.push({ name: "signin" });
	}
});

useHead({ title: "Verification" });
</script>
