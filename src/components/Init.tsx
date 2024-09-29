import React, { useEffect, useState, useCallback, useRef } from "react";
import { IconDblArrow, TitleArknights } from "../components/SvgIcons";
import { useStore } from "@nanostores/react";
import { isInitialized, readyToTouch } from "../components/store/rootLayoutStore";

export function Init() {
    const $isInitialized = useStore(isInitialized);
    const $readyToTouch = useStore(readyToTouch);
    const [progress, setProgress] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const commonColor = "rgb(164,164,164)";
    const loadingColorText = "#61cefa";
    const loadingColor = "#61cefa";
    const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());
    const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());
    const observerRef = useRef<PerformanceObserver | null>(null);
    const [isObserving, setIsObserving] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    //TODO: 继续完善init， 目前的做法是等待/images/index-bg.jpg加载完毕
    const incrementProgress = useCallback(() => {
        setProgress(prevProgress => Math.min(prevProgress + 0.5, 80));
    }, []);

    const stopObserving = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
            setIsObserving(false);
            // console.log("停止资源加载监控");
        }
    }, []);

    useEffect(() => {
        if (!isObserving) return; // 如果已经停止观察，不再创建新的观察器

        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    const resourceName = (entry as PerformanceResourceTiming).name;
                    if (!loadedResources.has(resourceName)) {
                        // console.log("资源加载成功:", resourceName);
                        setLoadedResources(prev => new Set(prev).add(resourceName));
                        incrementProgress();

                        if (resourceName.endsWith('/images/index-bg.jpg')) {
                            isInitialized.set(true);
                            stopObserving();
                            // console.log("背景图片加载成功，停止监控");
                        }
                    }
                }
            });
        });

        observerRef.current = observer;
        observer.observe({ entryTypes: ['resource'] });

        // 检查已经加载成功的资源
        const checkExistingResources = () => {
            const resources = performance.getEntriesByType('resource');
            resources.forEach((entry) => {
                if (!loadedResources.has(entry.name)) {
                    // console.log("已加载成功的资源:", entry.name);
                    setLoadedResources(prev => new Set(prev).add(entry.name));
                    incrementProgress();
                    if (entry.name.endsWith('/images/index-bg.jpg')) {
                        isInitialized.set(true);
                        stopObserving();
                        // console.log("背景图片已加载成功，停止监控");
                    }
                }
            });
        };

        checkExistingResources();

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [incrementProgress, loadedResources, stopObserving, isObserving]);

    useEffect(() => {
        let interval: number;
        if ($isInitialized && progress < 100) {
            interval = window.setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + 100;
                    if (newProgress >= 100) {
                        window.clearInterval(interval);
                        return 100;
                    }
                    return newProgress;
                });
            }, 50);
        }
        return () => window.clearInterval(interval);
    }, [$isInitialized, progress]);

    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            setIsComplete(true);
            setTimeout(() => {
                readyToTouch.set(true);
                setIsFadingOut(true);
                setTimeout(() => {
                    setIsHidden(true);
                }, 800);
            }, 500);
        }
    }, [progress, isComplete]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [loadedResources]);

    if (isHidden) return null;

    return (
        <div className={`fixed inset-0 bg-[#272727] flex flex-col items-center justify-center z-50 font-benderBold transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* 上边线 */}
            <div className={`absolute left-0 right-0 h-[0.05vw] bg-[#686767] transition-all duration-1000 ease-in-out ${
                isFadingOut ? 'top-[-5vw]' : 'top-[5vw]'
            }`} />
            {/* 右边线 */}
            <div className={`absolute top-0 bottom-0 w-[0.05vw] bg-[#686767] transition-all duration-1000 ease-in-out ${
                isFadingOut ? 'right-[-5vw]' : 'right-[5vw]'
            }`} />

            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="flex-grow" />

                <div className="flex items-center justify-center mb-[2vw]">
                    <TitleArknights
                        className={`w-[13vw] h-[17vw] max-w-full text-[rgb(164,164,164)]`}
                    />
                </div>

                <div className="flex-grow" />

                <div className="w-full max-w-[90vw] px-[2vw] absolute" style={{ top: '75%' }}>
                    <div className={`flex items-start ${isPortrait ? 'flex-col' : ''}`}>
                        <div
                            className={`whitespace-nowrap ${
                                isPortrait 
                                    ? 'fixed bottom-[1%] left-[1%] text-[10px]' ////idk,反正就是text-[1vw]
                                    : 'mr-[15vw] text-[1.2vw]'
                            }`}
                            style={{ color: commonColor }}
                        >
                            <span>© YUE_PLUS</span>
                        </div>
                        <div className={`flex-grow ${isPortrait ? 'w-full' : ''} pl-[5vw] pr-[5.5vw]`}>
                            <div className="relative h-[0.3vw] flex items-center" style={{ backgroundColor: 'transparent' }}>
                                <div className="absolute left-0 w-[0.3vw] h-[0.3vw]" style={{ backgroundColor: commonColor }}></div>
                                <div className="absolute right-0 w-[0.3vw] h-[0.3vw]" style={{ backgroundColor: commonColor }}></div>
                                <div className="absolute top-[0.1vw] left-0 right-0 h-[0.1vw]" style={{ backgroundColor: commonColor }}></div>
                                <div
                                    className="absolute top-0 left-0 h-[0.3vw] transition-all duration-300 ease-linear"
                                    style={{ width: `${progress}%`, backgroundColor: loadingColor }}
                                />
                            </div>
                            <div className="flex justify-between items-center mt-[0.8vw]">
                                <div className="flex items-center text-[0.8vw]" style={{ color: loadingColorText }}>
                                    <IconDblArrow className="w-[0.8vw] h-[0.8vw] mr-[0.4vw]"/>
                                    <span>{`LOADING - ${Math.round(progress)}%`}</span>
                                </div>
                                <div className={`flex items-center text-[0.8vw]`} style={{ color: commonColor }}>
                                    <span>ARKNIGHTS</span>
                                    <span className="mx-[0.8vw]">//</span>
                                    <span>https://github.com/Yue-plus/astro-arknights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow" />
            </div>

            {/* <div
                ref={listRef}
                className="absolute bottom-[2vw] left-[2vw] text-[0.8vw] text-white max-h-[20vh] overflow-y-auto opacity-50"
            >
                <h3 className="mb-[0.5vw]">已加载成功的资源：</h3>
                <ul>
                    {Array.from(loadedResources).map((resource, index) => (
                        <li key={index} className="truncate max-w-[30vw]">{resource}</li>
                    ))}
                </ul>
                <p className="mt-[0.5vw]">
                    {$isInitialized ? "背景图片加载成功" : "正在加载背景图片..."}
                </p>
                <p>加载进度：{Math.round(progress)}%</p>
            </div> */}
        </div>
    );
}
