import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 设置后端地址，区分开发和生产环境
const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://react-cms.onrender.com' // 生产环境后端地址
    : 'http://localhost:3000'; // 开发环境后端地址

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl, // 根据环境动态设置目标地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 可选：重写路径
      },
    },
  },
});
