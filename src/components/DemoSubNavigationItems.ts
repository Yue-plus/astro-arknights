import type {SubNavigationItem} from "../_types/SubNavigationItem.ts";

const DemoSubNavigationItems: SubNavigationItem[] = [...Array(100)]
    .map((item, index): SubNavigationItem => ({title: `子导航项 - ${index}`, href: ""}))

export default DemoSubNavigationItems
