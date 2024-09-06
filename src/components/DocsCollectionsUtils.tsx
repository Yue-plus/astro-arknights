import { getCollection } from "astro:content";
import type { SubNavigationItem } from "../_types/SubNavigationItem";

const base = import.meta.env.BASE_URL
const allDocs = await getCollection("docs")

/**
 * 去除 slug 的前缀
 * 
 * @param {string} slug 示例输入：`01_用户文档/01_项目介绍`
 * @returns {string} 示例输出：`用户文档/项目介绍`
 */
export function trimSlugPrefix(slug: string): string {
    return slug.split("/").map((item, index, array) => {
        return item.includes("_") ? item.split("_").slice(1).join() : item
    }).join("/")
}

export function getDocsUrlBySlug(slug: string): string {
    return base + "docs/" + trimSlugPrefix(slug)
}

export function getDocsSubNavigationItems(): SubNavigationItem[] {
    return allDocs.map(({ id, slug, body, collection, data }, index) => ({
        title: data.title ?? id,
        href: getDocsUrlBySlug(slug),
    }))
}
