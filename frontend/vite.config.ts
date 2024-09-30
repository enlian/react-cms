import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选：重写路径
      },
    },
  },
});
