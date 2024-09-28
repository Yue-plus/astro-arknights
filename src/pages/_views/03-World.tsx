import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { viewIndex } from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore.ts";
import { IconArrow } from "../../components/SvgIcons.tsx";

const items = [
    {title: "源石", subTitle: "ORIGINIUMS", imageUrl: "/images/03-world/originiums.png", description: '大地被起因不明的天灾四处肆虐，经由天灾卷过的土地上出现了大量的神秘矿物——"源石"。依赖于技术的进步，源石蕴含的能量投入工业后使得文明顺利迈入现代，与此同时，源石本身也催生出"感染者"的存在。'},
    {title: "源石技艺", subTitle: "ORIGINIUM ARTS", imageUrl: "/images/03-world/originium_arts.png", description: "源石技艺的描述..."},
    {title: "整合运动", subTitle: "REUNION", imageUrl: "/images/03-world/reunion.png", description: "整合运动的描述..."},
    {title: "感染者", subTitle: "INFECTED", imageUrl: "/images/03-world/infected.png", description: "感染者的描述..."},
    {title: "移动城邦", subTitle: "NOMADIC CITY", imageUrl: "/images/03-world/nomadic_city.png", description: "移动城邦的描述..."},
    {title: "罗德岛", subTitle: "RHODES ISLAND", imageUrl: "/images/03-world/rhodes_island.png", description: "罗德岛的描述..."},
];

