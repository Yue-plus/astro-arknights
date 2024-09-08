import React, {useEffect, useMemo, useState} from "react";
import {useStore} from "@nanostores/react";
import {viewIndex} from "../../components/store/rootLayoutStore.ts";

export default function RootPageViewTemplate({selfIndex, children}: { selfIndex: number, children: React.ReactNode }) {
    const $viewIndex = useStore(viewIndex)

    const width = useMemo(() => {
        return selfIndex === $viewIndex ? "100%" : "0%"
    }, [selfIndex, $viewIndex])

    const [left, setLeft] = useState("0")
    useEffect(() => {
        if (selfIndex === $viewIndex) return
        if (selfIndex < $viewIndex) return setLeft("0")
        if (selfIndex > $viewIndex) return setLeft("auto")
    }, [selfIndex, $viewIndex])

    return <div
        className="w-0 h-full absolute top-0 right-0 bottom-0 left-0 overflow-hidden transition-[width] duration-1000"
        style={{width, left}}>
        {children}
    </div>
}
