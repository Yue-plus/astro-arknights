import React from "react"
import type {HeroActionButtonProps, SwiperData} from "./RootPageViews.ts"

export type NavbarItem = {
    title: string
    subtitle: string
    href: string
}

export type ArknightsConfig = {
    title: string
    description: string
    language: string
    bgm: {
        autoplay: boolean
        src: string
    }
    navbar: {
        logo: {
            element: () => React.JSX.Element
            alt: string
        }
        items: NavbarItem[]
        toolbox: {
            Skland?: string
            Bilibili?: string
            WeChat?: string
            Weibo?: string
            TapTap?: string
            GitHub?: string
        }
    }
    pageTracker: {
        microInfo: string
        labels: string[]
    }
    rootPage: {
        INDEX: {
            title: string
            subtitle: string
            url: string
            copyright: React.JSX.Element
            heroActions: HeroActionButtonProps[]
        },
        INFORMATION: {
            swiperData: SwiperData[]
        },
    }
}
