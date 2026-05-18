<template>
	<div class="flex flex-col gap-3">
		<!-- User card -->
		<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<div class="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
			<div class="flex items-center gap-3 px-4 py-4">
				<!-- Avatar -->
				<div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
					<span class="text-sm font-black text-primary">{{ initials }}</span>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-black text-gray-900 truncate">{{ getProfile?.full_name || 'My Account' }}</p>
					<p class="text-[11px] text-gray-400 font-medium truncate">{{ getProfile?.username }}</p>
				</div>
			</div>
		</div>

		<!-- Nav -->
		<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<NuxtLink
				v-for="item in accountSidebar"
				:key="item.path"
				:to="item.path"
				class="flex items-center gap-3 px-4 py-3 transition-all border-b border-gray-50 last:border-0 group"
				:class="isActive(item.path)
					? 'bg-primary/5 text-primary'
					: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
			>
				<div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
					:class="isActive(item.path) ? 'bg-primary/10' : 'bg-gray-100 group-hover:bg-gray-200'">
					<Icon :name="item.icon" size="15" :class="isActive(item.path) ? 'text-primary' : 'text-gray-400'" />
				</div>
				<span class="text-sm font-semibold flex-1">{{ item.name }}</span>
				<Icon name="mdi:chevron-right" size="15"
					:class="isActive(item.path) ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'" />
			</NuxtLink>
		</div>

		<!-- Sign out -->
		<button
			type="button"
			class="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all group"
			@click="handleSignout"
		>
			<div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-all">
				<Icon name="mdi:logout" size="15" class="text-red-400" />
			</div>
			<span class="text-sm font-semibold">Sign Out</span>
		</button>
	</div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const { getProfile } = storeToRefs(userStore);

const accountSidebar = [
	{ name: "My Account",       icon: "mdi:account-circle-outline",  path: "/account/profile" },
	{ name: "Orders",           icon: "lucide:receipt",                     path: "/account/orders" },
	{ name: "My Reviews",       icon: "mdi:star-outline",            path: "/account/reviews" },
	{ name: "My Wishlists",     icon: "mdi:heart-outline",           path: "/account/wishlists" },
	{ name: "Saved Address",    icon: "mdi:map-marker-outline",      path: "/account/saved-address" },
	{ name: "Change Password",  icon: "mdi:lock-outline",            path: "/account/change-password" },
];

const initials = computed(() => {
	const name = getProfile.value?.full_name ?? "";
	return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
});

const isActive = (path) => route.path === path || route.path.startsWith(path + "/");

const handleSignout = () => {
	userStore.signout();
	router.push("/");
};
</script>
