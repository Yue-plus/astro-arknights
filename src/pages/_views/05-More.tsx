import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  viewIndex,
  readyToTouch,
  isFooterVisible,
} from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";
import Footer from "./components/Footer.tsx"; 

// --- 类型定义 ---
interface AkCard {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  icon: React.ReactNode;
  desc?: string;
  onClick?: () => void;
}

// --- 数据配置 ---
const AK_CARDS: AkCard[] = [
  {
    id: "01",
    title: "在线体验",
    subtitle: "ONLINE EXPERIENCE",
    img: "/images/05-more/integrated_strategies.jpg",
    icon: (
      <img
        src="/images/05-more/icon-animation.png"
        alt="Online Experience"
        className="min-w-8 h-8"
      />
    ),
    onClick: () => (window.location.href = "/BDdraw_DEV/login"),
  },
  {
    id: "02",
    title: "代码仓库",
    subtitle: "REPOSITORY",
    img: "/images/05-more/reclamation_algorithm.jpg",
    icon: (
      <img
        src="/images/05-more/icon-reclamation_algorithm.png"
        alt="Repository"
        className="min-w-8 h-8"
      />
    ),
    onClick: () =>
      window.open("https://github.com/Yue-plus/astro-arknights", "_blank"),
  },
  {
    id: "03",
    title: "相关文档",
    subtitle: "DOCUMENTATION",
    img: "/images/05-more/animation.jpg",
    icon: (
      <img
        src="/images/05-more/icon-integrated_strategies.png"
        alt="Documentation"
        className="min-w-8 h-8"
      />
    ),
    onClick: () =>
      window.open("https://arknights.astro.yue.zone/docs/", "_blank"),
  },
  {
    id: "04",
    title: "项目贡献者",
    subtitle: "CONTRIBUTORS",
    img: "/images/05-more/terra_historicus.jpg",
    icon: (
      <img
        src="/images/05-more/icon-terra_historicus.png"
        alt="Contributors"
        className="min-w-8 h-8"
      />
    ),
    onClick: () => {
      window.location.href = `${import.meta.env.BASE_URL}contributors/`;
    },
  },
];

export default function More() {
  const $viewIndex = useStore(viewIndex);
  const $readyToTouch = useStore(readyToTouch);
  const $isFooterVisible = useStore(isFooterVisible); // 订阅 Footer 状态
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isActive = $viewIndex === 5 && $readyToTouch;
    if (isActive) {
      // 关键：当在 More 页面时，根据 Footer 是否显示来决定底部箭头
      // 如果 footer 没显示，显示 bottom: true (提示还能往下)
      // 如果 footer 显示了，显示 bottom: false (到底了)
      directions.set({
        top: true,
        right: false,
        bottom: !$isFooterVisible, // 动态控制
        left: false,
      });
    }
    setActive(isActive);
  }, [$viewIndex, $readyToTouch, $isFooterVisible]);

  // 计算 transform 的值
  // 假设 Footer 高度固定或自适应，这里我们可以简单地将整个 View 向上移动 Footer 的高度
  // 或者向上移动例如 40vh / 400px
  const translateY = $isFooterVisible ? "-400px" : "0px";

  return (
    // 外层容器：固定 100% 宽高，隐藏溢出
    <div
      className={`relative w-full h-full overflow-hidden bg-black transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
    >
      {/* 
          内容包裹器：包含原来的 MORE 内容 + Footer 
          使用 transition-transform 实现平滑的上下滑动效果
      */}
      <div
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${translateY})` }}
      >
        {/* --- 原本的 MORE 页面内容 --- */}
        <div className="relative w-full h-full bg-black">
          {/* 背景水印 */}
          <div className="absolute bottom-[-2%] left-[-2%] z-0 select-none font-black text-[14vw] leading-none text-white/[0.04] tracking-tighter whitespace-nowrap pointer-events-none">
            MORE CONTENT
          </div>

          {/* 右下角页码
              <div className="absolute bottom-8 right-10 z-20 flex flex-col items-end pointer-events-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-cyan-400 text-6xl font-black tracking-tighter">05</span>
                  <span className="text-white/40 text-xl font-bold tracking-widest">/ 05</span>
                </div>
                <div className="text-white text-xs tracking-[0.4em] font-bold mt-1">MORE</div>
              </div> */}

          {/* 卡片区域 */}
          <div className="relative z-10 flex min-w-full h-full">
            {AK_CARDS.map((card, index) => (
              <div
                key={card.id}
                onClick={card.onClick}
                className={`
                      group relative h-full border-r border-white/10 cursor-pointer overflow-hidden
                      transition-[flex-grow,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${active && !$isFooterVisible ? "flex-1 hover:flex-[1]" : "flex-[0]"}
                      /* 这里加个判断：当 Footer 显示时，禁止 flex 伸缩动画，或者保持原有比例，防止布局跳动 */
                    `}
                // 注意：当 Footer 显示时，可能需要调整 flex 样式让它们保持静止
                style={{ flex: active ? 1 : 0 }}
              >
                {/* ... 卡片内部代码保持不变 ... */}
                <div className="absolute inset-0 z-0">
                  <div className="min-w-full h-full bg-black">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                </div>
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-10 pb-24 md:p-12 md:pb-32">
                  {/* 简化示例，保持你的原始内容 */}
                  <h3 className="text-white text-4xl font-black">
                    {card.title}
                  </h3>
                  <div className="text-white/60 text-sm font-bold mb-8">
                    {card.subtitle}
                  </div>

                  {/* View More 按钮区 */}
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-widest group-hover:text-white transition-colors">
                      <span className="h-[2px] w-8 bg-white/50 group-hover:w-12 group-hover:bg-cyan-400 transition-all duration-500" />
                      <span>VIEW MORE</span>
                    </div>
                    {/* 英文描述 (可选) */}
                    <div className="text-[10px] text-white/30 tracking-wider transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      CLICK TO NAVIGATE
                    </div>
                  </div>
                </div>

                {/* 顶部序号 (可选装饰) */}
                <div className="absolute top-10 left-10 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="text-6xl font-black text-white/5 select-none">
                    {card.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Footer 组件 (位于 MORE 内容正下方) --- */}
        <div className="w-full h-[400px]">
          <Footer />
        </div>
      </div>
    </div>
  );
}
