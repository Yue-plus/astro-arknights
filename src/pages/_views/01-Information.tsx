import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper/modules";
import { motion, AnimatePresence, type Transition } from "framer-motion";
// 引入 framer-motion 处理复杂动效
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";
import PortraitBottomGradientMask from "../../components/PortraitBottomGradientMask";
import { IconArrow } from "../../components/SvgIcons";
import type { BreakingNewsItemProps } from "../../_types/RootPageViews.ts";
import arknightsConfig from "../../../arknights.config.tsx";
import { directions } from "../../components/store/lineDecoratorStore.ts";
import {
  viewIndex,
  readyToTouch,
} from "../../components/store/rootLayoutStore.ts";

const base = import.meta.env.BASE_URL;

// --- 动画配置常量 ---
const TRANSITION_SNAP = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
} satisfies Transition;

function SwiperInfo({ swiperIndex }: { swiperIndex: number }) {
  const swiperData = useMemo(
    () => arknightsConfig.rootPage.INFORMATION.swiper.data,
    []
  );
  const current = swiperData[swiperIndex];

  return (
    <div className="w-[26.5rem] portrait:w-[unset] portrait:static absolute left-[3.875rem] bottom-[-1.875rem] overflow-hidden">
      {/* 使用 AnimatePresence 处理切换时的退出和进入 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={swiperIndex} // 关键：key 变化触发动画
          initial={{ opacity: 0, x: 20 }} // 初始状态：透明且向右偏
          animate={{ opacity: 1, x: 0 }} // 入场状态：不透明且归位
          exit={{ opacity: 0, x: -20 }} // 退出状态：透明且向左偏
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col"
        >
          {/* 标题和日期区 */}
          <div className="flex flex-col portrait:flex-col-reverse">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-benderRegular tracking-[1px] portrait:mt-[1rem]"
            >
              {current.date ?? ""}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-h-[2.8em] portrait:max-h-[1.4em] overflow-ellipsis text-[2.25rem] portrait:text-[2.5rem] font-bold font-benderBold tracking-[2px] line-clamp-2 portrait:line-clamp-1"
            >
              {current.title ?? ""}
            </motion.div>
          </div>

          {/* 副标题 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-[1rem] text-[1.125rem] font-benderRegular portrait:hidden text-[#d2d2d2]"
          >
            {current.subtitle ?? ""}
          </motion.div>

          {/* URL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[.75rem] portrait:text-[.875rem] font-n15eMedium leading-5 tracking-[2px] opacity-70"
          >
            {current.url ?? ""}
          </motion.div>

          {/* 更多情报按钮 */}
          {current.href && (
            <motion.a
              href={current.href}
              target="_blank"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
              whileTap={{ scale: 0.98 }}
              className="w-[14.375rem] h-[3.75rem] pr-7 pl-4 mt-12 text-black no-underline whitespace-nowrap bg-ark-blue flex items-center cursor-pointer transition-colors duration-300 portrait:hidden group"
            >
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <div className="text-[1.25rem] font-black leading-none">
                  更多情报
                </div>
                <div className="text-[.875rem] font-benderBold">READ MORE</div>
              </div>
              <IconArrow className="w-[.5rem] ml-auto flex-none pointer-events-none transition-transform duration-300 group-hover:translate-x-2" />
            </motion.a>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BreakingNewsTag({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      {...{ onClick }}
      className={`relative w-[5.625rem] h-[1.25em] portrait:text-[1.25rem] font-bold pr-2 pl-[.125rem] mr-4 flex items-center cursor-pointer transition-all duration-300 group
                ${active ? "text-black" : "text-white hover:text-ark-blue"}`}
    >
      {/* 激活时的背景色块动画 */}
      {active && (
        <motion.div
          layoutId="activeTag"
          className="absolute inset-0 bg-ark-blue -z-10"
          transition={TRANSITION_SNAP}
        />
      )}
      <span className="relative z-10">{label}</span>
      <IconArrow
        className={`w-[.4375rem] ml-auto flex-none pointer-events-none transition-all duration-300 
                ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
      />
    </div>
  );
}

function BreakingNewsItem({
  category,
  title,
  date,
  href,
  index,
}: BreakingNewsItemProps & { index: number }) {
  return (
    <motion.a
      {...{ href }}
      target="_blank"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }} // 交错出现
      className={
        "w-[22.5rem] portrait:w-[unset] h-24 portrait:h-[7.125rem] text-inherit" +
        " border-b-[1px] border-solid border-[#ffffff4d] portrait:border-[#403c3b] no-underline" +
        " flex items-center cursor-pointer group hover:bg-white/5 transition-colors"
      }
    >
      <div
        className={"text-[1.125rem] text-ark-blue font-bold whitespace-nowrap"}
      >
        {category}
      </div>
      <div
        className={
          "w-[17.5rem] portrait:w-[unset] text-[d2d2d2] ml-auto portrait:ml-[2.75rem] portrait:flex-auto" +
          " portrait:flex portrait:flex-row-reverse portrait:justify-between portrait:items-center"
        }
      >
        <div
          className={
            "portrait:text-[1rem] font-benderRegular portrait:ml-20 whitespace-nowrap tracking-[1px]"
          }
        >
          {date}
        </div>
        <div
          className={
            "max-h-[3.2rem] portrait:max-h-[3.4em] font-bold text-[1.125rem] portrait:text-[1.6rem]" +
            " portrait:leading-[1.6] tracking-[2px] line-clamp-2 text-ellipsis mt-[.125rem] group-hover:text-ark-blue transition-colors"
          }
        >
          {title}
        </div>
      </div>
    </motion.a>
  );
}

function BreakingNewsList() {
  /**
   * TODO: 服务端渲染 (SSR) 建议
   * 如果使用 Astro: 可以在 getStaticPaths 或组件顶层 await fetch
   * 如果使用 React/Next.js: 使用 getServerSideProps
   * 当前实现为客户端获取，可通过内联数据初步渲染来避免白屏。
   */
  const [category, setCategory] = useState([] as string[]);
  const [data, setData] = useState(
    [] as { name: string; list: BreakingNewsItemProps[] }[]
  );
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    fetch(base + "blog/breaking-news.json")
      .then((response) => response.json())
      .then((data) => {
        setCategory(data.map((item: any) => item.name));
        setData(data);
      });
  }, []);

  return (
    <>
      <div
        className={
          "flex portrait:mt-8 portrait:pt-8 portrait:pb-8 portrait:border-y" +
          " portrait:border-solid portrait:border-t-[#565656] portrait:border-b-[#403c3b]"
        }
      >
        {category.map((label, index) => (
          <BreakingNewsTag
            key={label}
            active={index === categoryIndex}
            label={label}
            onClick={() => setCategoryIndex(index)}
          />
        ))}
      </div>
      <div className={"mt-2 portrait:mt-0 overflow-hidden"}>
        {/* 列表切换动效 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {data.length > 0 && data[categoryIndex]?.list.length > 0 ? (
              data[categoryIndex].list.map((item, index) => (
                <BreakingNewsItem
                  key={item.title + index}
                  index={index}
                  {...item}
                />
              ))
            ) : (
              <div className="text-4xl font-benderBold p-8">NO DATA</div>
            )}
          </motion.div>
        </AnimatePresence>

        {category[categoryIndex] !== "公告" && (
          <a
            target="_blank"
            href={base + "blog/?category=" + category[categoryIndex]}
            className={
              "w-[7.625rem] portrait:w-[11.125rem]" +
              " h-[1.5rem] portrait:h-[1.75rem] text-[.875rem] portrait:text-[1.3125rem] text-[#d2d2d2]" +
              " hover:text-black font-benderBold whitespace-nowrap bg-[#585858] hover:bg-white" +
              " px-[.625rem] portrait:px-3 mt-8 portrait:mt-10 flex items-center cursor-pointer" +
              " transition-all duration-300 transform hover:translate-x-1"
            }
          >
            <span>READ MORE</span>
            <IconArrow className={"w-[.4375rem] ml-auto flex-none"} />
          </a>
        )}
      </div>
    </>
  );
}

function ImageSlide({ title, image }: { title: string; image: string }) {
  return (
    <div className="w-full h-full relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 w-full h-[3.75rem] bg-black bg-opacity-30 mix-blend-overlay" />
      <div className="absolute bottom-0 left-0 w-full h-[3.75rem] flex items-center justify-center">
        <div className="text-[1.25rem] font-bold text-white">{title}</div>
      </div>
    </div>
  );
}

function TextSlide({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-[1.25rem] font-bold text-white">
          {title}
          <div className="mt-2 text-[1rem] font-benderRegular text-white">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

function SwiperBody({
  setSwiperIndex,
  active,
}: {
  setSwiperIndex: React.Dispatch<React.SetStateAction<number>>;
  active: boolean;
}) {
  const data = useMemo(
    () => arknightsConfig.rootPage.INFORMATION.swiper.data,
    []
  );

  return (
    <div
      className={`w-[83.125rem] portrait:w-[unset] h-[46.875rem] portrait:h-[24.125rem] portrait:static absolute top-[9.5rem] right-[14.75rem] portrait:mt-[9.375rem] portrait:pr-[5.75rem] flex items-center justify-center overflow-hidden mask-gradient-90-transparent-to-white portrait:mask-unset transition-all duration-1000 delay-300
            ${active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
    >
      <Swiper
        className="w-full h-full"
        modules={[Autoplay, Scrollbar]}
        autoplay={arknightsConfig.rootPage.INFORMATION.swiper.autoplay ?? true}
        scrollbar={{
          el: ".swiper-scrollbar-horizontal",
          hide: false,
          draggable: true,
        }}
        onSlideChange={(e) => setSwiperIndex(e.activeIndex)}
      >
        {data.map(({ title, subtitle, href, image }, index) => (
          <SwiperSlide key={index}>
            <a
              target="_blank"
              {...{ href }}
              className="block w-full h-full overflow-hidden"
            >
              {image ? (
                <ImageSlide {...{ title, image }} />
              ) : (
                <TextSlide {...{ title, subtitle: subtitle ?? "" }} />
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function Information() {
  const [swiperIndex, setSwiperIndex] = useState(0);
  const $viewIndex = useStore(viewIndex);
  const $readyToTouch = useStore(readyToTouch);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isActive = $viewIndex === 1 && $readyToTouch;
    if (isActive)
      directions.set({ top: true, right: true, bottom: false, left: false });
    setActive(isActive);
  }, [$viewIndex, $readyToTouch]);

  return (
    <div
      className={`w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto transition-opacity duration-500
            ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <PortraitBottomGradientMask />

      <SwiperBody {...{ setSwiperIndex, active }} />

      <div
        className={`w-[61rem] portrait:w-full h-[.5rem] portrait:h-[.375rem] portrait:pr-[5.75rem] absolute portrait:flex top-[56.375rem] portrait:top-[33.125rem] right-0 z-[4] transition-all duration-1000 delay-500
                ${active ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={"w-[12rem] h-px absolute top-0 right-full portrait:hidden"}
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsla(0, 0%, 67%, 0), hsla(0, 0%, 67%, .7))",
          }}
        />
        <div className="swiper-scrollbar-horizontal w-full h-full bg-[#ababab]">
          <div
            className="swiper-scrollbar-drag"
            style={{ backgroundColor: "#ffd700", borderRadius: 0 }}
          />
        </div>
      </div>

      {/* 背景装饰层 */}
      <div
        className="w-full h-full absolute top-0 left-0 bg-[length:100%_100%] pointer-events-none portrait:hidden"
        style={{
          backgroundImage:
            "linear-gradient(0deg, #000 5rem, transparent 20rem)",
        }}
      />
      <div className="w-full h-full absolute top-0 left-0 portrait:hidden mix-blend-overlay pointer-events-none transition-opacity duration-500" />

      {/* 左侧内容区整体动效 */}
      <div
        className={`w-[34.375rem] portrait:w-[unset] h-[46.75rem] portrait:h-[unset] portrait:pr-[5.75rem] absolute top-[9.5rem] left-0 portrait:static transition-all duration-700 delay-100
                ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-30 mix-blend-overlay portrait:hidden" />
        <div className="w-full h-full absolute top-0 left-0 portrait:hidden mix-blend-difference bg-list-texture bg-cover bg-left-top" />

        <div className="h-full portrait:h-[unset] relative pt-[2.5rem] portrait:pt-[1.25rem] pl-[3.875rem] portrait:pl-[1.75rem] portrait:pr-[1.75rem]">
          {/* 背景大文字动效 */}
          <div
            className={`h-[.95em] text-[7rem] text-[#242424] font-oswaldMedium -tracking-wider whitespace-nowrap overflow-hidden absolute top-full left-[9rem] flex items-end portrait:hidden transition-all duration-1000 delay-500
                        ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <span>KEY INFORMATION</span>
          </div>

          <SwiperInfo {...{ swiperIndex }} />
          <BreakingNewsList />
        </div>
      </div>
    </div>
  );
}
