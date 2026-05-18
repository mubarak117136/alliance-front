import {
	PUBLIC_SETTINGS_ENDPOINT,
	PUBLIC_SHIPPING_CITY_ENDPOINT,
	PUBLIC_CONTACT_US_ENDPOINT,
	PUBLIC_FAQ_ENDPOINT,
	PUBLIC_COUNTRIES_ENDPOINT,
	PUBLIC_STATES_ENDPOINT,
} from "@/utils/store/endpoints";
import { buildParams } from "../utils/utils";
import { useUserStore } from "./user";

export const useUtilityStore = defineStore("utilityStores", {
	state: () => {
		return {
			basic: null,
			social: null,
			main_nav: null,
			footer_nav: null,
			categories: null,
			payment_gateways: null,
			shipping_settings: null,
			cities: [],
			countries: [],
		};
	},
	getters: {
		getBasicSettings(state) {
			return state.basic;
		},
		getSocialSettings(state) {
			return state.social;
		},
		getMainNavs(state) {
			return state.main_nav;
		},
		getFooterNavs(state) {
			return state.footer_nav;
		},
		getCategories(state) {
			return state.categories;
		},
		getShippingSettings(state) {
			return state.shipping_settings;
		},
		getPaymentGateways(state) {
			return state.payment_gateways;
		},
		getCities(state) {
			return state.cities;
		},
		getCountries(state) {
			return state.countries;
		},
	},
	actions: {
		async fetchSettings() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_SETTINGS_ENDPOINT}/all/`, {
					baseURL: config.public.baseURL,
				})
					.then((data) => {
						this.basic = data.basic;
						this.social = data.social;
						this.main_nav = data.main_nav;
						this.footer_nav = data.footer_nav;
						this.categories = data.categories;
						this.payment_gateways = data.payment_gateways;
						this.shipping_settings = data.shipping_settings;
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
		async fetchCountries() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				if (this.countries.length == 0) {
					$fetch(`${PUBLIC_COUNTRIES_ENDPOINT}/`, {
						baseURL: config.public.baseURL,
					})
						.then((data) => {
							this.countries = data;
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					resolve(true);
				}
			});
		},

		async fetchStates(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				$fetch(`${PUBLIC_STATES_ENDPOINT}/${buildParams(payload)}`, {
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

		async fetchShippingCities() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				if (this.cities.length == 0) {
					$fetch(`${PUBLIC_SHIPPING_CITY_ENDPOINT}/`, {
						baseURL: config.public.baseURL,
					})
						.then((data) => {
							this.cities = data;
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					resolve(true);
				}
			});
		},
		async addContactUs(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				if (this.cities.length == 0) {
					$fetch(`${PUBLIC_CONTACT_US_ENDPOINT}/`, {
						method: "post",
						baseURL: config.public.baseURL,
						body: payload,
					})
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					resolve(true);
				}
			});
		},
		async fetchFaq() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				$fetch(`${PUBLIC_FAQ_ENDPOINT}/`, {
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
