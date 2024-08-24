---
title: 开始使用
---

# 开始使用

[AstroArknights] 是一款基于 [Astro] 框架构建的全功能文档、博客、作品集主题。

:::caution
AstroArknights 目前处于开发阶段，未来可能会出现破坏性变更。
:::

## 先决条件

- [Git] - 免费开源的分布式版本控制系统
- [Node.js]  - JavaScript 运行时环境；
  始终建议使用最新的长期支持（<abbr title="Long-term Support">LTS</abbr>）版本；
  - [`pnpm`](https://pnpm.io/zh/) - 快速的，节省磁盘空间的包管理工具；
- 文本编辑器 - 推荐使用 [VS Code](https://code.visualstudio.com/) 并安装 [Astro 官方扩展](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)；

## 快速启动

克隆 [AstroArknights] 仓库内容：

```shell
git clone https://github.com/Yue-plus/astro-arknights.git --depth=1
cd astro-arknights
```

> `--depth=1` 命令表示只克隆仓库最近的一次提交，可以加快克隆速度。
> 
> 如果想要长期使用本主题可以先 [Fork](https://github.com/Yue-plus/astro-arknights/fork) 一份，然后从自己从仓库克隆，方便日后拉取更新。

安装项目依赖：

```shell
pnpm install
```

启动 Astro 开发服务器：

```shell
pnpm dev
```

如果没有报错，就可以通过浏览器访问 http://localhost:4321/ 看到和本站点一模一样的网站了！

## 下一步

- 如果是初次使用 [Astro] 建议先阅读官方文档；
- TODO: 项目结构介绍、相关技术栈介绍、内置组件介绍、默认内容集合管理……

[Astro]: https://docs.astro.build/zh-cn/getting-started/
[AstroArknights]: https://github.com/Yue-plus/astro-arknights
[Git]: https://git-scm.com/
[Node.JS]: https://nodejs.org/zh-cn
