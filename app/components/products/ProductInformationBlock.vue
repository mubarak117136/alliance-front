<template>
	<div class="sticky top-[90px] flex flex-col gap-5">
		<!-- Breadcrumbs -->

		<nav class="flex items-center gap-1.5 flex-wrap">
			<NuxtLink
				to="/"
				class="text-xs text-gray-500 hover:text-primary transition-colors font-medium"
				>Home</NuxtLink
			>
			<template v-for="(crumb, i) in breadcrumbs" :key="i">
				<Icon
					name="mdi:chevron-right"
					size="12"
					class="shrink-0 text-gray-300"
				/>
				<NuxtLink
					:to="crumb.to"
					class="text-xs text-gray-500 hover:text-primary transition-colors font-medium truncate max-w-[140px]"
					>{{ crumb.title }}</NuxtLink
				>
			</template>
		</nav>

		<!-- Name -->
		<div>
			<h1
				class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug"
			>
				{{ props.data?.name }}
			</h1>
		</div>

		<!-- Price block -->
		<div class="flex flex-col gap-1.5">
			<div class="flex items-end gap-3 flex-wrap">
				<span class="text-3xl font-black text-accent leading-none">
					{{ currency }}{{ productPriceTotal.toLocaleString() }}
				</span>
				<div class="flex items-center gap-2 mb-0.5">
					<span
						v-if="selectedVariant?.has_offer && selectedVariant?.old_price"
						class="text-sm text-gray-400 line-through"
					>
						{{ currency }}{{ selectedVariant.old_price.toLocaleString() }}
					</span>
					<span
						v-if="
							selectedVariant?.has_offer && selectedVariant?.discount_percent
						"
						class="text-xs font-black bg-accent text-white px-2 py-0.5 rounded-lg"
					>
						{{ Math.round(selectedVariant.discount_percent) }}% OFF
					</span>
				</div>
			</div>
			<p
				v-if="selectedVariant?.has_offer && selectedVariant?.old_price"
				class="text-xs text-green-600 font-semibold"
			>
				You save
				{{ currency
				}}{{ (selectedVariant.old_price - productPriceTotal).toLocaleString() }}
			</p>
		</div>

		<!-- Badges row -->
		<div class="flex items-center flex-wrap gap-2">
			<span
				v-if="selectedVariant"
				class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
				:class="
					selectedVariant.quantity > 0
						? 'bg-green-50 border-green-200 text-green-700'
						: 'bg-red-50 border-red-200 text-red-600'
				"
			>
				<span
					class="w-1.5 h-1.5 rounded-full animate-pulse"
					:class="selectedVariant.quantity > 0 ? 'bg-green-500' : 'bg-red-500'"
				/>
				{{
					selectedVariant.quantity > 0
						? `${selectedVariant.quantity} in stock`
						: "Out of stock"
				}}
			</span>
			<span
				v-if="props.data?.brand_detail"
				class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary"
			>
				<Icon name="mdi:tag-outline" size="12" />
				{{ props.data.brand_detail.name }}
			</span>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600"
			>
				<span class="relative flex w-1.5 h-1.5">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"
					/>
					<span
						class="relative inline-flex rounded-full w-1.5 h-1.5 bg-orange-500"
					/>
				</span>
				{{ watcherCount }} people watching
			</span>
		</div>

		<!-- Short description -->
		<div
			v-if="props.data?.short_description"
			class="border-t border-gray-100 pt-4"
		>
			<div class="relative">
				<div
					class="text-sm text-gray-500 leading-relaxed richtext overflow-hidden transition-all duration-300"
					:style="descExpanded ? '' : 'max-height: 4.5rem'"
					v-html="props.data.short_description"
				/>
				<!-- Fade overlay -->
				<div
					v-if="!descExpanded"
					class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"
				/>
			</div>
			<button
				class="mt-1.5 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors w-full justify-center"
				@click="descExpanded = !descExpanded"
			>
				{{ descExpanded ? "Show less" : "Show more" }}
				<Icon
					:name="descExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
					size="14"
				/>
			</button>
		</div>

		<!-- Variant attributes -->
		<div v-if="props.data?.attributes?.length" class="flex flex-col gap-5">
			<div
				v-for="(attr, idx) in props.data.attributes"
				:key="'attr_' + idx"
				class="flex flex-col gap-2.5"
			>
				<div class="flex items-center gap-2">
					<span
						class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest"
						>{{ attr.name }}</span
					>
					<span class="h-px flex-1 bg-gray-100" />
					<span class="text-[11px] font-semibold text-primary">
						{{ attr.values.find((v) => v.slug === variantInput[idx])?.value }}
					</span>
				</div>
				<div class="flex flex-wrap gap-2">
					<button
						v-for="val in attr.values"
						:key="val.slug"
						class="relative px-4 py-2 rounded-xl border-2 text-[13px] font-semibold transition-all duration-200 active:scale-95"
						:class="
							variantInput[idx] === val.slug
								? 'bg-primary/5 text-primary border-primary'
								: isChipAvailable(idx, val.slug)
									? 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
									: 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
						"
						:disabled="
							!isChipAvailable(idx, val.slug) && variantInput[idx] !== val.slug
						"
						@click="
							isChipAvailable(idx, val.slug) &&
							((variantInput[idx] = val.slug), handleVariantInputChange())
						"
					>
						<span
							v-if="variantInput[idx] === val.slug"
							class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
						>
							<Icon name="mdi:check" size="10" class="text-white" />
						</span>
						{{ val.value }}
					</button>
				</div>
			</div>
		</div>

		<!-- Static attributes -->
		<div
			v-if="props.data?.static_attributes?.length"
			class="flex flex-col gap-5"
		>
			<div
				v-for="(attr, sidx) in props.data.static_attributes"
				:key="'sattr_' + sidx"
				class="flex flex-col gap-2.5"
			>
				<div class="flex items-center gap-2">
					<span
						class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest"
						>{{ attr.name }}</span
					>
					<span class="h-px flex-1 bg-gray-100" />
					<span
						v-if="staticAttribute[attr.slug]?.value"
						class="text-[11px] font-semibold text-primary"
					>
						{{ staticAttribute[attr.slug].value }}
					</span>
				</div>
				<div v-if="attr.input_type === 1" class="flex flex-wrap gap-2">
					<button
						v-for="val in attr.values"
						:key="val.value"
						class="relative px-4 py-2 rounded-xl border-2 text-[13px] font-semibold transition-all duration-200 active:scale-95"
						:class="
							staticAttribute[attr.slug]?.value === val.value
								? 'bg-primary/5 text-primary border-primary'
								: 'bg-white text-gray-500 border-gray-150 hover:border-gray-300 hover:text-gray-800'
						"
						@click="staticAttribute[attr.slug] = val"
					>
						<span
							v-if="staticAttribute[attr.slug]?.value === val.value"
							class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
						>
							<Icon name="mdi:check" size="10" class="text-white" />
						</span>
						{{ val.value
						}}{{
							val.price_addition ? ` +${currency}${val.price_addition}` : ""
						}}
					</button>
				</div>
				<input
					v-else-if="attr.input_type === 2"
					v-model="staticAttribute[attr.slug]"
					type="text"
					:placeholder="`Enter ${attr.name}`"
					class="max-w-xs bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
				/>
			</div>
		</div>

		<!-- Quantity + CTA -->
		<div class="flex items-center gap-3 flex-wrap pt-1">
			<!-- Qty stepper -->
			<div
				class="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white"
			>
				<button
					class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-30"
					:disabled="
						quantity <= Math.max(1, selectedVariant?.min_purchase ?? 1)
					"
					@click="decrementQty"
				>
					<Icon name="mdi:minus" size="15" />
				</button>
				<span
					class="w-10 text-center text-sm font-bold text-gray-800 select-none"
					>{{ quantity }}</span
				>
				<button
					class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-30"
					:disabled="!selectedVariant || quantity >= selectedVariant.quantity"
					@click="incrementQty"
				>
					<Icon name="mdi:plus" size="15" />
				</button>
			</div>

			<!-- Buy Now -->
			<button
				class="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold h-11 px-6 rounded-[10px] hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
				:disabled="
					!selectedVariant ||
					selectedVariant.quantity < 1 ||
					quantity < (selectedVariant.min_purchase ?? 1) ||
					loading
				"
				@click="handleAddToCart"
			>
				<Icon
					v-if="loading"
					name="mdi:loading"
					size="16"
					class="animate-spin"
				/>
				<Icon v-else name="ic:baseline-shopping-bag" size="18" />
				Buy Now
			</button>

			<!-- Wishlist -->
			<button
				v-if="getToken"
				class="w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all"
				:class="
					inWishlist
						? 'border-red-200 bg-red-50 text-red-500'
						: 'border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400'
				"
				:title="inWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
				@click="inWishlist ? handleRemoveFromWishlist() : handleAddToWishlist()"
			>
				<Icon
					:name="inWishlist ? 'mdi:heart' : 'mdi:heart-outline'"
					size="18"
				/>
			</button>
		</div>

		<!-- Warnings -->
		<p
			v-if="
				selectedVariant?.min_purchase > 1 &&
				quantity < selectedVariant.min_purchase
			"
			class="text-xs text-accent font-semibold flex items-center gap-1"
		>
			<Icon name="mdi:information-outline" size="13" />
			Minimum purchase quantity: {{ selectedVariant.min_purchase }}
		</p>
		<p
			v-if="!selectedVariant || selectedVariant.quantity < 1"
			class="text-xs text-red-500 font-semibold flex items-center gap-1"
		>
			<Icon name="mdi:alert-circle-outline" size="13" />
			This item is currently unavailable
		</p>

		<!-- Trust row -->
		<div class="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
			<div
				v-for="t in trustItems"
				:key="t.label"
				class="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-gray-50 text-center"
			>
				<Icon :name="t.icon" size="18" class="text-primary" />
				<span class="text-[10px] font-semibold text-gray-500 leading-tight">{{
					t.label
				}}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useSaleStore } from "@/stores/sale";
