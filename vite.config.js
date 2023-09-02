import {defineConfig} from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias:{
            "@": fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: true,
        port: 16113,
        strictPort: true,
    },
    base:"/bs-web/",
    build: {
        cssCodeSplit: true,
        outDir: process.env.BUILD_PATH || 'static',
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
            scopeBehaviour: 'local',
            generateScopedName: '[name]-[local]-[hash:5]',
        }
    },
})
