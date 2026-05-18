<template>
	<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
		<!-- Header -->
		<div
			class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60"
		>
			<div
				class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"
			>
				<Icon name="mdi:tag-outline" size="14" class="text-primary" />
			</div>
			<span class="text-sm font-black text-gray-800">Coupon Code</span>
			<div
				v-if="props?.data?.coupon"
				class="ml-auto shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-green-500 text-white"
			>
				Applied
			</div>
		</div>

		<form
			class="px-5 py-4 flex flex-col gap-3"
			@submit.prevent="handleFormSubmit"
		>
			<div class="flex gap-2">
				<div
					class="flex-1 flex items-center h-10 rounded-xl border-2 bg-gray-50 focus-within:bg-white transition-all px-3 gap-2"
					:class="
						formData.coupon.errorMessage.value
							? 'border-red-300 focus-within:border-red-400'
							: props?.data?.coupon
								? 'border-green-300 bg-green-50/50'
								: 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
					"
				>
					<Icon
						name="mdi:ticket-percent-outline"
						size="15"
						class="shrink-0"
						:class="props?.data?.coupon ? 'text-green-500' : 'text-gray-400'"
					/>
					<input
						v-model="formData.coupon.value.value"
						type="text"
						placeholder="Enter coupon code"
						:disabled="!!props?.data?.coupon"
						class="flex-1 h-full text-sm outline-none bg-transparent disabled:opacity-70 font-mono tracking-wider uppercase"
					/>
				</div>

				<button
					v-if="!props?.data?.coupon"
					type="submit"
					:disabled="loading"
					class="h-10 px-4 rounded-[10px] bg-primary text-white text-xs font-bold hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
				>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="13"
						class="animate-spin"
					/>
					<span>Apply</span>
				</button>
				<button
					v-else
					type="button"
					:disabled="loading"
					class="h-10 px-4 rounded-xl bg-red-50 text-red-500 border border-red-200 text-xs font-bold hover:bg-red-100 active:scale-[0.97] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
					@click="handleRemoveCoupon"
				>
					<Icon
						v-if="loading"
						name="mdi:loading"
						size="13"
						class="animate-spin"
					/>
					<Icon v-else name="mdi:close" size="13" />
					<span>Remove</span>
				</button>
			</div>

			<p
				v-if="formData.coupon.errorMessage.value"
				class="text-[11px] text-red-500 font-medium flex items-center gap-1"
			>
				<Icon name="mdi:alert-circle-outline" size="11" />{{
					formData.coupon.errorMessage.value
				}}
			</p>

			<div
				v-if="error_msg"
				class="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
			>
				<Icon name="mdi:alert-circle-outline" size="13" class="shrink-0" />{{
					error_msg
				}}
			</div>

			<div
				v-if="props?.data?.coupon"
				class="flex items-center gap-1.5 text-xs text-green-600 font-semibold"
			>
				<Icon name="mdi:check-circle-outline" size="14" />
				Saving {{ currency }}{{ props.data.coupon.discount_amount }} on this
				order
			</div>
		</form>
	</div>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useSaleStore } from "@/stores/sale";
import { useToast } from "vue-toastification";
import { useRoute } from "#vue-router";

const config = useRuntimeConfig();
const saleStore = useSaleStore();
const toast = useToast();
const route = useRoute();

const props = defineProps({ data: null });
const emit = defineEmits(["refresh"]);

const loading = ref(false);
const error_msg = ref(null);
const currency = config.public.currency;

const validationSchema = yup
	.object()
	.shape({ coupon: yup.string().required() });
const { handleSubmit } = useForm({ validationSchema });
const formData = { coupon: useField("coupon", validationSchema) };

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	values["order"] = route?.params?.slug;
	saleStore
		.applyCoupon(values)
		.then(() => {
			loading.value = false;
			error_msg.value = null;
			toast.success("Coupon applied successfully!");
			emit("refresh");
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
});

const handleRemoveCoupon = () => {
	loading.value = true;
	saleStore
		.removeCoupon({ order: route?.params?.slug })
		.then(() => {
			loading.value = false;
			toast.success("Coupon removed!");
			formData.coupon.value.value = "";
			emit("refresh");
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data))
					err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
};

watch(
	() => props.data,
	(val) => {
		if (val?.coupon) formData.coupon.value.value = val.coupon.data?.code;
	},
);

onMounted(() => {
	if (props?.data?.coupon)
		formData.coupon.value.value = props.data.coupon.data?.code;
});
</script>
