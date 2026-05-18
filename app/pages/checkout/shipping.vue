<template>
	<div class="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Stepper -->
		<div class="max-w-md mx-auto mb-8">
			<CheckoutStepper :step="1" />
		</div>

		<!-- Page title -->
		<div class="mb-6">
			<h1 class="text-xl font-black text-gray-900 tracking-tight">Checkout</h1>
			<p class="text-sm text-gray-400 mt-0.5">
				Fill in your shipping details to proceed
			</p>
		</div>

		<!-- Skeleton -->
		<div
			v-if="!isMounted"
			class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start"
		>
			<!-- Left: form skeleton -->
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				<!-- Header -->
				<div
					class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60"
				>
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
						<div class="flex flex-col gap-1.5">
							<div class="h-3.5 w-32 rounded bg-gray-200 animate-pulse" />
							<div class="h-3 w-40 rounded bg-gray-100 animate-pulse" />
						</div>
					</div>
				</div>
				<div class="p-5 sm:p-6 flex flex-col gap-5">
					<!-- Row: name + city -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-20 rounded bg-gray-200 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-12 rounded bg-gray-200 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
					</div>
					<!-- Address -->
					<div class="flex flex-col gap-1.5">
						<div class="h-3 w-16 rounded bg-gray-200 animate-pulse" />
						<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
					</div>
					<!-- Row: email + phone -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-24 rounded bg-gray-200 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
						<div class="flex flex-col gap-1.5">
							<div class="h-3 w-16 rounded bg-gray-200 animate-pulse" />
							<div class="h-11 rounded-xl bg-gray-100 animate-pulse" />
						</div>
					</div>
					<div class="h-px bg-gray-100" />
					<!-- Checkboxes -->
					<div class="flex flex-col gap-3">
						<div class="flex items-center gap-3">
							<div
								class="w-5 h-5 rounded-md bg-gray-200 animate-pulse shrink-0"
							/>
							<div class="h-3 w-52 rounded bg-gray-100 animate-pulse" />
						</div>
						<div class="flex items-center gap-3">
							<div
								class="w-5 h-5 rounded-md bg-gray-200 animate-pulse shrink-0"
							/>
							<div class="h-3 w-64 rounded bg-gray-100 animate-pulse" />
						</div>
					</div>
					<!-- Button -->
					<div class="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
				</div>
			</div>

			<!-- Right: order summary skeleton -->
			<div class="flex flex-col gap-4">
				<div
					class="bg-white border border-gray-100 rounded-2xl overflow-hidden"
				>
					<div
						class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60"
					>
						<div class="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
						<div class="h-4 w-28 rounded bg-gray-200 animate-pulse" />
					</div>
					<div class="px-4 py-3 flex flex-col gap-3">
						<div v-for="i in 3" :key="i" class="flex gap-3 py-2">
							<div
								class="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0"
							/>
							<div class="flex-1 flex flex-col gap-2 pt-1">
								<div class="h-3 w-full rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
							</div>
							<div class="w-12 flex flex-col gap-1.5 items-end pt-1 shrink-0">
								<div class="h-4 w-10 rounded bg-gray-200 animate-pulse" />
								<div class="h-3 w-8 rounded bg-gray-100 animate-pulse" />
							</div>
						</div>
					</div>
					<div class="px-5 py-4 border-t border-gray-100 flex flex-col gap-2">
						<div v-for="i in 3" :key="i" class="flex justify-between">
							<div class="h-3.5 w-20 rounded bg-gray-100 animate-pulse" />
							<div class="h-3.5 w-16 rounded bg-gray-200 animate-pulse" />
						</div>
					</div>
				</div>
				<!-- Trust badges skeleton -->
				<div class="grid grid-cols-3 gap-2">
					<div
						v-for="i in 3"
						:key="i"
						class="h-16 rounded-xl bg-gray-100 animate-pulse"
					/>
				</div>
			</div>
		</div>

		<!-- Two-column layout -->
		<div
			v-else
			class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start"
		>
			<!-- Form -->
			<CheckoutShippingForm />

			<!-- Order summary -->
			<div class="lg:sticky lg:top-[100px]">
				<CheckoutShippingRates />
				<CheckoutShippingProducts />

				<!-- Trust badges -->
				<div class="grid grid-cols-3 gap-2 mt-4">
					<div
						v-for="t in trustItems"
						:key="t.label"
						class="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-white border border-gray-100 text-center"
					>
						<Icon :name="t.icon" size="16" class="text-primary" />
						<span
							class="text-[10px] font-semibold text-gray-500 leading-tight"
							>{{ t.label }}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const isMounted = ref(false);

const trustItems = [
	{ icon: "mdi:lock-outline", label: "Secure Checkout" },
	{ icon: "mdi:truck-fast-outline", label: "Fast Delivery" },
	{ icon: "mdi:refresh", label: "Easy Returns" },
];

onMounted(() => {
	isMounted.value = true;
});

useHead({ title: "Shipping — Checkout" });
</script>
