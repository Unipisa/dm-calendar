import { defineConfig } from 'vite'

import preactPlugin from '@preact/preset-vite'

export default defineConfig({
    base: '/dm-calendar/',
    build: {
        outDir: 'out/',
        emptyOutDir: true,
        minify: 'terser',
    },
    plugins: [preactPlugin()],
})
