import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { v4 } from 'uuid';

export default defineConfig({
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
  build: {
    outDir: './build',
  },
  plugins: [react()],
});
