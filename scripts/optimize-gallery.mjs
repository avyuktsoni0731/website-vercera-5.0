#!/usr/bin/env node
/**
 * Optimize gallery images: resize and compress for web.
 * Put your original 3–4 MB images in gallery-source/ (e.g. 40-1.jpg, 40-2.jpg, 30-1.jpg)
 * then run: node scripts/optimize-gallery.mjs
 * Output: public/images/gallery/*.webp (typically 100–400 KB each)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'gallery-source')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'gallery')

const MAX_WIDTH = 1600
const WEBP_QUALITY = 82

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('Install sharp first: pnpm add -D sharp')
    process.exit(1)
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true })
    console.log('Created gallery-source/ — put your original images there (e.g. 40-1.jpg, 30-1.png) then run this script again.')
    return
  }

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
  if (files.length === 0) {
    console.log('No images in gallery-source/. Add .jpg or .png files (e.g. 40-1.jpg, 30-1.png) and run again.')
    return
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const file of files) {
    const base = path.basename(file, path.extname(file))
    const outPath = path.join(OUT_DIR, `${base}.webp`)
    const inPath = path.join(SOURCE_DIR, file)
    const stat = fs.statSync(inPath)
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2)

    await sharp(inPath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath)

    const outStat = fs.statSync(outPath)
    const outKB = (outStat.size / 1024).toFixed(0)
    console.log(`${file} (${sizeMB} MB) → ${base}.webp (${outKB} KB)`)
  }

  console.log(`\nDone. Optimized ${files.length} images in public/images/gallery/`)
  console.log('Use paths like /images/gallery/40-1.webp in lib/gallery-data.ts')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
