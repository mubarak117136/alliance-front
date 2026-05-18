<!-- <template>
	<div class="mt-10">
		<a :href="data?.link?.link" target="_blank">
			<v-img
				:src="HOST + data?.image?.original?.src"
				:alt="data?.image?.original?.alt"
				rounded
				cover
			></v-img>
		</a>
	</div>
</template>

<script setup>
const config = useRuntimeConfig();

const { data } = defineProps({
	data: null,
});

const HOST = computed(() => {
	return config.public.HOST;
});
</script>

<style scoped lang="scss"></style> -->
