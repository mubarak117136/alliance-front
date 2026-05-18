export const PAGE_API_ROOT = `/api/v2/pages`;
export const PUBLIC_ACCOUNT_ENDPOINT = `/api/v1/account/public`;
export const PUBLIC_PRODUCT_ENDPOINT = `/api/v1/product/public`;
export const PUBLIC_SALE_ENDPOINT = `/api/v1/sell/public`;
export const PUBLIC_UTILITY_ENDPOINT = `/api/v1/utility/public`;

export const PUBLIC_USERS_ENDPOINT = PUBLIC_ACCOUNT_ENDPOINT + "/users";
export const PUBLIC_ORDER_PHONE_VERIFICATION_ENDPOINT =
	PUBLIC_ACCOUNT_ENDPOINT + "/order-phone-verification";
export const PUBLIC_REVIEWS_ENDPOINT =
	PUBLIC_ACCOUNT_ENDPOINT + "/rating-reviews";

export const PUBLIC_SETTINGS_ENDPOINT = PUBLIC_UTILITY_ENDPOINT + `/settings`;
export const PUBLIC_COUNTRIES_ENDPOINT = PUBLIC_UTILITY_ENDPOINT + `/countries`;
export const PUBLIC_STATES_ENDPOINT = PUBLIC_UTILITY_ENDPOINT + `/states`;
export const PUBLIC_SHIPPING_CITY_ENDPOINT =
	PUBLIC_UTILITY_ENDPOINT + `/shipping-cities`;

export const PUBLIC_CONTACT_US_ENDPOINT =
	PUBLIC_UTILITY_ENDPOINT + `/contact-us`;
export const PUBLIC_FAQ_ENDPOINT = PUBLIC_UTILITY_ENDPOINT + `/faqs`;

export const PUBLIC_PRODUCTS_ENDPOINT = PUBLIC_PRODUCT_ENDPOINT + `/products`;
export const PUBLIC_BRANDS_ENDPOINT = PUBLIC_PRODUCT_ENDPOINT + `/brands`;
export const PUBLIC_PRODUCT_SEARCH_ENDPOINT =
	PUBLIC_PRODUCT_ENDPOINT + `/product-search`;

export const PUBLIC_CAMPAIGNS_ENDPOINT = PUBLIC_PRODUCT_ENDPOINT + `/campaigns`;
export const PUBLIC_CAMPAIGN_PRODUCTS_ENDPOINT =
	PUBLIC_PRODUCT_ENDPOINT + `/campaign-products`;

export const PUBLIC_CARTS_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/carts`;
export const PUBLIC_WISHLISTS_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/wishlists`;
export const PUBLIC_COINS_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/coins`;

export const PUBLIC_SHIPPING_RATE_ENDPOINT =
	PUBLIC_SALE_ENDPOINT + `/shipping-rates`;
export const PUBLIC_ORDERS_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/orders`;
export const PUBLIC_LANDING_ORDERS_ENDPOINT =
	PUBLIC_SALE_ENDPOINT + `/landing-orders`;

export const PUBLIC_ADDRESS_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/addresses`;
export const PUBLIC_RATING_ENDPOINT = PUBLIC_SALE_ENDPOINT + `/ratings`;
