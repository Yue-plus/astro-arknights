import {atom} from "nanostores";
import arknightsConfig from "../../../arknights.config.tsx";

export const viewIndex = atom<number>(0)

export function viewIndexSetNext() {
    const viewIndexNow = viewIndex.get()
    if (viewIndexNow < arknightsConfig.navbar.items.length - 1) viewIndex.set(viewIndexNow + 1)
}

export function viewIndexSetPrev() {
    const viewIndexNow = viewIndex.get()
    if (viewIndexNow > 0) viewIndex.set(viewIndexNow - 1)
}

export const isNavMenuOpen = atom<boolean>(false)
export const isToolBoxOpen = atom<boolean>(false)
export const isOwnerInfoOpen = atom<boolean>(false)
export const isInitialized = atom(false)
export const readyToTouch = atom(false) // TODO: 和isInitialized合并
