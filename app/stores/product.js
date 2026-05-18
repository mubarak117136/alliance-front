import {
	PUBLIC_PRODUCTS_ENDPOINT,
	PUBLIC_CAMPAIGNS_ENDPOINT,
	PUBLIC_CAMPAIGN_PRODUCTS_ENDPOINT,
	PUBLIC_PRODUCT_SEARCH_ENDPOINT,
	PUBLIC_BRANDS_ENDPOINT,
} from "@/utils/store/endpoints";
import { buildParams } from "../utils/utils";
import { useUserStore } from "./user";

export const useProductStore = defineStore("productStores", {
	state: () => {
		return {};
	},
	getters: {},
	actions: {
		async fetchBrands(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_BRANDS_ENDPOINT}/all/`, {
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
		async fetchProducts(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_PRODUCTS_ENDPOINT}/${buildParams(params)}`, {
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
		async fetchCampaignProduct(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_CAMPAIGN_PRODUCTS_ENDPOINT}/${buildParams(params)}`, {
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
		async fetchProductFilters(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(
					`${PUBLIC_PRODUCTS_ENDPOINT}/available_filters/${buildParams(
						params
					)}`,
					{
						baseURL: config.public.baseURL,
					}
				)
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
		async fetchProductDetails(slug) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_PRODUCTS_ENDPOINT}/${slug}/`, {
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
		async fetchRelatedProducts(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(
					`${PUBLIC_PRODUCTS_ENDPOINT}/related_products/${buildParams(params)}`,
					{
						baseURL: config.public.baseURL,
					}
				)
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
		async fetchCampaignDetail(slug) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_CAMPAIGNS_ENDPOINT}/${slug}/`, {
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
		async searchProduct(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_PRODUCT_SEARCH_ENDPOINT}/${buildParams(params)}`, {
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
