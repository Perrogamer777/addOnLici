import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import react from '@vitejs/plugin-react'
import TranslationsLoader from './rollup/translations-loader-plugin'
import { extractMarketplaceTranslation } from './rollup/modifiers/translations'
import StaticCopy from './rollup/static-copy-plugin'
import { defineConfig, loadEnv } from 'vite'
import { changeLocation } from './rollup/modifiers/manifest'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      TranslationsLoader(),
      StaticCopy({
        targets: [
          // Copia todos los assets al subdirectorio correcto
          { src: resolve(__dirname, 'src/assets/*'), dest: 'assets' },
          // Copia manifest.json directamente a la raíz del outDir (dist/)
          {
            src: resolve(__dirname, 'src/manifest.json'),
            dest: resolve(__dirname, 'dist'),
            modifier: (data) => data // sin modificar el contenido
          },
          // Copia traducciones si existen
          {
            src: resolve(__dirname, 'src/translations/*'),
            dest: 'translations'
          }
        ]
      })
    ],
    root: 'src',
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html')
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    }
  })
}
