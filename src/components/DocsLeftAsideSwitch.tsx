import {IconArrow} from "./SvgIcons.tsx";
import {useEffect, useMemo, useState} from "react";

export default function DocsLeftAsideSwitch() {
    const [isOpen, setIsOpen] = useState(true);
    const iconClassName = useMemo(() => (isOpen ? "rotate-180 " : "") + "h-6 inline-block select-none", [isOpen])

    useEffect(() => {
        const nav = document.getElementById("docs-nav-list")
        nav && (isOpen ? nav.classList.remove("hidden") : nav.classList.add("hidden"))
    }, [isOpen])

    return <div className={(isOpen ? "" : "h-full ")
        + "hover:text-black bg-[#5a5a5a] hover:bg-white p-2 flex justify-center items-center transition"}
                title="收起侧边栏" aria-label="收起侧边栏"
                onClick={() => setIsOpen(!isOpen)}>
        <div>
            <IconArrow className={iconClassName}/>
            <IconArrow className={iconClassName}/>
        </div>
    </div>
}
