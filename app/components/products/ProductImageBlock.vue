<template>
	<div class="flex gap-3">
		<!-- Thumbnail strip (vertical, desktop) -->
		<div
			v-if="images?.length > 1"
			class="hidden sm:flex flex-col gap-2 shrink-0"
		>
			<button
				v-for="(img, i) in images"
				:key="i"
				class="w-[68px] h-[68px] rounded-xl border-2 overflow-hidden shrink-0 transition-all duration-200"
				:class="i === current
					? 'border-primary shadow-md shadow-primary/20'
					: 'border-gray-100 hover:border-gray-300'"
				@click="current = i"
			>
				<img
					:src="HOST + img?.image_detail?.original?.src"
					:alt="img?.image_detail?.original?.alt"
					class="w-full h-full object-cover"
				/>
			</button>
		</div>

		<!-- Main image -->
		<div class="flex-1 flex flex-col gap-3">
			<div
				class="relative rounded-2xl overflow-hidden aspect-square"
				@mouseenter="pause"
				@mouseleave="resume"
			>
				<img
					:src="currentImage"
					:alt="currentAlt"
					class="w-full h-full object-contain transition-all duration-300"
				/>


				<!-- Image counter badge -->
				<div
					v-if="images?.length > 1"
					class="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm"
				>
					{{ current + 1 }} / {{ images.length }}
				</div>
			</div>

			<!-- Thumbnail strip (horizontal, mobile) -->
			<div v-if="images?.length > 1" class="flex sm:hidden gap-2 overflow-x-auto pb-1">
				<button
					v-for="(img, i) in images"
					:key="i"
					class="shrink-0 w-14 h-14 rounded-xl border-2 overflow-hidden transition-all"
					:class="i === current ? 'border-primary' : 'border-gray-100 hover:border-gray-300'"
					@click="current = i"
				>
					<img
						:src="HOST + img?.image_detail?.original?.src"
						:alt="img?.image_detail?.original?.alt"
						class="w-full h-full object-cover"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const config = useRuntimeConfig();
const HOST = config.public.HOST;

const props = defineProps({
	images: { type: Array, default: () => [] },
});

const current = ref(0);

const currentImage = computed(() => {
	const img = props.images?.[current.value];
	return img ? HOST + img.image_detail?.original?.src : "";
});
const currentAlt = computed(() =>
	props.images?.[current.value]?.image_detail?.original?.alt ?? ""
);


let timer = null;

function startTimer() {
	if (props.images?.length <= 1) return;
	timer = setInterval(() => {
		current.value = current.value === props.images.length - 1 ? 0 : current.value + 1;
	}, 3000);
}
function pause() {
	clearInterval(timer);
	timer = null;
}
function resume() {
	if (!timer) startTimer();
}

onMounted(startTimer);
onUnmounted(pause);
</script>
