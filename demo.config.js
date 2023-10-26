import { defineConfig } from 'vite'

export default defineConfig({
    base: '/dm-calendar/',
    build: {
        outDir: 'out/',
        emptyOutDir: true,
        minify: 'terser',
    },
})
