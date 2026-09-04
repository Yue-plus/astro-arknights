import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  viewIndex,
  readyToTouch,
  isScrollLocked, // 引入锁定状态
} from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";
import GalleryDetails from "./components/GalleryDetails.tsx"; // 引入刚才创建的组件

// 定义子分类类型
type Category = "books" | "gallery" | "website" | "Question_Set";

interface CategoryData {
  id: Category;
  en: string;
  cn: string;
  info:string;
  bg:string;
  desc: string;
}

const CATEGORIES: CategoryData[] = [
  {
    id: "books",
    en: "SEABLUE REVERY",
    cn: "第九边缘：溯梦蓝海",
    bg:"/images/04-media/gallery/2-1.png",
    info:"第九边缘设定集。完成于2025年7月。\n" +
        "记载2025年及以前第九边缘的绝大部分作品，拥有良好的阅读结构。",
    desc: "第九边缘官方作品\nHTTPS://ARK.SCH-NIE.COM/",
  },
  {
    id: "gallery",
    en: "GALLERY",
    cn: "插画珍藏",
    bg:"/images/04-media/gallery/2-2.png",
    info:"展示来自 [OPERATOR-RUIFOX] 所描绘的世界。\n" +
        "画廊可以记载这些作品的痕迹，但在这之前，它们均已被安稳地留存在了一个温暖的地方。",
    desc: "记录在这篇大地上的点滴瞬间\nHTTPS://ARK.SCH-NIE.COM/",
  },
  {
    id: "website",
    en: "WEBSITE",
    cn: "网站构建",
    bg:"/images/04-media/gallery/2-3.png",
    info:"第九边缘网站状况监视器。\n" +
        "建立于2025年10月，展示第九边缘全部网站的可访问性。",
    desc: "第九边缘网站一览\nHTTPS://ARK.SCH-NIE.COM/",
  },
  {
    id: "Question_Set",
    en: "QUESTION SET",
    cn: "问题集",
    bg:"/images/04-media/be.png",
    info:"第九边缘标准化认知测试，及其他“协作者”上传的测试。\n" +
        "结合第九边缘的世界观、自然观、价值观所制定的测试题合集。",
    desc: "第九边缘测试题合集\nHTTPS://ARK.SCH-NIE.COM/",
  },
];

// 定义点击热区的位置 (基于视觉元素的坐标微调)
const HIT_AREAS = [
  {
    id: "books" as Category,
    position: "top-[37%] left-[18%] w-[160px] h-[160px]",
  },
  {
    id: "gallery" as Category,
    position: "top-[0%] left-[25%] w-[180px] h-[180px]",
  },
  {
    id: "operator" as Category,
    position: "top-[17%] left-[65%] w-[180px] h-[180px]",
  },
  {
    id: "video" as Category,
    position: "top-[60%] left-[57%] w-[200px] h-[200px]",
  },
];

