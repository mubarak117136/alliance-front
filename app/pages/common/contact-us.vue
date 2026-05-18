<template>
	<div class="w-full">
		<!-- Hero -->
		<div
			class="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-b border-gray-100 text-center -mt-[128px] sm:-mt-[88px] lg:-mt-[172px] pt-[156px] sm:pt-[116px] lg:pt-[200px] pb-12 px-4"
		>
			<h1
				class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3"
			>
				Let's Talk
			</h1>
			<p class="text-sm sm:text-base text-gray-400 max-w-sm mx-auto mb-6">
				Please leave us a message. Our team will contact you as soon as
				possible.
			</p>

			<!-- Social + Phone pills -->
			<div class="flex flex-wrap items-center justify-center gap-3">
				<!-- Social links -->
				<div
					v-if="hasSocials"
					class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-200 bg-white shadow-sm"
				>
					<a
						v-if="getSocialSettings?.facebook"
						:href="getSocialSettings.facebook"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-primary transition-colors"
						aria-label="Facebook"
					>
						<Icon name="mdi:facebook" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.whatsapp"
						:href="getSocialSettings.whatsapp"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-green-500 transition-colors"
						aria-label="WhatsApp"
					>
						<Icon name="mdi:whatsapp" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.instagram"
						:href="getSocialSettings.instagram"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-pink-500 transition-colors"
						aria-label="Instagram"
					>
						<Icon name="mdi:instagram" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.x"
						:href="getSocialSettings.x"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-gray-900 transition-colors"
						aria-label="X"
					>
						<Icon name="mdi:twitter" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.youtube"
						:href="getSocialSettings.youtube"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-red-500 transition-colors"
						aria-label="YouTube"
					>
						<Icon name="mdi:youtube" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.linkedin"
						:href="getSocialSettings.linkedin"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-blue-600 transition-colors"
						aria-label="LinkedIn"
					>
						<Icon name="mdi:linkedin" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.discord"
						:href="getSocialSettings.discord"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
						aria-label="Discord"
					>
						<Icon name="mdi:discord" size="18" />
					</a>
					<a
						v-if="getSocialSettings?.tiktok"
						:href="getSocialSettings.tiktok"
						target="_blank"
						rel="noopener"
						class="flex items-center text-gray-400 hover:text-gray-900 transition-colors"
						aria-label="TikTok"
					>
						<Icon name="mdi:music-note" size="18" />
					</a>
				</div>

				<!-- Phone pill -->
				<a
					v-if="getBasicSettings?.phone"
					:href="'tel:' + getBasicSettings.phone"
					class="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
				>
					<Icon name="mdi:phone" size="16" class="text-primary" />
					{{ getBasicSettings.phone }}
				</a>
			</div>
		</div>

		<!-- Form card -->
		<div class="w-full max-w-lg mx-auto px-4 sm:px-6 py-10">
			<!-- Success state -->
			<div
				v-if="messageSent"
				class="flex flex-col items-center justify-center py-16 text-center"
			>
				<div
					class="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4"
				>
					<Icon
						name="mdi:check-circle-outline"
						size="32"
						class="text-green-500"
					/>
				</div>
				<p class="text-gray-800 font-bold text-lg mb-1">Message Received!</p>
				<p class="text-gray-400 text-sm">
					Thank you for reaching out. We'll get back to you soon.
				</p>
			</div>

			<!-- Form -->
			<form
				v-else
				class="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
				@submit.prevent="handleFormSubmit"
			>
				<!-- Name -->
				<div class="flex flex-col gap-1.5">
					<label
						class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
						>Name *</label
					>
					<input
						v-model="formData.full_name.value.value"
						type="text"
						placeholder="Enter your name"
						class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-gray-50 focus:bg-white"
						:class="
							formData.full_name.errorMessage.value
								? 'border-red-300 focus:border-red-400'
								: 'border-gray-200 focus:border-primary'
						"
					/>
					<p
						v-if="formData.full_name.errorMessage.value"
						class="text-xs text-red-500"
					>
						{{ formData.full_name.errorMessage.value }}
					</p>
				</div>

				<!-- Email + Phone -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
							>Email *</label
						>
						<input
							v-model="formData.email.value.value"
							type="email"
							placeholder="Enter your email"
							class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-gray-50 focus:bg-white"
							:class="
								formData.email.errorMessage.value
									? 'border-red-300 focus:border-red-400'
									: 'border-gray-200 focus:border-primary'
							"
						/>
						<p
							v-if="formData.email.errorMessage.value"
							class="text-xs text-red-500"
						>
							{{ formData.email.errorMessage.value }}
						</p>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
							>Phone *</label
						>
						<input
							v-model="formData.phone.value.value"
							type="tel"
							placeholder="Enter your phone"
							class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-gray-50 focus:bg-white"
							:class="
								formData.phone.errorMessage.value
									? 'border-red-300 focus:border-red-400'
									: 'border-gray-200 focus:border-primary'
							"
						/>
						<p
							v-if="formData.phone.errorMessage.value"
							class="text-xs text-red-500"
						>
							{{ formData.phone.errorMessage.value }}
						</p>
					</div>
				</div>

				<!-- Message -->
				<div class="flex flex-col gap-1.5">
					<label
						class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
						>Message *</label
					>
					<textarea
						v-model="formData.message.value.value"
						placeholder="Write your message..."
						rows="4"
						class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
						:class="
							formData.message.errorMessage.value
								? 'border-red-300 focus:border-red-400'
								: 'border-gray-200 focus:border-primary'
						"
					/>
					<p
						v-if="formData.message.errorMessage.value"
						class="text-xs text-red-500"
					>
						{{ formData.message.errorMessage.value }}
					</p>
				</div>

				<!-- Error alert -->
				<div
					v-if="error_msg"
					class="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
				>
					<Icon
						name="mdi:alert-circle-outline"
						size="16"
						class="shrink-0 mt-0.5"
					/>
					{{ error_msg }}
				</div>

				<!-- Submit -->
				<button
					type="submit"
					:disabled="loading"
					class="w-full py-3 rounded-[10px] bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="16"
						class="animate-spin"
					/>
					{{ loading ? "Sending..." : "Submit Now" }}
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useUtilityStore } from "@/stores/utility";
import { useToast } from "vue-toastification";
import { useReCaptcha } from "vue-recaptcha-v3";

