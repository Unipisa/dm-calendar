import { resolve } from 'path'

import { defineConfig } from 'vite'

import rollupPluginSizes from 'rollup-plugin-sizes'

export default defineConfig(configEnv => {
    return {
        server: {
            port: 3000,
        },
        build: {
            outDir: 'out/phd/',
            emptyOutDir: true,
            minify: 'terser',
            lib: {
                formats: ['iife'],
                entry: resolve(__dirname, 'src/dm-calendar.js'),
                name: 'DMCalendar',
                fileName: 'dm-calendar',
            },
            rollupOptions: {
                output: {
                    assetFileNames: 'dm-calendar.[ext]',
                },
            },
        },
        plugins:
            configEnv.command === 'build'
                ? // mostro alcune metriche sul bundle generato
                  [rollupPluginSizes()]
                : // altrimenti non usiamo nessun plugin per ora
                  [],
    }
})
