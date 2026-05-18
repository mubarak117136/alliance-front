<template>
	<div v-if="data?.youtube_video_id" class="w-full flex flex-col items-center gap-4 my-6">
		<h3 v-if="data.title" class="text-base font-semibold text-gray-800 text-center">
			{{ data.title }}
		</h3>
		<div class="w-full rounded-2xl overflow-hidden shadow-sm">
			<LiteYouTubeEmbed :id="data.youtube_video_id" />
		</div>
	</div>
</template>

<script setup>
import LiteYouTubeEmbed from "vue-lite-youtube-embed";
import "vue-lite-youtube-embed/style.css";

const props = defineProps({ data: null });
const data = computed(() => props.data);
</script>
