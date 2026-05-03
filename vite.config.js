import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `npm run dev`              → Vite dev server with HMR
// `npm run build`            → split bundle in dist/ (для інспекції)
// `npm run build:embed`      → FULL single-file dist/index.html (всі шари: пелюстки, космо, кабінет)
// `npm run build:embed-lite` → LITE dist-lite/index.html (≤800 KB:
//                              без 9 пелюсток / контенту каналів космо / кабінету)
export default defineConfig(({ mode }) => {
  const isEmbed = mode === 'embed' || mode === 'embed-lite';
  const isLite = mode === 'embed-lite';
  return {
    plugins: [
      react(),
      ...(isEmbed ? [viteSingleFile()] : []),
    ],
    resolve: {
      alias: isLite
        ? [
            // У LITE режимі підмінюємо повний контент на lite-стаби
            {
              find: /^.*\/data\/cosmo-channels\/index\.js$/,
              replacement: path.resolve(__dirname, 'src/data/cosmo-channels/index.lite.js'),
            },
            {
              find: /^.*\/data\/petals\.js$/,
              replacement: path.resolve(__dirname, 'src/data/petals.lite.js'),
            },
            {
              find: /^.*\/data\/constellation\/figures\.js$/,
              replacement: path.resolve(__dirname, 'src/data/constellation/figures.lite.js'),
            },
            {
              find: /^.*\/data\/practices\.js$/,
              replacement: path.resolve(__dirname, 'src/data/practices.lite.js'),
            },
            {
              find: /^.*\/data\/shadow-keywords\.js$/,
              replacement: path.resolve(__dirname, 'src/data/shadow-keywords.lite.js'),
            },
            {
              find: /^.*\/data\/achievements\.js$/,
              replacement: path.resolve(__dirname, 'src/data/achievements.lite.js'),
            },
            {
              find: /^.*\/components\/PersonalCabinet\/index\.jsx$/,
              replacement: path.resolve(__dirname, 'src/components/PersonalCabinet/index.lite.jsx'),
            },
            {
              find: /^.*\/data\/mirror\.js$/,
              replacement: path.resolve(__dirname, 'src/data/mirror.lite.js'),
            },
            // Library — стаби у lite-build
            {
              find: /^.*\/data\/library\/index\.json$/,
              replacement: path.resolve(__dirname, 'src/data/library/index.lite.json'),
            },
            {
              find: /^.*\/data\/library\/cosmo\.json$/,
              replacement: path.resolve(__dirname, 'src/data/library/empty-book.lite.json'),
            },
            {
              find: /^.*\/data\/library\/methodichka\.json$/,
              replacement: path.resolve(__dirname, 'src/data/library/empty-book.lite.json'),
            },
            {
              find: /^.*\/data\/library\/united\.json$/,
              replacement: path.resolve(__dirname, 'src/data/library/empty-book.lite.json'),
            },
          ]
        : [],
    },
    define: {
      __LITE__: JSON.stringify(isLite),
    },
    build: {
      outDir: isLite ? 'dist-lite' : 'dist',
      cssCodeSplit: !isEmbed,
      assetsInlineLimit: isEmbed ? 100_000_000 : 4096,
      rollupOptions:
        isEmbed
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
      include: ['src/**/*.test.{js,jsx}'],
    },
  };
});
