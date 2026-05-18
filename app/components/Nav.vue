<template>
	<header
		class="w-full fixed top-0 left-0 right-0 z-40 transition-transform duration-300 font-sans"
		:class="navHidden ? '-translate-y-full' : 'translate-y-0'"
	>
		<!-- ── Top Bar (desktop only) ── -->
		<div
			class="hidden lg:block bg-topbar text-white text-xs overflow-hidden transition-all duration-300 relative z-[100]"
			:class="atTop ? 'max-h-9 opacity-100' : 'max-h-0 opacity-0'"
		>
			<div class="w-full px-6 flex items-center justify-between h-9">
				<!-- Left -->
				<div class="flex items-center gap-1.5 cursor-pointer group">
					<Icon name="mdi:globe" class="shrink-0" size="14" />
					<span
						class="font-bold text-white group-hover:text-accent transition-colors"
					>
						WE SHIP OUR PACKAGES WORLD WIDE
					</span>
				</div>
				<!-- Right -->
				<div class="flex items-center gap-5">
					<!-- Dynamic menus from getMainNavs -->
					<template v-for="menu in topbarMenus" :key="menu.id">
						<!-- Highlighted: flash deals style -->
						<NuxtLink
							v-if="menu.is_highlighted"
							:to="menu.link"
							class="flex items-center gap-1 font-semibold text-accent"
						>
							<Icon
								:name="
									highlightIcons[
										highlightedMenus.indexOf(menu) % highlightIcons.length
									]
								"
								size="13"
							/>
							{{ menu.title }}
						</NuxtLink>
						<!-- External link -->
						<a
							v-else-if="menu.is_external"
							:href="menu.link"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-300 hover:text-white transition-colors"
							>{{ menu.title }}</a
						>
						<!-- Internal link -->
						<NuxtLink
							v-else
							:to="menu.link"
							class="text-gray-300 hover:text-white transition-colors"
							>{{ menu.title }}</NuxtLink
						>
					</template>

					<!-- Profile link (signed in) -->
					<NuxtLink
						v-if="getProfile"
						to="/account/profile"
						class="text-gray-300 hover:text-white transition-colors"
					>
						My Profile
					</NuxtLink>

					<!-- Sign In dropdown (not signed in) -->
					<div v-else class="relative" ref="signInMenuRef">
						<button
							class="flex items-center gap-0.5 text-gray-300 hover:text-white transition-colors"
							@click="signInOpen = !signInOpen"
						>
							Sign In
							<Icon
								:name="signInOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
								size="12"
							/>
						</button>
						<Teleport to="body">
							<div
								v-if="signInOpen"
								class="fixed z-[999] w-48"
								:style="signInDropdownStyle"
							>
								<div
									class="bg-white rounded shadow-xl p-4 flex flex-col items-center gap-3"
								>
									<NuxtLink
										to="/signin"
										class="block w-full text-center bg-accent text-white text-sm font-semibold py-2 rounded hover:bg-accent-dark transition-colors"
										>Sign In</NuxtLink
									>
									<p class="text-xs text-center text-gray-500 leading-tight">
										New customer?
										<NuxtLink
											to="/signup"
											class="text-primary hover:underline font-medium"
											>Start here</NuxtLink
										>
									</p>
								</div>
							</div>
						</Teleport>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Main Nav Bar ── -->
		<div class="bg-white">
			<div
				class="w-full px-2 sm:px-4 lg:px-6 grid grid-cols-3 items-center gap-3 lg:gap-4 h-16 lg:h-20"
			>
				<!-- Col 1: Hamburger (mobile) / Search (desktop) -->
				<div class="flex items-center">
					<!-- Mobile only: hamburger -->
					<button
						class="flex sm:hidden text-primary"
						@click="drawerOpen = true"
					>
						<Icon name="ri:menu-3-line" size="26" />
					</button>
					<!-- Desktop only: search -->
					<div class="hidden sm:flex relative h-7 lg:h-8 max-w-[480px] w-full">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search for products, brands and more..."
							class="w-full pl-3 lg:pl-4 pr-10 text-sm text-gray-800 bg-white outline-none border-0 border-b border-gray-300 min-w-0"
							@keyup.enter="handleSearch"
						/>
						<button
							class="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-400 hover:text-accent transition-colors"
							@click="handleSearch"
						>
							<Icon name="mdi:magnify" size="20" />
						</button>
					</div>
				</div>

				<!-- Col 2: Logo (centered) -->
				<NuxtLink to="/" class="flex items-center justify-center">
					<img
						v-if="logoUrl"
						:src="logoUrl"
						:alt="getBasicSettings?.logo?.original?.alt ?? 'Logo'"
						class="h-16 lg:h-16 w-auto object-contain"
					/>
					<span
						v-else
						class="font-bold text-lg lg:text-[22px] leading-none tracking-tight"
					>
						<span class="text-primary">Alliance</span
						><span class="text-accent">Fencing</span>
					</span>
				</NuxtLink>

				<!-- Col 3: Right Actions -->
				<div class="flex items-center justify-end gap-3 lg:gap-5 text-primary">
					<!-- Mobile only: search toggle -->
					<button
						class="flex sm:hidden text-primary"
						@click="mobileSearchOpen = !mobileSearchOpen"
					>
						<Icon
							:name="mobileSearchOpen ? 'mdi:close' : 'mdi:magnify'"
							size="24"
						/>
					</button>
					<!-- Desktop only: Account -->
					<div class="hidden lg:flex items-center gap-5">
						<div v-if="getProfile" class="relative" ref="profileMenuRef">
							<button
								class="hover:text-accent transition-colors cursor-pointer text-left"
								@click="profileOpen = !profileOpen"
							>
								<div class="text-[11px] text-gray-500 leading-tight">
									Hello, {{ (getProfile.full_name || "User").split(" ")[0] }}
								</div>
								<div
									class="text-[13px] text-primary font-bold leading-tight flex items-center gap-0.5 mt-px"
								>
									Account
									<Icon
										:name="profileOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
										size="12"
									/>
								</div>
							</button>
							<Teleport to="body">
								<div
									v-if="profileOpen"
									class="fixed z-[999] w-48"
									:style="profileDropdownStyle"
								>
									<div
										class="bg-white rounded-xl shadow-xl border border-gray-100 py-1 flex flex-col w-52"
									>
										<NuxtLink
											v-for="item in accountSidebarNav"
											:key="item.path"
											:to="item.path"
											class="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
											:class="
												$route.path === item.path ||
												$route.path.startsWith(item.path + '/')
													? 'bg-primary/5 text-primary font-medium'
													: 'text-gray-600 hover:bg-gray-50'
											"
											@click="profileOpen = false"
										>
											<Icon
												:name="item.icon"
												size="15"
												:class="
													$route.path === item.path ||
													$route.path.startsWith(item.path + '/')
														? 'text-primary'
														: 'text-gray-400'
												"
											/>
											{{ item.name }}
										</NuxtLink>
										<div class="h-px bg-gray-100 my-1" />
										<button
											class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
											@click="handleSignout"
										>
											<Icon name="mdi:logout" size="15" />
											Sign Out
										</button>
									</div>
								</div>
							</Teleport>
						</div>
						<NuxtLink
							v-else
							to="/signin"
							class="hover:text-accent transition-colors cursor-pointer"
						>
							<div class="text-[11px] text-gray-500 leading-tight">
								Hello, Sign In
							</div>
							<div
								class="text-[13px] text-primary font-bold leading-tight flex items-center gap-0.5 mt-px"
							>
								Account <Icon name="mdi:chevron-down" size="12" />
							</div>
						</NuxtLink>
					</div>
					<!-- Cart: all screens -->
					<button
						class="relative flex items-center gap-1.5 hover:text-accent transition-colors"
						@click="saleStore.cartModalOpen = true"
					>
						<div class="relative">
							<Icon
								name="ri:shopping-basket-fill"
								class="text-primary"
								size="28"
							/>
							<span
								v-if="cartCount > 0"
								class="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-0.5 leading-none"
							>
								{{ cartCount }}
							</span>
						</div>
						<span class="hidden lg:inline text-[13px] text-primary font-bold"
							>Cart</span
						>
					</button>
				</div>
			</div>
		</div>

		<!-- ── Mobile Search Bar (hidden at sm+) ── -->
		<div v-if="mobileSearchOpen" class="sm:hidden pb-2.5 px-2 bg-white">
			<div class="flex h-10">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search for products, brands and more..."
					class="flex-1 px-3 text-sm text-gray-800 bg-white rounded-l-md outline-none border border-gray-200 border-r-0 min-w-0"
					@keyup.enter="handleSearch"
				/>
				<button
					class="bg-accent hover:bg-accent-dark text-white w-10 rounded-r-md flex items-center justify-center transition-colors shrink-0"
					@click="handleSearch"
				>
					<Icon name="mdi:magnify" size="20" />
				</button>
			</div>
		</div>

		<!-- ── Category Bar (desktop only) ── -->
		<div class="hidden lg:block bg-white border-t border-b border-gray-200">
			<div class="w-full px-6 flex items-center h-10">
				<!-- All Categories -->
				<div
					class="relative shrink-0 h-10 flex items-center"
					@mouseenter="categoryOpen = true"
					@mouseleave="categoryOpen = false"
				>
					<button
						class="flex items-center gap-1.5 text-white text-[16px] font-condensed font-bold uppercase tracking-normal px-3 h-10 transition-colors"
						:class="categoryOpen ? 'bg-accent' : 'bg-accent/90'"
					>
						<Icon name="mdi:view-grid" size="16" />
						All Categories
						<Icon
							name="mdi:chevron-down"
							size="13"
							class="transition-transform duration-200"
							:class="categoryOpen ? 'rotate-180' : ''"
						/>
					</button>
					<div
						v-show="categoryOpen"
						class="absolute left-0 top-full z-50 shadow-2xl overflow-hidden border-t-2 border-accent"
						style="width: min(1200px, calc(100vw - 3rem))"
					>
						<div class="bg-white text-gray-800 p-5">
							<ul class="grid grid-cols-6 gap-x-3 gap-y-0.5 text-sm">
								<li v-for="cat in categories" :key="cat.slug">
									<NuxtLink
										:to="`/stores/${cat.slug}`"
										class="flex items-center gap-2 px-2 py-2 border-l-2 border-transparent hover:border-accent hover:bg-gray-50 hover:text-accent transition-all"
									>
										<Icon
											v-if="cat.font_icon"
											:name="cat.font_icon"
											size="14"
											class="text-gray-400 shrink-0"
										/>
										<span
											class="text-[12px] font-semibold uppercase tracking-wide text-gray-700 leading-tight"
											>{{ cat.name }}</span
										>
									</NuxtLink>
								</li>
							</ul>
							<div
								v-if="highlightedMenus.length"
								class="border-t border-gray-100 mt-3 pt-3 flex gap-4"
							>
								<NuxtLink
									v-for="(menu, i) in highlightedMenus"
									:key="menu.id"
									:to="menu.link"
									class="flex items-center gap-2 hover:opacity-80 transition-opacity"
								>
									<Icon
										:name="highlightIcons[i % highlightIcons.length]"
										size="15"
										:class="i % 2 === 0 ? 'text-accent' : 'text-green-600'"
									/>
									<span
										class="text-[11px] font-bold uppercase tracking-wide"
										:class="i % 2 === 0 ? 'text-accent' : 'text-green-600'"
										>{{ menu.title }}</span
									>
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
				<!-- Category Links -->
				<nav
					class="flex items-center justify-between overflow-x-auto scrollbar-hide flex-1 pl-4"
				>
					<NuxtLink
						v-for="cat in navCategories"
						:key="cat.slug"
						:to="`/stores/${cat.slug}`"
						class="text-primary text-[16px] font-condensed font-bold uppercase whitespace-nowrap px-2 h-10 flex items-center hover:text-accent transition-colors shrink-0"
						style="letter-spacing: 1px"
						>{{ cat.name }}</NuxtLink
					>
				</nav>
			</div>
		</div>
	</header>

	<!-- ── Mobile Drawer ── -->
	<Teleport to="body">
		<!-- Backdrop -->
		<Transition name="fade">
			<div
				v-if="drawerOpen"
				class="fixed inset-0 bg-black/50 z-[90] lg:hidden"
				@click="drawerOpen = false"
			/>
		</Transition>
		<!-- Drawer -->
		<Transition name="slide">
			<div
				v-if="drawerOpen"
				class="fixed top-0 left-0 h-full w-72 bg-white z-[100] lg:hidden flex flex-col shadow-2xl"
			>
				<!-- Drawer Header -->
				<div
					class="bg-primary flex items-center justify-between px-4 h-14 shrink-0"
				>
					<NuxtLink
						to="/"
						class="flex items-center gap-2"
						@click="drawerOpen = false"
					>
						<img
							v-if="logoUrl"
							:src="logoUrl"
							:alt="getBasicSettings?.logo?.original?.alt ?? 'Logo'"
							class="h-8 w-auto object-contain"
						/>
						<span v-else class="font-bold text-lg text-white"
							>Well<span class="text-accent">med</span></span
						>
					</NuxtLink>
					<button class="text-white" @click="drawerOpen = false">
						<Icon name="mdi:close" size="24" />
					</button>
				</div>

				<!-- Signed in profile banner -->
				<div
					v-if="getProfile"
					class="bg-gray-50 px-4 py-3 border-b border-gray-200 shrink-0"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0"
						>
							<Icon name="mdi:account" class="text-white" size="20" />
						</div>
						<div class="min-w-0">
							<p class="text-sm font-bold text-gray-800 truncate">
								{{ getProfile.full_name || "My Profile" }}
							</p>
							<NuxtLink
								to="/account/profile"
								class="text-xs text-primary font-medium"
								@click="drawerOpen = false"
								>View Account</NuxtLink
							>
						</div>
					</div>
					<button
						class="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-red-500 border border-red-200 rounded py-1.5 hover:bg-red-50 transition-colors"
						@click="handleSignout"
					>
						<Icon name="mdi:logout" size="14" />
						Sign Out
					</button>
				</div>

				<!-- Not signed in banner -->
				<div
					v-else
					class="bg-gray-50 px-4 py-3 border-b border-gray-200 shrink-0"
				>
					<NuxtLink
						to="/signin"
						class="block w-full text-center bg-accent text-white text-sm font-semibold py-2 rounded hover:bg-accent-dark transition-colors"
						@click="drawerOpen = false"
						>Sign In</NuxtLink
					>
					<p class="text-xs text-center mt-2 text-gray-500">
						New customer?
						<NuxtLink
							to="/signup"
							class="text-primary font-medium"
							@click="drawerOpen = false"
							>Start here</NuxtLink
						>
					</p>
				</div>

				<!-- Scrollable Content -->
				<div class="flex-1 overflow-y-auto">
					<!-- Categories -->
					<div class="border-b border-gray-100">
						<p
							class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider"
						>
							Categories
						</p>
						<ul>
							<li v-for="cat in categories" :key="cat.slug">
								<NuxtLink
									:to="`/stores/${cat.slug}`"
									class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
									@click="drawerOpen = false"
								>
									<Icon
										v-if="cat.font_icon"
										:name="cat.font_icon"
										size="18"
										class="text-primary shrink-0"
									/>
									<span class="text-sm text-gray-800">{{ cat.name }}</span>
								</NuxtLink>
							</li>
						</ul>
					</div>

					<!-- Highlighted menus -->
					<div v-if="highlightedMenus.length" class="border-b border-gray-100">
						<NuxtLink
							v-for="(menu, i) in highlightedMenus"
							:key="menu.id"
							:to="menu.link"
							class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
							@click="drawerOpen = false"
						>
							<Icon
								:name="highlightIcons[i % highlightIcons.length]"
								size="18"
								:class="i % 2 === 0 ? 'text-orange-500' : 'text-green-600'"
							/>
							<span
								class="text-sm font-semibold"
								:class="i % 2 === 0 ? 'text-orange-500' : 'text-green-600'"
								>{{ menu.title }}</span
							>
						</NuxtLink>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
