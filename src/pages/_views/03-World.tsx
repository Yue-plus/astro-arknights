import React, {useEffect, useRef, useState} from "react";
import {useStore} from "@nanostores/react";
import {viewIndex} from "../../components/store/rootLayoutStore.ts";
import {directions} from "../../components/store/lineDecoratorStore.ts";
import {IconArrow} from "../../components/SvgIcons.tsx";

function Item({title, subTitle, delay}: { title: string; subTitle: string, delay: number }) {
    const $viewIndex = useStore(viewIndex)
    const [active, setActive] = useState(false)
    const itemDom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // TODO: 补全动效
        $viewIndex === 3
            ? itemDom.current!.classList.remove("-translate-x-full", "opacity-0")
            : itemDom.current!.classList.add("-translate-x-full", "opacity-0")
    }, [$viewIndex]);

    return <div ref={itemDom}
                className="h-[6rem] pb-[.75rem] leading-[1] flex items-end relative transition-[transform,opacity] duration-[800ms] ease-in-out -translate-x-full opacity-0 cursor-pointer"
                style={{
                    borderBottom: "1px solid #fff",
                    transitionDelay: delay + "ms",
                }}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}>
        <div
            className="text-[4.5rem] text-[rgba(24,209,255,.25)] font-n15eBold absolute right-[.75rem] bottom-[.75rem] transition-opacity duration-300"
            style={{opacity: active ? "100" : "0"}}>{subTitle}</div>
        <div className="text-[2.5rem] font-bold relative transition-[color,transform] duration-300"
             style={{
                 textShadow: "0 0 1em #000,0 0 1em #000",
                 transform: active ? "translateX(2rem)" : "translateX(0)",
                 color: active ? "#fff" : "#ababab",
             }}>{title}</div>
        <div className="text-[1.25rem] font-n15eBold ml-[1.5rem] relative transition-[color,transform] duration-300"
             style={{
                 textShadow: "0 0 1em #000,0 0 1em #000",
                 transform: active ? "translateX(2rem)" : "translateX(0)",
                 color: active ? "#fff" : "#ababab",
             }}>{subTitle}</div>
    </div>
}

function List() {
    return <div
        className="w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] transition-[opacity,visibility] duration-[600ms] portrait:invisible portrait:opacity-0 z-[3]">
        {
            [
                {title: "源石", subTitle: "ORIGINIUMS"},
                {title: "源石技艺", subTitle: "ORIGINIUM ARTS"},
                {title: "整合运动", subTitle: "REUNION"},
                {title: "感染者", subTitle: "INFECTED"},
                {title: "移动城邦", subTitle: "NOMADIC CITY"},
                {title: "罗德岛", subTitle: "RHODES ISLAND"},
            ].map(({title, subTitle}, index) => <Item key={index} delay={index * 200} {...{title, subTitle}}/>)
        }
    </div>
}

function Details({title, subTitle, description}: { title: string, subTitle: string, description: string }) {
    return <>
        <div className="transition-[opacity,visibility] duration-[600ms]">
            <div
                className="w-[30.75rem] portrait:w-full h-px absolute top-[45.5555555556%] portrait:top-[62.3688155922%] left-[54.25rem] portrait:left-0 portrait:pl-[4.25rem] portrait:pr-[10.5rem] flex z-[3]">
                <div className="min-w-0 h-px flex-auto transition-[width] duration-[600ms] portrait:hidden"
                     style={{
                         width: "100%",
                         backgroundImage:
                             "repeating-linear-gradient(90deg,#b2b2b2,#b2b2b2 .25rem,transparent 0,transparent .5rem)"
                     }}/>
                <div className="text-[3.75rem] font-bold inline-block absolute bottom-12 overflow-hidden">
                    {title}
                </div>
                <div className="text-[2rem] font-n15eBold inline-block absolute bottom-4 overflow-hidden">
                    {subTitle}
                </div>
                <div className="w-full text-[1rem] inline-block absolute top-4 portrait:pr-[14.75rem] overflow-hidden">
                    {description}
                </div>
            </div>
            <IconArrow
                className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[6.625rem] portrait:left-[3.5rem] rotate-180 opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"/>
            <IconArrow
                className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[95.5rem] portrait:left-auto portrait:right-[9.5rem] opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"/>
        </div>
        <div
            className="w-full h-2 pr-[17.25rem] portrait:pr-[5.75rem] absolute left-0 bottom-[11.25rem] portrait:bottom-[18.2908545727%] flex translate-y-full transition-[opacity,visibility] duration-[600ms] z-[2]">
            <div className="w-full h-full relative flex flex-auto">
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div
                    className="min-w-0 w-full h-full bg-[#5a5a5a] hover:bg-[#ababab] flex-1 transition-colors duration-300 cursor-pointer"/>
                <div className="h-full bg-ark-blue absolute transition-[left] duration-300 cursor-pointer"
                     style={{
                         width: "16.67%",
                         left: 0
                     }}/>
            </div>
        </div>
        <div
            className="w-[17.25rem] h-[3.75rem] text-inherit no-underline hover:text-black hover:bg-white bg-[#585858] pl-[4.5rem] pr-12 flex items-center justify-between absolute right-0 bottom-[11.25rem] translate-y-1/2 z-[4] cursor-pointer portrait:hidden"
            style={{transition: "color .3s, background-color .3s, transform .6s, opacity .6s, visibility .6s"}}>
            <IconArrow className="w-4 rotate-180 pointer-events-none"/>
            <div className="min-w-20">
                <div className="text-[1.25rem] font-bold">返回</div>
                <div className="text-[.875rem] font-benderBold">GO BACK</div>
            </div>
        </div>
    </>
}

export default function World() {
    const $viewIndex = useStore(viewIndex)
    const world = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if ($viewIndex === 3) {
            directions.set({top: false, right: true, bottom: true, left: false})
            world.current!.classList.remove("opacity-0")
        } else {
            world.current!.classList.add("opacity-0")
        }
    }, [$viewIndex])

    return <div
        className="w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto bg-[#272727] bg-2 bg-cover bg-[50%] transition-opacity duration-100">
        <div className="w-full h-full absolute left-0 bottom-0 bg-[#101010] opacity-85 pointer-events-none"/>
        {/* TODO: <canvas/> */}
        <div
            className="w-full h-full absolute left-0 bottom-0 bg-common-mask bg-[length:100%_100%] mix-blend-overlay pointer-events-none z-[2]"/>
        <List/>
        <div ref={world}
             className="h-[.95em] text-[#242424] text-[7rem] font-oswaldMedium whitespace-nowrap tracking-tighter absolute bottom-[11.25rem] left-[9rem] portrait:left-[4.25rem] portrait:bottom-[18.2908545727%] flex items-end translate-y-full overflow-hidden transition-opacity opacity-0 z-[2]">
            WORLD
        </div>
        <Details title="源石" subTitle="ORIGINIUMS"
                 description="大地被起因不明的天灾四处肆虐，经由天灾席卷过的土地上出现了大量的神秘矿物——“源石”。依赖于技术的进步，源石蕴含的能量投入工业后使得文明顺利迈入现代，与此同时，源石本身也催生出“感染者”的存在。"/>
    </div>
}
