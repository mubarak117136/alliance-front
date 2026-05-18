<template>
	<div v-for="attr in data" :key="attr.slug" class="border-t border-gray-100">
		<!-- Section header -->
		<button
			class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
			@click="toggleSection(attr.slug)"
		>
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
					{{ attr.name }}
				</span>
				<span
					v-if="selectedValue(attr.slug)"
					class="text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md"
				>
					{{ attr.values.find((v) => v.slug === selectedValue(attr.slug))?.value }}
				</span>
			</div>
			<Icon
				name="mdi:chevron-down"
				size="16"
				class="text-gray-400 transition-transform duration-200"
				:class="{ 'rotate-180': openSections[attr.slug] }"
			/>
		</button>

		<!-- Content -->
		<div v-show="openSections[attr.slug]" class="px-3 pb-3 flex flex-col gap-0.5">
			<!-- All option -->
			<label
				class="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
				:class="{ 'bg-primary/5': !selectedValue(attr.slug) }"
			>
				<span
					class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
					:class="
						!selectedValue(attr.slug)
							? 'border-primary bg-primary'
							: 'border-gray-300 group-hover:border-primary/50'
					"
				>
					<span v-if="!selectedValue(attr.slug)" class="w-1.5 h-1.5 rounded-full bg-white" />
				</span>
				<input
					type="radio"
					:checked="!selectedValue(attr.slug)"
					@change="select(attr.slug, '')"
					class="sr-only"
				/>
				<span
					class="text-sm transition-colors"
					:class="!selectedValue(attr.slug) ? 'text-primary font-semibold' : 'text-gray-600'"
				>All</span>
			</label>

			<!-- Value options -->
			<label
				v-for="val in attr.values"
				:key="val.slug"
				class="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
				:class="{ 'bg-primary/5': selectedValue(attr.slug) === val.slug }"
			>
				<span
					class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
					:class="
						selectedValue(attr.slug) === val.slug
							? 'border-primary bg-primary'
							: 'border-gray-300 group-hover:border-primary/50'
					"
				>
					<span
						v-if="selectedValue(attr.slug) === val.slug"
						class="w-1.5 h-1.5 rounded-full bg-white"
					/>
				</span>
				<input
					type="radio"
					:checked="selectedValue(attr.slug) === val.slug"
					@change="select(attr.slug, val.slug)"
					class="sr-only"
				/>
				<span
					class="text-sm transition-colors"
					:class="
						selectedValue(attr.slug) === val.slug
							? 'text-primary font-semibold'
							: 'text-gray-600'
					"
				>{{ val.value }}</span>
			</label>
		</div>
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";

const props = defineProps({
	data: { type: Array, default: () => [] },
});

const route = useRoute();
const router = useRouter();

const openSections = reactive({});

watch(
	() => props.data,
	(attrs) => {
		for (const attr of attrs) {
			if (!(attr.slug in openSections)) {
				openSections[attr.slug] = !!route.query[attr.slug];
			}
		}
	},
	{ immediate: true },
);

function selectedValue(slug) {
	return route.query[slug] ?? "";
}

function toggleSection(slug) {
	openSections[slug] = !openSections[slug];
}

function select(attrSlug, val) {
	const query = deepCopy(route.query);
	if (val) query[attrSlug] = val;
	else delete query[attrSlug];
	query["offset"] = 0;
	router.push({ query });
}
</script>
