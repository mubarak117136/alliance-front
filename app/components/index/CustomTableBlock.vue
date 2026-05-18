<template>
	<div v-if="tableData.length" class="w-full flex flex-col gap-4 my-6">
		<!-- Title -->
		<h3 v-if="data?.title" class="text-base font-semibold text-gray-800 text-center">
			{{ data.title }}
		</h3>

		<!-- Table -->
		<div class="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
			<table class="w-full text-sm border-collapse">
				<thead>
					<tr>
						<th
							v-for="(cell, i) in tableData[0]"
							:key="'h_' + i"
							class="bg-primary/5 text-primary font-semibold text-left px-4 py-2.5 border-b border-gray-200 whitespace-nowrap"
						>
							{{ cell }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, ri) in tableData.slice(1)"
						:key="'r_' + ri"
						class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
					>
						<td
							v-for="(cell, ci) in row"
							:key="'c_' + ci"
							class="px-4 py-2.5 text-gray-600"
						>
							{{ cell }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({ data: null });

const tableData = computed(() => props.data?.table?.data ?? []);
</script>
