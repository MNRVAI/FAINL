import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                // React core — changes rarely, cache long-term
                if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                  return 'vendor-react';
                }
                // Google GenAI SDK — largest dependency
                if (id.includes('@google')) {
                  return 'vendor-google';
                }
                // Markdown rendering pipeline (react-markdown + unified ecosystem)
                if (
                  id.includes('react-markdown') ||
                  id.includes('remark') ||
                  id.includes('rehype') ||
                  id.includes('unified') ||
                  id.includes('mdast') ||
                  id.includes('hast') ||
                  id.includes('micromark') ||
                  id.includes('unist') ||
                  id.includes('vfile') ||
                  id.includes('bail') ||
                  id.includes('trough') ||
                  id.includes('devlop') ||
                  id.includes('decode-named') ||
                  id.includes('comma-separated') ||
                  id.includes('space-separated') ||
                  id.includes('property-information') ||
                  id.includes('estree-util') ||
                  id.includes('trim-lines') ||
                  id.includes('is-plain-obj') ||
                  id.includes('extend') ||
                  id.includes('html-url-attributes') ||
                  id.includes('inline-style-parser') ||
                  id.includes('style-to-')
                ) {
                  return 'vendor-markdown';
                }
                // Everything else (supabase, lucide, tslib, p-retry, etc.)
                return 'vendor-misc';
              }
            }
          }
        }
      }
    };
});