import { findNestedObj } from "@/utils/utils";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";
import { useUtilityStore } from "@/stores/utility";

const config = useRuntimeConfig();
const saleStore = useSaleStore();
const userStore = useUserStore();
const utilityStore = useUtilityStore();
const toast = useToast();

const props = defineProps({ data: { type: Object, default: null } });

const { getToken } = storeToRefs(userStore);
const { getBasicSettings } = storeToRefs(utilityStore);

const currency = config.public.currency;

const selectedVariant = ref(null);
const variantInput = ref([]);
const staticAttribute = ref({});
const quantity = ref(1);
const loading = ref(false);
const inWishlist = ref(false);
const descExpanded = ref(false);

const watcherCount = computed(() => {
	const now = new Date();
	const hour = now.getHours();
	const minute = now.getMinutes();
	const productId = props.data?.id ?? 1;
	const hasOffer = selectedVariant.value?.has_offer ?? false;

	// Offer products skew higher (30–100), normal products lower (1–45)
	let base;
	if (hour >= 18 && hour < 21) base = hasOffer ? 78 : 38;
	else if (hour >= 9 && hour < 11) base = hasOffer ? 62 : 28;
	else if (hour >= 12 && hour < 14) base = hasOffer ? 55 : 25;
	else if (hour >= 21 && hour < 23) base = hasOffer ? 42 : 18;
	else if (hour >= 7 && hour < 9) base = hasOffer ? 30 : 12;
	else if (hour >= 0 && hour < 7) base = hasOffer ? 10 : 3;
	else base = hasOffer ? 38 : 16;

	// Per-product offset so each product shows a different number
	const productSeed = (productId * 7 + (productId % 13)) % 20;
	// Vary by minute + productId to feel live and differ per product
	const variance = Math.floor(Math.sin((minute + productId) * 0.45) * 10);

	return Math.min(100, Math.max(1, base + productSeed + variance));
});

