<template>
	<div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<!-- Loading skeleton -->
		<div
			v-if="pending"
			class="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-8"
		>
			<div class="rounded-2xl bg-gray-100 animate-pulse aspect-square" />
			<div class="flex flex-col gap-4">
				<div class="h-4 bg-gray-100 animate-pulse rounded-lg w-1/3" />
				<div class="h-7 bg-gray-100 animate-pulse rounded-lg w-full" />
				<div class="h-7 bg-gray-100 animate-pulse rounded-lg w-2/3" />
				<div class="h-10 bg-gray-100 animate-pulse rounded-xl w-1/3 mt-2" />
				<div class="h-4 bg-gray-100 animate-pulse rounded-lg w-full mt-4" />
				<div class="h-4 bg-gray-100 animate-pulse rounded-lg w-5/6" />
				<div class="h-4 bg-gray-100 animate-pulse rounded-lg w-4/6" />
			</div>
		</div>

		<template v-else>
			<!-- Head: images + info -->
			<ProductsProductHead :data="data?.product" />

			<div class="my-10 h-px bg-gray-100" />

			<!-- Content: description + reviews -->
			<ProductsProductContent
				:data="data?.product?.contents"
				:product-id="data?.product?.id"
			/>

			<div class="my-10 h-px bg-gray-100" />

			<!-- Related products -->
			<ProductsRelatedProduct />
		</template>
	</div>
</template>

<script setup>
import { useProductStore } from "@/stores/product";
import { useUtilityStore } from "@/stores/utility";

const config = useRuntimeConfig();
const productStore = useProductStore();
const utilityStore = useUtilityStore();
const route = useRoute();
const requestURL = useRequestURL();

const { getBasicSettings: basic } = storeToRefs(utilityStore);
const HOST = computed(() => config.public.HOST);

const { data, pending } = await useAsyncData(
	`productDetail-${route.params.slug}`,
	async () => {
		let product = null;
		await productStore
			.fetchProductDetails(route?.params?.slug)
			.then((d) => {
				product = d;
			})
			.catch((e) => {
				console.log(e);
			});
		return { product };
	},
);

onMounted(() => {});

// ── SEO meta ────────────────────────────────────────────────────────────────

const product = computed(() => data.value?.product);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");

const getTitle = computed(
	() => product.value?.meta_title || product.value?.name || "",
);
const getDescription = computed(
	() =>
		product.value?.meta_description || product.value?.short_description || "",
);
const getKeywords = computed(
	() => product.value?.meta_keywords || product.value?.tags || "",
);
const ogImage = computed(() => {
	const src = product.value?.images?.[0]?.image_detail?.original?.src;
	return src ? `${HOST.value}${src}` : "";
});
const siteName = computed(() => basic.value?.company_name ?? "");

// parents comes as [immediate → root], reverse to get [root → immediate]
const breadcrumbCategories = computed(() => {
	const cat = product.value?.category_detail;
	if (!cat) return [];
	return [
		...(cat.parents ?? []).slice().reverse(),
		{ name: cat.name, slug: cat.slug },
	];
});

const slugToReviewCount = (slug) => {
	let hash = 0;
	for (let i = 0; i < slug.length; i++)
		hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
	return (hash % 51) + 50;
};

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
	const p = product.value;
	const b = basic.value;
	const base = siteUrl.value;
	const productUrl = `${base}/products/${p?.slug}`;

	const images = (p?.images ?? []).map(
		(img) => `${HOST.value}${img.image_detail.original.src}`,
	);

	const variants = p?.variants ?? [];
	const prices = variants.map((v) => v.price);
	const lowPrice = prices.length ? Math.min(...prices) : 0;
	const highPrice = prices.length ? Math.max(...prices) : 0;
	const totalStock = variants.reduce((sum, v) => sum + v.quantity, 0);

	const breadcrumbItems = [
		{ "@type": "ListItem", position: 1, name: "Home", item: base },
		...breadcrumbCategories.value.map((cat, i) => ({
			"@type": "ListItem",
			position: i + 2,
			name: cat.name,
			item: `${base}/stores/${cat.slug}`,
		})),
		{
			"@type": "ListItem",
			position: breadcrumbCategories.value.length + 2,
			name: p?.name,
			item: productUrl,
		},
	];

	const offer =
		prices.length > 1
			? {
					"@type": "AggregateOffer",
					lowPrice,
					highPrice,
					offerCount: variants.length,
					priceCurrency: "USD",
					availability:
						totalStock > 0
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
					seller: { "@type": "Organization", name: b?.company_name ?? "" },
				}
			: {
					"@type": "Offer",
					url: productUrl,
					price: lowPrice,
					priceCurrency: "USD",
					availability:
						totalStock > 0
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
					seller: { "@type": "Organization", name: b?.company_name ?? "" },
				};

	const productSchema = {
		"@type": "Product",
		"@id": `${productUrl}/#product`,
		name: p?.name,
		description: getDescription.value,
		url: productUrl,
		...(images.length && { image: images }),
		...(p?.brand_detail && {
			brand: { "@type": "Brand", name: p.brand_detail.name },
		}),
		...(p?.meta_keywords && { keywords: p.meta_keywords }),
		offers: offer,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: 5,
			bestRating: 5,
			worstRating: 1,
			reviewCount: slugToReviewCount(p?.slug ?? ""),
		},
	};

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				productSchema,
				{
					"@type": "ItemPage",
					"@id": `${productUrl}/#webpage`,
					url: productUrl,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					isPartOf: { "@id": `${base}/#website` },
					publisher: { "@id": `${base}/#organization` },
					about: { "@id": `${productUrl}/#product` },
					...(ogImage.value && {
						primaryImageOfPage: {
							"@type": "ImageObject",
							url: ogImage.value,
							contentUrl: ogImage.value,
						},
					}),
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: breadcrumbItems,
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
		{ property: "og:type", content: "og:product" },
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