function List({ onItemSelect }: { onItemSelect: (index: number) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const isFirstMove = useRef(true); // 用一个变量来修复首次加载会导致图片位置错误的问题

    const handleMouseMove = (e: React.MouseEvent) => {
        if (listRef.current) {
            const rect = listRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const imgWidth = 1024;
            const imgHeight = 1024;

            const newPosition = {
                x: x - imgWidth / 2 + 345,
                y: y - imgHeight / 2
            };

            if (isFirstMove.current) {
                setImagePosition(newPosition);
                isFirstMove.current = false;
            }

            setTargetPosition(newPosition);

            const itemHeight = rect.height / items.length;
            const index = Math.floor(y / itemHeight);
            if (index >= 0 && index < items.length) {
                setActiveImage(items[index].imageUrl);
            } else {
                setActiveImage(null);
            }
        }
    };

    const handleMouseLeave = () => {
        setActiveImage(null);
        isFirstMove.current = true;
    };

    useEffect(() => {
        const animatePosition = () => {
            setImagePosition(prevPos => {
                const dx = targetPosition.x - prevPos.x;
                const dy = targetPosition.y - prevPos.y;
                return {
                    x: prevPos.x + dx * 0.1,
                    y: prevPos.y + dy * 0.1
                };
            });
            animationFrameRef.current = requestAnimationFrame(animatePosition);
        };

        if (activeImage) {
            animationFrameRef.current = requestAnimationFrame(animatePosition);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [targetPosition, activeImage]);

    const handleItemClick = (index: number) => {
        setIsExiting(true);
        setTimeout(() => {
            onItemSelect(index);
        }, 500); // 退出动画时间
    };

    const itemAnimationDuration = 300; // 每个元素的动画时间（毫秒）
    const itemAnimationDelay = 50; // 元素之间的延迟时间（毫秒）

    return (
        <div 
            ref={listRef}
            className={`w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] transition-all duration-500 ${isExiting ? '-translate-x-full opacity-0' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {items.map(({title, subTitle}, index) => (
                <Item 
                    key={index} 
                    delay={index * itemAnimationDelay}
                    title={title} 
                    subTitle={subTitle} 
                    onClick={() => handleItemClick(index)}
                    isExiting={isExiting}
                />
            ))}
            {activeImage && (
                <img 
                    src={activeImage} 
                    alt="Active item"
                    className="absolute pointer-events-none transition-opacity duration-300 ease-out"
                    style={{
                        width: '1024px',
                        height: '1024px',
                        objectFit: 'cover',
                        left: `${imagePosition.x}px`,
                        top: `${imagePosition.y}px`,
                        opacity: 1,
                        zIndex: -1,
                        filter: 'blur(0.2px)',
                    }}
                />
            )}
        </div>
    );
}

function Item({title, subTitle, delay, onClick, isExiting}: { 
    title: string; 
    subTitle: string, 
    delay: number, 
    onClick: () => void,
    isExiting: boolean 
}) {
    const $viewIndex = useStore(viewIndex)
    const [active, setActive] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const itemDom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if ($viewIndex === 3) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, delay);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [$viewIndex, delay]);

    return (
        <div 
            ref={itemDom}
            className={`h-[6rem] pb-[.75rem] leading-[1] flex items-end relative transition-all duration-300 ease-out cursor-pointer
                ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
                ${isExiting ? '-translate-x-full opacity-0' : ''}`}
            style={{
                borderBottom: "1px solid #fff",
            }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onClick={onClick}
        >
            <div
                className="text-[4.5rem] text-[rgba(24,209,255,.25)] font-n15eBold absolute right-[.75rem] bottom-[.75rem] transition-opacity duration-300"
                style={{opacity: active ? "100" : "0"}}
            >
                {subTitle}
            </div>
            <div 
                className="text-[2.5rem] font-bold relative transition-[color,transform] duration-300"
                style={{
                    textShadow: "0 0 1em #000,0 0 1em #000",
                    transform: active ? "translateX(2rem)" : "translateX(0)",
                    color: active ? "#fff" : "#ababab",
                }}
            >
                {title}
            </div>
            <div 
                className="text-[1.25rem] font-n15eBold ml-[1.5rem] relative transition-[color,transform] duration-300"
                style={{
                    textShadow: "0 0 1em #000,0 0 1em #000",
                    transform: active ? "translateX(2rem)" : "translateX(0)",
                    color: active ? "#fff" : "#ababab",
                }}
            >
                {subTitle}
            </div>
        </div>
    )
}

function Details({item, onBack, onPrevious, onNext}: { 
    item: typeof items[0], 
    onBack: () => void,
    onPrevious: () => void,
    onNext: () => void
}) {
    return <>
        <div className="transition-[opacity,visibility] duration-[600ms]">
            <div
                className="w-[30.75rem] portrait:w-full h-px absolute top-[45.5555555556%] portrait:top-[62.3688155922%] left-[54.25rem] portrait:left-0 portrait:pl-[4.25rem] portrait:pr-[10.5rem] flex z-[3]">
                <div className="min-w-0 h-px flex-auto transition-[width] duration-[600ms] portrait:hidden"
                     style={{
                         width: "100%",
                         backgroundImage:
                             "repeating-linear-gradient(90deg,#b2b2b2,#b2b2b2 .25rem,transparent 0,transparent .5rem)"
                     }}/>
                <div className="text-[3.75rem] font-bold inline-block absolute bottom-12 overflow-hidden">
                    {item.title}
                </div>
                <div className="text-[2rem] font-n15eBold inline-block absolute bottom-4 overflow-hidden">
                    {item.subTitle}
                </div>
                <div className="w-full text-[1rem] inline-block absolute top-4 portrait:pr-[14.75rem] overflow-hidden">
                    {item.description}
                </div>
            </div>
            <IconArrow
                className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[6.625rem] portrait:left-[3.5rem] rotate-180 opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"
                onClick={onPrevious}
            />
            <IconArrow
                className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[95.5rem] portrait:left-auto portrait:right-[9.5rem] opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"
                onClick={onNext}
            />
        </div>
        <div
            className="w-full h-2 pr-[17.25rem] portrait:pr-[5.75rem] absolute left-0 bottom-[11.25rem] portrait:bottom-[18.2908545727%] flex translate-y-full transition-[opacity,visibility] duration-[600ms] z-[2]">
            <div className="w-full h-full relative flex flex-auto">
                {items.map((_, index) => (
                    <div
                        key={index}
                        className={`min-w-0 w-full h-full ${index === items.indexOf(item) ? 'bg-ark-blue' : 'bg-[#5a5a5a] hover:bg-[#ababab]'} flex-1 transition-colors duration-300 cursor-pointer`}
                        onClick={onBack}
                    />
                ))}
            </div>
        </div>
        <div
            className="w-[17.25rem] h-[3.75rem] text-inherit no-underline hover:text-black hover:bg-white bg-[#585858] pl-[4.5rem] pr-12 flex items-center justify-between absolute right-0 bottom-[11.25rem] translate-y-1/2 z-[4] cursor-pointer portrait:hidden"
            style={{transition: "color .3s, background-color .3s, transform .6s, opacity .6s, visibility .6s"}}
            onClick={onBack}
        >
            <IconArrow className="w-4 rotate-180 pointer-events-none"/>
            <div className="min-w-20">
                <div className="text-[1.25rem] font-bold">返回</div>
                <div className="text-[.875rem] font-benderBold">GO BACK</div>
            </div>
        </div>
    </>
}

// TODO: 把颗粒集中
function AshParticles({ count = 20 }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: {
            x: number;
            y: number;
            size: number;
            speed: number;
            initialY: number;
        }[] = [];

        for (let i = 0; i < count; i++) {
            const y = canvas.height + Math.random() * 100;
            particles.push({
                x: Math.random() * canvas.width,
                y: y,
                initialY: y,
                size: Math.random() * 1 + 1.2,
                speed: Math.random() * 0.2
            });
        }

        function easeOutCubic(t: number): number {
            return 1 - Math.pow(1 - t, 3);
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

            particles.forEach(particle => {
                // 主粒子
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                // 模糊
                for (let i = 0; i < 3; i++) {
                    ctx.globalAlpha = 0.01;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size + i * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                const totalDistance = canvas.height * 0.2;
                const currentDistance = particle.initialY - particle.y;
                const progress = Math.min(currentDistance / totalDistance, 1);
                const easeProgress = easeOutCubic(progress);

                const speed = particle.speed * (10 - 9 * easeProgress);
                particle.y -= speed;

                if (particle.y < 0) {
                    particle.y = canvas.height;
                    particle.x = Math.random() * canvas.width;
                    particle.initialY = particle.y;
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [count]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />;
}

export default function World() {
    const $viewIndex = useStore(viewIndex)
    const world = useRef<HTMLDivElement>(null)
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if ($viewIndex === 3) {
            directions.set({top: false, right: true, bottom: true, left: false})
            world.current!.classList.remove("opacity-0")
        } else {
            world.current!.classList.add("opacity-0")
        }
    }, [$viewIndex])

    const handleItemSelect = (index: number) => {
        setSelectedItemIndex(index);
    };

    const handleBack = () => {
        setSelectedItemIndex(null);
    };

    const handlePrevious = () => {
        setSelectedItemIndex((prevIndex) => 
            prevIndex === null ? null : (prevIndex - 1 + items.length) % items.length
        );
    };

    const handleNext = () => {
        setSelectedItemIndex((prevIndex) => 
            prevIndex === null ? null : (prevIndex + 1) % items.length
        );
    };

    return <div className="w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto bg-[#272727] bg-2 bg-cover bg-[50%] transition-opacity duration-100">
        <div className="w-full h-full absolute left-0 bottom-0 bg-[#101010] opacity-85 pointer-events-none"/>
        <AshParticles count={20} />
        <div
            className="w-full h-full absolute left-0 bottom-0 bg-common-mask bg-[length:100%_100%] mix-blend-overlay pointer-events-none z-[2]"/>
        {selectedItemIndex === null ? (
            <List onItemSelect={handleItemSelect} />
        ) : (
            <Details 
                item={items[selectedItemIndex]} 
                onBack={handleBack}
                onPrevious={handlePrevious}
                onNext={handleNext}
            />
        )}
        <div ref={world}
             className="h-[.95em] text-[#242424] text-[7rem] font-oswaldMedium whitespace-nowrap tracking-tighter absolute bottom-[11.25rem] left-[9rem] portrait:left-[4.25rem] portrait:bottom-[18.2908545727%] flex items-end translate-y-full overflow-hidden transition-opacity opacity-0 z-[2]">
            WORLD
        </div>
        <div
            className="w-full h-2 pr-[17.25rem] portrait:pr-[5.75rem] absolute left-0 bottom-[11.25rem] portrait:bottom-[18.2908545727%] flex translate-y-full transition-[opacity,visibility] duration-[600ms] z-[2]">
            <div className="w-full h-full relative flex flex-auto">
                {items.map((_, index) => (
                    <div
                        key={index}
                        className={`min-w-0 w-full h-full ${selectedItemIndex === index ? 'bg-ark-blue' : 'bg-[#5a5a5a] hover:bg-[#ababab]'} flex-1 transition-colors duration-300 cursor-pointer`}
                        onClick={() => handleItemSelect(index)}
                    />
                ))}
            </div>
        </div>
    </div>
}