const utilityStore = useUtilityStore();
const requestURL = useRequestURL();
const toast = useToast();
const recaptcha = useReCaptcha();

const { getBasicSettings, getSocialSettings } = storeToRefs(utilityStore);

const loading = ref(false);
const error_msg = ref("");
const messageSent = ref(false);

const hasSocials = computed(
	() =>
		getSocialSettings.value &&
		Object.values(getSocialSettings.value).some(Boolean),
);

const validationSchema = yup.object().shape({
	full_name: yup.string().required("Name is required!"),
	email: yup.string().email().required("Email is required!"),
	phone: yup.string().required("Phone is required!"),
	message: yup.string().required("Message is required!"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	full_name: useField("full_name", validationSchema),
	email: useField("email", validationSchema),
	phone: useField("phone", validationSchema),
	message: useField("message", validationSchema),
};

const handleFormSubmit = handleSubmit(async (values) => {
	loading.value = true;
	error_msg.value = "";

	await recaptcha?.recaptchaLoaded();
	const token = await recaptcha?.executeRecaptcha("contact_form");
	values["g_recaptcha_response"] = token;

	utilityStore
		.addContactUs(values)
		.then(() => {
			loading.value = false;
			messageSent.value = true;
			toast.success("We received your message! Thank you for contacting!");
		})
		.catch((e) => {
			loading.value = false;
			if (e.response?.status === 400) {
				error_msg.value = Object.values(e.response._data).join(" ");
			} else {
				error_msg.value = "Something went wrong. Please try again.";
			}
		});
});

// ── SEO ─────────────────────────────────────────────────────────────────────

const config = useRuntimeConfig();
const HOST = computed(() => config.public.HOST);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");
const siteName = computed(() => getBasicSettings.value?.company_name ?? "");

const getTitle = computed(() => `Contact Us | ${siteName.value}`);
const getDescription = computed(
	() =>
		`Get in touch with ${siteName.value}. Reach us via phone, email or our contact form. We're here to help with your healthcare needs.`,
);
const ogImage = computed(() => {
	const src = getBasicSettings.value?.logo?.original?.src;
	return src ? `${HOST.value}${src}` : "";
});

const sameAs = computed(() =>
	[
		getSocialSettings.value?.facebook,
		getSocialSettings.value?.instagram,
		getSocialSettings.value?.x,
		getSocialSettings.value?.youtube,
		getSocialSettings.value?.linkedin,
	].filter(Boolean),
);

const jsonLD = computed(() => {
	const b = getBasicSettings.value;
	const base = siteUrl.value;

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": `${pageUrl.value}/#webpage`,
					url: pageUrl.value,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					isPartOf: { "@id": `${base}/#website` },
					publisher: { "@id": `${base}/#organization` },
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: base },
							{ "@type": "ListItem", position: 2, name: "Contact Us", item: pageUrl.value },
						],
					},
				},
				{
					"@type": "ContactPage",
					"@id": `${pageUrl.value}/#contactpage`,
					url: pageUrl.value,
					name: `Contact ${siteName.value}`,
					description: getDescription.value,
					isPartOf: { "@id": `${base}/#website` },
				},
				{
					"@type": "LocalBusiness",
					"@id": `${base}/#organization`,
					name: b?.company_name,
					telephone: b?.phone,
					email: b?.email,
					address: {
						"@type": "PostalAddress",
						streetAddress: b?.address,
						addressLocality: b?.city,
						postalCode: b?.post_code,
						addressCountry: b?.country?.alpha2 ?? "BD",
					},
					...(ogImage.value && { image: ogImage.value }),
					sameAs: sameAs.value,
				},
			],
		}),
	};
});

useHead({
	title: getTitle,
	meta: [
		{ name: "robots", content: "index, follow" },
		{ name: "description", content: getDescription },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: siteName },
		{ property: "og:title", content: getTitle },
		{ property: "og:description", content: getDescription },
		{ property: "og:image", content: ogImage },
		{ property: "og:url", content: pageUrl },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: getTitle },
		{ name: "twitter:description", content: getDescription },
		{ name: "twitter:image", content: ogImage },
	],
	link: [{ rel: "canonical", href: pageUrl }],
	script: [jsonLD],
});
</script>
