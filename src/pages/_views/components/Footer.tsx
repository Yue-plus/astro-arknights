// src/pages/_views/components/Footer.tsx
export default function Footer({
  onContributorsClick,
}: {
  onContributorsClick?: () => void;
}) {
  return (
    <div className="w-full h-[400px] bg-[#181818] text-[#8a8a8a] flex flex-col justify-center items-center relative z-10 border-t border-[#333]">
      {/* 顶部链接区 */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-bold tracking-wider text-white mb-8">
        <a
          href="https://github.com/Yue-plus/astro-arknights/blob/main/LICENSE"
          className="hover:text-ark-blue transition-colors"
        >
          License
        </a>
        <span className="text-[#333]">|</span>
        <a
          href="https://github.com/Yue-plus/astro-arknights"
          className="hover:text-ark-blue transition-colors"
        >
          GitHub Repository
        </a>
        <span className="text-[#333]">|</span>
        <a
          href="https://arknights.astro.yue.zone/"
          className="hover:text-ark-blue transition-colors"
        >
          Live Demo
        </a>
        <span className="text-[#333]">|</span>
        <a
          href="https://docs.astro.build/zh-cn/getting-started/"
          className="hover:text-ark-blue transition-colors"
        >
          Astro Framework
        </a>
        <span className="text-[#333]">|</span>
        <a
          href={`${import.meta.env.BASE_URL}contributors/`}
          target="_self"
          onClick={(event) => {
            if (!onContributorsClick) return;
            event.preventDefault();
            onContributorsClick();
          }}
          className="hover:text-ark-blue transition-colors"
        >
          Project Contributors
        </a>
      </div>

      {/* 备案号区域 */}
      <div className="text-[10px] text-[#666] mb-8 text-center px-4">
        <p>
          This website is built with Astro static site generator and is for
          learning and communication purposes only. Arknights and its related
          content are owned by Hypergryph Co., Ltd. This project is MIT licensed
          and does not claim any rights to the original work.
        </p>
      </div>

      <div className="w-[80%] h-px bg-[#333] mb-8" />

      {/* 底部 Logo 和版权 */}
      <div className="flex flex-col md:flex-row items-center justify-between w-[80%] gap-8">
        <div className="flex items-center gap-4">
          <div className="text-white font-black text-xl italic">
            ASTRO ARKNIGHTS
          </div>
        </div>

        <div className="text-[10px] text-[#666] flex flex-col md:items-end">
          <p>Version: 0.0.1 | Based on MIT License</p>
          <p>Copyright © 2024-present Yue_plus | Shanghai, China</p>
        </div>
      </div>
    </div>
  );
}