const config = useRuntimeConfig();
const utilityStore = useUtilityStore();
const userStore = useUserStore();
const router = useRouter();

const { getMainNavs, getCategories, getBasicSettings } =
	storeToRefs(utilityStore);

const { getProfile } = storeToRefs(userStore);

const topbarMenus = computed(() => {
	const nav = Array.isArray(getMainNavs.value)
		? getMainNavs.value.find((n) => n.type === 1)
		: getMainNavs.value;
	return nav?.menus ?? [];
});

const highlightedMenus = computed(() =>
	topbarMenus.value.filter((m) => m.is_highlighted),
);

const highlightIcons = ["mdi:fire", "mdi:rocket-launch"];

const HOST = computed(() => config.public.HOST);

const logoUrl = computed(() => {
	const src = getBasicSettings.value?.logo?.original?.src;
	return src ? `${HOST.value}${src}` : null;
});

const route = useRoute();
const searchQuery = ref(route.query.search ?? "");

watch(
	() => route.query.search,
	(val) => {
		searchQuery.value = val ?? "";
	},
);

const saleStore = useSaleStore();
const { getCartTotalItem } = storeToRefs(saleStore);
const cartCount = computed(() => getCartTotalItem.value ?? 0);
const categoryOpen = ref(false);
const signInOpen = ref(false);
const mobileSearchOpen = useState("mobileSearchOpen", () => false);
const profileOpen = ref(false);
const drawerOpen = ref(false);
const atTop = ref(true);
const navHidden = ref(false);

