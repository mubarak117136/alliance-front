<template>
	<div class="flex flex-col gap-4">
		<!-- Header -->
		<div class="flex items-center justify-between gap-3">
			<div>
				<h2 class="text-base font-bold text-gray-900">Saved Addresses</h2>
				<p class="text-xs text-gray-400 mt-0.5">
					{{
						totalCount > 0
							? `${totalCount} address${totalCount > 1 ? "es" : ""} saved`
							: "Your delivery addresses"
					}}
				</p>
			</div>
			<button
				type="button"
				class="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all"
				@click="createAddressModalOpen = true"
			>
				<Icon name="mdi:plus" size="14" />
				Add Address
			</button>
		</div>

		<!-- Skeleton -->
		<div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div
				v-for="i in 4"
				:key="i"
				class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3"
			>
				<div class="flex items-center justify-between">
					<div class="h-3.5 w-24 rounded bg-gray-100 animate-pulse" />
					<div class="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
				</div>
				<div class="flex flex-col gap-1.5">
					<div class="h-3 w-40 rounded bg-gray-100 animate-pulse" />
					<div class="h-3 w-52 rounded bg-gray-100 animate-pulse" />
					<div class="h-3 w-32 rounded bg-gray-100 animate-pulse" />
				</div>
				<div class="flex gap-2 pt-1 border-t border-gray-50">
					<div class="h-6 w-16 rounded-lg bg-gray-100 animate-pulse" />
					<div class="h-6 w-16 rounded-lg bg-gray-100 animate-pulse" />
				</div>
			</div>
		</div>

		<!-- Address grid -->
		<div
			v-else-if="items.length > 0"
			class="grid grid-cols-1 sm:grid-cols-2 gap-3"
		>
			<div
				v-for="(item, idx) in items"
				:key="'address_' + idx"
				class="bg-white rounded-2xl border transition-all flex flex-col"
				:class="
					item?.is_default
						? 'border-primary/30 bg-primary/[0.02]'
						: 'border-gray-100'
				"
			>
				<!-- Card header -->
				<div class="flex items-center justify-between px-4 pt-4 pb-3">
					<div class="flex items-center gap-2">
						<div
							class="w-7 h-7 rounded-lg flex items-center justify-center"
							:class="item?.is_default ? 'bg-primary/10' : 'bg-gray-100'"
						>
							<Icon
								name="mdi:map-marker-outline"
								size="14"
								:class="item?.is_default ? 'text-primary' : 'text-gray-400'"
							/>
						</div>
						<span class="text-xs font-medium text-gray-700">{{
							item?.full_name
						}}</span>
					</div>
					<span
						v-if="item?.is_default"
						class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
					>
						Default
					</span>
				</div>

				<!-- Address details -->
				<div class="px-4 pb-3 flex flex-col gap-0.5">
					<div class="flex items-center gap-1.5">
						<Icon
							name="mdi:phone-outline"
							size="11"
							class="text-gray-300 shrink-0"
						/>
						<span class="text-[11px] text-gray-400">{{ item?.phone }}</span>
					</div>
					<div v-if="item?.email" class="flex items-center gap-1.5">
						<Icon
							name="mdi:email-outline"
							size="11"
							class="text-gray-300 shrink-0"
						/>
						<span class="text-[11px] text-gray-400">{{ item?.email }}</span>
					</div>
					<div class="flex items-start gap-1.5">
						<Icon
							name="mdi:home-outline"
							size="11"
							class="text-gray-300 shrink-0 mt-px"
						/>
						<span class="text-[11px] text-gray-400 leading-snug">{{
							item?.address
						}}</span>
					</div>
					<div class="flex items-center gap-1.5">
						<Icon
							name="mdi:map-outline"
							size="11"
							class="text-gray-300 shrink-0"
						/>
						<span class="text-[11px] text-gray-400">
							{{ item?.city }}, {{ item?.state_detail?.name }}, {{ item?.country_detail?.name }}
						</span>
					</div>
				</div>

				<!-- Actions -->
				<div
					class="mt-auto px-4 py-3 border-t border-gray-50 flex items-center gap-2"
				>
					<button
						type="button"
						class="flex items-center gap-1 text-[11px] font-medium h-6 px-2.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
						@click="handleEdit(item)"
					>
						<Icon name="mdi:pencil-outline" size="11" />
						Edit
					</button>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div
			v-else
			class="bg-white border border-gray-100 rounded-2xl flex flex-col items-center py-14 text-center px-4"
		>
			<div
				class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3"
			>
				<Icon name="mdi:map-marker-outline" size="22" class="text-gray-300" />
			</div>
			<p class="text-sm font-medium text-gray-600 mb-1">No addresses saved</p>
			<p class="text-xs text-gray-400">
				Add a delivery address to speed up checkout
			</p>
			<button
				type="button"
				class="mt-4 inline-flex items-center gap-1.5 h-8 px-4 rounded-xl bg-primary/8 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
				@click="createAddressModalOpen = true"
			>
				<Icon name="mdi:plus" size="13" />
				Add Address
			</button>
		</div>

		<!-- Pagination -->
		<div v-if="totalPage > 1" class="flex items-center justify-center gap-1.5">
			<button
				:disabled="currentPage === 1"
				class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
				@click="currentPage--"
			>
				<Icon name="mdi:chevron-left" size="15" />
			</button>
			<button
				v-for="p in totalPage"
				:key="p"
				class="w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all"
				:class="
					p === currentPage
						? 'bg-primary text-white border-primary font-semibold'
						: 'border-gray-200 text-gray-500 hover:border-gray-300'
				"
				@click="currentPage = p"
			>
				{{ p }}
			</button>
			<button
				:disabled="currentPage === totalPage"
				class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
				@click="currentPage++"
			>
				<Icon name="mdi:chevron-right" size="15" />
			</button>
		</div>

		<!-- Modals -->
		<ModalsEditAddress
			v-if="editAddressModalOpen"
			:isOpenModal="editAddressModalOpen"
			:data="selectedItem"
			@close="handleCloseEditModal"
		/>
		<ModalsCreateAddress
			v-if="createAddressModalOpen"
			:isOpenModal="createAddressModalOpen"
			@close="handleCloseEditModal"
		/>
	</div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { calculateTotalPage, deepCopy } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const items = ref([]);
