import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
    build: {
        rollupOptions: {
            input: ["scss/boilerplate.scss", "js/toc-button.js", "js/toc-toggle.js"],
            output: {
                assetFileNames: ({ name }) => name,
                entryFileNames: 'js/[name].js',
            },
        },
        outDir: "build",
        cssMinify: false,
    },
    css: {
        devSourcemap: true,
        postcss: {
            plugins: [autoprefixer()],
        },
    },
});
