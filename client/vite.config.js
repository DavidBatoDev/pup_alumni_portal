import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Proxying all requests starting with /api
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
