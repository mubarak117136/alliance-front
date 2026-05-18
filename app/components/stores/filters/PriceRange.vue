<template>
	<div class="border-b border-gray-100">
		<!-- Section header -->
		<button
			class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
			@click="isOpen = !isOpen"
		>
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Price Range
				</span>
				<span
					v-if="isFiltered"
					class="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md"
				>
					{{ priceRange[0].toLocaleString() }} –
					{{ priceRange[1].toLocaleString() }}$
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
		<div v-show="isOpen" class="px-5 pb-4" v-if="priceMax > 0">
			<div class="relative flex items-center h-5">
				<div class="relative w-full h-1.5 bg-gray-100 rounded-full">
					<div
						class="absolute h-1.5 bg-primary rounded-full"
						:style="fillStyle"
					/>
				</div>
				<input
					type="range"
					v-model.number="priceRange[0]"
					:min="priceMin"
					:max="priceMax"
					:step="1"
					class="range-thumb"
					@input="clampMin"
					@change="handleMinMaxValueChange"
				/>
				<input
					type="range"
					v-model.number="priceRange[1]"
					:min="priceMin"
					:max="priceMax"
					:step="1"
					class="range-thumb"
					@input="clampMax"
					@change="handleMinMaxValueChange"
				/>
			</div>
			<div class="flex justify-between text-[10px] text-gray-400 mt-2">
				<span>${{ priceMin.toLocaleString() }}</span>
				<span>${{ priceMax.toLocaleString() }}+</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";

const props = defineProps({
	data: null,
});

const route = useRoute();
const router = useRouter();

const isOpen = ref(true);
const priceRange = ref([0, 0]);
const priceMin = ref(0);
const priceMax = ref(0);

const handleMinMaxValueChange = () => {
	const query = deepCopy(route.query);
	query["price_min"] = priceRange.value[0];
	query["price_max"] = priceRange.value[1];
	query["offset"] = 0;
	router.push({ query });
};

watch(
	() => props.data,
	(val) => {
		if (route?.query?.price_min) {
			priceRange.value[0] = route.query.price_min;
		}
		if (route?.query?.price_max) {
			priceRange.value[1] = route.query.price_max;
		} else {
			priceRange.value[1] = val.max;
		}
		priceMax.value = val.max;
	},
	{ deep: true },
);

const isFiltered = computed(
	() =>
		priceRange.value[0] > priceMin.value ||
		priceRange.value[1] < priceMax.value,
);

function clampMin() {
	if (priceRange.value[0] >= priceRange.value[1])
		priceRange.value[0] = priceRange.value[1] - 1;
}
function clampMax() {
	if (priceRange.value[1] <= priceRange.value[0])
		priceRange.value[1] = priceRange.value[0] + 1;
}

const fillStyle = computed(() => {
	const range = priceMax.value - priceMin.value || 1;
	const minPct = ((priceRange.value[0] - priceMin.value) / range) * 100;
	const maxPct = ((priceRange.value[1] - priceMin.value) / range) * 100;
	return { left: `${minPct}%`, width: `${maxPct - minPct}%` };
});
</script>

<style scoped>
.range-thumb {
	position: absolute;
	width: 100%;
	height: 4px;
	background: transparent;
	-webkit-appearance: none;
	appearance: none;
	pointer-events: none;
}

.range-thumb::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: #1565c0;
	cursor: pointer;
	pointer-events: all;
	border: 2px solid white;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.range-thumb::-moz-range-thumb {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: #1565c0;
	cursor: pointer;
	pointer-events: all;
	border: 2px solid white;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.range-thumb::-webkit-slider-runnable-track {
	background: transparent;
}

.range-thumb::-moz-range-track {
	background: transparent;
}
</style>
