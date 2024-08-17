/**
 * 该静态文件端点被 ../_views/01-Information.tsx 调用
 *
 * 参考：https://docs.astro.build/zh-cn/guides/endpoints/
 * See: https://docs.astro.build/en/guides/endpoints/
 */
export async function GET({params, request}) {
    // TODO:
    return new Response(JSON.stringify({
        "最新": [],
        "公告": [],
        "活动": [],
        "新闻": [],
    }));
}
