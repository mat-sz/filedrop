import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import buildInfo from 'vite-plugin-info';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    hmr: {
      port: 3001,
      clientPort: 3001,
    },
  },
  resolve: {
    mainFields:
      mode === 'production' ? ['jsnext:main', 'module', 'main'] : undefined,
  },
  build: {
    outDir: './build',
  },
  plugins: [buildInfo(), preact()],
}));
