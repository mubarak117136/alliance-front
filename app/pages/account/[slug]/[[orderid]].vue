<template>
	<div class="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Mobile menu trigger -->
		<div
			class="flex items-center gap-3 mb-5 lg:hidden"
			v-click-outside="() => (mobileDropdownOpen = false)"
		>
			<div class="relative">
				<button
					type="button"
					class="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
					@click="mobileDropdownOpen = !mobileDropdownOpen"
				>
					<Icon
						name="mdi:account-circle-outline"
						size="16"
						class="text-gray-400"
					/>
					<span>{{ currentPageName }}</span>
					<Icon
						name="mdi:chevron-down"
						size="14"
						class="text-gray-400 transition-transform duration-200"
						:class="mobileDropdownOpen ? 'rotate-180' : ''"
					/>
				</button>

				<Transition name="dropdown">
					<div
						v-if="mobileDropdownOpen"
						class="absolute top-full left-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
					>
						<NuxtLink
							v-for="item in accountSidebar"
							:key="item.path"
							:to="item.path"
							class="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-0"
							:class="
								isActive(item.path)
									? 'bg-primary/5 text-primary font-medium'
									: 'text-gray-600 hover:bg-gray-50'
							"
							@click="mobileDropdownOpen = false"
						>
							<Icon
								:name="item.icon"
								size="14"
								:class="isActive(item.path) ? 'text-primary' : 'text-gray-400'"
							/>
							{{ item.name }}
							<Icon
								v-if="isActive(item.path)"
								name="mdi:check"
								size="13"
								class="text-primary ml-auto"
							/>
						</NuxtLink>
					</div>
				</Transition>
			</div>
		</div>

		<!-- Two-column layout -->
		<div
			class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start"
		>
			<!-- Sidebar (desktop only) -->
			<div class="hidden lg:block lg:sticky lg:top-[100px]">
				<AccountSideBar />
			</div>

			<!-- Content area -->
			<div>
				<AccountProfile v-if="route.params.slug === 'profile'" />
				<AccountChangePassword
					v-else-if="route.params.slug === 'change-password'"
				/>
				<AccountSavedAddress
					v-else-if="route.params.slug === 'saved-address'"
				/>
				<AccountReviews v-else-if="route.params.slug === 'reviews'" />
				<AccountWishlists v-else-if="route.params.slug === 'wishlists'" />
				<AccountOrders v-else-if="route.path === '/account/orders'" />
				<AccountOrderDetails
					v-else-if="route.params.slug === 'orders' && route.params.orderid"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "#vue-router";

const route = useRoute();
const mobileDropdownOpen = ref(false);

const accountSidebar = [
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

const isActive = (path) =>
	route.path === path || route.path.startsWith(path + "/");

const currentPageName = computed(
	() => accountSidebar.find((item) => isActive(item.path))?.name ?? "Account",
);
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
