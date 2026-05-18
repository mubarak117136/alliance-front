import { useProductStore } from "@/stores/product";

export const useProductFilters = () => {
	const route = useRoute();
	const productStore = useProductStore();

	const apiBrands = useState("filter-brands", () => []);
	const apiPriceRange = useState("filter-price-range", () => null);
	const apiAttrs = useState("filter-attrs", () => []);

	const brands = computed(() =>
		apiBrands.value.map((b) => ({ label: b.brand__name, value: b.brand__slug })),
	);

	const fetchFilters = () => {
		const params = {};
		if (route.params?.category) params["category"] = route.params.category;
		productStore
			.fetchProductFilters(params)
			.then((d) => {
				apiBrands.value = d?.brands ?? [];
				apiPriceRange.value = d?.price_range ?? null;
				apiAttrs.value = d?.attrs ?? [];
			})
			.catch((e) => console.log(e));
	};

	return { brands, apiPriceRange, apiAttrs, fetchFilters };
};
