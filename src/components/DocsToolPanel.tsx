import {IconArrow} from "./SvgIcons.tsx";

function ToTop() {
    return <div
        className="w-[3.75rem] h-full hover:text-black bg-[#3f3f3f] hover:bg-white hover:pb-4 flex items-center justify-center transition-[color,background-color,padding] duration-300 ease-linear"
        title="回到顶部" aria-label="回到顶部"
        onClick={() => document.getElementById("docs-content")?.scroll(0, 0)}>
        <IconArrow className="w-3 h-auto -rotate-90 select-none"/>
    </div>
}

export default function DocsToolPanel() {
    // TODO: 文档索引、回到顶部、沉浸模式
    return <>
        <ToTop/>
    </>
}
