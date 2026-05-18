<template>
	<div class="-mt-[128px] sm:-mt-[88px] lg:-mt-[172px]">
		<!-- Skeleton -->
		<div
			v-if="!data?.getCurrentPage"
			class="w-full max-w-[720px] mx-auto px-4 sm:px-6 pt-[156px] sm:pt-[116px] lg:pt-[200px] pb-16 flex flex-col gap-6 animate-pulse"
		>
			<div class="h-4 bg-gray-100 rounded-full w-24" />
			<div class="flex items-center justify-between">
				<div class="h-3 bg-gray-100 rounded-full w-32" />
				<div class="flex gap-2">
					<div
						v-for="n in 4"
						:key="n"
						class="w-7 h-7 rounded-full bg-gray-100"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<div class="h-8 bg-gray-100 rounded-xl w-full" />
				<div class="h-8 bg-gray-100 rounded-xl w-4/5" />
				<div class="h-8 bg-gray-100 rounded-xl w-3/5" />
			</div>
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-gray-100" />
				<div class="h-3 bg-gray-100 rounded-full w-32" />
			</div>
			<div class="aspect-[16/9] bg-gray-100 rounded-2xl w-full" />
			<div class="flex flex-col gap-3 mt-2">
				<div
					v-for="n in 8"
					:key="n"
					class="h-3 bg-gray-100 rounded-full"
					:style="{ width: n % 3 === 0 ? '70%' : '100%' }"
				/>
			</div>
		</div>

		<!-- Content -->
		<div v-else>
			<!-- Header band -->
			<div class="bg-white border-b border-gray-100">
				<div
					class="w-full max-w-[720px] mx-auto px-4 sm:px-6 pt-[156px] sm:pt-[116px] lg:pt-[200px] pb-8 flex flex-col gap-5"
				>
					<!-- Back + breadcrumb -->
					<NuxtLink
						to="/blogs"
						class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors w-fit"
					>
						<Icon name="mdi:arrow-left" size="14" />
						Back to Blog
					</NuxtLink>

					<!-- Meta row -->
					<div class="flex items-center justify-between gap-4 flex-wrap">
						<div class="flex items-center gap-2">
							<!-- Category pill -->
							<span
								v-if="data.getCurrentPage.fetch_parent?.title"
								class="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/5 px-2.5 py-1 rounded-full"
							>
								{{ data.getCurrentPage.fetch_parent.title }}
							</span>
							<span class="text-xs text-gray-400">
								{{
									dayjs(data.getCurrentPage.last_published_at).format(
										"DD MMM, YYYY",
									)
								}}
							</span>
						</div>
						<!-- Share -->
						<div class="flex items-center gap-1.5">
							<span class="text-xs text-gray-400 mr-1">Share:</span>
							<a
								v-for="s in shareLinks"
								:key="s.label"
								:href="s.url"
								target="_blank"
								rel="noopener noreferrer"
								:aria-label="s.label"
								class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center transition-colors text-gray-500 shrink-0"
								:class="s.hover"
							>
								<Icon :name="s.icon" size="14" />
							</a>
						</div>
					</div>

					<!-- Title -->
					<h1
						class="text-2xl sm:text-4xl font-bold text-gray-800 leading-tight tracking-tight"
					>
						{{ data.getCurrentPage.title }}
					</h1>

					<!-- Author -->
					<div class="flex items-center gap-3">
						<img
							v-if="data.getCurrentPage.author?.image?.src"
							:src="HOST + data.getCurrentPage.author.image.src"
							:alt="data.getCurrentPage.author.name"
							loading="lazy"
							width="36"
							height="36"
							class="w-9 h-9 rounded-full object-cover border border-gray-100"
						/>
						<div
							v-else
							class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
						>
							<Icon
								name="mdi:account-outline"
								size="16"
								class="text-gray-400"
							/>
						</div>
						<div>
							<div class="flex items-center gap-1">
								<span class="text-sm font-medium text-gray-700">{{
									data.getCurrentPage.author?.name
								}}</span>
								<Icon
									name="mdi:shield-check"
									size="14"
									class="text-green-500"
								/>
							</div>
							<span class="text-xs text-gray-400">Author</span>
						</div>
					</div>

					<!-- Thumbnail -->
					<div
						v-if="data.getCurrentPage.thumbnail?.original?.src"
						class="rounded-2xl overflow-hidden"
					>
						<img
							:src="HOST + data.getCurrentPage.thumbnail.original.src"
							:alt="data.getCurrentPage.thumbnail.original.alt"
							loading="eager"
							fetchpriority="high"
							width="720"
							height="405"
							class="w-full object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Body content -->
			<div
				class="w-full max-w-[720px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-3"
			>
				<div
					v-for="(comp, idx) in data.getCurrentPage.body"
					:key="'comp_' + idx"
				>
					<IndexRichtext
						v-if="comp.type === 'description_block'"
						:data="comp.value"
					/>
					<IndexBanner
						v-else-if="comp.type === 'banner_block'"
						:data="comp.value"
					/>
					<IndexCustomTableBlock
						v-else-if="comp.type === 'custom_table_block'"
						:data="comp.value"
					/>
					<IndexVideoBlock
						v-else-if="comp.type === 'video_block'"
						:data="comp.value"
						:index="idx"
					/>
				</div>
			</div>

			<!-- Tags -->
			<div
				v-if="tags?.length"
				class="w-full max-w-[720px] mx-auto px-4 sm:px-6 pb-16"
			>
				<div class="h-px bg-gray-100 mb-6" />
				<div class="flex flex-col gap-3">
					<div
						class="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide"
					>
						<Icon name="mdi:tag-outline" size="13" />
						Tags
					</div>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="(tag, idx) in tags"
							:key="'tag_' + idx"
							class="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
						>
							{{ tag }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useHomeStore } from "@/stores/home";
