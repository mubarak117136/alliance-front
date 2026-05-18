<template>
	<div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
		<!-- Hero -->
		<div class="mb-10 text-center">
			<h1
				class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3"
			>
				Shop by Brand
			</h1>
			<p class="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
				Browse our complete collection of trusted brands — from global names to
				local favorites.
			</p>
		</div>

		<!-- Search -->
		<div class="max-w-sm mx-auto mb-8 relative">
			<Icon
				name="mdi:magnify"
				size="18"
				class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
			/>
			<input
				v-model="search"
				type="text"
				placeholder="Search brands..."
				class="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:border-primary bg-white"
			/>
		</div>

		<!-- Loading skeleton -->
		<div
			v-if="pending"
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
		>
			<div
				v-for="n in 24"
				:key="n"
				class="rounded-2xl bg-gray-100 animate-pulse aspect-[3/2]"
			/>
		</div>

		<template v-else>
			<!-- Brand grid -->
			<div
				v-if="filteredBrands.length"
				class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
			>
				<NuxtLink
					v-for="brand in filteredBrands"
					:key="brand.id"
					:to="{ path: '/stores', query: { brand: brand.slug } }"
					class="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200"
					:aria-label="brand.name"
				>
					<div class="w-full flex items-center justify-center h-12">
						<img
							v-if="brand.logo_detail?.original?.src"
							:src="HOST + brand.logo_detail.original.src"
							:alt="brand.logo_detail.original.alt || brand.name"
							class="max-h-12 max-w-full object-contain"
						/>
						<div
							v-else
							class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
						>
							<span class="text-primary font-black text-sm">
								{{ brand.name.charAt(0) }}
							</span>
						</div>
					</div>
					<span
						class="text-[11px] font-semibold text-gray-500 text-center truncate w-full group-hover:text-primary transition-colors"
					>
						{{ brand.name }}
					</span>
				</NuxtLink>
			</div>

			<!-- Empty search state -->
			<div
				v-else
				class="flex flex-col items-center justify-center py-20 text-center"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"
				>
					<Icon name="mdi:tag-off-outline" size="28" class="text-gray-300" />
				</div>
				<p class="text-gray-500 font-semibold">No brands found</p>
				<p class="text-gray-400 text-sm mt-1">Try a different search term</p>
				<button
					class="mt-4 text-sm text-primary font-semibold"
					@click="search = ''"
				>
					Clear search
				</button>
			</div>
		</template>
	</div>
</template>

<script setup>
import { useProductStore } from "@/stores/product";

const config = useRuntimeConfig();
const productStore = useProductStore();

const HOST = computed(() => config.public.HOST);

const search = ref("");

const { data, pending } = await useAsyncData("brandPageItems", async () => {
	let items = [];
	await productStore
		.fetchBrands()
		.then((d) => {
			items = d;
		})
		.catch((e) => {
			console.log(e);
		});
	return items;
});

const filteredBrands = computed(() => {
	if (!data.value) return [];
	const q = search.value.trim().toLowerCase();
	if (!q) return data.value;
	return data.value.filter((b) => b.name.toLowerCase().includes(q));
});
</script>
