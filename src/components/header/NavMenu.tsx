import React from "react";
import {IconBiliBili, IconSkland, IconTapTap, IconWechat, IconWeibo} from "../SvgIcons";
import {useStore} from "@nanostores/react";
import {isNavMenuOpen, viewIndex} from "../store/rootLayoutStore.ts";

export default function NavMenu() {
    const LineClassName: React.ComponentProps<"div">["className"] =
        "w-full h-[2px] bg-white absolute left-1/2 transition duration-300 ease-in-out"
    const $isNavMenuOpen = useStore(isNavMenuOpen)
    return <div className="w-[5.75rem] h-full landscape:hidden portrait:flex"
                onClick={() => isNavMenuOpen.set(!$isNavMenuOpen)}>
        <div className="w-[2.625rem] h-[2.375rem] m-auto relative">
            <div className={LineClassName} style={{
                top: $isNavMenuOpen ? "1.1875rem" : "1px",
                transform: `translate(-50%, -50%) ${$isNavMenuOpen ? "rotate(45deg) scaleX(1.2)" : ""}`,
            }}></div>
            <div className={`${LineClassName} top-1/2 -translate-x-1/2 -translate-y-1/2`} style={{
                opacity: $isNavMenuOpen ? 0 : 1,
                transform: `translateX(${$isNavMenuOpen ? "-100%" : "-50%"}) translateY(-50%)`,
            }}></div>
            <div className={`${LineClassName} bottom-px -translate-x-1/2 translate-y-1/2`} style={{
                bottom: $isNavMenuOpen ? "1.1875rem" : "1px",
                transform: `translate(-50%, 50%) ${$isNavMenuOpen ? "rotate(-45deg) scaleX(1.2)" : ""}`,
            }}></div>
        </div>
    </div>
}

function Navigation() {
    const $viewIndex = useStore(viewIndex)
    const $isNavMenuOpen = useStore(isNavMenuOpen)
    const base = import.meta.env.BASE_URL

    let delay = -70
    return <div className="pt-[1.25rem] pr-[2.25rem] pb-0 pl-[3.375rem]">{
        // TODO: 此处可以服务端渲染
        [
            {title: "INDEX", subtitle: "首页", href: base + "#index"},
            {title: "INFORMATION", subtitle: "情报", href: base + "#information"},
            {title: "OPERATOR", subtitle: "干员", href: base + "#operator"},
            {title: "WORLD", subtitle: "设定", href: base + "#world"},
            {title: "MEDIA", subtitle: "泰拉万象", href: base + "#media"},
            {title: "MORE", subtitle: "更多内容", href: base + "#more"},
        ].map((item, index) => {
            delay += 70
            return <a key={index} href={item.href}
                      onClick={_ => isNavMenuOpen.set(!$isNavMenuOpen)}
                      className={"h-[7.5rem] flex items-center justify-between transition ease-in-out duration-200"}
                      style={{
                          color: $viewIndex === index ? "#19d1ff" : "inherit",
                          borderBottom: "1px solid hsla(0, 0%, 100%, .3)",
                          transitionDelay: delay + "ms",
                          opacity: $isNavMenuOpen ? 1 : 0,
                          transform: `translateX(${$isNavMenuOpen ? "0" : "20%"})`,
                      }}>
                <div className={`transition duration-300 text-4xl font-oswaldMedium`}>
                    {item.title}
                </div>
                <div className="h-full text-[1.75rem] relative flex items-center transition duration-300">
                    {item.subtitle}
                    <div className="w-full h-[.375rem] absolute right-0 bottom-[-.1875rem] bg-[currentColor]"></div>
                </div>
            </a>
        })
    }</div>
}

function ToolBox() {
    const aClassName: string = "text-inherit flex-none cursor-pointer"
    const iconClassName: string = "h-auto m-auto pointer-events-none"
    return <div className={"mt-auto pr-9 pb-[4.5rem] pl-[3.375rem]"}>
        <div className={"text-[1.5rem] font-benderBold flex items-center"}>
            <div className={"w-full min-w-0 h-px mr-4 bg-white bg-opacity-30 flex-auto"}/>
            TOOLBOX
        </div>
        <div className={"mt-4 flex items-center justify-between"}>
            <a className={aClassName}><IconSkland className={"w-[4.5rem] " + iconClassName} /></a>
            <a className={aClassName}><IconBiliBili className={"w-[4.5rem] " + iconClassName}/></a>
            <a className={aClassName}><IconWechat className={"w-[3rem] " + iconClassName}/></a>
            <a className={aClassName}><IconWeibo className={"w-[3rem] " + iconClassName}/></a>
            <a className={aClassName}><IconTapTap className={"w-[4.5rem] " + iconClassName}/></a>
        </div>
    </div>
}

export function Menu() {
    const $isNavMenuOpen = useStore(isNavMenuOpen)
    return <div className={"w-full h-full absolute top-0 left-0 z-[22] overflow-hidden bg-black bg-opacity-90"
        + " transition-[opacity,visibility] ease-in-out duration-[600ms]"}
                style={{opacity: $isNavMenuOpen ? 1 : 0, visibility: $isNavMenuOpen ? "visible" : "hidden"}}>
        <div className="w-full h-px absolute left-0 top-[9.375rem] bg-[#4f4f4f]"></div>
        <div className="w-full h-full pt-[9.375rem] pr-[5.75rem] flex flex-col">
            <Navigation/>
            <ToolBox/>
        </div>
        <div className="w-px h-full absolute top-0 right-[5.75rem] bg-[#4f4f4f]"></div>
    </div>
}
