import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { viewIndex, readyToTouch } from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";

export default function More() {
    const $viewIndex = useStore(viewIndex);
    const $readyToTouch = useStore(readyToTouch);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const isActive = $viewIndex === 5 && $readyToTouch;
        if (isActive) directions.set({ top: false, right: false, bottom: true, left: false });
        setActive(isActive);
    }, [$viewIndex, $readyToTouch]);

    return (
        <div 
            className={`w-full h-full transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`} 
            style={{backgroundColor: "darkred"}}
        >
            <h1 className="text-9xl absolute top-1/4 left-1/4">TODO: More</h1>
        </div>
    );
}
