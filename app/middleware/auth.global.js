import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore();
	const router = useRouter();

	const currentRoute = to.name;
	const token = userStore.getToken;

	const authRouteName = ["account-slug-orderid"];
	const match = authRouteName.includes(currentRoute);
	if (match === true) {
		if (token === null) {
			return router.push("/signin");
		}
	}
});
