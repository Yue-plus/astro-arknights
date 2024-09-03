import {IconArrow} from "./SvgIcons.tsx";

export default function GoBackTool({goBackHref}: { goBackHref?: string }) {
    const base = import.meta.env.BASE_URL
    return <>
        <a href={goBackHref ? goBackHref : base} target="_self"
           className="w-[14.875rem] h-[3.75rem] text-inherit no-underline hover:text-black hover:bg-white bg-[#5a5a5a] px-[2.5rem] flex items-center justify-between cursor-pointer transition-[color,background-color] duration-300">
            <IconArrow className="w-2 rotate-180 pointer-events-none"/>
            <div>
                <div className="text-[1.25rem] font-bold">{goBackHref ? "返回列表" : "返回首页"}</div>
                <div className="text-[.875rem] font-benderBold">GO BACK</div>
            </div>
        </a>
        {
            goBackHref &&
            <a href={base} target="_self"
               className="w-[10.5rem] h-[3.75rem] text-inherit no-underline hover:text-black hover:bg-white bg-[#3f3f3f] px-[2.25rem] flex items-center justify-between cursor-pointer transition-[color,background-color] duration-300">
                <div>
                    <div className="text-[1.25rem] font-bold">返回首页</div>
                    <div className="text-[.875rem] font-benderBold">HOMEPAGE</div>
                </div>
            </a>
        }
    </>
}
