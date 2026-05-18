<template>
	<section class="w-full flex justify-center">
		<div
			class="flex flex-col md:flex-row w-full md:max-w-[70%]"
			:class="imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'"
		>
			<!-- Image -->
			<div
				class="w-full md:w-[60%] flex-shrink-0 flex items-center justify-center"
				:class="{ 'md:justify-start': imageLeft, 'md:justify-end': !imageLeft }"
			>
				<img
					:src="section.image"
					:alt="section.alt"
					loading="lazy"
					class="w-[70%] sm:w-[55%] md:w-[65%] object-contain block"
				/>
			</div>

			<!-- Text Content -->
			<div
				class="w-full md:w-[40%] flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 py-8 sm:px-12 sm:py-12 md:px-10 md:py-12 lg:px-16 lg:py-16"
			>
				<h2
					v-if="section.title"
					class="font-condensed font-black text-4xl sm:text-5xl text-primary uppercase mb-4 tracking-tight"
				>
					{{ section.title }}
				</h2>
				<p
					v-if="section.subtitle"
					class="text-gray-600 text-sm sm:text-base leading-relaxed mb-8"
				>
					{{ section.subtitle }}
				</p>

				<!-- Connected tab-style buttons -->
				<div v-if="section.links.length" class="flex flex-wrap justify-center md:justify-start">
					<template v-for="(item, i) in section.links" :key="i">
						<a
							v-if="item.isExternal"
							:href="item.link"
							target="_blank"
							rel="noopener noreferrer"
							class="its-tab-btn"
							:class="{
								'its-tab-btn--first': i === 0,
								'its-tab-btn--last': i === section.links.length - 1,
							}"
						>
							{{ item.label }}
						</a>
						<NuxtLink
							v-else
							:to="item.link"
							class="its-tab-btn"
							:class="{
								'its-tab-btn--first': i === 0,
								'its-tab-btn--last': i === section.links.length - 1,
							}"
						>
							{{ item.label }}
						</NuxtLink>
					</template>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	block: { type: Object, default: null },
	data: { type: Object, default: null },
});

const config = useRuntimeConfig();
const HOST = config.public.HOST;

const section = computed(() => {
	const v = props.data ?? props.block?.value;
	return {
		image: HOST + v.image.original.src,
		alt: v.image.original.alt,
		title: v.title ?? "",
		subtitle: v.subtitle ?? "",
		links: (v.links ?? []).map((l) => ({
			label: l.text,
			link: l.link?.link ?? "/",
			isExternal: l.link?.is_external ?? false,
		})),
	};
});

const imageLeft = computed(() => {
	const v = props.data ?? props.block?.value;
	return (v.image_position ?? "left") === "left";
});
</script>

<style>
.its-tab-btn {
	display: inline-block;
	padding: 0.55rem 1.4rem;
	border: 1.5px solid #1a1a1a;
	margin-left: -1.5px;
	font-family: "Barlow Condensed", sans-serif;
	font-weight: 700;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #1a1a1a;
	background: #ffffff;
	transition:
		background 0.2s ease,
		color 0.2s ease;
	text-decoration: none;
	position: relative;
	z-index: 0;
}

.its-tab-btn--first {
	margin-left: 0;
}

.its-tab-btn:hover {
	background: #EA4F24;
	border-color: #EA4F24;
	color: #ffffff;
	z-index: 1;
}
</style>