export default function Media() {
  const $viewIndex = useStore(viewIndex);
  const $readyToTouch = useStore(readyToTouch);
  const [active, setActive] = useState(false);
  const [currentCat, setCurrentCat] = useState<Category>("books");

  // 控制是否显示图集详情的状态
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const isActive = $viewIndex === 4 && $readyToTouch;
    if (isActive) {
      // 如果进入了图集详情页，不需要显示上下左右的箭头提示
      if (showGallery) {
        directions.set({
          top: false,
          right: false,
          bottom: false,
          left: false,
        });
      } else {
        directions.set({ top: false, right: true, bottom: true, left: false });
      }
    }
    setActive(isActive);
  }, [$viewIndex, $readyToTouch, showGallery]); // 添加 showGallery 依赖

  // 处理详情按钮点击
  const handleDetailClick = () => {
    if (currentCat === "gallery") {
      setShowGallery(true);
      isScrollLocked.set(true); // 锁定主页面滚动
    } else if (currentCat === "books") {
      window.open("https://www.sch-nie.com/core/", "_blank");
    } else if (currentCat === "Question_Set") {
      window.open("https://www.sch-nie.com/categories/tests/", "_blank");
    } else if (currentCat === "website") {
      window.open("https://monitor.sch-nie.com", "_blank");
    } else {
      console.log(`${currentCat} clicked`);
      // 其他分类的逻辑...
    }
  };

  // 处理从详情页返回
  const handleBackFromGallery = () => {
    setShowGallery(false);
    isScrollLocked.set(false); // 解锁主页面滚动
  };

  const activeData = CATEGORIES.find((c) => c.id === currentCat)!;

  return (
    // 外层容器：相对定位，隐藏溢出
    <div
      className={`relative w-full h-full overflow-hidden transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
    >
      {/* 
         滚动容器：
         高度为 200% (两屏高度)
         根据 showGallery 状态决定 transform 的位置
         - translateY(0): 显示上半部分 (Media 主页)
         - translateY(-50%): 显示下半部分 (Gallery 详情)
      */}
      <div
        className="w-full h-[200%] transition-transform duration-700 cubic-bezier(0.65, 0, 0.35, 1)"
        style={{
          transform: showGallery ? "translateY(-50%)" : "translateY(0)",
        }}
      >
        {/* --- 第一屏：Media 主页面 (高度 50% = 100vh) --- */}
        <div
          className="w-full h-[50%] relative bg-black overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        >
          {/* 背景图片 - 使用伪元素实现透明度控制 */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${activeData.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.3,
            }}
          />


          {/* 左侧侧边导航 */}
          <div className="absolute top-1/4 left-16 z-20">
            <h2 className="text-white text-xl font-bold mb-6 tracking-tighter">
              ABOUT SCHNIE
            </h2>
            <div className="flex flex-col gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center group cursor-pointer pointer-events-auto"
                  onClick={() => setCurrentCat(cat.id)}
                >
                  <div
                    className={`w-3 h-3 border border-white/50 mr-3 flex items-center justify-center transition-all ${currentCat === cat.id ? "bg-white" : ""}`}
                  >
                    {currentCat === cat.id && (
                      <div className="w-1 h-1 bg-black" />
                    )}
                  </div>
                  <span
                    className={`text-xs tracking-widest transition-colors ${currentCat === cat.id ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
                  >
                    {cat.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 视觉区 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative min-w-[1000px] h-[600px]">
              {/* 用于接收点击事件 */}
              <div className="absolute inset-0 z-50 w-full h-full">
                {HIT_AREAS.map((area) => (
                  <div
                    key={area.id}
                    className={`absolute ${area.position} cursor-pointer pointer-events-auto outline-none tap-highlight-transparent group`}
                    onClick={() => setCurrentCat(area.id)}
                  >
                    {/* 悬停效果*/}
                    <div
                      className={`w-full h-full rounded-2xl transition-colors duration-300 ${
                        currentCat === area.id ? "" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* 中央info显示 */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative text-white text-center max-w-3xl px-8"
                  >
                    {/* 背景效果 */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl -z-10"></div>
                   
                    
                    {/* 装饰元素 */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mb-6"
                    >
                      <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
                    </motion.div>
                    
                    {/* 文字内容 */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      className="text-xl leading-relaxed tracking-wide font-light whitespace-pre-line"
                    >
                      {activeData.info.split(/\[|\]/).map((part, index) => {
                        if (index % 2 === 1) {
                          return <span key={index} style={{ color: '#ffd700', fontWeight: 'bold' }}>{part}</span>;
                        }
                        return part;
                      })}
                    </motion.p>
                    
                    {/* 底部装饰 */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mt-6"
                    >
                      <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* 左下角详情介绍 */}
          <div className="absolute bottom-24 left-16 z-40 max-w-md pointer-events-auto">
            {/* 
                关键点：key={activeData.id}
                当 id 改变时，React 会重新挂载这个 div，从而触发内部子元素的 CSS animation 
              */}
            <div key={activeData.id} className="flex flex-col items-start">
              {/* 1. 英文标题 - 延迟 0ms */}
              <h1
                className="text-white text-5xl font-bold tracking-tighter uppercase animate-enter"
                style={{ animationDelay: "0ms" }}
              >
                {activeData.en}
              </h1>

              {/* 2. 中文标题 + 装饰条 - 延迟 100ms */}
              <div
                className="flex items-end gap-4 mt-2 mb-8 animate-enter"
                style={{ animationDelay: "100ms" }}
              >
                <h2 className="text-white min-w-[200px] text-7xl font-bold">
                  {activeData.cn}
                </h2>
                <div className="h-1 w-24 bg-cyan-400 mb-4" />
              </div>

              {/* 3. 描述文字 - 延迟 200ms */}
              <p
                className="text-gray-400 text-xs tracking-widest whitespace-pre-line leading-loose animate-enter"
                style={{ animationDelay: "200ms" }}
              >
                {activeData.desc}
              </p>

              {/* 4. 按钮 - 延迟 300ms */}
              <div
                className="relative mt-10 animate-enter"
                style={{ animationDelay: "300ms" }}
              >
                <button
                  className="group flex items-center bg-[#ffd700] hover:bg-white transition-colors duration-300 text-[rgb(0,0,0)] cursor-pointer w-[14.375rem] h-[3.75rem] pl-4 pr-7 py-0 whitespace-nowrap"
                  onClick={handleDetailClick}
                >
                  <div className="flex flex-col justify-center">
                    <div className="font-bold text-[1.25rem] leading-tight">
                      查看详情
                    </div>
                    <div className="font-semibold text-[0.875rem] leading-tight">
                      READ MORE
                    </div>
                  </div>
                  <div className="ml-auto flex items-center justify-center w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <svg
                      width="7"
                      height="15"
                      viewBox="0 0 7 15"
                      className="block w-full h-auto pointer-events-none"
                    >
                      <path
                        d="M1 1 L6 7.5 L1 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 第二屏：Gallery 详情 (高度 50% = 100vh) --- */}
        <div className="w-full h-[50%] relative">
          <GalleryDetails onBack={handleBackFromGallery} />
        </div>
      </div>
    </div>
  );
}
