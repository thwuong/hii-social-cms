import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/app': path.resolve(__dirname, './app'),
      '@/features': path.resolve(__dirname, './features'),
      '@/shared': path.resolve(__dirname, './shared'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/services': path.resolve(__dirname, './services'),
    },
  },
});
