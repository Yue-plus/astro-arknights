import {defineConfig} from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: "one-dark-pro",
        },
    },

    integrations: [react(), tailwind({applyBaseStyles: false})],
});
