import React from "react"
import type {OwnerInfoFooterLink} from "../_types/ArknightsConfig.ts"
import arknightsConfig from "../../arknights.config.tsx"
import {
    IconArrow,
    IconBiliBili,
    IconGitHub,
    IconSkland,
    IconTapTap,
    IconWechat,
    IconWeibo,
    LogoRhodesIsland,
} from "./SvgIcons"
import {isOwnerInfoOpen} from "./store/rootLayoutStore.ts"
import {useStore} from "@nanostores/react"


function Divider({children, portraitHidden}: {
    children: React.ReactNode
    portraitHidden?: boolean
}) {
    return <div className={"mr-[1.25rem] portrait:mr-[6.75rem] ml-[2.25rem] portrait:ml-[8rem] whitespace-nowrap"
        + " text-[.75rem] portrait:text-[1.125rem] font-benderBold flex items-center "
        + (portraitHidden ? " portrait:hidden" : "")}>
        {children}
        <span className="ml-[1em] flex-auto h-px bg-white"/>
    </div>
}

function Welcome() {
    const name = arknightsConfig?.navbar?.ownerInfo?.name
        ? <div className="pb-5">
            <img className="w-[12.5625rem] portrait:w-[21rem] h-auto ml-[1.5rem] portrait:ml-[5.5rem] block"
                 src={import.meta.env.BASE_URL + "images/passport.png"}
                 alt="通行证"/>
            <div
                className="text-[1rem] portrait:text-[1.75rem] mt-[-3.5rem] portrait:mt-[-5.75rem] ml-8 portrait:ml-[6.5rem]">
                <div className="h-6 portrait:h-8 bg-[#232323] px-3 inline-flex items-center"
                     style={{boxShadow: "0 .75rem .5rem rgba(0, 0, 0, .5)"}}>
                    {arknightsConfig.navbar.ownerInfo.name}
                </div>
            </div>
        </div>
        : <img
            className="w-[12.5625rem] portrait:w-[21rem] h-auto ml-[1.5rem] portrait:ml-[5.5rem] block"
            src={import.meta.env.BASE_URL + "images/no_account_info.png"}
            alt="无账号信息"/>

    const slogan = arknightsConfig?.navbar?.ownerInfo?.slogan
        ? <div
            className="w-[10.75rem] portrait:w-[17.75rem] text-[1rem] portrait:text-[1.625rem] font-bold mt-8 ml-11 portrait:ml-[8.5rem] break-words hyphens-auto text-ellipsis">
            {/* TODO: 换个字体 */}
            {arknightsConfig.navbar.ownerInfo.slogan}
        </div>
        : <img className="w-[10.75rem] portrait:w-[17.75rem] h-auto ml-[2.875rem] portrait:ml-[8rem] block"
               src={import.meta.env.BASE_URL + "images/stroke_text-rhodes_island.png"}
               alt="Rhodes Island"/>

    return <>
        <Divider>WELCOME</Divider>
        <div className={"h-[24rem] portrait:h-[32rem] relative"}>
            <div className={"w-full absolute top-[2.375rem] portrait:top-[1rem]"}>
                {name}
                {slogan}
                {/*
                <div className="text-[1.125rem] portrait:text-[1.875rem] ml-[2.875rem] portrait:ml-[8rem] mt-[.25rem] font-bold">Please login.</div>
                <div className="text-[1rem] portrait:text-[1.625rem] ml-[2.875rem] portrait:ml-[8rem]">请先登入您的账号。</div>
                */}
            </div>
        </div>
    </>
}

function ToolBox() {
    const {Skland, Bilibili, WeChat, Weibo, TapTap, GitHub} = arknightsConfig.navbar.toolbox
    const aClassName: string = "text-inherit no-underline decoration-0 cursor-pointer flex flex-1 opacity-70 transition-opacity duration-300"
    const iconClassName: string = "h-auto m-auto pointer-events-none"

    return <>
        <Divider portraitHidden>TOOLBOX</Divider>
        <div className={"mt-4 pl-4 grid grid-cols-3 gap-y-2 portrait:hidden"}>
            {
                GitHub && <a target="_blank" href={GitHub} className={aClassName} aria-label="GitHub">
                    <IconGitHub className={"w-[2rem] " + iconClassName}/>
                </a>
            }
            {
                Skland && <a target="_blank" href={Skland} className={aClassName} aria-label="Skland - 森空岛">
                    <IconSkland className={"w-[2rem] " + iconClassName}/>
                </a>
            }
            {
                Bilibili && <a target="_blank" href={Bilibili} className={aClassName} aria-label="Bilibili - 哔哩哔哩">
                    <IconBiliBili className={"w-[3rem] " + iconClassName}/>
                </a>
            }
            {
                WeChat && <a target="_blank" href={WeChat} className={aClassName} aria-label="WeChat - 微信">
                    <IconWechat className={"w-[2rem] " + iconClassName}/>
                </a>
            }
            {
                Weibo && <a target="_blank" href={Weibo} className={aClassName} aria-label="Weibo - 微博">
                    <IconWeibo className={"w-[2rem] " + iconClassName}/>
                </a>
            }
            {
                TapTap && <a target="_blank" href={TapTap} className={aClassName} aria-label="TapTap">
                    <IconTapTap className={"w-[3rem] " + iconClassName}/>
                </a>
            }
        </div>
    </>
}

