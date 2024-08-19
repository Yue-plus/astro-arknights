import React, {useEffect, useState} from "react"
import Swiper from "swiper"
import "swiper/css"
import PortraitBottomGradientMask from "../../components/PortraitBottomGradientMask"
import {IconArrow} from "../../components/SvgIcons"
import type {BreakingNewsItemProps} from "../../_types/BreakingNewsItemProps.ts"

const base = import.meta.env.BASE_URL

function BreakingNewsTag({label, active, onClick}: {
    label: string,
    active?: boolean
    onClick?: () => void
}) {
    // TODO:
    return <div {...{onClick}} className={(active ? "text-black bg-ark-blue " : "hover:text-ark-blue ")
        + "w-[5.625rem] h-[1.25em] portrait:text-[1.25rem] font-bold"
        + " pr-2 pl-[.125rem] mr-4 flex items-center cursor-pointer"}>
        <span>{label}</span>
        <IconArrow className={(active ? "" : "opacity-0 ")
            + "w-[.4375rem] ml-auto flex-none pointer-events-none transition-opacity duration-300"}/>
    </div>
}

function BreakingNewsItem({category, title, date, href}: BreakingNewsItemProps) {
    return <a {...{href}} target="_blank"
              className={"w-[22.5rem] portrait:w-[unset] h-24 portrait:h-[7.125rem] text-inherit"
                  + " border-b-[1px] border-solid border-[#ffffff4d] portrait:border-[#403c3b] no-underline"
                  + " flex items-center cursor-pointer"}>
        <div className={"text-[1.125rem] text-ark-blue font-bold whitespace-nowrap"}>{category}</div>
        <div className={"w-[17.5rem] portrait:w-[unset] text-[d2d2d2] ml-auto portrait:ml-[2.75rem] portrait:flex-auto"
            + " portrait:flex portrait:flex-row-reverse portrait:justify-between portrait:items-center"}>
            <div className={"portrait:text-[1rem] font-benderRegular portrait:ml-20 whitespace-nowrap tracking-[1px]"}>
                {date}
            </div>
            <div className={"max-h-[3.2rem] portrait:max-h-[3.4em] font-bold text-[1.125rem] portrait:text-[1.6rem]"
                + " portrait:leading-[1.6] tracking-[2px] line-clamp-2 text-ellipsis mt-[.125rem]"}
            >{title}</div>
        </div>
    </a>
}

function BreakingNewsList() {
    // TODO: 服务端渲染

    const [category, setCategory] = useState([] as string[])
    const [data, setData] = useState([] as { name: string, list: BreakingNewsItemProps[] }[])
    const [categoryIndex, setCategoryIndex] = useState(0)

    useEffect(() => {
        fetch(base + "blog/breaking-news.json")
            .then(response => response.json())
            .then(data => {
                setCategory(data.map((item: { name: string, list: BreakingNewsItemProps[] }) => item.name))
                setData(data)
            })
    }, []);

    return <>
        <div className={"flex portrait:mt-8 portrait:pt-8 portrait:pb-8 portrait:border-y"
            + " portrait:border-solid portrait:border-t-[#565656] portrait:border-b-[#403c3b]"}>{
            category.map((label, index) => <BreakingNewsTag
                key={index}
                active={index === categoryIndex} {...{label}}
                onClick={() => setCategoryIndex(index)}
            />)
        }</div>
        <div className={"mt-2 portrait:mt-0"}>
            {
                // TODO: 添加动效
                data.length > 0 && data[categoryIndex]?.list.length > 0
                    ? data[categoryIndex].list.map((item: BreakingNewsItemProps, index: number) =>
                        <BreakingNewsItem key={index} {...item} />)
                    : <div className="text-4xl font-benderBold p-8">NO DATA</div>
            }
            <a target="_blank" href={base + "blog/"} className={"w-[7.625rem] portrait:w-[11.125rem]"
                + " h-[1.5rem] portrait:h-[1.75rem] text-[.875rem] portrait:text-[1.3125rem] text-[#d2d2d2]"
                + " hover:text-black font-benderBold whitespace-nowrap bg-[#585858] hover:bg-white"
                + " px-[.625rem] portrait:px-3 mt-8 portrait:mt-10 flex items-center cursor-pointer"
                + " transition-colors duration-300"}>
                <span>READ MORE</span>
                <IconArrow className={"w-[.4375rem] ml-auto flex-none"}/>
            </a>
        </div>
    </>
}

