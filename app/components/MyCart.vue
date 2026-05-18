<template>
	<Teleport to="body">
		<!-- Backdrop -->
		<Transition name="drawer-fade">
			<div
				v-if="getcartModalOpen"
				class="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-[3px]"
				@click.self="saleStore.cartModalOpen = false"
			/>
		</Transition>

		<!-- Drawer -->
		<Transition name="drawer-slide">
			<div
				v-if="getcartModalOpen"
				class="fixed top-0 right-0 z-[9999] h-full w-full max-w-[400px] flex flex-col bg-white"
			>
				<!-- Header -->
				<div class="relative shrink-0 px-5 pt-5 pb-4">
					<!-- Top accent bar -->
					<div
						class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent"
					/>

					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="relative">
								<div
									class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/25"
								>
									<Icon
										name="ri:shopping-basket-fill"
										size="20"
										class="text-white"
									/>
								</div>
								<span
									v-if="getCarts.length > 0"
									class="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-accent text-white text-[11px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 leading-none"
								>
									{{ getCartTotalItem }}
								</span>
							</div>
							<div>
								<h2 class="text-[15px] font-black text-gray-900 tracking-tight">
									My Cart
								</h2>
								<p class="text-[11px] text-gray-400 font-medium">
									{{
										getCartTotalItem === 0
											? "Empty"
											: `${getCartTotalItem} ${getCartTotalItem === 1 ? "product" : "products"}`
									}}
								</p>
							</div>
						</div>
						<button
							class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
							@click="saleStore.cartModalOpen = false"
						>
							<Icon name="mdi:close" size="16" />
						</button>
					</div>
				</div>

				<!-- Divider -->
				<div class="h-px bg-gray-100 shrink-0 mx-5" />

				<!-- Items -->
				<div class="flex-1 overflow-y-auto overscroll-contain">
					<div v-if="getCarts.length > 0" class="px-4 py-3 flex flex-col gap-2">
						<div
							v-for="(item, idx) in getCarts"
							:key="'cart_' + item.id"
							class="group relative flex gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition-colors"
						>
							<!-- Image -->
							<div class="shrink-0 relative self-start">
								<div
									class="w-[68px] h-[68px] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm"
								>
									<img
										v-if="item?.product_detail?.default_image"
										:src="HOST + item.product_detail.default_image.original.src"
										:alt="item.product_detail.default_image.original.alt"
										class="w-full h-full object-cover"
									/>
									<div
										v-else
										class="w-full h-full flex items-center justify-center"
									>
										<Icon
											name="mdi:image-off-outline"
											size="18"
											class="text-gray-300"
										/>
									</div>
								</div>
								<!-- Qty badge -->
								<span
									v-if="item.total_item > 1"
									class="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center shadow-sm"
								>
									{{ item.total_item }}
								</span>
							</div>

							<!-- Info -->
							<div class="flex-1 min-w-0 flex flex-col gap-1">
								<!-- Name -->
								<NuxtLink
									:to="{
										name: 'products-slug',
										params: { slug: item?.product_detail?.slug },
									}"
									class="text-[13px] font-bold text-gray-800 hover:text-primary transition-colors leading-snug line-clamp-2 pr-6"
									@click="saleStore.cartModalOpen = false"
								>
									{{ item?.product_detail?.name }}
								</NuxtLink>

								<!-- Attributes -->
								<div class="flex flex-wrap gap-1">
									<span
										v-if="item?.variant_detail?.name"
										class="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/10"
									>
										{{ item.variant_detail.name }}
									</span>
									<span
										v-if="!isObjectEmpty(item?.static_attribute_data)"
										class="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-500"
									>
										{{ convertObjToString(item?.static_attribute_data) }}
									</span>
								</div>

								<!-- Price + unit -->
								<div class="flex items-center justify-between mt-0.5">
									<span class="text-sm font-black text-accent">
										{{ currency }}{{ item?.price?.toLocaleString() }}
									</span>
									<span class="text-[10px] text-gray-400 font-medium">
										{{ item.total_item }} × {{ currency
										}}{{ item?.variant_detail?.price?.toLocaleString() }}
									</span>
								</div>

								<!-- Stepper -->
								<div class="flex items-center justify-between mt-1">
									<div
										class="flex items-center gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm"
									>
										<button
											class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
											:disabled="
												item.total_item <=
												Math.max(1, item?.variant_detail?.min_purchase ?? 1)
											"
											@click="decrement(item, idx)"
										>
											<Icon name="mdi:minus" size="11" />
										</button>
										<span
											class="w-8 text-center text-xs font-black text-gray-800 select-none border-x border-gray-200"
										>
											{{ item.total_item }}
										</span>
										<button
											class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
											:disabled="
												item.total_item >= item?.variant_detail?.quantity
											"
											@click="increment(item, idx)"
										>
											<Icon name="mdi:plus" size="11" />
										</button>
									</div>

									<!-- Delete -->
									<button
										class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-40"
										:disabled="loading"
										@click="handleCartRemove(item)"
									>
										<Icon name="mdi:trash-can-outline" size="14" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Empty state -->
					<div
						v-else
						class="flex flex-col items-center justify-center h-full py-16 px-8 text-center"
					>
						<div
							class="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5"
						>
							<Icon name="mdi:cart-outline" size="34" class="text-gray-300" />
						</div>
						<p class="text-gray-800 font-black text-base mb-1.5">
							Your cart is empty
						</p>
						<p class="text-gray-400 text-sm leading-relaxed mb-6">
							Looks like you haven't added<br />anything yet.
						</p>
						<button
							class="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
							@click="saleStore.cartModalOpen = false"
						>
							Browse Products
						</button>
					</div>
				</div>

				<!-- Footer summary -->
				<div v-if="getCarts.length > 0" class="shrink-0">
					<div
						class="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
					/>
					<div class="px-5 py-4 flex flex-col gap-3">
						<!-- Total -->
						<div class="flex items-center justify-between">
							<div>
								<p
									class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider"
								>
									Order Total
								</p>
								<p class="text-2xl font-black text-gray-900 leading-tight">
									<span class="text-base font-bold text-gray-500">{{
										currency
									}}</span
									>{{ getCartTotal?.toLocaleString() }}
								</p>
							</div>
							<div class="text-right">
								<p class="text-[11px] text-gray-400 font-medium">
									{{ getCartTotalItem }}
									{{ getCartTotalItem === 1 ? "item" : "items" }}
								</p>
								<p
									class="text-[11px] text-green-600 font-semibold flex items-center gap-1 justify-end mt-0.5"
								>
									<Icon name="mdi:shield-check-outline" size="11" />
									Secure checkout
								</p>
							</div>
						</div>

						<!-- CTA -->
						<button
							class="w-full relative flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm h-12 rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
							:disabled="loading"
							@click="handleGoToCheckout"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
							/>
							<Icon name="mdi:lock-outline" size="15" class="relative" />
							<span class="relative">Proceed to Checkout</span>
							<Icon name="mdi:arrow-right" size="15" class="relative" />
						</button>

						<button
							class="text-[11px] text-gray-400 hover:text-primary font-semibold transition-colors text-center py-0.5"
							@click="saleStore.cartModalOpen = false"
						>
							← Continue Shopping
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";
import { useToast } from "vue-toastification";
import { isObjectEmpty, convertObjToString } from "@/utils/utils";

