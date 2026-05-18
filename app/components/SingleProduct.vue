<template>
	<NuxtLink
		:to="link"
		class="single-product-card group relative flex flex-col cursor-pointer bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
	>
		<!-- Discount badge -->
		<div
			v-if="discount"
			class="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
		>
			-{{ discount }}%
		</div>

		<!-- Image -->
		<div
			class="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-3"
		>
			<img
				:src="image"
				:alt="title"
				loading="lazy"
				width="400"
				height="400"
				class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
			/>
			<!-- Quick shop pill -->
			<div
				class="absolute inset-x-0 bottom-0 flex justify-center pb-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
			>
				<span
					class="text-white text-[11px] font-semibold bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 whitespace-nowrap"
				>
					Quick Shop
				</span>
			</div>
		</div>

		<!-- Info -->
		<div class="px-1 flex flex-col flex-1">
			<p
				class="text-gray-600 text-xs sm:text-sm font-medium leading-snug line-clamp-2 mb-2 group-hover:text-gray-900 transition-colors duration-200 flex-1"
				:title="title"
			>
				{{ title }}
			</p>
			<div class="flex items-center gap-2 flex-wrap mt-auto">
				<span class="text-accent font-bold text-sm sm:text-base"
					>${{ price.toLocaleString() }}</span
				>
				<span
					v-if="product.variant?.has_offer && oldPrice"
					class="text-gray-400 text-xs line-through"
				>
					${{ oldPrice.toLocaleString() }}
				</span>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup>
const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
});

const config = useRuntimeConfig();
const HOST = config.public.HOST;

const image = computed(() => {
	const src = props.product.default_image?.original?.src;
	return src ? HOST + src : (props.product.image ?? "");
});

const title = computed(() => props.product.name ?? "");

const price = computed(() => props.product.variant?.price ?? 0);

const oldPrice = computed(() => props.product.variant?.old_price ?? null);

const link = computed(() =>
	props.product.slug
		? `/products/${props.product.slug}`
		: (props.product.link ?? "/"),
);

const discount = computed(() => {
	if (!props.product.variant?.has_offer) return null;
	return Math.round(props.product.variant.discount_percent);
});
</script>
