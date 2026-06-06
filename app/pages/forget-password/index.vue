<template>
	<div class="min-h-screen bg-white lg:bg-gray-50 flex items-stretch">
		<!-- ── Left panel (hidden on mobile) ── -->
		<div class="hidden lg:block lg:w-1/2 p-5">
			<div class="relative w-full h-full rounded-2xl overflow-hidden">
				<img
					src="/images/forget-password.png"
					alt="Alliance"
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
						Forgot password?
					</h1>
					<p class="text-gray-500 text-sm mt-1">
						Enter your email and we'll send you a verification code to reset
						your password.
					</p>
				</div>

				<!-- Form -->
				<form @submit.prevent="handleSignin" class="flex flex-col gap-4">
					<!-- Email / Phone -->
					<div>
						<label class="block text-sm font-medium text-gray-500 mb-1.5"
							>* Email
						</label>
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
						{{ loading ? "Sending..." : "Send Code" }}
					</button>
				</form>

				<!-- Divider -->
				<div class="flex items-center gap-3 my-6">
					<div class="flex-1 h-px bg-gray-200" />
					<span class="text-gray-400 text-xs">or</span>
					<div class="flex-1 h-px bg-gray-200" />
				</div>

				<!-- Sign in -->
				<p class="text-center text-sm text-gray-500">
					Remember your password?
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
import { useReCaptcha } from "vue-recaptcha-v3";

const userStore = useUserStore();
const router = useRouter();
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

const validationSchema = yup.object().shape({
	username: yup.string().required("Email is required"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	username: useField("username", validationSchema),
};

const handleSignin = handleSubmit(async () => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("forgetpassword");

	userStore
		.sendVerificationCode({
			username: formData.username.value.value,
			g_recaptcha_response: token,
		})
		.then(() => {
			loading.value = false;
			router.push({
				name: "forget-password-reset",
				query: {
					username: formData.username.value.value,
					mode: "forget-password",
				},
			});
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
				error_msg.value = "Something went wrong!";
			}
		});
});

useHead({ title: "Forgot password" });
</script>