const trustItems = [
	{ icon: "mdi:truck-fast-outline", label: "Fast Delivery" },
	{ icon: "mdi:shield-check-outline", label: "Genuine Product" },
	{ icon: "mdi:refresh", label: "Easy Returns" },
];

const productPriceTotal = computed(() => {
	let total = selectedVariant.value?.price ?? 0;
	for (const key in staticAttribute.value) {
		total += staticAttribute.value[key]?.price_addition ?? 0;
	}
	return total;
});

const breadcrumbs = computed(() => {
	const cat = props.data?.category_detail;
	if (!cat) return [];
	const crumbs = [];
	for (const p of [...(cat.parents ?? [])].reverse()) {
		crumbs.push({ title: p.name, to: `/stores/${p.slug}` });
	}
	crumbs.push({ title: cat.name, to: `/stores/${cat.slug}` });
	return crumbs;
});

function initVariants() {
	if (props.data?.attributes?.length) {
		variantInput.value = props.data.attributes.map((a) => a.values[0]?.slug);
	}
	if (props.data?.static_attributes?.length) {
		for (const attr of props.data.static_attributes) {
			staticAttribute.value[attr.slug] =
				attr.input_type === 1 ? attr.values[0] : "";
		}
	}
	// Derive selectedVariant from chips, not variants[0]
	resolveVariant();
}

