const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		container: {
			center: true,
			padding: "2rem",
		},
	},
	darkMode: "class",
	plugins: [heroui({ defaultTheme: "dark" })],
};
