import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useStore } from "@nanostores/react";
import { viewIndex, readyToTouch } from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore.ts";
import { IconArrow } from "../../components/SvgIcons.tsx";
import PortraitBottomGradientMask from "../../components/PortraitBottomGradientMask";
import config from "../../../arknights.config.tsx";
import ParticleFactory from '../../components/ParticleFactory.tsx';

const items = config.rootPage.WORLD.items;

// 将 AshParticles 的动画逻辑抽离到自定义 hook
function useAshParticlesAnimation(count: number, canvasRef: React.RefObject<HTMLCanvasElement>) {
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
}

function AshParticles({ count = 20 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAshParticlesAnimation(count, canvasRef);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />;
}

// 使用 useMemo 优化 items 的渲染
const MemoizedItem = React.memo(Item);

function List({ onItemSelect }: { onItemSelect: (index: number) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isFirstMove = useRef(true); // 用一个变量来修复首次加载会导致图片位置错误的问题
  const isFirstLoad = useRef(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const imgWidth = 1024;
      const imgHeight = 1024;

      // TODO: 一个奇怪的偏移，需要更好的方法
      const imgOffsetX = 350;
      const imgOffsetY = 0;
      const imgOffsetXPercentage = 75;
      const imgOffsetYPercentage = 0;
      const newPosition = {
        x: x - imgWidth / 2 + (imgOffsetX * imgOffsetXPercentage / 100),
        y: y - imgHeight / 2 + (imgOffsetY * imgOffsetYPercentage / 100)
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

  const itemAnimationDuration = 300; // 每个元素的动画时间
  const itemAnimationDelay = 50; // 元素之间的延迟时间
  const initialDelay = 800;

  const handleItemClick = (index: number) => {
    setIsExiting(true);
    setExitingIndex(index);
    setTimeout(() => {
      onItemSelect(index);
    }, 500 + items.length * itemAnimationDelay);
  };

  const memoizedItems = useMemo(() => items.map(({title, subTitle}: {title: string, subTitle: string}, index: number) => (
    <MemoizedItem 
      key={index} 
      delay={isFirstLoad.current ? initialDelay + index * itemAnimationDelay : index * itemAnimationDelay}
      title={title} 
      subTitle={subTitle} 
      onClick={() => handleItemClick(index)}
      isExiting={isExiting}
      exitingIndex={exitingIndex}
      index={index}
    />
  )), [isExiting, exitingIndex]);

  useEffect(() => {
    return () => {
      isFirstLoad.current = false;
    };
  }, []);

  return (
    <div className="flex">
      <div 
        ref={listRef}
        className={`w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] transition-all duration-500 ${isExiting ? '-translate-x-full opacity-0' : ''} z-10`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {memoizedItems}
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
    </div>
  );
}

function Item({title, subTitle, delay, onClick, isExiting, exitingIndex, index}: { 
  title: string; 
  subTitle: string, 
  delay: number, 
  onClick: () => void, 
  isExiting: boolean,
  exitingIndex: number | null,
  index: number
}) {
  const $viewIndex = useStore(viewIndex)
  const [active, setActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLAnchorElement>(null);

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

  const exitDelay = isExiting ? (index - (exitingIndex ?? 0)) * 50 : 0;

  return (
    <a 
      ref={itemRef}
      href="#"
      className={`h-24 pb-3 leading-none flex items-end relative transition-all duration-300 ease-out cursor-pointer
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        ${isExiting ? '-translate-x-full opacity-0' : ''}`}
      style={{
        borderBottom: "1px solid #fff",
        transitionDelay: `${exitDelay}ms`,
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={`${title} - ${subTitle}`}
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
    </a>
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
      <a
        href="#"
        className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[6.625rem] portrait:left-[3.5rem] rotate-180 opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"
        onClick={(e) => {
          e.preventDefault();
          onPrevious();
        }}
        aria-label="上一个"
      >
        <IconArrow className="pointer-events-none" />
      </a>
      <a
        href="#"
        className="w-8 portrait:w-[1.25rem] box-content px-8 py-4 portrait:p-4 block absolute top-[48.1481481481%] portrait:top-[35.2323838081%] left-[95.5rem] portrait:left-auto portrait:right-[9.5rem] opacity-70 hover:opacity-100 z-[2] cursor-pointer transition-opacity duration-300"
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
        aria-label="下一个"
      >
        <IconArrow className="pointer-events-none" />
      </a>
    </div>
    <div
      className="w-full h-2 pr-[17.25rem] portrait:pr-[5.75rem] absolute left-0 bottom-[11.25rem] portrait:bottom-[18.2908545727%] flex translate-y-full transition-[opacity,visibility] duration-[600ms] z-[2]">
      <div className="w-full h-full relative flex flex-auto">
        {items.map((_: any, index: React.Key | null | undefined) => (
          <div
            key={index}
            className={`min-w-0 w-full h-full ${index === items.indexOf(item) ? 'bg-ark-blue' : 'bg-[#5a5a5a] hover:bg-[#ababab]'} flex-1 transition-colors duration-300 cursor-pointer`}
            onClick={onBack}
          />
        ))}
      </div>
    </div>
    <a
      href="#"
      className="w-[17.25rem] h-[3.75rem] text-inherit no-underline hover:text-black hover:bg-white bg-[#585858] pl-[4.5rem] pr-12 flex items-center justify-between absolute right-0 bottom-[11.25rem] translate-y-1/2 z-[4] cursor-pointer portrait:hidden"
      style={{transition: "color .3s, background-color .3s, transform .6s, opacity .6s, visibility .6s"}}
      onClick={(e) => {
        e.preventDefault();
        onBack();
      }}
      aria-label="返回"
    >
      <IconArrow className="w-4 rotate-180 pointer-events-none"/>
      <div className="min-w-20">
        <div className="text-[1.25rem] font-bold">返回</div>
        <div className="text-[.875rem] font-benderBold">GO BACK</div>
      </div>
    </a>
  </>
}

// 使用 useCallback 优化回调函数
export default function World() {
  const $viewIndex = useStore(viewIndex)
  const $readyToTouch = useStore(readyToTouch)
  const world = useRef<HTMLDivElement>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [active, setActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isWorldReady, setIsWorldReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // 初始设置
    handleResize();

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isActive = $viewIndex === 3 && $readyToTouch;
    if (isActive) {
      directions.set({top: false, right: true, bottom: true, left: false})
    }
    setActive(isActive);
  }, [$viewIndex, $readyToTouch])

  useEffect(() => {
    if (active && windowSize.width > 0 && windowSize.height > 0) {
      // 给一个小延迟，确保其他元素都已经渲染完成
      const timer = setTimeout(() => {
        setIsWorldReady(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsWorldReady(false); // 确保在非活动状态下停止粒子系统
    }
  }, [active, windowSize]);

  const handleItemSelect = useCallback((index: number) => {
    setSelectedItemIndex(index);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedItemIndex(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedItemIndex((prevIndex) => 
      prevIndex === null ? null : (prevIndex - 1 + items.length) % items.length
    );
  }, []);

  const handleNext = useCallback(() => {
    setSelectedItemIndex((prevIndex) => 
      prevIndex === null ? null : (prevIndex + 1) % items.length
    );
  }, []);

  return (
    <div 
      ref={world}
      className={`w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto bg-[#272727] bg-2 bg-cover bg-[50%] transition-all duration-1000 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
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

      {/* 粒子系统 */}
      {isWorldReady && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-[1]">
          <ParticleFactory 
            activeLabel="island"
            width={windowSize.width}
            height={windowSize.height}
            isGrayscale={false}
            scale={1.7}
            particleAreaX={windowSize.width / 2 + 60}
            particleAreaY={windowSize.height / 2 - 150}
          />
        </div>
      )}

      <PortraitBottomGradientMask />
    </div>
  )
}