<template>
	<div>
		<!-- Section header -->
		<button
			class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
			@click="isOpen = !isOpen"
		>
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Brand
				</span>
				<span
					v-if="selectedBrand"
					class="text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md"
				>
					{{ brands.find((b) => b.value === selectedBrand)?.label }}
				</span>
			</div>
			<Icon
				name="mdi:chevron-down"
				size="16"
				class="text-gray-400 transition-transform duration-200"
				:class="{ 'rotate-180': isOpen }"
			/>
		</button>

		<!-- Content -->
		<div v-show="isOpen" class="px-3 pb-3 flex flex-col gap-0.5">
			<label
				class="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
				:class="{ 'bg-primary/5': !selectedBrand }"
			>
				<span
					class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
					:class="
						!selectedBrand
							? 'border-primary bg-primary'
							: 'border-gray-300 group-hover:border-primary/50'
					"
				>
					<span v-if="!selectedBrand" class="w-1.5 h-1.5 rounded-full bg-white" />
				</span>
				<input
					type="radio"
					:checked="!selectedBrand"
					@change="select('')"
					class="sr-only"
				/>
				<span
					class="text-sm transition-colors"
					:class="!selectedBrand ? 'text-primary font-semibold' : 'text-gray-600'"
					>All</span
				>
			</label>

			<label
				v-for="brand in brands"
				:key="brand.value"
				class="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
				:class="{ 'bg-primary/5': selectedBrand === brand.value }"
			>
				<span
					class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
					:class="
						selectedBrand === brand.value
							? 'border-primary bg-primary'
							: 'border-gray-300 group-hover:border-primary/50'
					"
				>
					<span
						v-if="selectedBrand === brand.value"
						class="w-1.5 h-1.5 rounded-full bg-white"
					/>
				</span>
				<input
					type="radio"
					:checked="selectedBrand === brand.value"
					@change="select(brand.value)"
					class="sr-only"
				/>
				<span
					class="text-sm transition-colors"
					:class="
						selectedBrand === brand.value
							? 'text-primary font-semibold'
							: 'text-gray-600'
					"
					>{{ brand.label }}</span
				>
			</label>
		</div>
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";

const props = defineProps({
	brands: { type: Array, default: () => [] },
});

const route = useRoute();
const router = useRouter();

const selectedBrand = computed(() => route.query.brand ?? "");

const isOpen = ref(!!route.query.brand);

watch(selectedBrand, (val) => {
	if (val) isOpen.value = true;
});

function select(val) {
	const query = deepCopy(route.query);
	if (val) query["brand"] = val;
	else delete query["brand"];
	query["offset"] = 0;
	router.push({ query });
}
</script>
