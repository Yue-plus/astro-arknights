import React from "react";
import {
    IconArrow,
    IconBiliBili,
    IconSkland,
    IconTapTap,
    IconWechat,
    IconWeibo,
    LogoRhodesIsland
} from "./SvgIcons";
import {isOwnerInfoOpen} from "./store/rootLayoutStore.ts";
import {useStore} from "@nanostores/react";


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
    return <>
        <Divider>WELCOME</Divider>
        <div className={"h-[24rem] portrait:h-[32rem] relative"}>
            <div className={"w-full absolute top-[2.375rem] portrait:top-[1rem]"}>
                <img className={"w-[12.5625rem] portrait:w-[21rem] h-auto ml-[1.5rem] portrait:ml-[5.5rem] block"}
                     src={import.meta.env.BASE_URL + "images/no_account_info.png"}
                     alt="无账号信息"/>
                <img className={"w-[10.75rem] portrait:w-[17.75rem] h-auto ml-[2.875rem] portrait:ml-[8rem] block"}
                     src={import.meta.env.BASE_URL + "images/stroke_text-rhodes_island.png"}
                     alt="Rhodes Island"/>
                <div className={"text-[1.125rem] portrait:text-[1.875rem]"
                    + " ml-[2.875rem] portrait:ml-[8rem] mt-[.25rem] font-bold"}>Please login.</div>
                <div className={"text-[1rem] portrait:text-[1.625rem]"
                    + " ml-[2.875rem] portrait:ml-[8rem]"}>请先登入您的账号。</div>
            </div>
        </div>
    </>
}

function ToolBox() {
    const aClassName: string = "text-inherit no-underline decoration-0 cursor-pointer flex-1"
        + " opacity-70 transition-opacity duration-300"
    const iconClassName: string = "h-auto m-auto pointer-events-none"

    return <>
        <Divider portraitHidden>TOOLBOX</Divider>
        <div className={"mt-[2rem] pl-[1rem] portrait:hidden"}>
            <div className={"flex items-center justify-between"}>
                <a className={aClassName}><IconSkland className={"w-[2rem] " + iconClassName}/></a>
                <a className={aClassName}><IconBiliBili className={"w-[3rem] " + iconClassName}/></a>
                <a className={aClassName}><IconWechat className={"w-[2rem] " + iconClassName}/></a>
            </div>
            <div className={"flex items-center justify-between mt-[.5rem]"}>
                <a className={aClassName}><IconWeibo className={"w-[2rem] " + iconClassName}/></a>
                <a className={aClassName}><IconTapTap className={"w-[3rem] " + iconClassName}/></a>
                <a className={"flex-1"}/>
            </div>
        </div>
    </>
}

function BoxButton({label, url, portraitHidden}: {
    label: string
    url: string
    portraitHidden?: boolean
}) {
    return <a href={url} className={"h-[1.5rem] portrait:h-[2.5rem]"
        + " mt-[1rem] portrait:mt-[1.5rem] px-[1.25rem] portrait:px-[2rem]"
        + " text-white hover:text-black bg-black hover:bg-white flex items-center justify-between"
        + " transition duration-300 cursor-pointer portrait:text-[1.625rem]"
        + (portraitHidden ? " portrait:hidden" : "")}>
        <span style={{fontFamily: "SourceHanSans-Medium"}}>{label}</span>
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
                    <BoxButton label="客服中心" url="" portraitHidden/>
                    <BoxButton label="立即登入" url=""/>
                    <BoxButton label="前往注册" url=""/>
                </div>
                <CloseButton/>
            </div>
        </div>
    </aside>
}
