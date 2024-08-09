import {useStore} from "@nanostores/react";
import {viewIndex} from "./store/rootLayoutStore.ts";
import arknightsConfig from "../../arknights.config";

export default function PageTracker() {
    const $viewIndex = useStore(viewIndex)

    // TODO: 添加动效
    return <div className={"w-[10rem] portrait:w-[4rem] absolute top-[44.4444444444%] portrait:top-[auto]"
        + " right-[7.375rem] portrait:right-[2.875rem] portrait:bottom-[12.5rem]"
        + " translate-x-1/2 z-[6] whitespace-nowrap leading-[normal]"}>
        <div className={"font-n15eDemiBold"}></div>
        <div className={"text-ark-blue text-[5.4rem] portrait:text-[3.6rem] portrait:text-center font-n15eDemiBold"
            + " leading-[.55] overflow-hidden"}
        >{"0" + $viewIndex}</div>
        <div className={"mt-[-1.55em] text-right text-[1.125rem] portrait:text-[1rem] portrait:text-center"
            + " font-benderRegular portrait:writing-rl portrait:absolute portrait:right-0 bottom-0"}
        >{`// 0${$viewIndex} / 0${arknightsConfig.pageTracker.labels.length - 1}`}</div>
        <div className={"text-right text-[.375rem] font-n15eMedium tracking-[.5em] portrait:hidden"}
        >{arknightsConfig.pageTracker.microInfo}</div>
        <div className={"text-right portrait:text-center text-[1.125rem] portrait:text-[.625rem] font-n15eDemiBold"
            + " tracking-widest portrait:absolute portrait:right-[1.5rem] portrait:bottom-0 portrait:writing-rl"}
        >{arknightsConfig.pageTracker.labels[$viewIndex]}</div>
    </div>
}
