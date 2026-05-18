<template>
	<Teleport to="body">
		<Transition name="backdrop-fade">
			<div class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" @click="close(false)" />
		</Transition>
		<Transition name="modal-pop">
			<div class="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
				<div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto">
					<!-- Header -->
					<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
						<div class="flex items-center gap-2.5">
							<div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
								<Icon name="mdi:star-outline" size="14" class="text-gray-500" />
							</div>
							<span class="text-sm font-semibold text-gray-800">Rating & Review</span>
						</div>
						<button
							type="button"
							class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
							@click="close(false)"
						>
							<Icon name="mdi:close" size="15" />
						</button>
					</div>

					<!-- Form -->
					<form class="px-5 py-4 flex flex-col gap-4" @submit.prevent="handleFormSubmit">
						<!-- Star selector -->
						<div class="flex flex-col gap-1.5 items-center">
							<label class="text-xs font-medium text-gray-500 self-start">Your Rating <span class="text-red-400">*</span></label>
							<div class="flex items-center gap-1">
								<button
									v-for="n in 5"
									:key="n"
									type="button"
									class="transition-transform hover:scale-110"
									@click="formData.rating.value.value = n"
									@mouseover="hoverRating = n"
									@mouseleave="hoverRating = 0"
								>
									<Icon
										:name="(hoverRating || formData.rating.value.value) >= n ? 'mdi:star' : 'mdi:star-outline'"
										size="28"
										:class="(hoverRating || formData.rating.value.value) >= n ? 'text-amber-400' : 'text-gray-300'"
									/>
								</button>
							</div>
							<p v-if="formData.rating.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1 self-start">
								<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.rating.errorMessage.value }}
							</p>
						</div>

						<!-- Review textarea -->
						<div class="flex flex-col gap-1.5">
							<label class="text-xs font-medium text-gray-500">Write a Review <span class="text-red-400">*</span></label>
							<div
								class="rounded-xl border bg-gray-50 focus-within:bg-white transition-all px-3.5 py-2.5"
								:class="formData.review.errorMessage.value ? 'border-red-300' : 'border-gray-200 focus-within:border-primary'"
							>
								<textarea
									v-model="formData.review.value.value"
									rows="4"
									placeholder="Share your experience with this product..."
									class="w-full text-sm outline-none bg-transparent text-gray-700 resize-none"
								/>
							</div>
							<p v-if="formData.review.errorMessage.value" class="text-[11px] text-red-500 flex items-center gap-1">
								<Icon name="mdi:alert-circle-outline" size="11" />{{ formData.review.errorMessage.value }}
							</p>
						</div>

						<!-- Error -->
						<div v-if="error_msg" class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
							<Icon name="mdi:alert-circle-outline" size="13" class="shrink-0" />{{ error_msg }}
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 mt-1">
							<button
								type="button"
								class="h-9 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 transition-all"
								@click="close(false)"
							>
								Cancel
							</button>
							<button
								type="submit"
								:disabled="loading"
								class="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
							>
								<Icon v-if="loading" name="mdi:loading" size="13" class="animate-spin" />
								<Icon v-else name="mdi:send-outline" size="13" />
								Submit Review
							</button>
						</div>
					</form>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";
import { useRoute } from "#vue-router";

const { isOpenModal, data } = defineProps({ isOpenModal: false, data: null });
const emit = defineEmits();

const toast = useToast();
const userStore = useUserStore();
const route = useRoute();

const loading = ref(false);
const error_msg = ref("");
const hoverRating = ref(0);

const validationSchema = yup.object().shape({
	rating: yup.number().required(),
	review: yup.string().required("Review is required"),
});

const { handleSubmit } = useForm({ validationSchema });

const formData = {
	rating: useField("rating", validationSchema),
	review: useField("review", validationSchema),
};

const handleFormSubmit = handleSubmit((values) => {
	loading.value = true;
	values["cart_id"] = data?.id;
	values["order_id"] = route?.params?.orderid;
	userStore
		.createRating(values)
		.then(() => {
			loading.value = false;
			toast.success("Review submitted!");
			close(true);
		})
		.catch((e) => {
			loading.value = false;
			let err_msg = "";
			if (e?.response?.status === 400) {
				for (const [, value] of Object.entries(e.response._data)) err_msg += `${value}`;
				error_msg.value = err_msg;
			} else {
				error_msg.value = "Something went wrong!";
			}
		});
});

const close = (refresh = false) => emit("close", refresh);

onMounted(() => {
	formData.rating.value.value = 5;
});
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.2s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }
.modal-pop-enter-active, .modal-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
