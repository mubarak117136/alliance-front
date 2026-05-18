<template>
	<NuxtLink
		:to="`/blogs/${data?.fetch_parent?.slug}/${data?.meta?.slug}`"
		:aria-label="data?.title"
		class="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
	>
		<!-- Thumbnail -->
		<div class="overflow-hidden aspect-[16/9] bg-gray-100 shrink-0">
			<img
				:src="HOST + data?.thumbnail?.original?.src"
				:alt="data?.thumbnail?.original?.alt"
				loading="lazy"
				width="720"
				height="405"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
			/>
		</div>

		<!-- Body -->
		<div class="flex flex-col flex-1 p-4 sm:p-5 gap-3">
			<!-- Category tag -->
			<div v-if="data?.fetch_parent?.title" class="flex">
				<span
					class="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/5 px-2.5 py-1 rounded-full"
				>
					{{ data.fetch_parent.title }}
				</span>
			</div>

			<!-- Title -->
			<h3
				class="text-sm sm:text-base font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors"
			>
				{{ data?.title }}
			</h3>

			<!-- Description -->
			<p
				class="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1"
			>
				{{ data?.short_description }}
			</p>

			<!-- Footer -->
			<div
				class="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 mt-auto"
			>
				<div class="flex items-center gap-2 min-w-0">
					<img
						v-if="data?.author?.image?.src"
						:src="HOST + data.author.image.src"
						:alt="data.author.name"
						loading="lazy"
						width="24"
						height="24"
						class="w-6 h-6 rounded-full object-cover shrink-0"
					/>
					<div
						v-else
						class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
					>
						<Icon name="mdi:account-outline" size="13" class="text-gray-400" />
					</div>
					<span class="text-xs font-medium text-gray-600 truncate">{{
						data?.author?.name
					}}</span>
				</div>
				<span class="text-[11px] text-gray-400 shrink-0">
					{{ dayjs(data?.last_published_at).format("DD MMM, YYYY") }}
				</span>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup>
const config = useRuntimeConfig();
const dayjs = useDayjs();

const props = defineProps({ data: null });
const data = computed(() => props.data);

const HOST = computed(() => config.public.HOST);
</script>
