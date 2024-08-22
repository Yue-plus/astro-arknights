import React from "react";

// 01-INDEX =====================================

export type HeroActionButtonProps = {
    icon: React.JSX.Element
    label: string
    subLabel?: string
    target?: "_blank" | "_top" | "_parent" | "_self"
    href: string
    className?: string
}

// 02-INFORMATION ===============================

export type BreakingNewsItemProps = {
    title: string,
    date: string,
    href: string,
    category: string,
}

export type SwiperData = {
    title?: string,
    subtitle?: string,
    date?: string,
    url?: string,
    href?: string,
    image?: string,
}
