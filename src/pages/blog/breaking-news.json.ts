import type {APIContext} from "astro";
import {getCollection} from "astro:content";
import type {BreakingNewsItemProps} from "../../_types/BreakingNewsItemProps.ts";

/**
 * 该静态文件端点被 ../_views/01-Information.tsx 调用
 *
 * 参考：https://docs.astro.build/zh-cn/guides/endpoints/
 * See: https://docs.astro.build/en/guides/endpoints/
 */
export async function GET({params, request}: APIContext) {
    // TODO:
    const base = import.meta.env.BASE_URL
    const allBlog = await getCollection("blog");

    return new Response(JSON.stringify({
        "最新": allBlog.reverse().slice(0, 5).map((item, index) => {
            const date = new Date(item.data.date ?? item.id.substring(0, 9));

            return {
                title: item.data.title ?? item.id,
                date: date.getFullYear() + " // " + (date.getMonth() + 1) + " / " + date.getDay(),
                href: base + "blog/" + item.slug,
                category: item.data.category ?? "未分类"
            }
        }) as BreakingNewsItemProps[],
        "公告": [] as BreakingNewsItemProps[],
        "活动": [] as BreakingNewsItemProps[],
        "新闻": [] as BreakingNewsItemProps[],
    }));
}
