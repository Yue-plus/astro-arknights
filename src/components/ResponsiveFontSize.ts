import {useEffect} from "react";

export default function ResponsiveFontSize() {
    useEffect(() => {
        const handleWindowResize = () => {
            let fontSize = 16

            if (innerHeight > innerWidth) {
                const designWidth = 750, designHeight = 1334;
                if (innerWidth / innerHeight > designWidth / designHeight) fontSize *= innerHeight / designHeight
                else fontSize *= innerWidth / designWidth
            } else {
                const designWidth = 1920, designHeight = 1080;
                if (innerWidth / innerHeight > designWidth / designHeight) fontSize *= innerHeight / designHeight
                else fontSize *= innerWidth / designWidth
            }

            document.documentElement.style.fontSize = fontSize + "px"
        }

        handleWindowResize()
        window.addEventListener("resize", handleWindowResize)
        return () => window.removeEventListener("resize", handleWindowResize)
    }, []);

    return null
}
