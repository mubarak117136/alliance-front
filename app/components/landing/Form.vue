<!-- <template>
	<div class="mt-10">
		<v-form @submit.prevent="handleFormSubmit" v-if="step == 1">
			<v-row>
				<v-col
					cols="12"
					md="6"
					class="bg-surface-variant mb-4 pa-6"
					style="border-radius: 8px"
				>
					<div>
						<div class="d-flex flex-column ga-4">
							<div class="text-h6 font-weight-black">Product details</div>
							<div
								v-for="(item, idx) in props?.data?.attributes"
								:key="'attributes_' + idx"
							>
								<v-select
									:label="item?.name"
									:items="item?.values"
									variant="outlined"
									density="compact"
									v-model="variantInput[idx]"
									item-title="value"
									item-value="slug"
									width="300"
									hide-details="auto"
									@update:modelValue="handleVariantInputChange"
								></v-select>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column ga-6 mt-4">
						<div
							v-for="(item, sidx) in props?.data?.static_attributes"
							:key="'static_attributes_' + sidx"
						>
							<v-select
								v-if="item?.input_type == 1"
								:label="item?.name"
								:items="item?.values"
								variant="outlined"
								density="compact"
								v-model="staticAttribute[item.slug]"
								item-title="value"
								item-value="slug"
								width="300"
								hide-details="auto"
							></v-select>

							<v-text-field
								v-if="item?.input_type == 2"
								v-model="staticAttribute[item.slug]"
								density="compact"
								variant="outlined"
								:label="item?.name"
								width="300"
								hide-details="auto"
							></v-text-field>
						</div>
					</div>
					<div class="d-flex ga-4 mt-4">
						<div>
							<v-text-field
								v-model="quantity"
								density="compact"
								type="number"
								variant="outlined"
								label="Quantity"
								width="150"
								hide-details="auto"
								:min="1"
								:max="selectedVariant ? selectedVariant?.quantity : 0"
								:disabled="!selectedVariant || selectedVariant?.quantity < 1"
								@update:modelValue="handleUpdatQuantity"
							></v-text-field>
						</div>
					</div>
					<div class="mt-10">
						<div class="d-flex ga-4">
							<NuxtLink
								:to="'/products/' + props?.data?.slug"
								target="_blank"
								class=""
								aria-label="product image"
							>
								<v-img
									v-if="props?.data?.images?.length > 0"
									:src="
										HOST + props?.data?.images[0]?.image_detail?.original?.src
									"
									:alt="props?.data?.images[0]?.image_detail?.original?.alt"
									width="80"
									height="auto"
									rounded
									cover
								>
								</v-img>
							</NuxtLink>
							<div class="d-flex flex-column ga-2 me-auto">
								<NuxtLink
									:to="'/products/' + props?.data?.slug"
									target="_blank"
									class="text-body-2 text-white text-justify"
									:aria-label="props?.data?.name"
								>
									{{ props?.data?.name }}
								</NuxtLink>
								<div class="text-caption">
									{{ selectedVariant ? selectedVariant?.price : 0 }}৳ x
									{{ quantity }} = {{ calculateProductTotal }}৳
								</div>
								<div class="text-caption" v-if="selectedVariant?.name">
									<v-chip size="small" density="compact">
										{{ selectedVariant?.name }}
									</v-chip>
								</div>
								<div
									class="text-caption"
									v-if="!isObjectEmpty(staticAttribute)"
								>
									<v-chip size="small" density="compact">
										{{ convertObjToString(staticAttribute) }}
									</v-chip>
								</div>
							</div>
						</div>
						<div class="d-flex ga-4 mt-4 text-body-2">
							<div>Shipping cost:</div>
							<div>{{ getShippingCost }}৳</div>
						</div>
						<v-divider class="mt-2 mb-2"></v-divider>
						<div class="d-flex ga-4 text-body-2">
							<div>Grand total:</div>
							<div>{{ calculateGrandTotal }}৳</div>
						</div>
					</div>
				</v-col>
				<v-col cols="12" md="6" class="pl-lg-8">
					<div>
						<div class="text-h6 font-weight-black text-surface-variant">
							Delivery information
						</div>

						<div class="d-flex flex-column">
							<v-row class="mt-2">
								<v-col cols="12" sm="6" md="6" lg="6">
									<v-text-field
										v-model="formData.full_name.value.value"
										:error-messages="formData.full_name.errorMessage.value"
										label="Full name"
										variant="outlined"
										density="compact"
										hide-details="auto"
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="6" lg="6">
									<v-autocomplete
										v-model="formData.city.value.value"
										:error-messages="formData.city.errorMessage.value"
										label="City"
										:items="getCities"
										item-title="name"
										item-value="name"
										variant="outlined"
										density="compact"
										:loading="loading"
										@update:modelValue="handleCityChange"
										hide-details="auto"
									></v-autocomplete>
								</v-col>
							</v-row>
							<v-row class="mt-0">
								<v-col cols="12">
									<v-text-field
										v-model="formData.address.value.value"
										:error-messages="formData.address.errorMessage.value"
										label="Address"
										variant="outlined"
										density="compact"
										hide-details="auto"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row class="mt-0">
								<v-col cols="12">
									<v-text-field
										v-model="formData.phone.value.value"
										:error-messages="formData.phone.errorMessage.value"
										label="Phone"
										variant="outlined"
										density="compact"
										hide-details="auto"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row class="mt-0 mb-2">
								<v-col cols="12" class="mt-4">
									<v-sheet rounded color="surface-variant" class="pa-4">
										<div class="d-flex ga-2 align-center">
											<v-icon size="x-large">mdi-cash</v-icon>
											<div>Payment method</div>
										</div>
										<v-divider class="mt-4 mb-4"></v-divider>
										<div class="d-flex ga-2 align-center mt-4 text-body-2">
											<v-icon size="small">mdi-check-circle</v-icon>
											<div>Cash on delivery</div>
										</div>
									</v-sheet>
								</v-col>
							</v-row>
							<div class="mt-4">
								<v-alert
									v-if="error_msg"
									:text="error_msg"
									type="error"
									class="mb-4"
								></v-alert>
								<div
									class="text-error text-body-2"
									v-if="!selectedVariant || selectedVariant?.quantity < 1"
								>
									* Not available
								</div>
								<v-btn
									:loading="loading"
									variant="tonal"
									type="submit"
									class="bg-highlight mt-2"
									:disabled="!selectedVariant || selectedVariant?.quantity < 1"
									aria-label="Confirm order"
								>
									Confirm order - {{ calculateGrandTotal }}৳
								</v-btn>
							</div>
						</div>
					</div>
				</v-col>
			</v-row>
		</v-form>
		<v-divider class="mt-4 mb-4" v-if="step == 2"></v-divider>
		<div v-if="step == 2">
			<div
				class="d-flex flex-column ga-4 justify-center align-center mb-4 font-weight-black"
			>
				<div>We received your order! Thank you for stay with us!</div>
				<div>Order ID: {{ submittedOrderID }}</div>
				<v-btn
					aria-label="Order again"
					@click="handleOrderAgain"
					class="bg-highlight"
				>
					Order again
				</v-btn>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useUtilityStore } from "@/stores/utility";
