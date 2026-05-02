import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run dev`         → standard Vite dev server with HMR
// `npm run build`       → split bundle in dist/ (for inspection)
// `npm run build:embed` → single self-contained dist/index.html ready
//                          for upload via metaphysical-way.academy /demo
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'embed' ? [viteSingleFile()] : []),
  ],
  build: {
    cssCodeSplit: mode !== 'embed',
    assetsInlineLimit: mode === 'embed' ? 100_000_000 : 4096,
    rollupOptions:
      mode === 'embed'
        ? { output: { inlineDynamicImports: true, manualChunks: undefined } }
        : {},
  },
  server: {
    port: 5173,
    open: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.js'],
    css: false,
    // Збираємо тільки наші тести, не торкаємось node_modules і dist.
    include: ['src/**/*.test.{js,jsx}'],
  },
}));
