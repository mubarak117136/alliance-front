import { PAGE_API_ROOT } from "@/utils/store/endpoints";
import { buildParams } from "../utils/utils";
import { useUserStore } from "./user";

export const useHomeStore = defineStore("homeStores", {
	state: () => {
		return {};
	},
	getters: {},
	actions: {
		async fetchCurrentPage(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PAGE_API_ROOT}/find/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
		async fetchPage(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PAGE_API_ROOT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
	},
});
