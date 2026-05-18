<template>
	<div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-black">
		<!-- Header bar -->
		<div class="flex items-center gap-2.5 px-4 py-3 bg-gray-900">
			<div class="flex items-center gap-1.5">
				<span class="w-3 h-3 rounded-full bg-red-500" />
				<span class="w-3 h-3 rounded-full bg-yellow-400" />
				<span class="w-3 h-3 rounded-full bg-green-400" />
			</div>
			<div class="flex-1 flex items-center justify-center">
				<div class="flex items-center gap-1.5 bg-gray-800 rounded-md px-3 py-1">
					<Icon name="mdi:youtube" size="13" class="text-red-500" />
					<span class="text-[11px] text-gray-400 font-medium">Product Video</span>
				</div>
			</div>
		</div>

		<!-- Video embed -->
		<div class="relative">
			<LiteYouTubeEmbed :id="data?.video" title="Product Video" />
		</div>
	</div>
</template>

<script setup>
import LiteYouTubeEmbed from "vue-lite-youtube-embed";
import "vue-lite-youtube-embed/style.css";

defineProps({ data: { type: Object, default: null } });
</script>

<style scoped>
:deep(.yt-lite) {
	border-radius: 0;
}
:deep(.yt-lite > .lty-playbtn) {
	background: rgba(220, 38, 38, 0.9);
	border-radius: 50%;
	width: 60px;
	height: 60px;
	border: 3px solid rgba(255,255,255,0.3);
	box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.15);
	transition: transform 0.2s, box-shadow 0.2s;
}
:deep(.yt-lite:hover > .lty-playbtn) {
	transform: translate(-50%, -50%) scale(1.1);
	box-shadow: 0 0 0 12px rgba(220, 38, 38, 0.2);
}
:deep(.yt-lite > .lty-playbtn::before) {
	border-width: 10px 0 10px 20px;
}
</style>