const selectedItem = ref(null);
const currentPage = ref(1);
const totalPage = ref(0);
const limit = ref(12);
const offset = ref(0);
const totalCount = ref(0);
const editAddressModalOpen = ref(false);
const createAddressModalOpen = ref(false);

const handleFetchAddresses = () => {
	loading.value = true;
	if (route?.query?.offset) offset.value = route.query.offset;
	const params = { limit: limit.value, offset: offset.value };
	userStore
		.fetchAddresses(params)
		.then((d) => {
			loading.value = false;
			items.value = d.results;
			totalCount.value = d.count;
			totalPage.value = calculateTotalPage(d.count, 12);
		})
		.catch(() => {
			loading.value = false;
		});
};

const handleEdit = (item) => {
	selectedItem.value = item;
	editAddressModalOpen.value = true;
};

const handleCloseEditModal = (refresh = false) => {
	if (refresh == true) handleFetchAddresses();
	selectedItem.value = null;
	editAddressModalOpen.value = false;
	createAddressModalOpen.value = false;
};

onMounted(() => {
	handleFetchAddresses();
});

watch(
	() => currentPage.value,
	(val) => {
		offset.value = val * limit.value - limit.value;
		const query = deepCopy(route.query);
		query["limit"] = limit.value;
		query["offset"] = offset.value;
		router.push({ query });
	},
);

watch(
	() => route,
	(val) => {
		if (
			(val?.query?.limit == 12 && val?.query?.offset == 0) ||
			(!val?.query?.limit && !val?.query?.offset)
		) {
			currentPage.value = 1;
		}
		handleFetchAddresses();
	},
	{ deep: true },
);

useHead({ title: "Saved Addresses" });
</script>
