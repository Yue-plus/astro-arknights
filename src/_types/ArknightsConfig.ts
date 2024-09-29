import React from "react"
import type {AutoplayOptions} from "swiper/types";
import type {HeroActionButtonProps, SwiperData} from "./RootPageViews.ts"

export type NavbarItem = {
    title: string
    subtitle: string
    href: string
}

export type OwnerInfoFooterLink = {
    label: string,
    url: string,
    portraitHidden?: boolean
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
        ownerInfo: {
            name?: string
            slogan?: string
            footerLinks?: OwnerInfoFooterLink[]
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
            swiper: {
                autoplay?: boolean | AutoplayOptions | undefined
                data: SwiperData[]
            }
        },
        WORLD: {
            items: {
                title: string
                subTitle: string
                imageUrl: string
                description: string
            }[]
        }
    }
}