import { useSaleStore } from "@/stores/sale";
import { convertObjToString, isObjectEmpty } from "@/utils/utils";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";

const config = useRuntimeConfig();
const utilityStore = useUtilityStore();
const saleStore = useSaleStore();
const userStore = useUserStore();
const toast = useToast();

const { getCities } = storeToRefs(utilityStore);
const { getShippingCost } = storeToRefs(saleStore);
const { getProfile, getsessionId } = storeToRefs(userStore);

const props = defineProps({
	data: null,
});

const loading = ref(false);
const error_msg = ref(null);
const step = ref(1);
const submittedOrderID = ref(null);

const selectedVariant = ref(null);
const variantInput = ref([]);
const staticAttribute = ref({});
const quantity = ref(1);

const HOST = computed(() => {
	return config.public.HOST;
});

const validationSchema = yup.object().shape({
	full_name: yup.string().required(),
	city: yup.string().required(),
	address: yup.string().required(),
	phone: yup.string().required(),
});

const { handleSubmit, handleReset } = useForm({
	validationSchema,
});

var formData = {
	full_name: useField("full_name", validationSchema),
	city: useField("city", validationSchema),
	address: useField("address", validationSchema),
	phone: useField("phone", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	values["variant"] = selectedVariant?.value?.id;
	values["static_attribute"] = staticAttribute.value;
	values["quantity"] = quantity.value;
	values["session_id"] = getsessionId.value;

	saleStore
		.landingCreateOrder(values)
		.then((d) => {
			loading.value = false;
			submittedOrderID.value = d?.order_id;
			step.value = 2;
		})
		.catch((e) => {
			loading.value = false;
			toast.error("Something went wrong");
		});
});

