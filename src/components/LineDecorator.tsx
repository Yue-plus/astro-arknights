import {useStore} from "@nanostores/react"
import {directions} from "./store/lineDecoratorStore"

export default function LineDecorator() {
    const base = "absolute bg-white bg-opacity-30 portrait:bg-opacity-50 transition-[transform,top,right,bottom,left] duration-1000 "
    const {top, right, bottom, left} = useStore(directions)

    return <div className="w-full h-full absolute top-0 left-0 z-[3] pointer-events-none overflow-hidden">
        <div className={base + (top ? "top-[9.5rem] portrait:top-[9.375rem] " : "-top-px ") + "w-full h-px right-0"}/>
        <div className={base
            + (right ? "right-[14.75rem] portrait:right-[5.75rem] " : "-right-px ")
            + "w-px h-full top-0"}/>
        <div className={base + (bottom ? "bottom-[11.25rem] portrait:bottom-[12rem] " : "-bottom-px ") + "w-full h-px"}/>
    </div>
}
