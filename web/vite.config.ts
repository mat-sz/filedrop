import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import buildInfo from 'vite-plugin-info';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    hmr: {
      port: 3001,
      clientPort: 3001,
    },
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
  plugins: [buildInfo(), react()],
}));
