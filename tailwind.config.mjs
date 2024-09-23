import astroConfig from "./astro.config";
import colors from "tailwindcss/colors";

/**
 * https://tailwindcss.com/docs/configuration
 *
 * @type {import('tailwindcss').Config}
 */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./arknights.config.{js,jsx,ts,tsx}',
	],
	theme: {
		colors: {
			"ark-blue": "#18d1ff",
			"end-yellow": "#ffee22",
			"transparent": colors.transparent,
			"current": colors.current,
			"inherit": colors.inherit,
			"black": colors.black,
			"white": colors.white,
		},
		extend: {
			fontFamily: {
				benderBold: ["Bender-Bold"],
				benderRegular: ["Bender-Regular"],
				n15eBold: ["Novecentosanswide-Bold"],
				n15eDemiBold: ["Novecentosanswide-DemiBold"],
				n15eMedium: ["Novecentosanswide-Medium"],
				n15eUltraBold: ["Novecentosanswide-UltraBold"],
				oswaldMedium: ["Oswald-Medium"],
				oswaldDemiBold: ["Oswald-DemiBold"],

				// TODO: 使用思源黑体
				// sourceHanMedium: ["SourceHanSans-Medium"],
				// sourceHanRegular: ["SourceHanSans-Regular"],
				// sourceHanBold: ["SourceHanSans-Bold"],
				// sourceHanHeavy: ["SourceHanSans-Heavy"],
				// sdkSansRegular: ["SDK_Sans-Regular"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"2": `url(${astroConfig.base ?? ""}/images/bg2.png)`,
				"index": `url(${astroConfig.base ?? ""}/images/index-bg.jpg)`,
				"layout": `url(${astroConfig.base ?? ""}/images/layout-bg.jpg)`,
				"common-mask": `url(${astroConfig.base ?? ""}/images/common_mask.png)`,
				"mask-block": `url(${astroConfig.base ?? ""}/images/mask_block.png)`,
				"mask-block-m": `url(${astroConfig.base ?? ""}/images/mask_block_m.png)`,
				"list-texture": `url(${astroConfig.base ?? ""}/images/list_bg_texture.png)`,
			},
			keyframes: {
				downHide: {
					"0%": {opacity: "0", transform: "translateY(0)"},
					"40%": {opacity: "1", transform: "translateY(0)"},
					"80%": {opacity: "1"},
					"100%": {opacity: "0", transform: "translateY(30%)"},
				},
				showHide: {
					"0%,100%": {opacity: "0"},
					"50%": {opacity: "1"},
				}
			},
			animation: {
				downHide: "downHide 1.5s infinite",
				showHide: "showHide 2s infinite",
			},
		},
	},
	plugins: [],
}
