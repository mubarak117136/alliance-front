<template></template>
<!-- <template>
	<v-row class="d-flex justify-center pa-6">
		<v-col
			cols="12"
			md="10"
			lg="8"
			xl="6"
			class="bg-surface-light"
			style="border-radius: 8px"
		>
			<div v-for="(item, idx) in data?.currentPage?.body" :key="'p_idx_' + idx">
				<LandingBanner
					v-if="item?.type == 'banner_block'"
					:data="item?.value"
				/>
				<LandingTitle v-if="item?.type == 'title_block'" :data="item?.value" />
				<LandingButton
					v-if="item?.type == 'button_block'"
					:data="item?.value"
				/>
				<LandingRichtext
					v-if="item?.type == 'richtext_block'"
					:data="item?.value"
				/>
				<LandingYoutube
					v-if="item?.type == 'video_block'"
					:data="item?.value"
				/>
			</div>
			<div id="form">
				<LandingForm :data="data?.currentPage?.product" />
			</div>
		</v-col>
	</v-row>
</template>

<script setup>
definePageMeta({
	layout: "landing-layout",
});

import { useHomeStore } from "@/stores/home";
import { useRoute } from "#vue-router";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const homeStore = useHomeStore();
const route = useRoute();
const requestURL = useRequestURL();

const HOST = computed(() => {
	return config.public.HOST;
});

const { data, error } = await useAsyncData("landingPageData", async () => {
	let currentPage = null;

	await nuxtApp.runWithContext(async () => {
		await homeStore
			.fetchCurrentPage({ html_path: `/landing/${route?.params?.slug}` })
			.then((d) => {
				currentPage = d;
			})
			.catch((e) => {
				console.log(e);
			});
	});

	return {
		currentPage,
	};
});

// const getTitle = computed(() => {
// 	return data?.value?.currentPage?.meta?.seo_title
// 		? data?.value?.currentPage?.meta?.seo_title
// 		: "Home";
// });

// const description = computed(() => {
// 	return data?.value?.currentPage?.meta?.search_description
// 		? data?.value?.currentPage?.meta?.search_description
// 		: "";
// });

// const keywords = computed(() => {
// 	return data?.value?.currentPage?.og_keywords
// 		? data?.value?.currentPage?.og_keywords
// 		: "";
// });

// const prepareOGImageUrl = computed(() => {
// 	return data?.value?.currentPage?.og_img_original
// 		? HOST.value + data?.value?.currentPage?.og_img_original?.original?.src
// 		: "";
// });

// const fullPath = computed(() => {
// 	return requestURL?.href;
// });

// const jsonLD = {
// 	"@context": "https://schema.org",
// 	"@type": "WebSite",
// 	name: "EcomyBD",
// 	headline: "Ecommerce for all",
// 	alternativeHeadline: "Ecommerce for everyone at cheap rate",
// 	keywords: keywords.value,
// 	description: description.value,
// 	url: fullPath.value,
// 	image: "",
// 	datePublished: "2022-02-01",

// 	author: {
// 		"@type": "Organization",
// 		name: "EcomyBD",
// 		url: "https://ecomybd.com",
// 		image: "",
// 	},
// 	mainEntityOfPage: {
// 		"@type": "WebPage",
// 		url: "https://ecomybd.com",
// 	},
// 	publisher: {
// 		"@type": "Organization",
// 		name: "EcomyBD",
// 		publishingPrinciples: "",
// 		email: "",
// 		foundingDate: "",
// 		legalName: "EcomyBD",
// 		logo: "",
// 		sameAs: [],
// 	},
// };

// useHead({
// 	title: getTitle?.value,
// 	meta: [
// 		{
// 			name: "description",
// 			content: description,
// 		},
// 		{
// 			name: "Keywords",
// 			content: keywords,
// 		},
// 		{
// 			hid: "og:Keywords",
// 			name: "og:Keywords",
// 			content: keywords,
// 		},
// 		{
// 			hid: "og:title",
// 			property: "og:title",
// 			content: getTitle,
// 		},
// 		{
// 			hid: "og:description",
// 			property: "og:description",
// 			content: description,
// 		},
// 		{
// 			hid: "og:image",
// 			property: "og:image",
// 			content: prepareOGImageUrl,
// 		},
// 		{
// 			hid: "og:url",
// 			property: "og:url",
// 			content: fullPath,
// 		},
// 		{
// 			hid: "twitter:title",
// 			property: "twitter:title",
// 			content: getTitle,
// 		},
// 		{
// 			hid: "twitter:description",
// 			property: "twitter:description",
// 			content: description,
// 		},
// 		{
// 			hid: "twitter:image",
// 			property: "twitter:image",
// 			content: prepareOGImageUrl,
// 		},
// 		{
// 			hid: "twitter:url",
// 			property: "twitter:url",
// 			content: fullPath,
// 		},
// 	],
// 	link: [
// 		{
// 			rel: "canonical",
// 			href: fullPath,
// 		},
// 	],
// 	script: [
// 		{
// 			type: "application/ld+json",
// 			innerHTML: jsonLD,
// 		},
// 	],
// });
</script>

<style scoped lang="scss"></style> -->
