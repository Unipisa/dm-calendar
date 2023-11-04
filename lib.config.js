import { resolve } from 'path'

import { defineConfig } from 'vite'

import rollupPluginSizes from 'rollup-plugin-sizes'
import preactPlugin from '@preact/preset-vite'

/** @type {import('vite').PluginOption[]} */
const plugins = [preactPlugin()]

export default defineConfig(({ mode, command }) => {
    return {
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        server: {
            port: 3000,
        },
        build: {
            outDir: 'out/lib/',
            emptyOutDir: false,
            minify: 'terser',
            lib: {
                formats: ['iife'],
                entry: [resolve(__dirname, 'src/element.jsx')],
                name: 'DMCalendar',
                fileName: 'dm-calendar-element',
            },
            rollupOptions: {
                output: {
                    assetFileNames: 'dm-calendar-element.[ext]',
                },
            },
        },
        plugins:
            command === 'build'
                ? // mostro alcune metriche sul bundle generato
                  [...plugins, rollupPluginSizes()]
                : // altrimenti non usiamo nessun plugin per ora
                  [...plugins],
    }
})
