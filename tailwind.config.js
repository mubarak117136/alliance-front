/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				heading: ["Roboto", "sans-serif"],
				condensed: ["Barlow Condensed", "sans-serif"],
			},
			colors: {
				primary: {
					DEFAULT: "#1A1A1A",
					light: "#2A2A2A",
					dark: "#000508",
				},
				secondary: {
					DEFAULT: "#34394D",
					light: "#444A60",
					dark: "#22263A",
				},
				accent: {
					DEFAULT: "#EA4F24",
					light: "#FF6B3D",
					dark: "#DC4124",
				},
				topbar: "#1A1A1A",
				footer: "#000508",
				"page-bg": "#FFFFFF",
				"text-dark": "#1A1A1A",
			},
		},
	},
	plugins: [],
};
