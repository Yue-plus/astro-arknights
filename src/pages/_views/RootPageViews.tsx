import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {viewIndex, viewIndexSetNext, viewIndexSetPrev} from "../../components/store/rootLayoutStore.ts";
import arknightsConfig from "../../../arknights.config.tsx";
import RootPageViewTemplate from "./RootPageViewTemplate.tsx";
import Index from "./00-Index.tsx";
import Information from "./01-Information.tsx";
import Operator from "./02-Operator.tsx";
import World from "./03-World.tsx";
import Media from "./04-Media.tsx";
import More from "./05-More.tsx";

export default function RootPageViews() {
    const [isLoading, setIsLoading] = useState(true);

    const [localViewIndex, setLocalViewIndex] = useState(() => {
        const HASH = location.hash.split("#")[1];
        const INDEX = arknightsConfig.navbar.items.findIndex(item =>
            HASH === item.href.split("#")[1])
        return INDEX === -1 ? 0 : INDEX;
    });

    useLayoutEffect(() => {
        viewIndex.set(localViewIndex);
        setIsLoading(false);
    }, [localViewIndex]);

    // 处理 hash 变化
    useLayoutEffect(() => {
        const handleHashChange = () => {
            const HASH = location.hash.split("#")[1];
            const INDEX = arknightsConfig.navbar.items.findIndex(item =>
                HASH === item.href.split("#")[1])
            setLocalViewIndex(INDEX === -1 ? 0 : INDEX);
        }

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    useLayoutEffect(() => {
        const HASH = location.hash.split("#")[1];
        const INDEX = arknightsConfig.navbar.items.findIndex(item =>
            HASH === item.href.split("#")[1])
        viewIndex.set(INDEX === -1 ? 0 : INDEX)
    }, [])

    const startTouchY = useRef(0)

    const handleTouchStart = useCallback((event: TouchEvent) => {
        startTouchY.current = event.touches[0].clientY
    }, [])

    const handleTouchEnd = useCallback((event: TouchEvent) => {
        const diffY = startTouchY.current - event.changedTouches[0].clientY
        if (Math.abs(diffY) > 160) {
            diffY > 0 ? viewIndexSetNext() : viewIndexSetPrev()
        }
    }, [viewIndexSetNext, viewIndexSetPrev])

    useEffect(() => {
        const rootElement = document.getElementById("root-page-views")

        rootElement!.addEventListener("touchstart", handleTouchStart)
        rootElement!.addEventListener("touchend", handleTouchEnd)

        return () => {
            rootElement!.removeEventListener("touchstart", handleTouchStart)
            rootElement!.removeEventListener("touchend", handleTouchEnd)
        }
    }, [handleTouchStart, handleTouchEnd])

    const lastScrollTime = useRef(0);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (performance.now() - lastScrollTime.current > 1000) {
                let newIndex: number
                if (event.deltaY < 0)
                    newIndex = localViewIndex > 0 ? localViewIndex - 1 : localViewIndex
                else
                    newIndex = localViewIndex < arknightsConfig.navbar.items.length - 1 ? localViewIndex + 1 : localViewIndex

                location.hash = arknightsConfig.navbar.items[newIndex].href.split("#")[1]
                viewIndex.set(newIndex)
                lastScrollTime.current = performance.now();
            }
        }

        const rootElement = document.getElementById("root-page-views")
        rootElement!.addEventListener("wheel", handleScroll)
        return () => rootElement!.removeEventListener("wheel", handleScroll);
    }, [localViewIndex])

    if (isLoading) {
        return null; // 或者返回一个加载指示器
    }

    return [Index, Information, Operator, World, Media, More].map((Element, index) =>
        <RootPageViewTemplate key={index} selfIndex={index}><Element /></RootPageViewTemplate>
    )
}
