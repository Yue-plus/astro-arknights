import {useStore} from "@nanostores/react"
import {directions} from "./store/lineDecoratorStore"
import {useMemo} from "react";

export default function LineDecorator() {
    const base = "absolute bg-white bg-opacity-30 portrait:bg-opacity-50 transition-[transform,top,right,bottom,left] duration-1000 "
    const {top, right, bottom, left} = useStore(directions)
    const topClassName = useMemo(() =>
        base + (top ? "top-[9.5rem] portrait:top-[9.375rem] " : "-top-px ") + "w-full h-px right-0", [top])
    const rightClassName = useMemo(() =>
        base + (right ? "right-[14.75rem] portrait:right-[5.75rem] " : "-right-px ") + "w-px h-full top-0", [right])
    const bottomClassName = useMemo(() =>
        base + (bottom ? "bottom-[11.25rem] portrait:bottom-[12rem] " : "-bottom-px ") + "w-full h-px", [bottom])
    const leftClassName = useMemo(() =>
        base + (left ? "left-[14.75rem] portrait:left-[5.75rem] " : "-left-px ") + "w-px h-full top-0", [left])
    return <div id="line-decorator"
                className="w-full h-full absolute top-0 left-0 z-[3] pointer-events-none overflow-hidden">
        <div className={topClassName}/>
        <div className={rightClassName}/>
        <div className={bottomClassName}/>
        <div className={leftClassName}/>
    </div>
}
