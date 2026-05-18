<template>
	<section class="w-full max-w-[1280px] mx-auto px-2 sm:px-4 lg:px-6">
		<!-- Section header -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<!-- Accent bar -->
				<div class="flex flex-col gap-0.5 shrink-0">
					<div class="w-1 h-4 bg-primary rounded-full" />
					<div class="w-1 h-2 bg-accent rounded-full" />
				</div>
				<div>
					<p
						class="text-primary/50 text-[10px] font-semibold uppercase tracking-widest leading-none mb-0.5"
					>
						Collection
					</p>
					<h2
						class="text-gray-900 text-base sm:text-xl font-extrabold leading-tight tracking-tight"
					>
						{{ name }}
					</h2>
				</div>
			</div>
			<NuxtLink
				:to="link"
				class="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
			>
				View All
				<Icon
					name="mdi:arrow-right"
					size="14"
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</NuxtLink>
		</div>
		<div
			class="h-px bg-gradient-to-r from-primary/30 via-gray-200 to-transparent mb-4"
		/>

		<!-- ── GRID variant ── -->
		<div
			v-if="variant === 'grid'"
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 items-stretch"
		>
			<SingleProduct
				v-for="(product, i) in products"
				:key="i"
				:product="product"
			/>
		</div>

		<!-- ── SLIDER variant ── -->
		<ClientOnly v-else-if="variant === 'slider'">
			<div class="relative">
				<Swiper
					:modules="swiperModules"
					:slides-per-view="2"
					:space-between="10"
					:breakpoints="{
						640: { slidesPerView: 3, spaceBetween: 12 },
						768: { slidesPerView: 4, spaceBetween: 14 },
						1024: { slidesPerView: 5, spaceBetween: 16 },
					}"
					:autoplay="{ delay: 3000, disableOnInteraction: false }"
					class="category-swiper"
					style="height: auto"
				>
					<SwiperSlide
						v-for="(product, i) in products"
						:key="i"
						style="height: auto; align-self: stretch"
					>
						<SingleProduct :product="product" class="h-full" />
					</SwiperSlide>
				</Swiper>
			</div>
		</ClientOnly>
	</section>
</template>

<script setup>
const props = defineProps({
	block: {
		type: Object,
		required: true,
	},
});

const swiperModules = [SwiperAutoplay];

const name = computed(
	() => props.block.value.title ?? props.block.value.item?.name ?? "",
);
const link = computed(() => `/stores/${props.block.value.item?.slug ?? ""}`);
const products = computed(() => props.block.value.item?.products ?? []);
const variant = computed(() => props.block.value.type ?? "grid");

</script>
