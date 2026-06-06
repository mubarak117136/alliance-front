<template>
	<footer class="mt-16">
		<!-- Top band -->
		<div class="bg-footer">
			<div
				class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
			>
				<div class="flex items-center gap-4">
					<div
						class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"
					>
						<Icon name="mdi:headset" size="22" class="text-white" />
					</div>
					<div>
						<p class="text-white font-bold text-sm">
							Need help with your order?
						</p>
						<p class="text-blue-100 text-xs mt-0.5">
							Our support team is always ready to assist you.
						</p>
					</div>
				</div>
				<div class="flex flex-wrap items-center justify-center gap-3">
					<a
						v-if="getBasicSettings?.phone"
						:href="'tel:' + getBasicSettings.phone"
						class="phone-btn inline-flex items-center gap-2 bg-white text-primary text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap"
					>
						<Icon name="mdi:phone" size="15" class="phone-icon" />
						{{ getBasicSettings.phone }}
					</a>
					<a
						v-if="getBasicSettings?.email"
						:href="'mailto:' + getBasicSettings.email"
						class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/20 transition-colors whitespace-nowrap"
					>
						<Icon name="mdi:email-outline" size="15" />
						{{ getBasicSettings.email }}
					</a>
				</div>
			</div>
		</div>

		<!-- Category mega section -->
		<div v-if="topCategories.length" class="bg-footer">
			<div class="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
				<!-- Categories with children -->
				<div
					class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10"
				>
					<div v-for="cat in catsWithChildren" :key="cat.id">
						<NuxtLink
							:to="`/stores/${cat.slug}`"
							class="block font-condensed font-bold text-[15px] uppercase tracking-widest text-accent hover:text-accent-light transition-colors mb-2 pb-2 border-b border-white/10"
						>
							{{ cat.name }}
						</NuxtLink>
						<ul class="mt-2 space-y-1.5">
							<li v-for="child in cat.children" :key="child.id">
								<NuxtLink
									:to="`/stores/${child.slug}`"
									class="block font-sans font-semibold text-[11px] uppercase tracking-wide text-white/60 hover:text-white transition-colors leading-snug"
								>
									{{ child.name }}
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>

				<!-- Categories without children — flat pill row -->
				<div
					v-if="catsWithoutChildren.length"
					class="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-3"
				>
					<NuxtLink
						v-for="cat in catsWithoutChildren"
						:key="cat.id"
						:to="`/stores/${cat.slug}`"
						class="font-condensed font-bold text-[12px] uppercase tracking-widest text-accent hover:text-white border border-white/15 hover:border-white/40 px-3 py-1.5 transition-colors"
					>
						{{ cat.name }}
					</NuxtLink>
				</div>
			</div>
		</div>

		<!-- Main content -->
		<div class="bg-gray-50 border-t border-gray-100">
			<div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
				<div class="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
					<!-- Brand — spans 2 cols -->
					<div class="col-span-2">
						<NuxtLink to="/" class="inline-flex gap-2 mb-5">
							<img
								v-if="getBasicSettings?.logo?.original?.src"
								:src="HOST + getBasicSettings.logo.original.src"
								:alt="
									getBasicSettings?.logo?.original?.alt ??
									getBasicSettings?.company_name
								"
								class="h-12 w-auto object-contain"
							/>
							<div v-else class="flex items-center gap-2">
								<Icon name="mdi:medical-bag" size="20" class="text-white" />
								<span
									class="text-white text-base font-extrabold tracking-tight"
								>
									{{
										getBasicSettings?.company_name ??
										"Alliance Fencing Equipment"
									}}
								</span>
							</div>
						</NuxtLink>

						<p class="text-gray-500 text-xs leading-relaxed mb-6 max-w-[220px]">
							Your trusted source for professional fencing equipment, gear, and
							accessories — serving fencers of all levels worldwide.
						</p>

						<!-- Trust badges -->
						<div class="flex flex-col gap-2 mb-6">
							<div
								v-for="badge in badges"
								:key="badge.label"
								class="flex items-center gap-2"
							>
								<div
									class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
								>
									<Icon :name="badge.icon" size="11" class="text-primary" />
								</div>
								<span class="text-gray-500 text-xs">{{ badge.label }}</span>
							</div>
						</div>

						<!-- Socials -->
						<div class="flex items-center gap-2 flex-wrap">
							<a
								v-for="social in activeSocials"
								:key="social.name"
								:href="social.href"
								:aria-label="social.name"
								target="_blank"
								rel="noopener"
								class="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200 group text-gray-400"
							>
								<Icon :name="social.icon" size="15" />
							</a>
						</div>
					</div>

					<!-- Dynamic nav menus -->
					<div v-for="menu in getFooterNavs?.menus" :key="menu.id">
						<h4
							class="text-gray-900 text-xs font-extrabold uppercase tracking-widest mb-4 pb-2 border-b border-gray-200"
						>
							{{ menu.title }}
						</h4>
						<ul class="space-y-2.5">
							<li v-for="sub in menu.submenus" :key="sub.id">
								<a
									v-if="sub.is_external"
									:href="sub.link"
									target="_blank"
									rel="noopener"
									class="text-gray-500 hover:text-primary text-sm transition-colors duration-150 flex items-center gap-1.5 group"
								>
									<span
										class="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-primary transition-colors shrink-0"
									/>
									{{ sub.title }}
								</a>
								<NuxtLink
									v-else
									:to="sub.link"
									class="text-gray-500 hover:text-primary text-sm transition-colors duration-150 flex items-center gap-1.5 group"
								>
									<span
										class="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-primary transition-colors shrink-0"
									/>
									{{ sub.title }}
								</NuxtLink>
							</li>
						</ul>
					</div>

					<!-- Address -->
					<div>
						<h4
							class="text-gray-900 text-xs font-extrabold uppercase tracking-widest mb-4 pb-2 border-b border-gray-200"
						>
							Find Us
						</h4>
						<div
							v-if="getBasicSettings?.address"
							class="flex items-start gap-2.5 mb-4"
						>
							<div
								class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
							>
								<Icon
									name="mdi:map-marker-outline"
									size="15"
									class="text-primary"
								/>
							</div>
							<span class="text-gray-500 text-sm leading-relaxed">
								{{ getBasicSettings.address }},<br />
								{{ getBasicSettings.city }}
								<span v-if="getBasicSettings.post_code"
									>- {{ getBasicSettings.post_code }}</span
								>
							</span>
						</div>
						<div
							class="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full"
						>
							<span
								class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
							/>
							Support 24/7
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="bg-gray-100 border-t border-gray-200">
			<div
				class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
			>
				<p class="text-gray-400 text-xs">
					© {{ new Date().getFullYear() }}
					{{ getBasicSettings?.company_name ?? "Alliance" }}. All rights
					reserved.
				</p>
				<div class="flex items-center flex-wrap gap-2">
					<div
						v-for="pay in payments"
						:key="pay.label"
						class="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 shadow-sm"
						:class="pay.bg"
					>
						<Icon
							:name="pay.icon"
							size="13"
							:class="pay.color"
							class="shrink-0"
						/>
						<div class="leading-none">
							<p class="text-[10px] font-bold tracking-wide" :class="pay.color">
								{{ pay.label }}
							</p>
							<p class="text-[9px] text-gray-400 mt-0.5">{{ pay.sublabel }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { useUtilityStore } from "@/stores/utility";

const config = useRuntimeConfig();
const HOST = computed(() => config.public.HOST);

const utilityStore = useUtilityStore();
const { getBasicSettings, getSocialSettings, getFooterNavs, getCategories } =
	storeToRefs(utilityStore);

const topCategories = computed(() =>
	(getCategories.value ?? []).filter((c) => !c.parent_slug),
);
const catsWithChildren = computed(() =>
	topCategories.value.filter((c) => c.children?.length),
);
const catsWithoutChildren = computed(() =>
	topCategories.value.filter((c) => !c.children?.length),
);

const badges = [
	{ icon: "mdi:shield-check-outline", label: "Authorized Retailer" },
	{ icon: "mdi:truck-fast-outline", label: "Fast US Shipping" },
	{ icon: "mdi:lock-outline", label: "Secure Payments" },
];

const socialDefs = [
	{ key: "facebook", name: "Facebook", icon: "mdi:facebook" },
	{ key: "whatsapp", name: "WhatsApp", icon: "mdi:whatsapp" },
	{ key: "instagram", name: "Instagram", icon: "mdi:instagram" },
	{ key: "x", name: "X", icon: "mdi:twitter" },
	{ key: "youtube", name: "YouTube", icon: "mdi:youtube" },
	{ key: "linkedin", name: "LinkedIn", icon: "mdi:linkedin" },
	{ key: "discord", name: "Discord", icon: "mdi:discord" },
	{ key: "tiktok", name: "TikTok", icon: "mdi:music-note" },
];

const activeSocials = computed(() =>
	socialDefs
		.filter((s) => getSocialSettings.value?.[s.key])
		.map((s) => ({ ...s, href: getSocialSettings.value[s.key] })),
);

const payments = [
	{
		label: "Visa",
		sublabel: "Credit & Debit",
		icon: "mdi:credit-card-outline",
		color: "text-blue-700",
		bg: "bg-blue-50 border-blue-200",
	},
	{
		label: "Mastercard",
		sublabel: "Credit & Debit",
		icon: "mdi:credit-card-multiple-outline",
		color: "text-red-600",
		bg: "bg-red-50 border-red-200",
	},
	{
		label: "PayPal",
		sublabel: "Secure Checkout",
		icon: "mdi:paypal",
		color: "text-blue-500",
		bg: "bg-sky-50 border-sky-200",
	},
	{
		label: "Amex",
		sublabel: "Credit Card",
		icon: "mdi:credit-card-fast-outline",
		color: "text-indigo-600",
		bg: "bg-indigo-50 border-indigo-200",
	},
];
</script>

<style scoped>
/* Glow pulse on the button */
.phone-btn {
	animation: phone-glow 2s ease-in-out infinite;
	position: relative;
}

@keyframes phone-glow {
	0%,
	100% {
		box-shadow:
			0 0 0 0 rgba(255, 255, 255, 0.7),
			0 0 0 0 rgba(255, 255, 255, 0.4);
	}
	50% {
		box-shadow:
			0 0 0 8px rgba(255, 255, 255, 0.15),
			0 0 0 16px rgba(255, 255, 255, 0);
	}
}

/* Phone icon ring shake */
.phone-icon {
	animation: phone-ring 2s ease-in-out infinite;
	transform-origin: top center;
}

@keyframes phone-ring {
	0%,
	100% {
		transform: rotate(0deg);
	}
	10% {
		transform: rotate(-15deg);
	}
	20% {
		transform: rotate(15deg);
	}
	30% {
		transform: rotate(-10deg);
	}
	40% {
		transform: rotate(10deg);
	}
	50% {
		transform: rotate(0deg);
	}
}
</style>
