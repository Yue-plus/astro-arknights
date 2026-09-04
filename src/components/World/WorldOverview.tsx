import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useStore } from "@nanostores/react";
import { viewIndex } from "../store/rootLayoutStore.ts";
import config from "../../../arknights.config.tsx";
import { motion, AnimatePresence } from "framer-motion";

const items = config.rootPage.WORLD!.items;

// 使用 useMemo 优化 items 的渲染
const MemoizedItem = React.memo(Item);

type ItemProps = {
  title: string;
  subTitle: string;
  delay: number;
  onClick: () => void;
  isExiting: boolean;
  exitingIndex: number | null;
  index: number;
};

function Item({
  title,
  subTitle,
  delay,
  onClick,
  isExiting,
  exitingIndex,
  index,
}: ItemProps) {
  const $viewIndex = useStore(viewIndex);
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
        ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        ${isExiting ? "-translate-x-full opacity-0" : ""}`}
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
        className="text-[4.5rem] text-[rgba(255,215,0,.25)] font-n15eBold absolute right-[.75rem] bottom-[.75rem] transition-opacity duration-300"
        style={{ opacity: active ? "100" : "0" }}
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
  );
}

type OverviewProps = {
  onItemSelect: (index: number) => void;
};

export default function WorldOverview({ onItemSelect }: OverviewProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 每页显示5个词条
  
  // 计算总页数
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // 计算当前页的词条
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 移除了itemAnimationDuration、itemAnimationDelay和initialDelay变量，因为它们不再被使用

  const handleItemClick = (index: number) => {
    // 计算实际的索引位置
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setIsExiting(true);
    setExitingIndex(actualIndex);
  };
  
  // 分页处理函数
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Import useAnimation at the top of the file with other imports

  useEffect(() => {
    return () => {
      isFirstLoad.current = false;
    };
  }, []);

  // Add useAnimation import at the top
  // import { motion, AnimatePresence, useAnimation } from "framer-motion";

  const containerVariants = {
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    exit: {
      x: -window.innerWidth,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn" as const,
      },
    },
  };

  return (
    <div className="w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] z-10">
      <motion.div
        ref={listRef}
        className="relative"
        variants={containerVariants}
        initial={{ opacity: 0, x: -50 }}
        animate={isExiting ? "exit" : "enter"}
        onAnimationComplete={(definition) => {
          if (isExiting && definition === "exit") {
            onItemSelect(exitingIndex!);
            setIsExiting(false);
            setExitingIndex(null);
          }
        }}
      >
        {currentItems.map(
          (
            { title, subTitle }: { title: string; subTitle: string },
            index: number
          ) => (
            <MemoizedItem
              key={index}
              title={title}
              subTitle={subTitle}
              delay={isFirstLoad.current ? 800 + index * 50 : index * 50}
              onClick={() => handleItemClick(index)} // 修改这里，使用统一的处理函数
              isExiting={isExiting}
              exitingIndex={exitingIndex}
              index={index}
            />
          )
        )}
      </motion.div>
      
      {/* 分页按钮 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center">
          <button
            className={`px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            上一页
          </button>
          <div className="text-white">
            {currentPage} / {totalPages}
          </div>
          <button
            className={`px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
