import { defineConfig } from 'vite'

export default defineConfig({
    base: '/dm-calendar/',
    build: {
        outDir: 'out/website/',
        emptyOutDir: true,
        minify: 'terser',
    },
})
