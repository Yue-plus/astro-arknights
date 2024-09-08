import {type RefObject, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useStore} from "@nanostores/react"
import {viewIndex} from "./store/rootLayoutStore.ts"
import arknightsConfig from "../../arknights.config"

export default function PageTracker() {
    const labels = arknightsConfig.pageTracker.labels
    const $viewIndex = useStore(viewIndex)
    const [showIndex, setShowIndex] = useState($viewIndex)
    const [showLabel, setShowLabel] = useState(labels[$viewIndex])

    const nowIndexElement = useRef<HTMLDivElement>(null)
    const nowIndexDuration = 240
    const nowIndex = useMemo(() => showIndex.toString().padStart(2, "0"), [showIndex])

    const tinyIndexElement = useRef<HTMLDivElement>(null)
    const tinyIndexDuration = 260
    const tinyIndex = useMemo(() => {
        const maxIndex = labels.length - 1
        return `// ${nowIndex} / ${maxIndex.toString().padStart(2, "0")}`
    }, [nowIndex])

    const microInfoElement = useRef<HTMLDivElement>(null)
    const microInfoDuration = tinyIndexDuration

    const labelElement = useRef<HTMLDivElement>(null)
    const labelElementDuration = 280

    const handleElementAnimation = useCallback((element: RefObject<HTMLDivElement>, timeout: number) => {
        const translateY = $viewIndex > showIndex ? "-translate-y-8" : "translate-y-8"

        element.current?.classList.add(translateY, "opacity-0")
        setTimeout(() => element.current?.classList.replace(translateY, $viewIndex > showIndex ? "translate-y-8" : "-translate-y-8"), timeout)
        setTimeout(() => element.current?.classList.remove("translate-y-8", "-translate-y-8", "opacity-0"), timeout * 2)
    }, [$viewIndex, showIndex])

    useEffect(() => {
        handleElementAnimation(nowIndexElement, nowIndexDuration)
        handleElementAnimation(tinyIndexElement, tinyIndexDuration)
        handleElementAnimation(microInfoElement, microInfoDuration)
        handleElementAnimation(labelElement, labelElementDuration)

        setTimeout(() => {
            setShowIndex($viewIndex)
            setShowLabel(labels[$viewIndex])
        }, Math.max(nowIndexDuration, tinyIndexDuration))
    }, [$viewIndex])

    return <div
        className="w-[10rem] portrait:w-[4rem] absolute top-[44.4444444444%] portrait:top-[auto] right-[7.375rem] portrait:right-[2.875rem] portrait:bottom-[12.5rem] translate-x-1/2 z-[6] whitespace-nowrap leading-[normal] select-none">
        <div ref={nowIndexElement} style={{transitionDuration: nowIndexDuration + "ms"}}
             className="text-ark-blue text-[5.4rem] portrait:text-[3.6rem] portrait:text-center font-n15eDemiBold leading-[.55] overflow-hidden transition-[opacity,transform]">
            {nowIndex}
        </div>
        <div ref={tinyIndexElement} style={{transitionDuration: tinyIndexDuration + "ms"}}
             className="mt-[-1.55em] text-right text-[1.125rem] portrait:text-[1rem] portrait:text-center font-benderRegular portrait:writing-rl portrait:absolute portrait:right-0 bottom-0 transition-[opacity,transform]">
            {tinyIndex}
        </div>
        <div ref={microInfoElement} style={{transitionDuration: microInfoDuration + "ms"}}
             className="text-right text-[.375rem] font-n15eMedium tracking-[.5em] portrait:hidden transition-[opacity,transform]">
            {arknightsConfig.pageTracker.microInfo}
        </div>
        <div ref={labelElement} style={{transitionDuration: labelElementDuration + "ms"}}
             className="text-right portrait:text-center text-[1.125rem] portrait:text-[.625rem] font-n15eDemiBold tracking-widest portrait:absolute portrait:right-[1.5rem] portrait:bottom-0 portrait:writing-rl transition-[opacity,transform]">
            {showLabel}
        </div>
    </div>
}
