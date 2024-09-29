import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { viewIndex, readyToTouch } from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";

export default function Operator() {
    const $viewIndex = useStore(viewIndex);
    const $readyToTouch = useStore(readyToTouch);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const isActive = $viewIndex === 2 && $readyToTouch;
        if (isActive) {
            directions.set({ top: true, right: true, bottom: true, left: false });
        }
        setActive(isActive);
    }, [$viewIndex, $readyToTouch]);

    return (
        <div className={`w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto transition-all duration-1000 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="w-full h-full" style={{backgroundColor: "darkgrey"}}>
                <h1 className="text-9xl absolute top-1/4 left-1/4">TODO: Operator</h1>
            </div>
            {/* TODO: Operator */}
        </div>
    );
}
