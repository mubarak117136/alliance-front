export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: {
		enabled: false,
	},

	runtimeConfig: {
		public: {
			HOST: process.env.VUE_APP_DEVHOST || "http://localhost:8000",
			baseURL: process.env.VUE_APP_DEVHOST || "http://localhost:8000",
			tokenName: process.env.VUE_APP_TOKEN_NAME || "WELLMED_TOKEN",
			sessionName: process.env.VUE_APP_SESSION_ID || "WELLMED_TOKEN",
			siteName: process.env.VUE_APP_SITE_NAME || "WELLMED",
			currency: process.env.VUE_APP_CURRENCY,
		},
	},

	hooks: {
		"pages:extend"(pages) {
			pages.push({
				name: "stores-category",
				path: "/stores/:category",
				file: "~/pages/stores/index.vue",
			});
		},
	},

	app: {
		head: {
			title: "Home",
			titleTemplate: "%s | Store Front",
			htmlAttrs: {
				lang: "en",
			},
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			meta: [
				{ property: "format-detection", content: "telephone=no" },
				{
					hid: "og:type",
					property: "og:type",
					content: "website",
				},

				{
					hid: "og:site_name",
					property: "og:site_name",
					content: "Guardian Store Front",
				},
			],
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: "anonymous",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@500;700;900&family=Barlow+Condensed:wght@600;700;800&display=swap",
					media: "print",
					onload: "this.media='all'",
				},
			],
			noscript: [
				{
					innerHTML:
						'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@500;700;900&family=Barlow+Condensed:wght@600;700;800&display=swap">',
				},
			],
			script: [
				{
					src: "https://www.googletagmanager.com/gtag/js?id=G-NGYE25C0GF",
					async: true,
				},
				{
					innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-NGYE25C0GF');`,
				},
			],
		},
	},

	css: ["~/assets/css/main.scss"],

	swiper: {
		modules: ["navigation", "pagination", "autoplay"],
	},

	modules: [
		"@nuxt/icon",
		"@nuxtjs/tailwindcss",
		"@pinia/nuxt",
		"@vee-validate/nuxt",
		"nuxt-swiper",
		"nuxt-marquee",
	],

	build: {
		transpile: ["vue-toastification"],
	},

	veeValidate: {
		autoImports: true,
		componentNames: {
			Form: "VeeForm",
			Field: "VeeField",
			FieldArray: "VeeFieldArray",
			ErrorMessage: "VeeErrorMessage",
		},
	},
});
