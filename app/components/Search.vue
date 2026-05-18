<!-- <template>
	<div style="height: 100%" class="pa-4">
		<div
			style="height: 100%"
			class="d-flex justify-center align-center text-body-2"
			v-if="props?.data?.length < 1"
		>
			Oops, not any item found!
		</div>
		<div v-else class="">
			<div v-for="(item, idx) in data" :key="'carts_' + idx">
				<div class="d-flex ga-4">
					<NuxtLink
						:to="{
							name: 'products-slug',
							params: { slug: item?.product?.slug },
						}"
						class=""
						aria-label="product"
					>
						<v-img
							v-if="item?.product?.default_image"
							:src="HOST + item?.product?.default_image?.original?.src"
							:alt="item?.product?.default_image?.original?.alt"
							:width="60"
							:height="60"
							rounded
							cover
						>
						</v-img>
					</NuxtLink>
					<div class="d-flex flex-column ga-2 me-auto">
						<NuxtLink
							:to="{
								name: 'products-slug',
								params: { slug: item?.product?.slug },
							}"
							class="text-body-2 text-justify"
							aria-label="product"
						>
							{{ truncateText(item?.product?.name, 40) }}
						</NuxtLink>
						<div class="d-flex flex-wrap ga-4">
							<v-chip
								color="primary"
								density="compact"
								variant="elevated"
								size="small"
								class="text-caption"
							>
								Price:
								<div class="ml-2" style="font-weight: bold">
									{{
										item?.product?.variant ? item?.product?.variant?.price : 0
									}}৳
								</div>
							</v-chip>
							<v-chip
								color="surface-light"
								density="compact"
								variant="elevated"
								size="small"
								class="text-caption text-decoration-line-through"
								v-if="item?.product?.variant?.has_offer"
							>
								Old Price:
								<div class="ml-2" style="font-weight: bold">
									{{
										item?.product?.variant
											? item?.product?.variant?.old_price
											: 0
									}}৳
								</div>
							</v-chip>
							<v-chip
								color="surface"
								density="compact"
								variant="elevated"
								size="small"
								class="text-caption"
								v-if="item?.product?.variant?.has_offer"
							>
								<div style="font-weight: bold">
									{{ item?.product?.variant?.discount_percent }}% Off
								</div>
							</v-chip>
						</div>
					</div>
				</div>
				<v-divider class="mt-4 mb-4"></v-divider>
			</div>
		</div>
	</div>
</template>

<script setup>
import { truncateText } from "@/utils/utils";

const config = useRuntimeConfig();

const props = defineProps({
	data: [],
});

const HOST = computed(() => {
	return config.public.HOST;
});
</script>

<style scoped lang="scss"></style> -->
