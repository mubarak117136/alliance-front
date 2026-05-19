import {
	PUBLIC_CARTS_ENDPOINT,
	PUBLIC_SHIPPING_RATE_ENDPOINT,
	PUBLIC_ORDERS_ENDPOINT,
	PUBLIC_LANDING_ORDERS_ENDPOINT,
	PUBLIC_WISHLISTS_ENDPOINT,
	PUBLIC_COINS_ENDPOINT,
} from "@/utils/store/endpoints";
import { buildParams } from "../utils/utils";
import { useUserStore } from "./user";

export const useSaleStore = defineStore("saleStores", {
	state: () => {
		return {
			carts: [],
			cartTotal: 0,
			cartTotalItem: 0,
			cartModalOpen: false,
			shippingCost: 0,
			shippingServices: null,
			selectedShippingService: null,
		};
	},
	getters: {
		getCarts(state) {
			return state.carts;
		},
		getCartTotal(state) {
			return state.cartTotal;
		},
		getCartTotalItem(state) {
			return state.cartTotalItem;
		},
		getcartModalOpen(state) {
			return state.cartModalOpen;
		},
		getShippingCost(state) {
			return state.shippingCost;
		},
		getShippingServices(state) {
			return state.shippingServices;
		},
		getSelectedShippingService(state) {
			return state.selectedShippingService;
		},
	},
	actions: {
		async fetchCoins(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_COINS_ENDPOINT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
					headers: { ...userStore.getAuthHeader },
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
		async fetchWishlists(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_WISHLISTS_ENDPOINT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
					headers: { ...userStore.getAuthHeader },
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
		async addToWishlist(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_WISHLISTS_ENDPOINT}/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: { ...userStore.getAuthHeader },
					body: payload,
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
		async removeFromWishlist(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_WISHLISTS_ENDPOINT}/delete_from_wishlist/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: { ...userStore.getAuthHeader },
					body: payload,
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
		async checkWishlistItemInProduct(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(
					`${PUBLIC_WISHLISTS_ENDPOINT}/check_product_in_wishlist/${buildParams(
						params,
					)}`,
					{
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
					},
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
		async addToCart(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/add_to_cart/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
						body: payload,
					})
						.then((data) => {
							resolve(data);
							this.fetchMyCarts();
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					payload["session_id"] = userStore.getsessionId;
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/add_to_cart/`, {
						method: "post",
						baseURL: config.public.baseURL,
						body: payload,
					})
						.then((data) => {
							resolve(data);
							this.fetchMyCarts();
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async fetchMyCarts() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/`, {
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
					})
						.then((data) => {
							this.carts = data;
							this.cartTotal = 0;
							this.cartTotalItem = 0;

							for (var i = 0; i < data?.length; i++) {
								this.cartTotal = this.cartTotal + data[i]?.price;

								this.cartTotalItem = this.cartTotalItem + data[i]?.total_item;
							}
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					const params = { session_id: userStore.getsessionId };
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/${buildParams(params)}`, {
						baseURL: config.public.baseURL,
					})
						.then((data) => {
							this.carts = data;
							this.cartTotal = 0;
							this.cartTotalItem = 0;
							for (var i = 0; i < data?.length; i++) {
								this.cartTotal = this.cartTotal + data[i]?.price;
								this.cartTotalItem = this.cartTotalItem + data[i]?.total_item;
							}
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async updateCart(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/update_cart_quantity/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
						body: payload,
					})
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					payload["session_id"] = userStore.getsessionId;
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/update_cart_quantity/`, {
						method: "post",
						baseURL: config.public.baseURL,
						body: payload,
					})
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async deleteCart(cartId) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/${cartId}/`, {
						method: "delete",
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
					})
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					const params = { session_id: userStore.getsessionId };
					$fetch(`${PUBLIC_CARTS_ENDPOINT}/${cartId}/${buildParams(params)}`, {
						method: "delete",
						baseURL: config.public.baseURL,
					})
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async fetchShippingRate(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(
						`${PUBLIC_SHIPPING_RATE_ENDPOINT}/rate/${buildParams(params)}`,
						{
							method: "get",
							baseURL: config.public.baseURL,
							headers: { ...userStore.getAuthHeader },
						},
					)
						.then((data) => {
							this.shippingServices = data;
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					params["session_id"] = userStore.getsessionId;
					$fetch(
						`${PUBLIC_SHIPPING_RATE_ENDPOINT}/rate/${buildParams(params)}`,
						{
							method: "get",
							baseURL: config.public.baseURL,
						},
					)
						.then((data) => {
							this.shippingServices = data;
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async fetchLandingShippingRateWithoutCart(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				$fetch(
					`${PUBLIC_SHIPPING_RATE_ENDPOINT}/landing_rate/${buildParams(
						params,
					)}`,
					{
						method: "get",
						baseURL: config.public.baseURL,
					},
				)
					.then((data) => {
						this.shippingCost = data?.price;
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						reject(e);
					});
			});
		},
		async createOrder(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/create_order/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
						body: payload,
					})
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/create_order/${buildParams(params)}`,
						{
							method: "post",
							baseURL: config.public.baseURL,
							body: payload,
						},
					)
						.then((data) => {
							this.fetchMyCarts();
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async orderDetail(order_id) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/${order_id}/`, {
						method: "get",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
					})
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				} else {
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/${order_id}/${buildParams(params)}`,
						{
							method: "get",
							baseURL: config.public.baseURL,
						},
					)
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async cashOnDelivary(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/cash_on_delivary/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/cash_on_delivary/${buildParams(params)}`,
						{
							method: "post",
							baseURL: config.public.baseURL,
							body: payload,
						},
					)
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async stripePayment(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/stripe/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: { ...userStore.getAuthHeader },
						body: payload,
					})
						.then((data) => resolve(data))
						.catch((e) => reject(e));
				} else {
					const params = { session_id: userStore.getsessionId };
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/stripe/${buildParams(params)}`, {
						method: "post",
						baseURL: config.public.baseURL,
						body: payload,
					})
						.then((data) => resolve(data))
						.catch((e) => reject(e));
				}
			});
		},
		async applyCoupon(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/apply_coupon/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/apply_coupon/${buildParams(params)}`,
						{
							method: "post",
							baseURL: config.public.baseURL,
							body: payload,
						},
					)
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async removeCoupon(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/remove_coupon/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/remove_coupon/${buildParams(params)}`,
						{
							method: "post",
							baseURL: config.public.baseURL,
							body: payload,
						},
					)
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async applyCoin(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_ORDERS_ENDPOINT}/apply_coin/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...userStore.getAuthHeader,
					},
					body: payload,
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
		async removeCoin(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_ORDERS_ENDPOINT}/remove_coin/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...userStore.getAuthHeader,
					},
					body: payload,
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
		async fetchOrders(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_ORDERS_ENDPOINT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
					headers: {
						...userStore.getAuthHeader,
					},
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
		async cancelOrder(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				$fetch(`${PUBLIC_ORDERS_ENDPOINT}/cancel_order/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...userStore.getAuthHeader,
					},
					body: payload,
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
		async landingCreateOrder(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_LANDING_ORDERS_ENDPOINT}/create_order/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					$fetch(`${PUBLIC_LANDING_ORDERS_ENDPOINT}/create_order/`, {
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
				}
			});
		},
		async sslCommerzPayment(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/ssl_commerz/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(
						`${PUBLIC_ORDERS_ENDPOINT}/ssl_commerz/${buildParams(params)}`,
						{
							method: "post",
							baseURL: config.public.baseURL,
							body: payload,
						},
					)
						.then((data) => {
							resolve(data);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
		async bkashPayment(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/bkash/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/bkash/${buildParams(params)}`, {
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
				}
			});
		},
		async nagadPayment(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const userStore = useUserStore();

				if (userStore.getAuthHeader) {
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/nagad/`, {
						method: "post",
						baseURL: config.public.baseURL,
						headers: {
							...userStore.getAuthHeader,
						},
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
					const params = { session_id: userStore.getsessionId };
					$fetch(`${PUBLIC_ORDERS_ENDPOINT}/nagad/${buildParams(params)}`, {
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
				}
			});
		},
	},
});
