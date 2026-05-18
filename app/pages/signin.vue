<template>
	<div class="min-h-screen bg-white lg:bg-gray-50 flex items-stretch">
		<!-- ── Left panel (hidden on mobile) ── -->
		<div class="hidden lg:block lg:w-1/2 p-5">
			<div class="relative w-full h-full rounded-2xl overflow-hidden">
				<!-- Background image -->
				<img
					src="/images/sign-in.png"
					alt="Wellmed"
					class="absolute inset-0 w-full h-full object-cover"
				/>
				<!-- Subtle dark overlay at bottom -->
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
						class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"
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

		<!-- ── Right panel (form) ── -->
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

				<!-- Heading -->
				<div class="mb-8">
					<h1 class="text-gray-900 text-2xl font-bold tracking-tight">
						Sign in to Wellmed
					</h1>
					<p class="text-gray-500 text-sm mt-1">
						Enter your credentials to access your account
					</p>
				</div>

				<!-- Form -->
				<form @submit.prevent="handleSignin" class="flex flex-col gap-4">
					<!-- Email / Phone -->
					<div>
						<label class="block text-sm font-medium text-gray-500 mb-1.5"
							>* Email</label
						>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
							>
								<Icon
									name="mdi:account-outline"
									class="text-gray-400"
									size="17"
								/>
							</div>
							<input
								v-model="formData.username.value.value"
								type="text"
								placeholder="Enter Your Email"
								class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none"
								:class="
									formData.username.errorMessage.value
										? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
										: 'border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
								"
							/>
						</div>
						<p
							v-if="formData.username.errorMessage.value"
							class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
						>
							<Icon name="mdi:alert-circle-outline" size="13" />{{
								formData.username.errorMessage.value
							}}
						</p>
					</div>

					<!-- Password -->
					<div>
						<div class="mb-1.5">
							<label class="text-sm font-medium text-gray-500"
								>* Password</label
							>
						</div>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
							>
								<Icon name="mdi:lock-outline" class="text-gray-400" size="17" />
							</div>
							<input
								v-model="formData.password.value.value"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Enter your password"
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
						<div class="flex justify-end mt-1.5">
							<NuxtLink
								to="/forget-password"
								class="text-xs text-primary hover:text-accent font-semibold transition-colors"
							>
								Forgot password?
							</NuxtLink>
						</div>
					</div>

					<!-- API error -->
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
						{{ loading ? "Signing in..." : "Sign In" }}
					</button>
				</form>

				<!-- Divider -->
				<div class="flex items-center gap-3 my-6">
					<div class="flex-1 h-px bg-gray-200" />
					<span class="text-gray-400 text-xs">or</span>
					<div class="flex-1 h-px bg-gray-200" />
				</div>

				<!-- Sign up -->
				<p class="text-center text-sm text-gray-500">
					Don't have an account?
					<NuxtLink
						to="/signup"
						class="text-primary hover:text-accent font-semibold transition-colors ml-1"
					>
						Create one free
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

				<!-- Trust badges -->
				<div
					class="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-gray-100"
				>
					<div
						v-for="badge in badges"
						:key="badge.text"
						class="flex flex-col items-center gap-1"
					>
						<Icon :name="badge.icon" class="text-primary/60" size="18" />
						<span
							class="text-[10px] text-gray-400 font-medium text-center leading-tight"
							>{{ badge.text }}</span
						>
					</div>
				</div>
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
import { useReCaptcha } from "vue-recaptcha-v3";

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const recaptcha = useReCaptcha();

const config = useRuntimeConfig();
const utilityStore = useUtilityStore();

const { getBasicSettings } = storeToRefs(utilityStore);

const logoUrl = computed(() => {
	const src = getBasicSettings.value?.logo?.original?.src;
	return src ? `${config.public.HOST}${src}` : null;
});

const validationSchema = yup.object().shape({
	username: yup.string().required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	username: useField("username", validationSchema),
	password: useField("password", validationSchema),
};

const showPassword = ref(false);
const loading = ref(false);
const error_msg = ref("");

const badges = [
	{ icon: "mdi:lock-outline", text: "Secure Login" },
	{ icon: "mdi:shield-check-outline", text: "100% Authentic" },
	{ icon: "mdi:truck-fast-outline", text: "Fast Delivery" },
];

const handleSignin = handleSubmit(async (values) => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("signin");
	const token1 = await recaptcha?.executeRecaptcha("verification");

	values["g_recaptcha_response"] = token;

	userStore
		.signin(values)
		.then((data) => {
			loading.value = false;
			if (data.is_verified == false) {
				loading.value = true;
				userStore
					.sendVerificationCode({
						username: formData.username.value.value,
						user_checking: true,
						g_recaptcha_response: token1,
					})
					.then(() => {
						loading.value = false;
						toast.success("Verification code sent successfully!");
						router.push({
							name: "validate-otp",
							query: {
								username: data?.username,
								mode: "verification",
								from: "username_change",
							},
						});
					})
					.catch((e1) => {
						loading.value = false;
						error_msg.value = "";
						var err_msg = "";
						if (e1.response.status === 400) {
							for (const [, value] of Object.entries(e1.response._data)) {
								err_msg += `${value}`;
							}
							error_msg.value = err_msg;
						} else {
							error_msg.value = "Something went wrong!";
						}
					});
			} else {
				router.push({ name: "index" });
			}
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
				error_msg.value = "Something went wrong!";
			}
		});
});

useHead({ title: "Sign in" });
</script>
