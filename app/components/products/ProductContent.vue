<template>
	<div class="max-w-4xl mx-auto">
		<!-- Tab bar -->
		<div class="flex items-center gap-2 mb-8">
			<button
				v-for="t in tabs"
				:key="t.key"
				class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
				:class="
					tab === t.key
						? 'bg-primary text-white shadow-md shadow-primary/25'
						: 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
				"
				@click="tab = t.key"
			>
				<Icon :name="t.icon" size="15" />
				{{ t.label }}
			</button>
		</div>

		<!-- Description -->
		<Transition name="tab-fade" mode="out-in">
			<div v-if="tab === 'desc'" key="desc">
				<div v-if="data?.length">
					<div
						class="bg-white border border-gray-100 rounded-3xl overflow-hidden"
					>
						<!-- Header -->
						<div
							class="relative flex items-center gap-4 px-8 py-5 overflow-hidden"
							style="
								background: linear-gradient(
									135deg,
									#f0f7ff 0%,
									#ffffff 60%,
									#fff8f3 100%
								);
							"
						>
							<div
								class="absolute inset-0 opacity-[0.03]"
								style="
									background-image: radial-gradient(
										circle,
										#000 1px,
										transparent 1px
									);
									background-size: 20px 20px;
								"
							/>
							<div
								class="relative w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
							>
								<Icon
									name="mdi:text-box-check-outline"
									size="18"
									class="text-primary"
								/>
							</div>
							<div class="relative">
								<p
									class="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5"
								>
									About this product
								</p>
								<h3 class="text-base font-black text-gray-800 leading-tight">
									Product Description
								</h3>
							</div>
							<!-- Accent line -->
							<div
								class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-gray-100 to-accent/20"
							/>
						</div>

						<!-- Content blocks -->
						<div class="px-8 py-7 flex flex-col gap-7">
							<div v-for="(item, idx) in data" :key="'c_' + idx">
								<ProductsContentRichtext v-if="item?.type === 0" :data="item" />
								<ProductsContentImageBanner
									v-else-if="item?.type === 1"
									:data="item"
								/>
								<ProductsContentYoutube
									v-else-if="item?.type === 2"
									:data="item"
								/>
								<ProductsContentTable
									v-else-if="item?.type === 3"
									:data="item"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty state -->
				<div v-else class="flex flex-col items-center py-20 text-center">
					<div
						class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"
					>
						<Icon name="mdi:text-box-outline" size="28" class="text-gray-300" />
					</div>
					<p class="text-gray-400 text-sm font-medium">
						No description available
					</p>
				</div>
			</div>

			<!-- Reviews -->
			<div v-else-if="tab === 'reviews'" key="reviews">
				<div
					class="bg-white border border-gray-100 rounded-3xl overflow-hidden"
				>
					<!-- Header -->
					<div
						class="relative flex items-center gap-4 px-8 py-5 overflow-hidden"
						style="
							background: linear-gradient(
								135deg,
								#fff8f0 0%,
								#ffffff 60%,
								#f0f7ff 100%
							);
						"
					>
						<div
							class="relative w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"
						>
							<Icon name="mdi:star-outline" size="18" class="text-accent" />
						</div>
						<div>
							<p
								class="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5"
							>
								Customer Feedback
							</p>
							<h3 class="text-base font-black text-gray-800 leading-tight">
								Ratings & Reviews
							</h3>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent/20 via-gray-100 to-primary/20"
						/>
					</div>
					<div class="px-8 py-7">
						<ProductsRatings :productId="productId" />
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
const props = defineProps({
	data: { type: Array, default: () => [] },
	productId: { type: [Number, String], default: null },
});

const tab = ref("desc");
const tabs = [
	{ key: "desc", label: "Description", icon: "mdi:text-box-outline" },
	{ key: "reviews", label: "Reviews", icon: "mdi:star-outline" },
];
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
	transition:
		opacity 0.18s ease,
		transform 0.18s ease;
}
.tab-fade-enter-from {
	opacity: 0;
	transform: translateY(6px);
}
.tab-fade-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
