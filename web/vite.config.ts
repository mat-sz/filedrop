import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { v4 } from 'uuid';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    hmr: {
      port: 3001,
      clientPort: 3001,
    },
  },
  define: {
    __BUILD_UUID__: JSON.stringify(v4()),
  },
  resolve:
    mode === 'production'
      ? {
          // Enables MobX production build
          mainFields: ['jsnext:main', 'module', 'main'],
        }
      : undefined,
  build: {
    outDir: './build',
  },
  plugins: [react()],
}));
