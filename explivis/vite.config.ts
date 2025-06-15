import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.js',
  },

  resolve: {
    alias: {
      dropzone: path.resolve(__dirname, 'node_modules/dropzone')
    }
  },

  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if(warning.code === 'DYNAMIC_IMPORT') {
          return;
        }

        warn(warning);
      }
    }
  },

})
