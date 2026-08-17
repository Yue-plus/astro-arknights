import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
// 引入新状态 isFooterVisible
import {viewIndex, viewIndexSetNext, viewIndexSetPrev, isFooterVisible, isScrollLocked} from "../../components/store/rootLayoutStore.ts";
import arknightsConfig from "../../../arknights.config.tsx";
import RootPageViewTemplate from "./RootPageViewTemplate.tsx";
import Index from "./00-Index.tsx";
import Information from "./01-Information.tsx";
import Operator from "./02-Operator.tsx";
import World from "./03-World.tsx";
import Media from "./04-Media.tsx";
import More from "./05-More.tsx";

const MAX_INDEX = arknightsConfig.navbar.items.length - 1; // 5

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
        // 每次切换大页面时，重置 Footer 状态
        isFooterVisible.set(false);
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

    // --- 修改触摸逻辑 ---
    const handleTouchEnd = useCallback((event: TouchEvent) => {
        // [新增] 如果滚动被锁定（例如正在查看图集），则不执行主页面切换
        if (isScrollLocked.get()) return;

        const diffY = startTouchY.current - event.changedTouches[0].clientY
        if (Math.abs(diffY) > 100) { // 稍微降低一点触发阈值
            // 向上滑 (手指由下往上，试图看下面) -> Next / Show Footer
            if (diffY > 0) {
                if (localViewIndex === MAX_INDEX) {
                    // 如果在最后一页，且还没显示 Footer -> 显示 Footer
                    if (!isFooterVisible.get()) isFooterVisible.set(true);
                } else {
                    viewIndexSetNext();
                }
            } 
            // 向下滑 (手指由上往下，试图看上面) -> Prev / Hide Footer
            else {
                if (localViewIndex === MAX_INDEX && isFooterVisible.get()) {
                    // 如果在最后一页且显示了 Footer -> 隐藏 Footer
                    isFooterVisible.set(false);
                } else {
                    viewIndexSetPrev();
                }
            }
        }
    }, [localViewIndex])

    useEffect(() => {
        const handleTouchStart = (event: TouchEvent) => {
            startTouchY.current = event.touches[0].clientY
        }

        const rootElement = document.getElementById("root-page-views")
        rootElement!.addEventListener("touchstart", handleTouchStart)
        rootElement!.addEventListener("touchend", handleTouchEnd)
        return () => {
            rootElement!.removeEventListener("touchstart", handleTouchStart)
            rootElement!.removeEventListener("touchend", handleTouchEnd)
        }
    }, [handleTouchEnd])

    const lastWheelEventTime = useRef(0);
    const lastWheelDelta = useRef(0);
    const lastWheelNavigationTime = useRef(Number.NEGATIVE_INFINITY);

    // --- 修改滚轮逻辑 ---
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            // [新增] 如果滚动被锁定（例如正在查看图集），则不执行主页面切换
            if (isScrollLocked.get() || event.deltaY === 0) return;

            const now = performance.now();
            const delta = Math.abs(event.deltaY);
            const hasGestureGap = now - lastWheelEventTime.current > 120;
            const hasNewImpulse = delta >= 8 && delta > lastWheelDelta.current * 1.5;

            lastWheelEventTime.current = now;
            lastWheelDelta.current = delta;

            // 页面切换期间先阻止重复翻页；保护期结束后，新的明显发力可以
            // 立即触发，而触控板逐渐衰减的尾部惯性不会继续翻到下一页。
            if (now - lastWheelNavigationTime.current < 650) return;
            if (delta < 8 || (!hasGestureGap && !hasNewImpulse)) return;

            lastWheelNavigationTime.current = now;

            // 向下滚动 (看下面内容)
            if (event.deltaY > 0) {
                if (localViewIndex === MAX_INDEX) {
                    // 在最后一页，显示 Footer
                    if (!isFooterVisible.get()) {
                        isFooterVisible.set(true);
                    }
                } else {
                    // 正常翻页
                    const newIndex = localViewIndex + 1;
                    location.hash = arknightsConfig.navbar.items[newIndex].href.split("#")[1];
                }
            }
            // 向上滚动 (看上面内容)
            else {
                if (localViewIndex === MAX_INDEX && isFooterVisible.get()) {
                    // 在最后一页，且 Footer 显示中 -> 隐藏 Footer
                    isFooterVisible.set(false);
                } else {
                    // 正常翻页
                    if (localViewIndex > 0) {
                        const newIndex = localViewIndex - 1;
                        location.hash = arknightsConfig.navbar.items[newIndex].href.split("#")[1];
                    }
                }
            }
        }

        const rootElement = document.getElementById("root-page-views")
        rootElement!.addEventListener("wheel", handleScroll)
        return () => rootElement!.removeEventListener("wheel", handleScroll);
    }, [localViewIndex]) // 依赖 localViewIndex，这样每次翻页都会更新闭包里的 index

    if (isLoading) {
        return null; // 或者返回一个加载指示器
    }

    return [Index, Information, Operator, World, Media, More].map((Element, index) =>
        <RootPageViewTemplate key={index} selfIndex={index}><Element /></RootPageViewTemplate>
    )
}