import { useUtilityStore } from "@/stores/utility";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const homeStore = useHomeStore();
const utilityStore = useUtilityStore();
const route = useRoute();
const dayjs = useDayjs();
const requestURL = useRequestURL();

const { getBasicSettings: basic } = storeToRefs(utilityStore);
const HOST = computed(() => config.public.HOST);

const shareLinks = computed(() => {
	const url = encodeURIComponent(requestURL?.href ?? "");
	const title = encodeURIComponent(data?.value?.getCurrentPage?.title ?? "");
	return [
		{
			label: "Facebook",
			icon: "mdi:facebook",
			url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
			hover: "hover:bg-blue-50 hover:text-blue-600",
		},
		{
			label: "WhatsApp",
			icon: "mdi:whatsapp",
			url: `https://api.whatsapp.com/send?text=${title}%20${url}`,
			hover: "hover:bg-green-50 hover:text-green-600",
		},
		{
			label: "Twitter",
			icon: "mdi:twitter",
			url: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
			hover: "hover:bg-sky-50 hover:text-sky-500",
		},
		{
			label: "Telegram",
			icon: "mdi:telegram",
			url: `https://t.me/share/url?url=${url}&text=${title}`,
			hover: "hover:bg-sky-50 hover:text-sky-600",
		},
	];
});

const tags = computed(() => {
	const raw = data?.value?.getCurrentPage?.tags;
	if (!raw) return [];
	return raw
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
});

const { data } = await useAsyncData(`blog-${route.params.slug}`, async () => {
	let getCurrentPage = null;
	await nuxtApp.runWithContext(async () => {
		await homeStore
			.fetchCurrentPage({ html_path: route.path })
			.then((d) => {
				getCurrentPage = d;
			})
			.catch(() => {});
	});
	return { getCurrentPage };
});

// ── SEO ─────────────────────────────────────────────────────────────────────

const page = computed(() => data.value?.getCurrentPage);
const siteUrl = computed(() => requestURL?.origin ?? "");
const pageUrl = computed(() => requestURL?.href?.replace(/\/+$/, "") ?? "");
const siteName = computed(() => basic.value?.company_name ?? "");

