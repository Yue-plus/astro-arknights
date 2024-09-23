import React, {useEffect, useRef, useState} from "react";
import {useStore} from "@nanostores/react";
import {viewIndex} from "../../components/store/rootLayoutStore.ts";
import {directions} from "../../components/store/lineDecoratorStore.ts";

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
        className="w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] transition-[opacity,visibility] duration-[600] portrait:invisible portrait:opacity-0 z-[3]">
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
             className="h-[.95em] text-[#242424] text-[7rem] font-oswaldMedium whitespace-nowrap tracking-tighter absolute bottom-[11.25rem] left-[9rem] flex items-end translate-y-full overflow-hidden transition-opacity opacity-0 z-[2]">
            WORLD
        </div>
    </div>
}
