<template>
	<div class="w-full">
		<!-- Hero -->
		<div
			class="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-b border-gray-100 py-14 px-4 text-center -mt-[128px] sm:-mt-[88px] lg:-mt-[172px] pt-[156px] sm:pt-[116px] lg:pt-[200px]"
		>
			<div
				class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4"
			>
				<Icon name="mdi:help-circle-outline" size="24" class="text-primary" />
			</div>
			<h1
				class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3"
			>
				How can we help you?
			</h1>
			<p class="text-sm sm:text-base text-gray-400 max-w-md mx-auto">
				Find quick answers to our most frequently asked questions
			</p>
		</div>

		<div class="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10">
			<!-- Loading skeleton -->
			<div v-if="pending" class="flex flex-col gap-3">
				<div
					v-for="n in 6"
					:key="n"
					class="h-16 rounded-2xl bg-gray-100 animate-pulse"
				/>
			</div>

			<!-- FAQ accordion -->
			<div v-else class="flex flex-col gap-2">
				<div
					v-for="(item, idx) in data?.items"
					:key="'faq_' + idx"
					class="rounded-2xl border bg-white overflow-hidden transition-all duration-200"
					:class="
						openIndex === idx
							? 'border-primary/30 shadow-sm shadow-primary/10'
							: 'border-gray-100 hover:border-gray-200'
					"
				>
					<button
						class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
						:class="openIndex === idx ? 'bg-primary/5' : 'hover:bg-gray-50'"
						@click="toggle(idx)"
					>
						<div class="flex items-center gap-3 min-w-0">
							<span
								class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors"
								:class="
									openIndex === idx
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-400'
								"
								>{{ idx + 1 }}</span
							>
							<span
								class="text-sm font-semibold transition-colors"
								:class="openIndex === idx ? 'text-primary' : 'text-gray-800'"
								>{{ item.q }}</span
							>
						</div>
						<Icon
							name="mdi:plus"
							size="18"
							class="shrink-0 transition-all duration-300"
							:class="
								openIndex === idx ? 'rotate-45 text-primary' : 'text-gray-300'
							"
						/>
					</button>
					<Transition
						enter-active-class="transition-all duration-200 ease-out"
						enter-from-class="opacity-0 -translate-y-1"
						enter-to-class="opacity-100 translate-y-0"
						leave-active-class="transition-all duration-150 ease-in"
						leave-from-class="opacity-100 translate-y-0"
						leave-to-class="opacity-0 -translate-y-1"
					>
						<div
							v-if="openIndex === idx"
							class="px-5 pb-5 pt-3 border-t border-primary/10"
						>
							<p class="text-sm text-gray-500 leading-relaxed pl-9">
								{{ item.a }}
							</p>
						</div>
					</Transition>
				</div>

				<!-- Empty state -->
				<div
					v-if="!data?.items?.length"
					class="flex flex-col items-center justify-center py-20 text-center"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"
					>
						<Icon
							name="mdi:help-circle-outline"
							size="28"
							class="text-gray-300"
						/>
					</div>
					<p class="text-gray-500 font-semibold">No FAQs available</p>
				</div>
			</div>

			<!-- Contact CTA -->
			<div
				v-if="!pending && data?.items?.length"
				class="mt-10 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 p-6 text-center"
			>
				<p class="text-sm font-semibold text-gray-700 mb-1">
					Still have questions?
				</p>
				<p class="text-xs text-gray-400 mb-4">
					Our support team is happy to help
				</p>
				<NuxtLink
					to="/contact-us"
					class="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
				>
					<Icon name="mdi:message-outline" size="16" />
					Contact Support
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useUtilityStore } from "@/stores/utility";

const utilityStore = useUtilityStore();

const openIndex = ref(null);

function toggle(idx) {
	openIndex.value = openIndex.value === idx ? null : idx;
}

const { data, pending } = await useAsyncData("faqPageItems", async () => {
	let items = [];
	await utilityStore
		.fetchFaq()
		.then((d) => {
			items = d;
		})
		.catch((e) => {
			console.log(e);
		});
	return { items };
});
</script>
