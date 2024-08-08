import React from "react";

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
    rootPage: {
        views: (() => React.JSX.Element)[]
    }
    pageTracker: {
        microInfo: string
        labels: string[]
    }
}
