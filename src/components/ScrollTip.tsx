import {useStore} from "@nanostores/react";
import {viewIndex} from "./store/rootLayoutStore.ts";
import {IconArrow, LogoRhodesIsland} from "./SvgIcons";

export default function ScrollTip() {
    const $ViewIndex = useStore(viewIndex)
    const viewIndexInLast = $ViewIndex === 5 // TODO:

    return <div className={"w-[3rem] absolute left-1/2 bottom-[3.75rem] -translate-x-1/2 z-[4] pointer-events-none"}>
        <div className={"flex flex-col items-center transition-opacity duration-300"
            + ($ViewIndex === 0 || " opacity-0")}>
            <LogoRhodesIsland className={"pointer-events-none"} />
        </div>
        <div className={"flex flex-col items-center transition-colors duration-300"
            + ($ViewIndex === 0 ? " text-ark-blue" : " text-[#585858]")
            + (viewIndexInLast ? " animate-showHide" : " animate-downHide")}>
            <div className={"text-[.75rem] font-n15eMedium mt-[.25rem]"
                + (!viewIndexInLast || " opacity-0")}>SCROLL</div>
            <IconArrow className={"w-[1.25rem] mt-[-.5rem] mb-[-.5rem] pointer-events-none"
                + (viewIndexInLast ? " -rotate-90" : " rotate-90")} />
        </div>
    </div>
}