function SwiperInfo({title, subtitle, date, href}: {
    title?: string,
    subtitle?: string,
    date?: string,
    href?: string
}) {
    // TODO: 添加动效
    return <div
        className={"w-[26.5rem] portrait:w-[unset] portrait:static absolute left-[3.875rem] bottom-[-1.875rem]"}>
        <div className="flex flex-col portrait:flex-col-reverse">
            <div className={"font-benderRegular tracking-[1px] portrait:mt-[1rem]"}>{date ?? "yyyy // MM / dd"}</div>
            <div
                className={"max-h-[2.8em] portrait:max-h-[1.4em] overflow-ellipsis text-[2.25rem] portrait:text-[2.5rem] font-bold tracking-[2px] line-clamp-2 portrait:line-clamp-1"}>
                {title ?? "[SWIPER_TITLE]"}
            </div>
        </div>
        <div className={"mt-[1rem] text-[1.125rem] portrait:hidden"}>
            {subtitle ?? "[SWIPER_SUBTITLE]"}
        </div>
        <div className={"text-[.75rem] portrait:text-[.875rem] font-n15eMedium leading-5 tracking-[2px]"}>
            HTTPS://ARKNIGHTS.ASTRO.YUE.ZONE/
        </div>
        <a {...{href}} target="_blank"
           className={"w-[14.375rem] h-[3.75rem] pr-7 pl-4 mt-8 text-black no-underline whitespace-nowrap bg-ark-blue hover:bg-white flex items-center cursor-pointer transition-colors duration-300 portrait:hidden"}>
            <div>
                <div className={"text-[1.25rem] font-bold"}>更多情报</div>
                <div className={"text-[.875rem] font-benderBold"}>READ MORE</div>
            </div>
            <IconArrow className={"w-[.5rem] ml-auto flex-none pointer-events-none"}/>
        </a>
    </div>
}

function SwiperBody() {
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        scrollbar: {
            el: ".swiper-scrollbar-horizontal"
        }
    })

    return <div className={"w-[83.125rem] portrait:w-[unset] h-[46.875rem] portrait:h-[24.125rem] portrait:static"
        + " absolute top-[9.5rem] right-[14.75rem] portrait:mt-[9.375rem] portrait:pr-[5.75rem]"
        + " flex items-center justify-center overflow-hidden transition-[visibility,opacity] duration-1000"
        + " mask-gradient-90-transparent-to-white portrait:mask-unset"}>
        <div className={"w-full h-full swiper swiper-horizontal swiper-backface-hidden"}>
            <div className="swiper-wrapper">
                {/* TODO: */}
                <div className="swiper-slide text-center text-9xl bg-[darkred]">Slide 1</div>
                <div className="swiper-slide text-center text-9xl bg-[darkgreen]">Slide 2</div>
                <div className="swiper-slide text-center text-9xl bg-[darkblue]">Slide 3</div>
            </div>
        </div>
    </div>
}

function SwiperScrollbar() {
    return <div className={"w-[61rem] portrait:w-full h-[.5rem] portrait:h-[.375rem] portrait:pr-[5.75rem]"
        + " absolute portrait:flex top-[56.375rem] portrait:top-[33.125rem] right-0"
        + " z-[4] transition-[visibility,opacity] duration-1000"}>
        <div className={"w-[12rem] h-px absolute top-0 right-full portrait:hidden"} style={{
            backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 67%, 0), hsla(0, 0%, 67%, .7))"
        }}/>
        <div className="swiper-scrollbar-horizontal w-full h-full bg-[#ababab] duration-0">
            {/* TODO: swiper-scrollbar-horizontal */}
            <div className="swiper-scrollbar-drag h-full bg-ark-blue relative"/>
        </div>
    </div>
}

export default function Information() {
    return <div className={"w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto"
        + " transition-opacity duration-100"}>
        <PortraitBottomGradientMask/>
        <SwiperBody/>
        <SwiperScrollbar/>
        <div className={"w-full h-full absolute top-0 left-0 bg-[length:100%_100%] pointer-events-none portrait:hidden"}
             style={{backgroundImage: "linear-gradient(0deg, #000 5rem, transparent 20rem)"}}/>
        <div className={"w-full h-full absolute top-0 left-0 portrait:hidden bg-common-mask bg-[length:100%_100%]"
            + " mix-blend-overlay pointer-events-none"}/>
        <div className={"w-[34.375rem] portrait:w-[unset] h-[46.75rem] portrait:h-[unset] portrait:pr-[5.75rem]"
            + " absolute top-[9.5rem] left-0 portrait:static"}>
            <div className={"w-full h-full absolute top-0 left-0 bg-black bg-opacity-30 mix-blend-overlay"
                + " portrait:hidden"}/>
            <div className={"w-full h-full absolute top-0 left-0 portrait:hidden mix-blend-difference"
                + " bg-list-texture bg-cover bg-left-top"}/>
            <div className={"h-full portrait:h-[unset] relative pt-[2.5rem] portrait:pt-[1.25rem]"
                + " pl-[3.875rem] portrait:pl-[1.75rem] portrait:pr-[1.75rem]"
                + " transition-[visibility,opacity] duration-1000"}>
                <div className={"h-[.95em] text-[7rem] text-[#242424] font-oswaldMedium -tracking-wider"
                    + " whitespace-nowrap overflow-hidden absolute top-full left-[9rem] flex items-end portrait:hidden"}
                ><span>BREAKING NEWS</span></div>
                <SwiperInfo/>
                <BreakingNewsList/>
            </div>
        </div>
    </div>
}
