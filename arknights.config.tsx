import type { ArknightsConfig } from "./src/_types/ArknightsConfig";
import {
  CopyrightMini,
  IconArchive,
  IconGitHub,
  TitleArknights,
} from "./src/components/SvgIcons";

const base = import.meta.env.BASE_URL;

export default {
  title: "SCHNIE:ARK",
  description: "",
  language: "zh",
  bgm: {
    autoplay: false,

    // https://web.hycdn.cn/arknights/official/_next/static/media/audio/bgm.ea4286.mp3
    src: base + "audios/bgm.mp3",
    loop: true,
  },
  navbar: {
    logo: {
      element: () => (
          <img
              src="/images/logo.png"
              alt="Arknights Logo"
              style={{ width: '240px', height: 'auto' }} // 直接设置样式
              className="pointer-events-none"
          />
      ),
      alt: "Arknights Logo",
    },
    items: [
      { title: "INDEX", subtitle: "首页", href: base + "#index" },
      { title: "INFORMATION", subtitle: "情报", href: base + "#information" },
      { title: "OPERATOR", subtitle: "角色", href: base + "#operator" },
      { title: "WORLD", subtitle: "设定", href: base + "#world" },
      { title: "MEDIA", subtitle: "万象", href: base + "#media" },
      { title: "MORE", subtitle: "更多信息", href: base + "#more" },
    ],
    toolbox: {
      Bilibili: "https://b23.tv/e1vviXs",
      WeChat: "https://weixin.qq.com/",
      Weibo: "https://weibo.com/",
      TapTap: "https://www.taptap.cn/",
      GitHub: "https://github.com/schrolemons/arknights.github.io",
    },
    ownerInfo: {
      name: "SCHNIE.",
      slogan: "遇见不一样的你，遇见更好的自己。",
      footerLinks: [
        { label: "GitHub", url: "https://github.com/schrolemons" },
        { label: "Bilibili", url: "https://b23.tv/e1vviXs" },
      ],
    },
  },
  pageTracker: {
    microInfo: "SCHNIE:ARK",
    labels: [
      "HOMEPAGE",
      "INFORMATION",
      "OPERATOR",
      "WORLD",
      "ABOUT SCHNIE",
      "MORE",
    ],
  },
  rootPage: {
    INDEX: {
      title: "SCHNIE:ARK",
      subtitle: "POWERED BY RHODES ISLAND",
      url: "HTTPS://ARK.SCH-NIE.COM/",
      heroActions: [
        {
          icon: <IconArchive className="w-full h-auto pointer-events-none" />,
          label: "文档",
          subLabel: "Documentation",
          target: "_self",
          href: base + "docs/",
          className:
            "text-black bg-ark-blue border-[#ffd700] hover:border-white font-bold font-benderBold",
        },
        {
          // TODO: 换个好看的图标
          icon: (
            <svg
              className="w-full h-auto pointer-events-none"
              fillRule="evenodd"
              fill="currentColor"
              viewBox="0 0 1024 1024"
            >
              <path d="M856.874667 448l51.285333 30.762667a21.333333 21.333333 0 0 1 0 36.608L512 753.066667l-396.16-237.696a21.333333 21.333333 0 0 1 0-36.608l51.285333-30.762667L512 654.933333l344.874667-206.933333z m0 200.533333l51.285333 30.762667a21.333333 21.333333 0 0 1 0 36.608l-374.186667 224.512a42.666667 42.666667 0 0 1-43.946666 0l-374.186667-224.512a21.333333 21.333333 0 0 1 0-36.608l51.285333-30.762667L512 855.466667l344.874667-206.933334zM533.930667 55.850667l374.229333 224.512a21.333333 21.333333 0 0 1 0 36.608L512 554.666667 115.84 316.970667a21.333333 21.333333 0 0 1 0-36.608l374.186667-224.512a42.666667 42.666667 0 0 1 43.946666 0z" />
            </svg>
          ),
          label: "博客 - Blog",
          // subLabel: "Blog",
          target: "_self",
          href: base + "blog/",
          className:
            "text-black bg-end-yellow border-[#fe2] hover:border-white font-bold font-benderBold",
        },
        {
          icon: <IconGitHub className="w-full h-auto pointer-events-none" />,
          label: "GitHub",
          subLabel: "Repository",
          href: "https://github.com/schrolemons/arknights.github.io",
          className:
            "text-white bg-black border-[#333] hover:border-white font-benderBold",
        },
      ],
    },
    INFORMATION: {
      swiper: {
        autoplay: { delay: 5000 },
        data: [
          {
            title: "用户文档",
            subtitle: "User Documentation",
            date: "2026 // 03 / 22",
            url: "HTTPS://ARK.SCH-NIE.COM/",
            href: base + "docs/",
            image: base + "info-swiper/UserDocumentation.jpg",
          },
          {
            title: "第九宇宙",
            subtitle: "The Ninth Universe",
            date: "2026 // 03 / 22",
            url: "HTTPS://ARK.SCH-NIE.COM/",
            href: base + "blog/",
            image: base + "info-swiper/Blog.jpg",
          },
          {
            title: "角色诞生",
            subtitle: "Character Appears",
            date: "2026 // 03 / 22",
            url: "HTTPS://ARK.SCH-NIE.COM/",
            href: base + "operator/",
            image: base + "info-swiper/DeveloperDocumentation.jpg",
          },
        ],
      },
    },
    OPERATOR: {
      data: [
        {
          id: "moxue",
          name: "MO XUE",
          cnName: "墨薛",
          logo: "/images/logo.png",
          url:"https://ark.sch-nie.com/operator/?id=墨薛",
          desc: "诞生于科技的终末，受邀而汇聚成生命的形态。橘黄色的外表下，是金色生命与黑白技艺的相互对抗。\n" +
              "祂理性，平和，坚毅，在众多文明的事迹中游弋，汇聚着希望与批判，直达第九个边缘的虹光之处。\n" ,
          portrait: "/images/02-operator/moxue.png",
          fullbody: "/images/02-operator/moxue_full.png",

        },
        {
          id: "ruifox",
          name: "RUIFOX",
          cnName: "瑞",
          logo: "/images/logo.png",
          url:"https://ark.sch-nie.com/operator/?id=瑞狐",
          desc: "是一只阳光开朗的橘黄色小\"猫\"。" ,
          portrait: "/images/02-operator/ruifox.png",
          fullbody: "/images/02-operator/ruifox_full.png",

        },
          
      ],
    },
    WORLD: {
      items: [
        {
          title: "文明库",
          subTitle: "CIV DB",
          imageUrl: "/images/passport.png",
          description:
            "文明库最早建设于“启辉计划”后。文明库以时间为索引，记载逝痕文明中发生的一切事物：这甚至包含任意对象的物理活动。这使得其有利于实现“复原”：当逝痕文明因各种原因被摧毁时，文明库的力量将使得“新的”逝痕文明快速恢复到某一被记录的阶段。\n" +
              "\t在“方舟规划”后，为统一所有的“虚构文明”，文明库高度融合了“虹九虚构宇宙”的特点，使得逝痕文明成为一个“虚实交织”的文明。同时，文明库保留了许多通往“虚构文明”或其他真实文明的接口，以实现特定的操作或“文明输送”。\n",
        },
        {
          title: "虚构文明",
          subTitle: "Fictional CIV",
          imageUrl: "/images/logo.png",
          description:
            "虚构文明即逝痕文明以一定的技艺所创造的、完全受控于他们的微型文明。它诞生于“宏鳞企划”后，最早用于约束人们的思想（仅有体验文化的功能）。\n" +
              "随着技术的发展和管理水平的提高，“虚构文明”的概念越发盛行，普通群众也被允许在“虚构文明”中使用各种技艺与开采资源：此时的“虚构文明”更令人沉迷，且能带来一定的收益。",
        },
        {
          title: "宇宙移动",
          subTitle: "Cosmic MVT",
          imageUrl: "/images/logo.png",
          description:
            "在“宏鳞企划”后，“宇宙移动”技术走向成熟，并于“方舟规划”后得到突破。它是批量构建虚构文明的方式之一，同时也是逝痕文明躲避其他文明攻击的主要方式之一。\n" +
              "“宇宙移动”的实现方式相当地“粗暴”：其在部分重要的星球上布设能量采集器，在剩余的星体或机械造物上布设能量接收器——这样，遍布整个宇宙的推动器就能被激活，进而带领星球及其之间的物质高速移动。\n" +
              "当然，这是最早期的技术方案。由于它不够稳定，且会损坏大量设施，并干扰其他星球的正常运行…好在，“方舟规划”改良了这一技术：得益于除了“生命”外的其他的对象皆可被信息化（原来的物质结构被舍弃）这一属性，“宇宙移动”不再是对物质的移动，而是利用文明库进行的“宇宙重建”。\n",
        },
        {
          title: "文明输送",
          subTitle: "CIV TRANS",
          imageUrl: "/images/logo.png",
          description:
            "在“方舟规划”后，“文明输送”技术被用于向伪装成“虚构文明”的同阶或高阶文明输送逝痕文明的机体。在逝痕文明发展后期，越来越多的机体主动经文明输送技术前往其他的文明：因为平淡的发展终点让他们厌倦不已，加上这片世界也已无法诞生新的自然生命。\n" +
              "\t经“文明输送”的机体，也在后续的“虹九重构”等计划中协助重建“文明库”等文明设施。在这之中也有输送至高级文明而成为“神灵”的机体——“造神”，对逝痕文明的残留状态进行挽留或打击。\n",
        },
        {
          title: "人造生命",
          subTitle: "AI Exist.",
          imageUrl: "/images/logo.png",
          description:
            "在绝对先进、自由的科学世界里，一切人道的、浪漫的、虚构的“约束”都不再有意义。先驱者不惜击碎最后的生命底线，使得机器造物突破电流本身的限制：他们正式地将生物与机器结合在一起，编织规划之内的“人造生命”。\n" +
              " “渐渐地，人类的分工不再重复，所有人都互相关联，人的活动成为了环境本身，人回归了人本来力量。” 技术将人收敛，让生命的出路唯一。曾经的领袖为我们规划出如梦般的蓝图，但这只是对“人造生命”最后的宣言，因为牠们才有资格走到那一刻。",
        },
        {
          title: "文明塔",
          subTitle: "CIV TWR",
          imageUrl: "/images/logo.png",
          description:
              "文明塔是“人造生命”构建的、连接不同低级文明的塔状结构。牠们试图从中找到文明和生命的关联、及取得能够构造一个文明的关键：“纯净的黑核”——只有完整黑核支撑的文明，才能够不断地发展、并诞下自然的生命。\n" +
              "文明塔被代表自然的“人造生命”樊昕摧毁后，人造生命方将目光转移到“虹九重构”计划中。直到浮空岛时代，重构的“文明塔”取代“虚构文明”，成为了更广泛、也更加平等的文明接口。",
        },
      ],
    },
  },
} as ArknightsConfig;
