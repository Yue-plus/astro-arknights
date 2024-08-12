import {z, defineCollection} from "astro:content";

/**
 * 定义集合
 * [参考](https://docs.astro.build/zh-cn/guides/content-collections/#%E5%AE%9A%E4%B9%89%E9%9B%86%E5%90%88)
 *
 * Defining Collections
 * [Reference](https://docs.astro.build/en/guides/content-collections/#defining-collections)
 */
export const config = {
    "blog": defineCollection({
        type: "content",
        schema: z.object({
            // TODO:
        })
    }),
    "docs": defineCollection({
        type: "content",
        schema: z.object({
            // TODO:
        })
    }),
}