function FooterLink({label, url, portraitHidden}: OwnerInfoFooterLink) {
    return <a href={url} className={(portraitHidden ? "portrait:hidden " : "")
        + "h-[1.5rem] portrait:h-[2.5rem] mt-[1rem] portrait:mt-[1.5rem] px-[1.25rem] portrait:px-[2rem] text-white portrait:text-[1.625rem] hover:text-black bg-black hover:bg-white flex items-center justify-between transition duration-300 cursor-pointer"}>
        <span className="font-benderBold">{label}</span>
        <IconArrow className="w-[.5rem] pointer-events-none"/>
    </a>
}

export default function OwnerInfo(): React.JSX.Element {
    const $isOwnerInfoOpen = useStore(isOwnerInfoOpen)

    function CloseButton(): React.ReactElement {
        const xLine: string = "w-[.375rem] portrait:w-[.25rem] h-4/5 bg-current"
            + " absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        return <div className={"portrait:w-[4.5rem] h-[11.25rem] portrait:h-[4.5rem] mt-[3.75rem] portrait:mt-[.5rem]"
            + " text-white hover:text-black bg-ark-blue portrait:bg-transparent hover:bg-white"
            + " relative portrait:absolute portrait:right-0 top-0 transition duration-300 cursor-pointer"}
                    onClick={() => isOwnerInfoOpen.set(!$isOwnerInfoOpen)}>
            <div className={`${xLine} rotate-45`}/>
            <div className={`${xLine} -rotate-45`}/>
        </div>
    }

    return <aside className={"w-full h-full absolute top-0 left-0 z-[24] overflow-hidden transition duration-300"}
                  style={{opacity: $isOwnerInfoOpen ? 1 : 0, visibility: $isOwnerInfoOpen ? "visible" : "hidden"}}>
        <div className={"w-full h-full absolute top-0 left-0 portrait:bg-black portrait:opacity-70"
            + " transition duration-300"} onClick={() => isOwnerInfoOpen.set(!$isOwnerInfoOpen)}/>
        <div className={"w-[14.75rem] portrait:w-[32.5rem] h-full portrait:h-auto bg-ark-blue overflow-hidden"
            + " absolute top-0 portrait:top-1/2 right-0 portrait:left-1/2 transition duration-300"
            + " portrait:-translate-x-1/2 portrait:-translate-y-1/2 portrait:scale-100"}>
            <div className="w-full h-full absolute top-0 left-0">
                <div className={"h-[59.375rem] portrait:h-[55rem] text-[#06bbff]"
                    + " absolute top-[-2rem] left-[-18.75rem] portrait:left-[-5rem] portrait:z-[-1]"}>
                    <LogoRhodesIsland className="w-auto h-full pointer-events-none"/>
                </div>
            </div>
            <div className="relative pt-[5.875rem] portrait:pt-[2rem]">
                <Welcome/>
                <ToolBox/>
            </div>
            <div className={"w-full absolute left-0 bottom-0 portrait:static portrait:mb-[3.75rem]"}>
                <div className={"relative portrait:static pl-[2.5rem] pr-[1.25rem]"
                    + " portrait:pl-[8rem] portrait:pr-[6.75rem]"}>
                    {
                        // TODO: 感觉有点和上面 <ToolBox/> 功能重复
                        arknightsConfig?.navbar?.ownerInfo?.footerLinks?.map((item, index) =>
                            <FooterLink key={index} {...item}/>) ?? null
                    }

                    {/*
                    <BoxButton label="客服中心" url="" portraitHidden/>
                    <BoxButton label="立即登入" url=""/>
                    <BoxButton label="前往注册" url=""/>
                    */}
                </div>
                <CloseButton/>
            </div>
        </div>
    </aside>
}
