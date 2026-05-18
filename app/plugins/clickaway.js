export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.server) {
		nuxtApp.vueApp.directive("click-outside", {
			getSSRProps: () => ({}),
		});
		return;
	}

	nuxtApp.vueApp.directive("click-outside", {
		beforeMount(el, binding) {
			el._clickOutsideHandler = (event) => {
				if (!el.contains(event.target)) {
					binding.value(event);
				}
			};
			document.addEventListener("pointerdown", el._clickOutsideHandler);
		},
		unmounted(el) {
			document.removeEventListener("pointerdown", el._clickOutsideHandler);
			delete el._clickOutsideHandler;
		},
	});
});
