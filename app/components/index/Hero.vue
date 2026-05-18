<template>
	<div class="w-full">
		<section class="w-full">
			<div class="w-full">
				<!-- ── Main Slider ── -->
				<div class="w-full overflow-hidden">
					<Swiper
						:modules="swiperModules"
						:slides-per-view="1"
						:loop="true"
						:autoplay="{ delay: 6000, disableOnInteraction: false }"
						:pagination="{ clickable: true }"
						class="w-full hero-swiper"
					>
						<SwiperSlide v-for="(slide, i) in slides" :key="i" class="h-full">
							<a
								v-if="slide.isExternal"
								:href="slide.link"
								target="_blank"
								rel="noopener noreferrer"
								class="block w-full"
							>
								<img
									:src="slide.image"
									:alt="slide.alt"
									:loading="i === 0 ? 'eager' : 'lazy'"
									:fetchpriority="i === 0 ? 'high' : 'auto'"
									class="w-full h-auto object-cover"
								/>
							</a>
							<NuxtLink v-else :to="slide.link" class="block w-full">
								<img
									:src="slide.image"
									:alt="slide.alt"
									:loading="i === 0 ? 'eager' : 'lazy'"
									:fetchpriority="i === 0 ? 'high' : 'auto'"
									class="w-full h-auto object-cover"
								/>
							</NuxtLink>
						</SwiperSlide>
					</Swiper>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
const props = defineProps({
	block: {
		type: Object,
		required: true,
	},
});

const config = useRuntimeConfig();
const HOST = config.public.HOST;

const swiperModules = [SwiperPagination, SwiperAutoplay];

const slides = computed(() =>
	(props.block.value.main_slider ?? []).map((s) => ({
		image: HOST + s.image.original.src,
		alt: s.image.original.alt,
		link: s.link.link,
		isExternal: s.link.is_external,
	})),
);
</script>

<style>
.hero-swiper .swiper-pagination {
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	gap: 6px !important;
	bottom: 12px !important;
}
.hero-swiper .swiper-pagination-bullet {
	width: 8px !important;
	height: 8px !important;
	border-radius: 9999px !important;
	background: rgba(255, 255, 255, 0.5) !important;
	opacity: 1 !important;
	margin: 0 !important;
	transition:
		width 0.4s ease,
		background 0.3s ease !important;
	flex-shrink: 0 !important;
}
.hero-swiper .swiper-pagination-bullet-active {
	width: 28px !important;
	background: white !important;
}
</style>
