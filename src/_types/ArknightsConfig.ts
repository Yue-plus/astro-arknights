import React from "react"
import type {HeroActionButtonProps} from "./RootPageViews.ts"

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
            element: React.JSX.Element
            alt: string
        }
        items: NavbarItem[]
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
        }
    }
}
