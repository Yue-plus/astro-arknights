import type {ArknightsConfig} from "./src/_types/config";
import {TitleArknights} from "./src/components/SvgIcons.tsx";

export default {
    title: "Arknights",
    description: "",
    language: "zh",
    bgm: {
        autoplay: false,

        // https://web.hycdn.cn/arknights/official/_next/static/media/audio/bgm.ea4286.mp3
        src: import.meta.env.BASE_URL + "audios/bgm.mp3"
    },
    navbar: {
        logo: {
            element: <TitleArknights className="w-full h-auto pointer-events-none"/>,
            alt: "Arknights Logo"
        },
        items: [
            {title: "INDEX", subtitle: "首页", href: import.meta.env.BASE_URL + "#index"},
            {title: "INFORMATION", subtitle: "情报", href: import.meta.env.BASE_URL + "#information"},
            {title: "OPERATOR", subtitle: "干员", href: import.meta.env.BASE_URL + "#operator"},
            {title: "WORLD", subtitle: "设定", href: import.meta.env.BASE_URL + "#world"},
            {title: "MEDIA", subtitle: "泰拉万象", href: import.meta.env.BASE_URL + "#media"},
            {title: "MORE", subtitle: "更多内容", href: import.meta.env.BASE_URL + "#more"},
        ],
    },
    pageTracker: {
        microInfo: "ARKNIGHTS",
        labels: ["HOMEPAGE", "INFORMATION", "OPERATOR", "WORLD", "ABOUT TERRA", "MORE"],
    },
} as ArknightsConfig
