<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();
const utilityStore = useUtilityStore();

const { getBasicSettings } = storeToRefs(utilityStore);

const HOST = computed(() => {
	return config.public.HOST;
});

const getTitle = computed(() => {
	return getBasicSettings?.value?.company_name;
});

const getFavicon = computed(() => {
	if (getBasicSettings?.value?.favicon) {
		return HOST?.value + getBasicSettings?.value?.favicon?.original?.src;
	} else {
		return "/favicon/logo.png";
	}
});

useHead({
	titleTemplate: `%s | ${getTitle.value}`,
	link: [{ rel: "icon", type: "image/x-icon", href: getFavicon }],
});
</script>
