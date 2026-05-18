<template>
	<div class="relative flex items-center justify-center gap-0">
		<template v-for="(s, i) in steps" :key="s.key">
			<!-- Step -->
			<div class="flex flex-col items-center gap-1.5 z-10">
				<div
					class="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all duration-300"
					:class="stepState(s.value) === 'complete'
						? 'bg-primary border-primary text-white'
						: stepState(s.value) === 'active'
							? 'bg-white border-primary text-primary shadow-md shadow-primary/20'
							: 'bg-white border-gray-200 text-gray-300'"
				>
					<Icon v-if="stepState(s.value) === 'complete'" name="mdi:check" size="16" />
					<span v-else>{{ s.value }}</span>
				</div>
				<span
					class="text-[11px] font-bold whitespace-nowrap transition-colors"
					:class="stepState(s.value) === 'active' ? 'text-primary' : stepState(s.value) === 'complete' ? 'text-gray-600' : 'text-gray-300'"
				>
					{{ s.label }}
				</span>
			</div>

			<!-- Connector -->
			<div v-if="i < steps.length - 1" class="flex-1 h-0.5 mb-5 mx-2 transition-all duration-300"
				:class="props.step > s.value ? 'bg-primary' : 'bg-gray-200'" />
		</template>
	</div>
</template>

<script setup>
const props = defineProps({ step: { type: Number, default: 1 } });

const steps = [
	{ value: 1, label: "Shipping" },
	{ value: 2, label: "Payment" },
	{ value: 3, label: "Complete" },
];

function stepState(val) {
	if (props.step > val) return "complete";
	if (props.step === val) return "active";
	return "pending";
}
</script>
