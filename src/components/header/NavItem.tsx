import {useMemo} from "react";
import {useStore} from "@nanostores/react";
import type {NavbarItem} from "../../_types/ArknightsConfig.ts";
import {viewIndex} from "../store/rootLayoutStore.ts";

export default function NavItem({index, info}: {index: number, info: NavbarItem}) {
    const $viewIndex = useStore(viewIndex)

    const liClassName = useMemo(() => {
        return "inline-block text-center mx-10 duration-300 hover:text-ark-blue"
            + ($viewIndex !== index ? "" : " text-ark-blue")
    }, [$viewIndex])

    return <li className={liClassName} onClick={() => viewIndex.set(index)}>
        <a target="_self" href={info.href} className="text-left">
            <div className="font-oswaldMedium text-[1.375rem]">{info.title}</div>
            <div className="text-[0.875rem]">{info.subtitle}</div>
        </a>
    </li>
}

