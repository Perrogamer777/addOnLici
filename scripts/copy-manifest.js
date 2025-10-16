import fs from 'fs'
import path from 'path'

const src = path.resolve('src/manifest.json')
const destDir = path.resolve('dist')
const dest = path.join(destDir, 'manifest.json')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

fs.copyFileSync(src, dest)
console.log('✅ manifest.json copiado a dist/')
