
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'out/phd/',
        emptyOutDir: true,
        minify: 'terser',
        rollupOptions: {
            input: 'phd.html',
        }
    },
})
