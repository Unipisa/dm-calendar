import { resolve } from 'path'

import { defineConfig } from 'vite'

import rollupPluginSizes from 'rollup-plugin-sizes'

export function buildBundleFromEntrypoint(name, entryPoint) {
    return defineConfig(({ mode, command }) => {
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
                    entry: [resolve(__dirname, entryPoint)],
                    name: 'DMCalendar',
                    fileName: name,
                },
                rollupOptions: {
                    output: {
                        assetFileNames: name + '.[ext]',
                    },
                },
            },
            plugins:
                command === 'build'
                    ? // mostro alcune metriche sul bundle generato
                      [rollupPluginSizes()]
                    : // altrimenti non usiamo nessun plugin per ora
                      [],
        }
    })
}

export default buildBundleFromEntrypoint('dm-calendar', 'src/dm-calendar/index.js')
