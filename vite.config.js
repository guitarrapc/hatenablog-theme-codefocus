import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
    build: {
        rollupOptions: {
            input: ["scss/boilerplate.scss", "js/table-of-contents.js"],
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
