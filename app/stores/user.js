import {
	PUBLIC_USERS_ENDPOINT,
	PUBLIC_ADDRESS_ENDPOINT,
	PUBLIC_RATING_ENDPOINT,
	PUBLIC_ORDER_PHONE_VERIFICATION_ENDPOINT,
	PUBLIC_REVIEWS_ENDPOINT,
} from "~/utils/store/endpoints";
import { buildParams } from "../utils/utils";

export const useUserStore = defineStore("userStores", {
	state: () => {
		return {
			user: {
				token: null,
				profile: null,
			},
			sessionId: null,
			signUpData: null,
		};
	},
	getters: {
		getProfile(state) {
			return state.user.profile;
		},
		getsessionId(state) {
			return state.sessionId;
		},
		getSignUpData(state) {
			return state.signUpData;
		},
		getToken(state) {
			return state.user.token;
		},
		getAuthHeader(state) {
			if (state.user.token == null) return null;
			return { Authorization: `Token ${state.user.token}` };
		},
	},
	actions: {
		async signin(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/signin/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						const saleStore = useSaleStore();

						const tokenCookie = useCookie([config.public.tokenName]);
						tokenCookie.value = data.token;
						tokenCookie.path = "/";
						tokenCookie.maxAge = 60 * 60 * 24 * 365;
						tokenCookie.watch = false;

						this.user.token = data.token;
						this.user.profile = data;
						this.sessionCartToUserCart();
						saleStore.fetchMyCarts().then(() => {});
						resolve(data);
					})
					.catch((e) => {
						this.user.token = null;
						this.user.profile = null;

						const tokenCookie = useCookie([config.public.tokenName]);
						tokenCookie.value = null;
						tokenCookie.path = "/";
						tokenCookie.maxAge = -1;
						tokenCookie.watch = false;
						reject(e);
					});
			});
		},
		async otpSignin(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/otp_signin/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						const saleStore = useSaleStore();

						const tokenCookie = useCookie([config.public.tokenName]);
						tokenCookie.value = data.token;
						tokenCookie.path = "/";
						tokenCookie.maxAge = 60 * 60 * 24 * 365;
						tokenCookie.watch = false;

						this.user.token = data.token;
						this.user.profile = data;
						this.sessionCartToUserCart();
						saleStore.fetchMyCarts().then(() => {});

						resolve(data);
					})
					.catch((e) => {
						this.user.token = null;
						this.user.profile = null;

						const tokenCookie = useCookie([config.public.tokenName]);
						tokenCookie.value = null;
						tokenCookie.path = "/";
						tokenCookie.maxAge = -1;
						tokenCookie.watch = false;
						reject(e);
					});
			});
		},
		async signup(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/signup/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						this.signUpData = payload;
						delete payload["g_recaptcha_response"];
						localStorage.setItem(
							`${config.public.siteName}_SIGNUP_DATA`,
							JSON.stringify(payload),
						);
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async getSignUpDataFromLocalStorage() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				var localData = localStorage.getItem(
					`${config.public.siteName}_SIGNUP_DATA`,
				);
				if (localData != null) {
					this.signUpData = JSON.parse(localData);
					localStorage.setItem(
						`${config.public.siteName}_SIGNUP_DATA`,
						localData,
					);
					resolve();
				} else {
					localData = null;
					this.signUpData = JSON.parse(localData);
					localStorage.setItem(
						`${config.public.siteName}_SIGNUP_DATA`,
						localData,
					);
					reject();
				}
			});
		},
		async removeSignupDataFromLocalStorage() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				this.signUpData = null;
				localStorage.removeItem(`${config.public.siteName}_SIGNUP_DATA`);
				resolve();
			});
		},
		async sendVerificationCode(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/send_verification_code/`, {
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
			});
		},

		async verificationConfirm(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/verify_code/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						this.user.token = data.token;

						const tokenCookie = useCookie([config.public.tokenName]);
						tokenCookie.value = data.token;
						tokenCookie.path = "/";
						tokenCookie.maxAge = 60 * 60 * 24 * 365;
						tokenCookie.watch = false;
						this.user.profile = data;
						this.sessionCartToUserCart();
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async getTokenFromLocalStorage() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();

				var localToken = useCookie(config.public.tokenName);
				if (localToken != null) {
					this.user.token = localToken;
					resolve(localToken);
				} else {
					console.log("TOKEN FROM LOCAL STORE ERROR");
					reject("Local Token Error");
				}
			});
		},
		async profile() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/profile/`, {
					baseURL: config.public.baseURL,
					headers: {
						...this.getAuthHeader,
					},
				})
					.then((data) => {
						this.user.profile = data;
						resolve(data);
					})
					.catch((e) => {
						console.log(e);
						this.user.token = null;
						this.user.profile = null;
						const tokenCookie = useCookie([config.public.tokenName]);
						if (tokenCookie) {
							tokenCookie.value = null;
						}
						reject(e);
					});
			});
		},

		async sessionCartToUserCart() {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const params = { session_id: this.sessionId };
				$fetch(
					`${PUBLIC_USERS_ENDPOINT}/session_cart_to_user_cart/${buildParams(
						params,
					)}`,
					{
						baseURL: config.public.baseURL,
						headers: {
							...this.getAuthHeader,
						},
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
		async signout(payload) {
			const config = useRuntimeConfig();
			const saleStore = useSaleStore();

			this.user.token = null;
			this.user.profile = null;

			const tokenCookie = useCookie([config.public.tokenName]);
			tokenCookie.value = null;
			tokenCookie.path = "/";
			tokenCookie.maxAge = -1;
			tokenCookie.watch = false;

			saleStore.fetchMyCarts().then(() => {});
		},
		async changeProfile(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_USERS_ENDPOINT}/profile/`, {
					method: "patch",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload,
				})
					.then((data) => {
						resolve(data);
						this.profile();
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async removeProfile(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_USERS_ENDPOINT}/profile/`, {
					method: "delete",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload,
				})
					.then((data) => {
						resolve(data);
						this.signout();
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async changePassword(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_USERS_ENDPOINT}/change_password/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async fetchAddresses(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_ADDRESS_ENDPOINT}/${buildParams(params)}`, {
					method: "get",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async createAddress(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_ADDRESS_ENDPOINT}/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async updateAddress(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_ADDRESS_ENDPOINT}/${payload?.id}/`, {
					method: "patch",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload?.data,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async deleteAddress(id) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_ADDRESS_ENDPOINT}/${id}/`, {
					method: "delete",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},

		async verifyCodeForForgetPassword(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/verify_code_for_forget_password/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async forgetPassword(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_USERS_ENDPOINT}/forget_password/`, {
					method: "post",
					baseURL: config.public.baseURL,
					body: payload,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async createRating(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;
				$fetch(`${PUBLIC_RATING_ENDPOINT}/`, {
					method: "post",
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
					body: payload,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async fetchRatings(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(`${PUBLIC_RATING_ENDPOINT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async fetchRatingStats(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(
					`${PUBLIC_RATING_ENDPOINT}/rating_stats/${buildParams(params)}`,
					{
						baseURL: config.public.baseURL,
					},
				)
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		async orderPhoneVerificationStatus(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(
					`${PUBLIC_ORDER_PHONE_VERIFICATION_ENDPOINT}/check_order_verify_status/`,
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
						reject(e);
					});
			});
		},
		async orderPhoneVerificationCodeResend(payload) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				$fetch(
					`${PUBLIC_ORDER_PHONE_VERIFICATION_ENDPOINT}/resend_order_verification_code/`,
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
						reject(e);
					});
			});
		},
		async fetchReviews(params = {}) {
			return new Promise((resolve, reject) => {
				const config = useRuntimeConfig();
				const authHeader = this.getAuthHeader;

				$fetch(`${PUBLIC_REVIEWS_ENDPOINT}/${buildParams(params)}`, {
					baseURL: config.public.baseURL,
					headers: {
						...authHeader,
					},
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
	},
});
