import React from "react";
import {useStore} from "@nanostores/react";
import {isToolBoxOpen} from "./store/rootLayoutStore.ts";
import {
    IconBiliBili,
    IconSkland,
    IconSocial,
    IconTapTap,
    IconWechat,
    IconWeibo,
    LogoRhodesIsland
} from "./SvgIcons";

export default function ToolBox() {
    const $isToolBoxOpen = useStore(isToolBoxOpen)

    const aClassName: string = "w-[3.375rem] portrait:w-[6.375rem] h-[3.375rem] portrait:h-[6.375rem] text-white"
        + " bg-black transition duration-300 portrait:border portrait:border-solid portrait:border-white flex flex-none"
        + " rounded-lg portrait:rounded-2xl cursor-pointer"
    const iconClassName: string = "h-auto m-auto pointer-events-none block"
    return <div className="w-full h-full absolute top-0 left-0 z-[24] overflow-hidden transition duration-300"
                style={{opacity: $isToolBoxOpen ? 1 : 0, visibility: $isToolBoxOpen ? "visible" : "hidden"}}>
        <div className="w-full h-full absolute top-0 left-0 portrait:bg-black portrait:opacity-70 transition duration-300"
             onClick={() => isToolBoxOpen.set(!$isToolBoxOpen)}/>
        <div className={`w-[14.75rem] portrait:w-[32.5rem] portrait:h-[50rem] bg-ark-blue portrait:pt-[12.5rem]
                         absolute top-[6.75rem] portrait:top-1/2 right-0 portrait:left-1/2
                         transition duration-300
                         portrait:-translate-x-1/2 portrait:-translate-y-1/2`}>
            <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
                <LogoRhodesIsland className={`h-[59.375rem] portrait:h-[55rem] text-[#06bbff]
                                              absolute top-[-2rem] left-[-18.75rem] portrait:left-[-5rem]`}/>
            </div>
            <div className={`w-[4.5rem] h-[4.5rem] mt-[.5rem] text-white
                             absolute right-0 top-0 transition duration-300 cursor-pointer
                             hidden portrait:block`}
                 onClick={() => isToolBoxOpen.set(!$isToolBoxOpen)}>
                <div
                    className="w-[.25rem] h-4/5 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"/>
                <div
                    className="w-[.25rem] h-4/5 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"/>
            </div>
            <IconSocial
                className="w-[3rem] h-auto absolute left-[3.5rem] top-[7.5rem] pointer-events-none hidden portrait:block"/>
            <div className={`border-[1rem] border-solid border-transparent border-b-ark-blue
                             absolute bottom-full left-[2rem]
                             portrait:hidden`}></div>
            <div className="portrait:w-[25.75rem] relative pt-[2.625rem] portrait:pt-0 pb-[3rem] portrait:m-auto">
                <div className={"mx-12 portrait:mr-0 portrait:ml-0 whitespace-nowrap font-benderBold"
                    + " text-[.75rem] portrait:text-[1.125rem] flex items-center"}>
                    TOOLBOX
                    <span className="ml-[1em] flex-auto h-px bg-white"></span>
                </div>
                <div className={"mt-[1rem] portrait:mt-[3.5rem] px-[3rem] portrait:p-0"
                    + " grid grid-cols-2 portrait:grid-cols-3 gap-[1.75rem]"
                    + " portrait:gap-x-[3.32rem] portrait:gap-y-[2rem] justify-items-center"}>
                    <a className={aClassName}>
                        <IconSkland className={"w-[2rem]  portrait:w-[4rem] " + iconClassName}/>
                    </a>
                    <a className={aClassName}>
                        <IconBiliBili className={"w-[2.75rem] portrait:w-[5rem] " + iconClassName}/>
                    </a>
                    <a className={aClassName}>
                        <IconWechat className={"w-[2rem]  portrait:w-[4rem] " + iconClassName}/>
                    </a>
                    <a className={aClassName}>
                        <IconWeibo className={"w-[2rem]  portrait:w-[4rem] " + iconClassName}/>
                    </a>
                    <a className={aClassName}>
                        <IconTapTap className={"w-[3rem]  portrait:w-[6rem] " + iconClassName}/>
                    </a>
                </div>
            </div>
        </div>
    </div>
}