const config = useRuntimeConfig();
const saleStore = useSaleStore();
const toast = useToast();
const router = useRouter();

const { getCarts, getCartTotal, getCartTotalItem, getcartModalOpen } =
	storeToRefs(saleStore);

const currency = config.public.currency;
const HOST = config.public.HOST;
const loading = ref(false);

function increment(item, idx) {
	if (item.total_item >= item?.variant_detail?.quantity) return;
	getCarts.value[idx].total_item++;
	handleQuantityChange(item);
}

function decrement(item, idx) {
	const min = Math.max(1, item?.variant_detail?.min_purchase ?? 1);
	if (item.total_item <= min) return;
	getCarts.value[idx].total_item--;
	handleQuantityChange(item);
}

function handleQuantityChange(item) {
	const max = item?.variant_detail?.quantity;
	const min = item?.variant_detail?.min_purchase ?? 1;

	if (item.total_item > max) {
		item.total_item = max;
		toast.error(`Item quantity can't be more than ${max}`);
	}
	if (item.total_item < 1) {
		item.total_item = 1;
		toast.error("Item quantity can't be less than 1");
	}
	if (item.total_item < min) {
		item.total_item = min;
		toast.error(`Minimum purchase for this item is ${min}`);
	}

	loading.value = true;
	saleStore
		.updateCart({ cart: item.id, total_item: item.total_item })
		.then(() => {
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
}

function handleCartRemove(item) {
	loading.value = true;
	saleStore
		.deleteCart(item.id)
		.then(() => {
			loading.value = false;
			toast.success("Item removed from cart!");
		})
		.catch(() => {
			loading.value = false;
		});
}

function handleGoToCheckout() {
	saleStore.cartModalOpen = false;
	router.push({ name: "checkout-shipping" });
}
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
	transition: opacity 0.25s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
	opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
	transform: translateX(100%);
}

.bg-primary\/8 {
	background-color: rgb(21 101 192 / 0.08);
}
</style>
