<template>
	<div class="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
		<Nav />
		<main
			class="flex-1 sm:pt-[80px] lg:pt-[162px] transition-all duration-200"
			:class="mobileSearchOpen ? 'pt-[120px]' : 'pt-[68px]'"
		>
			<slot />
		</main>
		<Footer />
		<MyCart />
	</div>
</template>

<script setup>
const mobileSearchOpen = useState("mobileSearchOpen", () => false);
</script>