const handleFetchCity = () => {
	loading.value = true;
	utilityStore
		.fetchShippingCities()
		.then((d) => {
			loading.value = false;
		})
		.catch((e) => {
			loading.value = false;
			console.log(e);
			error_msg.value = "";
			var err_msg = "";
			if (e.response.status === 400) {
				for (const [key, value] of Object.entries(e.response._data)) {
					const err = `${value}`;
					err_msg = err_msg + err;
				}
				error_msg.value = err_msg;
			} else {
				var msg = `Something went wrong!`;
				error_msg.value = msg;
			}
		});
};

onMounted(() => {
	handleFetchCity();
});

const handleCityChange = () => {
	let params = {};

	params["city"] = formData.city.value.value;
	params["variant"] = selectedVariant?.value?.id;
	params["quantity"] = quantity.value;

	if (formData.city.value.value) {
		saleStore
			.fetchLandingShippingRateWithoutCart(params)
			.then((d) => {})
			.catch((e) => {
				console.log(e);
			});
	} else {
		saleStore.shippingCost = 0;
	}
};

watch(
	() => props?.data,
	(val, oldVal) => {
		if (val?.variants) {
			selectedVariant.value = val?.variants[0];
		}
		if (props?.data?.attributes) {
			for (var i = 0; i < props?.data?.attributes?.length; i++) {
				variantInput.value[i] = props?.data?.attributes[i]?.values[0]?.slug;
			}
		}
		if (props?.data?.static_attributes) {
			for (var i = 0; i < props?.data?.static_attributes?.length; i++) {
				if (props?.data?.static_attributes[i]?.input_type == 1) {
					staticAttribute.value[props?.data?.static_attributes[i]?.slug] =
						props?.data?.static_attributes[i]?.values[0]?.slug;
				} else {
					staticAttribute.value[props?.data?.static_attributes[i]?.slug] = "";
				}
			}
		}
	}
);

const handleVariantInputChange = () => {
	const variantName = variantInput?.value?.join(" ");
	const foundObj = findNestedObj(props?.data?.variants, "name", variantName);
	selectedVariant.value = foundObj;
	quantity.value = 1;
};

const handleUpdatQuantity = () => {
	const max_quantity = selectedVariant?.value?.quantity;
	if (quantity.value > max_quantity) {
		quantity.value = max_quantity;
		toast.error(`Item quantity can't be more than ${max_quantity}`);
	}

	if (quantity.value < 1) {
		quantity.value = 1;
		toast.error("Item quantity can't be less than 1");
	}
	handleCityChange();
};

onMounted(() => {
	if (props?.data?.variants) {
		selectedVariant.value = props?.data?.variants[0];
	}
	if (props?.data?.attributes) {
		for (var i = 0; i < props?.data?.attributes?.length; i++) {
			variantInput.value[i] = props?.data?.attributes[i]?.values[0]?.slug;
		}
	}
	if (props?.data?.static_attributes) {
		for (var i = 0; i < props?.data?.static_attributes?.length; i++) {
			if (props?.data?.static_attributes[i]?.input_type == 1) {
				staticAttribute.value[props?.data?.static_attributes[i]?.slug] =
					props?.data?.static_attributes[i]?.values[0]?.slug;
			} else {
				staticAttribute.value[props?.data?.static_attributes[i]?.slug] = "";
			}
		}
	}
});

const calculateProductTotal = computed(() => {
	return selectedVariant?.value?.price * quantity.value;
});

const calculateGrandTotal = computed(() => {
	return calculateProductTotal.value + getShippingCost.value;
});

const handleOrderAgain = () => {
	location.reload();
};
</script>

<style scoped lang="scss"></style> -->