watch(() => props.data, initVariants, { immediate: true });

function resolveVariant() {
	if (!variantInput.value.length) {
		// No attributes — single default variant has name: null
		selectedVariant.value = props.data?.variants?.[0] ?? null;
	} else {
		const name = variantInput.value.join(" ");
		selectedVariant.value =
			findNestedObj(props.data?.variants, "name", name) ?? null;
	}
	quantity.value = selectedVariant.value?.min_purchase ?? 1;
}

function handleVariantInputChange() {
	resolveVariant();
}

// Returns true if selecting valueSlug at attrIdx would match an in-stock variant
function isChipAvailable(attrIdx, valueSlug) {
	const hypothetical = [...variantInput.value];
	hypothetical[attrIdx] = valueSlug;
	const name = hypothetical.join(" ");
	const variant = findNestedObj(props.data?.variants, "name", name);
	return variant ? variant.quantity > 0 : false;
}

function incrementQty() {
	if (quantity.value < (selectedVariant.value?.quantity ?? 0)) quantity.value++;
}
function decrementQty() {
	const min = Math.max(1, selectedVariant.value?.min_purchase ?? 1);
	if (quantity.value > min) quantity.value--;
}

function handleAddToCart() {
	loading.value = true;
	saleStore
		.addToCart({
			product: props.data?.id,
			variant: selectedVariant.value.id,
			total_item: quantity.value,
			static_attribute_data: staticAttribute.value,
		})
		.then(() => {
			loading.value = false;
			saleStore.cartModalOpen = true;
			toast.success("Successfully added to cart!");
		})
		.catch((e) => {
			loading.value = false;
			toast.error(
				e.response?.status === 400
					? Object.values(e.response._data).join(" ")
					: "Something went wrong!",
			);
		});
}

function handleAddToWishlist() {
	saleStore
		.addToWishlist({ product: props.data?.id })
		.then(() => {
			inWishlist.value = true;
			toast.success("Added to wishlist!");
		})
		.catch(() => toast.error("Something went wrong!"));
}
function handleRemoveFromWishlist() {
	saleStore
		.removeFromWishlist({ product: props.data?.id })
		.then(() => {
			inWishlist.value = false;
			toast.success("Removed from wishlist!");
		})
		.catch(() => toast.error("Something went wrong!"));
}

onMounted(() => {
	initVariants();
	if (getToken.value) {
		saleStore
			.checkWishlistItemInProduct({ product: props.data?.id })
			.then((d) => {
				inWishlist.value = d?.status;
			})
			.catch((e) => console.log(e));
	}
});
</script>

<style scoped>
.richtext :deep(p) {
	margin-bottom: 0.5rem;
}
.richtext :deep(ul) {
	list-style-type: disc;
	margin-left: 1.25rem;
}
.richtext :deep(ol) {
	list-style-type: decimal;
	margin-left: 1.25rem;
}
.richtext :deep(a) {
	color: #1565c0;
	text-decoration: underline;
}
.richtext :deep(strong) {
	font-weight: 600;
	color: #374151;
}
</style>
