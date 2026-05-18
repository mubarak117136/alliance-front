import { useUserStore } from "@/stores/user";
import { useSaleStore } from "@/stores/sale";

export default defineNuxtPlugin(async (nuxtApp) => {
	const userStore = useUserStore(nuxtApp.$pinia);
	const saleStore = useSaleStore(nuxtApp.$pinia);
	const config = useRuntimeConfig();

	const sessionName = config.public.sessionName;
	let localSession = localStorage.getItem(sessionName);
	if (!localSession) {
		localSession = makeid();
		localStorage.setItem(sessionName, localSession);
	}
	userStore.sessionId = localSession;

	// Fetch carts after session is ready so cart count shows on refresh
	await saleStore.fetchMyCarts().catch(() => {});
});
