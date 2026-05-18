<template>
	<div class="relative" v-click-outside="() => open = false">
		<button
			type="button"
			class="flex items-center h-9 rounded-xl border-2 bg-gray-50 px-3 gap-2 transition-all text-left w-40"
			:class="open ? 'border-primary bg-white ring-2 ring-primary/10' : 'border-gray-200 hover:border-gray-300'"
			@click="open = !open"
		>
			<Icon name="mdi:filter-outline" size="13" class="text-gray-400 shrink-0" />
			<span class="flex-1 text-xs font-semibold truncate"
				:class="selectedStatus ? statusColor(selectedStatus) : 'text-gray-600'">
				{{ statuses.find(s => s.value === selectedStatus)?.title ?? 'All Orders' }}
			</span>
			<Icon name="mdi:chevron-down" size="14" class="text-gray-400 shrink-0 transition-transform duration-200"
				:class="open ? 'rotate-180' : ''" />
		</button>

		<Transition name="dropdown">
			<div v-if="open" class="absolute z-50 top-full right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
				<button
					v-for="s in statuses"
					:key="s.value"
					type="button"
					class="w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between gap-2"
					:class="selectedStatus === s.value ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'"
					@click="selectStatus(s.value)"
				>
					<div class="flex items-center gap-2">
						<div v-if="s.value" class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusDot(s.value)" />
						<div v-else class="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-300" />
						{{ s.title }}
					</div>
					<Icon v-if="selectedStatus === s.value" name="mdi:check" size="13" class="text-primary shrink-0" />
				</button>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { deepCopy } from "@/utils/utils";

const route = useRoute();
const router = useRouter();

const open = ref(false);
const selectedStatus = ref("");

const statuses = [
	{ title: "All Orders",  value: "" },
	{ title: "Pending",     value: "1" },
	{ title: "Processing",  value: "2" },
	{ title: "In Transit",  value: "3" },
	{ title: "Delivered",   value: "4" },
	{ title: "Returned",    value: "5" },
	{ title: "Cancelled",   value: "6" },
];

const statusDot = (value) => {
	const map = { "1": "bg-yellow-400", "2": "bg-blue-400", "3": "bg-indigo-400", "4": "bg-green-500", "5": "bg-orange-400", "6": "bg-red-400" };
	return map[value] ?? "bg-gray-300";
};

const statusColor = (value) => {
	const map = { "1": "text-yellow-600", "2": "text-blue-600", "3": "text-indigo-600", "4": "text-green-600", "5": "text-orange-500", "6": "text-red-500" };
	return map[value] ?? "text-gray-600";
};

const selectStatus = (val) => {
	selectedStatus.value = val;
	open.value = false;
	const query = deepCopy(route.query);
	if (val) { query["status"] = val; query["offset"] = 0; }
	else { delete query["status"]; }
	router.push({ query });
};

watch(() => route, (val) => {
	selectedStatus.value = val?.query?.status ?? "";
}, { deep: true });

onMounted(() => {
	selectedStatus.value = route?.query?.status ?? "";
});
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
