<template>
	<div class="w-full">
		<!-- Hero -->
		<div
			class="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-b border-gray-100 py-14 px-4 text-center -mt-[128px] sm:-mt-[88px] lg:-mt-[172px] pt-[156px] sm:pt-[116px] lg:pt-[200px]"
		>
			<div
				v-if="pending"
				class="h-9 w-64 mx-auto bg-gray-200 animate-pulse rounded-xl"
			/>
			<h1
				v-else
				class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight"
			>
				{{ data?.currentPage?.title }}
			</h1>
		</div>

		<!-- Body blocks -->
		<div class="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
			<!-- Loading skeleton -->
			<div v-if="pending" class="flex flex-col gap-4">
				<div class="h-5 bg-gray-100 animate-pulse rounded-lg w-full" />
				<div class="h-5 bg-gray-100 animate-pulse rounded-lg w-5/6" />
				<div class="h-5 bg-gray-100 animate-pulse rounded-lg w-4/6" />
				<div class="h-5 bg-gray-100 animate-pulse rounded-lg w-full" />
				<div class="h-5 bg-gray-100 animate-pulse rounded-lg w-3/4" />
			</div>

			<template v-else>
				<div
					v-for="(item, idx) in data?.currentPage?.body"
					:key="'block_' + idx"
					class="mb-6"
				>
					<IndexBanner v-if="item?.type === 'banner_block'" :block="item" />
					<IndexRichtext
						v-else-if="item?.type === 'description_block'"
						:data="item?.value"
					/>
				</div>

				<!-- Empty state -->
				<div
					v-if="!data?.currentPage?.body?.length"
					class="flex flex-col items-center justify-center py-20 text-center"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"
					>
						<Icon
							name="mdi:file-document-outline"
							size="28"
							class="text-gray-300"
						/>
					</div>
					<p class="text-gray-500 font-semibold">No content available</p>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import { useHomeStore } from "@/stores/home";

const config = useRuntimeConfig();
const homeStore = useHomeStore();
const utilityStore = useUtilityStore();
const route = useRoute();
const requestURL = useRequestURL();

const HOST = computed(() => config.public.HOST);
const { getBasicSettings: basic } = storeToRefs(utilityStore);

const { data, pending } = await useAsyncData(
	`commonPage-${route.path}`,
	async () => {
		let currentPage = null;
		await homeStore
			.fetchCurrentPage({ html_path: route?.path })
			.then((d) => { currentPage = d; })
			.catch((e) => { console.log(e); });
		return { currentPage };
	},
);

// ── SEO ─────────────────────────────────────────────────────────────────────

const page = computed(() => data.value?.currentPage);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");

const getTitle = computed(
	() => page.value?.meta?.seo_title || page.value?.title || "",
);
const getDescription = computed(
	() => page.value?.meta?.search_description || "",
);
const getKeywords = computed(() => page.value?.og_keywords || "");
const siteName = computed(() => basic.value?.company_name ?? "");
const ogImage = computed(() => {
	const src = page.value?.og_img_original?.original?.src;
	if (src) return `${HOST.value}${src}`;
	const logo = basic.value?.logo?.original?.src;
	return logo ? `${HOST.value}${logo}` : "";
});

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
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
					...(page.value?.meta?.first_published_at && {
						datePublished: page.value.meta.first_published_at,
					}),
					...(page.value?.last_published_at && {
						dateModified: page.value.last_published_at,
					}),
					...(ogImage.value && {
						primaryImageOfPage: {
							"@type": "ImageObject",
							url: ogImage.value,
							contentUrl: ogImage.value,
						},
					}),
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: base },
							{
								"@type": "ListItem",
								position: 2,
								name: getTitle.value,
								item: pageUrl.value,
							},
						],
					},
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
		{ name: "keywords", content: getKeywords },
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
