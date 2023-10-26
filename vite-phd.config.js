import { resolve } from 'path'

import { defineConfig } from 'vite'

import rollupPluginSizes from 'rollup-plugin-sizes'

export default defineConfig(configEnv => {
    return {
        server: {
            port: 3000,
        },
        build: {
            outDir: 'out/lib/',
            emptyOutDir: true,
            minify: 'terser',
            lib: {
                formats: ['iife'],
                entry: resolve(__dirname, 'src/dm-calendar-phd.js'),
                name: 'DMCalendarPhd',
                fileName: 'dm-calendar-phd',
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
