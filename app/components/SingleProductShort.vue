<template>
	<NuxtLink
		:to="link"
		class="group relative block w-full h-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
	>
		<!-- Image fills the whole card -->
		<img
			:src="image"
			:alt="title"
			loading="lazy"
			width="400"
			height="400"
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
		/>

		<!-- Top: price + discount -->
		<div
			class="absolute top-2 inset-x-2 z-10 flex items-center justify-between"
		>
			<div
				v-if="discount"
				class="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
			>
				-{{ discount }}%
			</div>
			<div
				class="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow"
				style="
					background: rgba(0, 0, 0, 0.5);
					backdrop-filter: blur(4px);
					-webkit-backdrop-filter: blur(4px);
				"
			>
				<span class="text-accent font-bold text-xs sm:text-sm leading-none">
					${{ price.toLocaleString() }}
				</span>
				<span
					v-if="product.variant?.has_offer && oldPrice"
					class="text-white/50 text-[10px] line-through leading-none"
				>
					${{ oldPrice.toLocaleString() }}
				</span>
			</div>
		</div>

		<!-- Bottom gradient -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
		/>

		<!-- Bottom: title -->
		<div class="absolute inset-x-2 bottom-2 sm:inset-x-2.5 sm:bottom-2.5">
			<div
				class="rounded-lg px-2.5 py-1.5 sm:px-3"
				style="
					background: rgba(0, 0, 0, 0.5);
					backdrop-filter: blur(1px);
					-webkit-backdrop-filter: blur(1px);
				"
			>
				<p
					class="text-white text-xs font-semibold leading-snug line-clamp-2"
					:title="title"
				>
					{{ title }}
				</p>
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

const title = computed(() => props.product.name ?? props.product.title ?? "");
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
