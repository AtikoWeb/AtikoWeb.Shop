import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
    },
    build: {
        minify: false,
        sourcemap: false,
    },
    define: {
        'process.env': process.env,
    },
})
