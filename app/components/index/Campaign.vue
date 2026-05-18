<template>
	<section class="max-w-[1280px] mx-auto px-2 sm:px-4 lg:px-6">
		<div
			class="campaign-wrapper relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-blue-50 via-white to-indigo-50"
		>
			<div class="absolute inset-0 campaign-grid-pattern opacity-[0.35]" />
			<div
				class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-[80px] rounded-full"
			/>
			<div
				class="absolute bottom-0 right-0 w-[400px] h-[200px] bg-accent/10 blur-[80px] rounded-full"
			/>
			<!-- Header -->
			<div class="relative z-10 px-4 sm:px-8 pt-6 pb-4">
				<div />
				<div
					class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 shrink-0"
						>
							<Icon name="mdi:flash" class="text-accent" size="20" />
						</div>
						<div>
							<p
								class="text-primary/60 text-xs font-medium uppercase tracking-widest"
							>
								Limited Offer
							</p>
							<h2
								class="text-gray-900 text-base sm:text-xl lg:text-2xl font-bold leading-tight"
							>
								{{ item.name }}
							</h2>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-gray-500 text-xs font-medium mr-1 hidden sm:block"
							>Ends in</span
						>
						<ClientOnly>
							<VueCountdown
								:time="timeLeft"
								v-slot="{ days, hours, minutes, seconds }"
							>
								<div class="flex items-center gap-1 sm:gap-1.5">
									<template
										v-for="unit in [
											{ val: days, label: 'Days' },
											{ val: hours, label: 'Hrs' },
											{ val: minutes, label: 'Min' },
											{ val: seconds, label: 'Sec' },
										]"
										:key="unit.label"
									>
										<div class="flex flex-col items-center">
											<div class="countdown-digit">
												{{ String(unit.val).padStart(2, "0") }}
											</div>
											<span
												class="text-gray-400 text-[9px] font-medium mt-0.5 uppercase tracking-wider"
												>{{ unit.label }}</span
											>
										</div>
										<span
											v-if="unit.label !== 'Sec'"
											class="text-gray-300 font-bold text-lg mb-4"
											>:</span
										>
									</template>
								</div>
							</VueCountdown>
						</ClientOnly>
					</div>
				</div>
			</div>

			<!-- Products area -->
			<div class="relative z-10 px-2 pt-4 pb-6 sm:px-6 lg:px-8">
				<div>
					<div
						class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-5"
					/>
					<!-- Products grid -->
					<div
						class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 items-stretch"
					>
						<SingleProduct
							v-for="product in item.products"
							:key="product.id"
							:product="product"
						/>
					</div>
					<!-- Footer CTA -->
					<div class="mt-5 sm:mt-8 flex justify-center">
						<NuxtLink
							:to="`/campaigns/${item.slug}`"
							class="group flex items-center gap-2 bg-white hover:bg-primary border border-gray-200 hover:border-primary text-gray-600 hover:text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm"
						>
							View All Campaign Products
							<Icon
								name="mdi:arrow-right"
								size="16"
								class="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	block: {
		type: Object,
		required: true,
	},
});


const item = computed(() => props.block.value.item);

const timeLeft = computed(() => {
	const endDate = new Date(item.value?.end_date);
	const diff = endDate.getTime() - Date.now();
	return diff > 0 ? diff : 0;
});

</script>

<style>
.campaign-grid-pattern {
	background-image:
		linear-gradient(rgba(99, 102, 241, 0.07) 1px, transparent 1px),
		linear-gradient(90deg, rgba(99, 102, 241, 0.07) 1px, transparent 1px);
	background-size: 40px 40px;
}

.countdown-digit {
	min-width: 30px;
	text-align: center;
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 3px 6px;
	font-size: 14px;
	font-weight: 700;
	color: #1565c0;
	font-variant-numeric: tabular-nums;
	letter-spacing: 0.02em;
}

@media (min-width: 640px) {
	.countdown-digit {
		min-width: 38px;
		padding: 5px 8px;
		font-size: 17px;
	}
}
</style>
