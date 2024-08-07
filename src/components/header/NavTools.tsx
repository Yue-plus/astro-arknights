import React, {useEffect, useRef, useState} from "react";
import {IconSocial, IconSound, IconUser} from "../SvgIcons";
import {useStore} from "@nanostores/react";
import {isOwnerInfoOpen, isToolBoxOpen} from "../store/rootLayoutStore.ts";

const ActiveColor = "#18d1ff"
const InactiveColor = "#c4c2c2"
const BoxClassName: React.ComponentProps<"div">["className"] =
    "h-4/5 m-auto relative flex flex-auto items-center justify-center cursor-pointer transition duration-300"
const SvgClassName: React.ComponentProps<"svg">["className"] = "w-auto h-[2.25rem] pointer-events-none"

export function Social() {
    const $isToolBoxOpen = useStore(isToolBoxOpen)
    return <div className={BoxClassName} onClick={() => isToolBoxOpen.set(!$isToolBoxOpen)}>
        <IconSocial className={SvgClassName} style={{color: $isToolBoxOpen ? ActiveColor : InactiveColor}}/>
    </div>
}

export function Sound({src}: {src: string}) {
    const [active, setActive] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (audioRef.current) {
            if (active) audioRef.current.play().catch(e => console.error(e));
            else audioRef.current.pause()
        }
    }, [active])

    return <div className={BoxClassName} onClick={_ => setActive(!active)}>
        <IconSound className={SvgClassName} style={{
            color: active ? ActiveColor : InactiveColor,
            transition: "transform .3s",
            transform: `scaleY(${active ? 1 : .5})`,
        }}/>
        <audio ref={audioRef} src={src} autoPlay/>
    </div>
}

export function OwnerInfo() {
    const $isOwnerInfoOpen = useStore(isOwnerInfoOpen)
    return <div className={BoxClassName} onClick={() => isOwnerInfoOpen.set(!$isOwnerInfoOpen)}>
        <IconUser className={SvgClassName} style={{color: $isOwnerInfoOpen ? ActiveColor : InactiveColor}}/>
    </div>
}