let lastScrollY = 0;
onMounted(() => {
	window.addEventListener("scroll", () => {
		const currentY = window.scrollY;
		atTop.value = currentY === 0;
		navHidden.value = currentY > lastScrollY && currentY > 80;
		lastScrollY = currentY;
	});
});

const signInMenuRef = ref(null);
const profileMenuRef = ref(null);

const signInDropdownStyle = computed(() => {
	if (!signInMenuRef.value) return {};
	const rect = signInMenuRef.value.getBoundingClientRect();
	return {
		top: `${rect.bottom + 4}px`,
		right: `${window.innerWidth - rect.right}px`,
	};
});

const profileDropdownStyle = computed(() => {
	if (!profileMenuRef.value) return {};
	const rect = profileMenuRef.value.getBoundingClientRect();
	return {
		top: `${rect.bottom + 4}px`,
		right: `${window.innerWidth - rect.right}px`,
	};
});

onMounted(() => {
	document.addEventListener("click", (e) => {
		if (signInMenuRef.value && !signInMenuRef.value.contains(e.target)) {
			signInOpen.value = false;
		}
		if (profileMenuRef.value && !profileMenuRef.value.contains(e.target)) {
			profileOpen.value = false;
		}
	});
});

async function handleSignout() {
	profileOpen.value = false;
	await userStore.signout();
	router.push("/");
}

function handleSearch() {
	const q = searchQuery.value.trim();
	if (q) {
		navigateTo(`/stores?search=${encodeURIComponent(q)}`);
	}
}

const categories = computed(() => getCategories.value ?? []);
const navCategories = computed(() => (getCategories.value ?? []).slice(0, 12));

const accountSidebarNav = [
	{
		name: "My Account",
		icon: "mdi:account-circle-outline",
		path: "/account/profile",
	},
	{ name: "Orders", icon: "lucide:receipt", path: "/account/orders" },
	{ name: "My Reviews", icon: "mdi:star-outline", path: "/account/reviews" },
	{
		name: "My Wishlists",
		icon: "mdi:heart-outline",
		path: "/account/wishlists",
	},
	{
		name: "Saved Address",
		icon: "mdi:map-marker-outline",
		path: "/account/saved-address",
	},
	{
		name: "Change Password",
		icon: "mdi:lock-outline",
		path: "/account/change-password",
	},
];
</script>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
	transform: translateX(-100%);
}
</style>
