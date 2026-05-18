<template>
	<div class="flex flex-col gap-5 sm:gap-8">
		<template
			v-for="block in data?.currentPage?.body ?? []"
			:key="block.id ?? block.type"
		>
			<IndexHero v-if="block.type === 'home_slider_block'" :block="block" />
			<IndexCampaign
				v-else-if="block.type === 'campaign_block'"
				:block="block"
			/>
			<IndexCategory
				v-else-if="block.type === 'category_block'"
				:block="block"
			/>
			<IndexBanner v-else-if="block.type === 'banner_block'" :block="block" />
			<IndexImageTextSection
				v-else-if="block.type === 'image_text_section_block'"
				:block="block"
			/>
			<IndexFooterSeoBlock
				v-else-if="block.type === 'footer_seo_block'"
				:block="block"
			/>
		</template>
	</div>
</template>

<script setup>
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const homeStore = useHomeStore();
const utilityStore = useUtilityStore();
const requestURL = useRequestURL();

const HOST = computed(() => config.public.HOST);
const {
	getBasicSettings: basic,
	getSocialSettings: social,
	getCategories: storeCategories,
} = storeToRefs(utilityStore);

const { data } = await useAsyncData("homePageData", async () => {
	let currentPage = null;
	let faqs = [];
	await nuxtApp.runWithContext(async () => {
		await Promise.allSettled([
			homeStore
				.fetchCurrentPage({ html_path: "/" })
				.then((d) => {
					currentPage = d;
				})
				.catch(() => {}),
			utilityStore
				.fetchFaq()
				.then((d) => {
					faqs = d ?? [];
				})
				.catch(() => {}),
		]);
	});
	return { currentPage, faqs };
});

const page = computed(() => data.value?.currentPage);
const faqs = computed(() => data.value?.faqs ?? []);
const topCategories = computed(() =>
	(storeCategories.value ?? []).filter((c) => !c.parent_slug),
);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");

// ── SEO meta ────────────────────────────────────────────────────────────────

const getTitle = computed(
	() =>
		page.value?.meta?.seo_title ||
		page.value?.title ||
		basic.value?.company_name ||
		"",
);
const getDescription = computed(
	() =>
		page.value?.meta?.search_description || page.value?.short_description || "",
);
const getKeywords = computed(
	() => page.value?.og_keywords || page.value?.tags || "",
);
const getRobots = computed(
	() => page.value?.robots_directive || "index, follow",
);
const getOGImageUrl = computed(() => {
	const src = page.value?.og_img_original?.original?.src;
	return src ? `${HOST.value}${src}` : "";
});
const siteName = computed(() => basic.value?.company_name ?? "");

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
	const b = basic.value;
	const s = social.value;
	const base = siteUrl.value;
	const name = b?.company_name ?? "";
	const logoUrl = b?.logo?.original?.src
		? `${HOST.value}${b.logo.original.src}`
		: "";

	const postalAddress = {
		"@type": "PostalAddress",
		streetAddress: b?.address,
		addressLocality: b?.city,
		postalCode: b?.post_code,
		addressCountry: b?.country?.alpha2 ?? "BD",
	};

	const sameAs = [
		s?.facebook,
		s?.instagram,
		s?.x,
		s?.youtube,
		s?.linkedin,
		s?.whatsapp,
	].filter(Boolean);

	const cats = topCategories.value;
	const faqList = faqs.value;

	const categoryItemList = cats.length
		? {
				"@type": "ItemList",
				"@id": `${base}/#categories`,
				name: "Product Categories",
				itemListElement: cats.map((cat, i) => ({
					"@type": "ListItem",
					position: i + 1,
					name: cat.name,
					url: `${base}/stores/${cat.slug}`,
					...(cat.meta_description && { description: cat.meta_description }),
				})),
			}
		: null;

	const faqPage = faqList.length
		? {
				"@type": "FAQPage",
				"@id": `${base}/#faq`,
				isPartOf: { "@id": `${base}/#webpage` },
				mainEntity: faqList.map((f) => ({
					"@type": "Question",
					name: f.q,
					acceptedAnswer: { "@type": "Answer", text: f.a },
				})),
			}
		: null;

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": `${base}/#organization`,
					name,
					url: base,
					description: getDescription.value,
					...(logoUrl && {
						logo: {
							"@type": "ImageObject",
							"@id": `${base}/#logo`,
							url: logoUrl,
							contentUrl: logoUrl,
						},
					}),
					address: postalAddress,
					contactPoint: {
						"@type": "ContactPoint",
						contactType: "customer service",
						telephone: b?.phone,
						email: b?.email,
						availableLanguage: ["English", "Bengali"],
					},
					areaServed: {
						"@type": "Country",
						name: "Bangladesh",
					},
					sameAs,
				},
				{
					"@type": "WebSite",
					"@id": `${base}/#website`,
					url: base,
					name,
					description: getDescription.value,
					inLanguage: "en",
					publisher: { "@id": `${base}/#organization` },
					potentialAction: {
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate: `${base}/stores?search={search_term_string}`,
						},
						"query-input": "required name=search_term_string",
					},
				},
				{
					"@type": ["WebPage", "CollectionPage"],
					"@id": `${base}/#webpage`,
					url: pageUrl.value,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					dateModified: new Date().toISOString().split("T")[0],
					publisher: { "@id": `${base}/#organization` },
					isPartOf: { "@id": `${base}/#website` },
					about: { "@id": `${base}/#organization` },
					...(getOGImageUrl.value && {
						primaryImageOfPage: {
							"@type": "ImageObject",
							url: getOGImageUrl.value,
							contentUrl: getOGImageUrl.value,
						},
					}),
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: base },
						],
					},
				},
				{
					"@type": "Store",
					"@id": `${base}/#store`,
					name,
					description: getDescription.value,
					url: base,
					telephone: b?.phone,
					email: b?.email,
					address: postalAddress,
					...(logoUrl && { image: logoUrl }),
					areaServed: {
						"@type": "Country",
						name: "Bangladesh",
					},
					priceRange: "$$",
					currenciesAccepted: "USD",
					paymentAccepted:
						"Bkash, Nagad, Credit Card, Debit Card, Mobile Banking, Cash",
					sameAs,
				},
				categoryItemList,
				faqPage,
			].filter(Boolean),
		}),
	};
});

useHead({
	title: getTitle,
	meta: [
		{ name: "robots", content: getRobots },
		{ name: "description", content: getDescription },
		{ name: "keywords", content: getKeywords },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: siteName },
		{ property: "og:title", content: getTitle },
		{ property: "og:description", content: getDescription },
		{ property: "og:image", content: getOGImageUrl },
		{ property: "og:url", content: pageUrl },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: getTitle },
		{ name: "twitter:description", content: getDescription },
		{ name: "twitter:image", content: getOGImageUrl },
	],
	link: [{ rel: "canonical", href: pageUrl }],
	script: [jsonLD],
});
</script>
