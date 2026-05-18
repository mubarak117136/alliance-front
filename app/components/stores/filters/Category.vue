<template>
	<div class="border-b border-gray-100">
		<!-- Content -->
		<div class="px-3 pb-3 mt-3">
			<!-- Back button when inside a category -->
			<button
				v-if="selectedCategory"
				@click="handleBack"
				class="flex items-center gap-1.5 w-full px-2 py-2 mb-1 text-xs font-semibold text-primary rounded-lg hover:bg-primary/5 transition-colors"
			>
				<Icon name="mdi:arrow-left" size="13" />
				<Icon
					v-if="selectedCategory.font_icon"
					:name="selectedCategory.font_icon"
					size="14"
				/>
				<span class="uppercase tracking-wide">{{ selectedCategory.name }}</span>
			</button>

			<!-- Category links -->
			<ul v-if="categoryList?.length" class="flex flex-col gap-0.5">
				<li v-for="item in categoryList" :key="item.slug">
					<NuxtLink
						:to="{ name: 'stores-category', params: { category: item.slug } }"
						class="flex items-center justify-between px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all group"
						active-class="bg-primary/10 text-primary font-semibold"
					>
						<span class="flex items-center gap-2.5">
							<Icon
								v-if="item.font_icon"
								:name="item.font_icon"
								size="16"
								class="text-gray-400 shrink-0 group-hover:text-primary transition-colors"
							/>
							<span>{{ item.name }}</span>
						</span>
						<Icon
							name="mdi:chevron-right"
							size="14"
							class="text-gray-300 group-hover:text-primary transition-colors shrink-0"
						/>
					</NuxtLink>
				</li>
			</ul>

			<p v-else-if="selectedCategory" class="text-xs text-gray-400 px-2 py-1">
				No subcategories
			</p>
			<p v-else class="text-xs text-gray-400 px-2 py-1">
				No categories available
			</p>
		</div>
	</div>
</template>

<script setup>
import { findNestedObj } from "@/utils/utils";

const isOpen = ref(true);

const route = useRoute();
const router = useRouter();
const utilityStore = useUtilityStore();
const { getCategories } = storeToRefs(utilityStore);

const selectedCategory = ref(null);

const categoryList = computed(() => {
	if (route?.params?.category) {
		const found = findNestedObj(
			getCategories.value,
			"slug",
			route.params.category,
		);
		selectedCategory.value = found;
		return found?.children ?? [];
	}
	selectedCategory.value = null;
	return getCategories.value;
});

function handleBack() {
	if (!selectedCategory.value) return;
	if (selectedCategory.value.parent) {
		router.push({
			name: "stores-category",
			params: { category: selectedCategory.value.parent_slug },
		});
	} else {
		router.push({ name: "stores" });
	}
}
</script>