const getTitle = computed(
	() => page.value?.meta?.seo_title || page.value?.title || "",
);
const getDescription = computed(
	() =>
		page.value?.meta?.search_description || page.value?.short_description || "",
);
const getKeywords = computed(
	() => page.value?.og_keywords || page.value?.tags || "",
);
const ogImage = computed(() => {
	const ogSrc = page.value?.og_img_original?.original?.src;
	if (ogSrc) return `${HOST.value}${ogSrc}`;
	const thumbSrc = page.value?.thumbnail?.original?.src;
	if (thumbSrc) return `${HOST.value}${thumbSrc}`;
	const logo = basic.value?.logo?.original?.src;
	return logo ? `${HOST.value}${logo}` : "";
});

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLD = computed(() => {
	const p = page.value;
	const b = basic.value;
	const base = siteUrl.value;
	const logoUrl = b?.logo?.original?.src
		? `${HOST.value}${b.logo.original.src}`
		: "";

	const categoryName = p?.fetch_parent?.title ?? "";
	const categoryId = p?.fetch_parent?.id ?? null;

	const breadcrumbItems = [
		{ "@type": "ListItem", position: 1, name: "Home", item: base },
		{ "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blogs` },
		...(categoryName && categoryId
			? [
					{
						"@type": "ListItem",
						position: 3,
						name: categoryName,
						item: `${base}/blogs?category=${categoryId}`,
					},
					{
						"@type": "ListItem",
						position: 4,
						name: p?.title ?? "",
						item: pageUrl.value,
					},
				]
			: [
					{
						"@type": "ListItem",
						position: 3,
						name: p?.title ?? "",
						item: pageUrl.value,
					},
				]),
	];

	const thumb = p?.thumbnail?.original;
	const authorImage = p?.author?.image?.src
		? `${HOST.value}${p.author.image.src}`
		: null;

	const imageObject = ogImage.value
		? {
				"@type": "ImageObject",
				url: ogImage.value,
				contentUrl: ogImage.value,
				...(thumb && { width: thumb.width, height: thumb.height }),
				...(thumb?.alt && { caption: thumb.alt }),
			}
		: null;

	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "BlogPosting",
					"@id": `${pageUrl.value}/#article`,
					url: pageUrl.value,
					headline: p?.title,
					description: getDescription.value,
					inLanguage: "en",
					...(imageObject && { image: imageObject }),
					...(p?.meta?.first_published_at && {
						datePublished: p.meta.first_published_at,
					}),
					...(p?.last_published_at && { dateModified: p.last_published_at }),
					...(getKeywords.value && { keywords: getKeywords.value }),
					...(categoryName && { articleSection: categoryName }),
					author: p?.author?.name
						? {
								"@type": "Person",
								name: p.author.name,
								...(authorImage && {
									image: { "@type": "ImageObject", url: authorImage },
								}),
							}
						: { "@id": `${base}/#organization` },
					publisher: {
						"@type": "Organization",
						"@id": `${base}/#organization`,
						name: b?.company_name ?? "",
						...(logoUrl && { logo: { "@type": "ImageObject", url: logoUrl } }),
					},
					isPartOf: { "@id": `${pageUrl.value}/#webpage` },
					mainEntityOfPage: { "@id": `${pageUrl.value}/#webpage` },
				},
				{
					"@type": ["WebPage", "ItemPage"],
					"@id": `${pageUrl.value}/#webpage`,
					url: pageUrl.value,
					name: getTitle.value,
					description: getDescription.value,
					inLanguage: "en",
					isPartOf: { "@id": `${base}/#website` },
					publisher: { "@id": `${base}/#organization` },
					...(p?.meta?.first_published_at && {
						datePublished: p.meta.first_published_at,
					}),
					...(p?.last_published_at && { dateModified: p.last_published_at }),
					...(imageObject && { primaryImageOfPage: imageObject }),
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: breadcrumbItems,
					},
					about: { "@id": `${pageUrl.value}/#article` },
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
		{ property: "og:type", content: "article" },
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
