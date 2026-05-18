<template>
	<section class="w-full mt-4 mb-4 sm:mt-10 sm:mb-10">
		<a
			v-if="banner.isExternal"
			:href="banner.link"
			target="_blank"
			rel="noopener noreferrer"
			class="banner-link group"
		>
			<img
				:src="banner.image"
				:alt="banner.alt"
				loading="lazy"
				class="banner-img h-auto"
			/>
			<div class="banner-overlay" />
			<div class="banner-shine-sweep" />
		</a>
		<NuxtLink v-else :to="banner.link" class="banner-link group">
			<img
				:src="banner.image"
				:alt="banner.alt"
				loading="lazy"
				class="banner-img h-auto"
			/>
			<div class="banner-overlay" />
			<div class="banner-shine-sweep" />
		</NuxtLink>
	</section>
</template>

<script setup>
const props = defineProps({
	block: { type: Object, default: null },
	data: { type: Object, default: null },
});

const config = useRuntimeConfig();
const HOST = config.public.HOST;

const banner = computed(() => {
	const v = props.data ?? props.block?.value;
	return {
		image: HOST + v.image1.original.src,
		alt: v.image1.original.alt,
		link: v.image1_link?.link ?? "/",
		isExternal: v.image1_link?.is_external ?? false,
	};
});
</script>

<style>
.banner-link {
	display: block;
	width: 100%;
	position: relative;
	overflow: hidden;
	border-radius: 0;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.banner-img {
	display: block;
	width: 100%;
	object-fit: cover;
	transition: transform 0.6s ease;
}

.banner-link:hover .banner-img {
	transform: scale(1.06);
}

/* Dark gradient at bottom */
.banner-overlay {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, transparent 60%);
	opacity: 0;
	transition: opacity 0.4s ease;
}

.banner-link:hover .banner-overlay {
	opacity: 1;
}

/* Shine sweep on hover */
.banner-shine-sweep {
	position: absolute;
	inset: 0;
	background: linear-gradient(
		105deg,
		transparent 30%,
		rgba(255, 255, 255, 0.15) 50%,
		transparent 70%
	);
	background-size: 200% 100%;
	background-position: 200% center;
	transition: background-position 0.6s ease;
	pointer-events: none;
}

.banner-link:hover .banner-shine-sweep {
	background-position: -200% center;
}
</style>
