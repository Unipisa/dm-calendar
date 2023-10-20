import { defineConfig } from 'vite'

export default defineConfig({
    base: '/dm-calendar/',
    build: {
        copyPublicDir: true,
        outDir: 'out/',
        emptyOutDir: true,
        minify: 'terser',
    },
})
