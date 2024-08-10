import React from "react";
import PortraitBottomGradientMask from "../../components/PortraitBottomGradientMask";
import {CopyrightMini, IconGitHub, IconArchive} from "../../components/SvgIcons";

type HeroActionButtonProps = {
    icon: React.JSX.Element
    label: string
    subLabel?: string
    target?: "_blank" | "_top" | "_parent" | "_self"
    href: string
    className?: string
}

function HeroActionButton({icon, label, subLabel, target, href, className}: HeroActionButtonProps) {
    return <a target={target ?? "_blank"} href={href}
              className={`w-[10.5rem] portrait:w-[15.125rem] h-[3rem] portrait:h-[4.5rem] no-underline border-[1px] border-solid rounded pl-4 flex items-center transition-[border-color] duration-300 ${className ?? ""}`.trim()}>
        <div className="w-[1.5rem] portrait:w-[3rem] flex-none mr-3">{icon}</div>
        <div className="whitespace-nowrap leading-[1.4]">
            <div className="text-[.875rem] portrait:text-[1.25rem]">{label}</div>
            <div className="text-[.75rem] portrait:text-[1rem]">{subLabel}</div>
        </div>
    </a>
}

const heroActions: HeroActionButtonProps[] = [
    {
        icon: <IconArchive className="w-full h-auto pointer-events-none"/>,
        label: "文档",
        subLabel: "Documentation",
        href: import.meta.env.BASE_URL + "docs/",
        className: "text-black bg-ark-blue border-[#2bf] hover:border-white font-bold font-benderBold",
    },
    {
        icon: <IconGitHub className="w-full h-auto pointer-events-none"/>,
        label: "GitHub",
        subLabel: "Repository",
        href: "https://github.com/Yue-plus/astro-arknights",
        className: "text-white bg-black border-[#333] hover:border-white font-benderBold",
    },
]

export default function Index() {
    // TODO: 添加动效
    return <div className={"w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-0 z-[2]"
        + " transition-opacity duration-100"}>
        <div className={"w-full h-full absolute top-0 left-0 bg-index bg-center bg-cover bg-no-repeat"
            + " transition-opacity duration-1000"}/>
        {/* TODO: <video> <canvas> */}
        <div className={"w-[52.5rem] portrait:w-[18.75rem] h-[60.75rem] portrait:h-[12rem] absolute left-0 bottom-0"
            + " bg-mask-block portrait:bg-mask-block-m bg-[auto_110%] portrait:bg-[auto_100%] bg-[100%_0]"
            + " opacity-[.78] transition-opacity duration-[2s]"}/>
        <div className={"w-[52.5rem] portrait:w-[5.75rem] h-[60.75rem] portrait:h-[12rem]"
            + " absolute left-full bottom-0 opacity-25 transition-opacity delay-[2.3s] duration-[.6s]"
            + " bg-mask-block portrait:bg-mask-block-m bg-[auto_110%] portrait:bg-[auto_100%] bg-no-repeat"
            + " translate-x-[-14.75rem] portrait:translate-x-[-3.75rem]"}/>
        <PortraitBottomGradientMask/>
        <div className={"absolute left-[4.5rem] portrait:left-[2rem] bottom-[2.75rem] portrait:bottom-[3rem]"
            + " transition-transform duration-1000"}/>
        <div className={"absolute left-[4.5rem] portrait:left-[2rem] bottom-[2.75rem] portrait:bottom-[3rem]"
            + " transition-transform duration-1000"}>
            <div className={"flex"}>
                <div className={"leading-[.75] text-[5.5rem] portrait:text-[2.375rem] font-n15eUltraBold"
                    + " mr-[2rem] portrait:mr-[1rem]"}>ARKNIGHTS
                </div>
                <div className={"flex flex-col font-n15eMedium"}>
                    <div className={"text-[1.125rem] portrait:text-[.5rem]"}>RHODES ISLAND</div>
                    <div className={"text-[.875rem] portrait:text-[.375rem]"}>HTTPS://ARKNIGHTS.ASTRO.YUE.ZONE/</div>
                    <div className={"w-[6rem] h-px bg-white mt-auto"}/>
                </div>
            </div>
            <CopyrightMini className={"w-[7.875rem] portrait:w-[7.25rem] mt-[2.5rem] portrait:mt-[9.375rem]"
                + " block pointer-events-none"}/>
        </div>
        <div className="absolute right-[3rem] portrait:left-[2rem] bottom-[12.75rem] portrait:bottom-[19.5rem] space-y-3 portrait:space-y-5">{
            heroActions.map((props, index) => <HeroActionButton key={index} {...props} />)
        }</div>
        <div className={"w-[10.5rem] portrait:w-[5.75rem] absolute"
            + " portrait:top-[9.25rem] right-[3rem] portrait:right-0 bottom-[5.625rem] portrait:bottom-auto"
            + " flex items-center justify-between portrait:justify-center"}>
            {/* TODO: 扫码下载、适龄提示 */}
        </div>
    </div>
}
