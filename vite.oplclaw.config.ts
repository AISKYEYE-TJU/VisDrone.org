import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8084, // OplClaw专用端口
    open: 'http://localhost:8084/oplclaw',
  },
  define: {
    'import.meta.env.VITE_APP_PLATFORM': JSON.stringify('oplclaw'),
  },
  optimizeDeps: {
    exclude: ['react-router-dom'],
  },
});
