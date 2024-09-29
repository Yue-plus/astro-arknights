import React, {useEffect, useRef, useState} from "react";
import {IconSocial, IconSound, IconUser} from "../SvgIcons";
import {useStore} from "@nanostores/react";
import {isOwnerInfoOpen, isToolBoxOpen} from "../store/rootLayoutStore.ts";
import arknightsConfig from "../../../arknights.config";

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

export function Sound() {
    const [active, setActive] = useState(arknightsConfig?.bgm?.autoplay ?? false)
    const [volume, setVolume] = useState(active ? 1 : 0)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isFading, setIsFading] = useState(false);
    const fadeIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            
            const handleFade = (targetVolume: number) => {
                setIsFading(true);
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                
                fadeIntervalRef.current = setInterval(() => {
                    if ((targetVolume === 1 && audio.volume < 1) || (targetVolume === 0 && audio.volume > 0)) {
                        audio.volume = Math.max(0, Math.min(1, audio.volume + (targetVolume === 1 ? 0.25 : -0.25)));
                        setVolume(audio.volume);
                    } else {
                        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                        setIsFading(false);
                        if (targetVolume === 0) audio.pause();
                    }
                }, 100) as unknown as number;
            };

            if (active) {
                audio.play().catch(e => console.error(e));
                handleFade(1);
            } else {
                handleFade(0);
            }
        }

        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        };
    }, [active]);

    const handleClick = () => {
        if (!isFading) {
            setActive(!active);
        }
    };

    return <div className={BoxClassName} onClick={handleClick}>
        <IconSound className={SvgClassName} style={{
            color: active ? ActiveColor : InactiveColor,
            transition: "transform .3s",
            transform: `scaleY(${active ? 1 : .5})`,
        }}/>
        <audio ref={audioRef} src={arknightsConfig?.bgm?.src ?? (import.meta.env.BASE_URL + "audios/bgm.mp3")}/>
    </div>
}

export function OwnerInfo() {
    const $isOwnerInfoOpen = useStore(isOwnerInfoOpen)
    return <div className={BoxClassName} onClick={() => isOwnerInfoOpen.set(!$isOwnerInfoOpen)}>
        <IconUser className={SvgClassName} style={{color: $isOwnerInfoOpen ? ActiveColor : InactiveColor}}/>
    </div>
}
