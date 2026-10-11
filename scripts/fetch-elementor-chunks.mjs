// One-off helper: the original static export only captured the Elementor chunks that happened to load while it was
// crawled. Elementor's webpack runtimes can lazy-load further frontend chunks (lightbox, share-link, popups, ...),
// so this downloads every chunk named in the runtimes — plus the lightbox/share-link assets — from the live site
// into legacy/supplement/ (same paths). legacy/taknikai_com/ itself is never modified.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LEGACY = join(ROOT, 'legacy', 'taknikai_com')
const SUPPLEMENT = join(ROOT, 'legacy', 'supplement')
const ORIGIN = 'https://taknikai.com'

const runtimes = [
  ['wp-content/plugins/elementor/assets/js/webpack.runtime.min.js', 'wp-content/plugins/elementor/assets/js/'],
  ['wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js', 'wp-content/plugins/elementor-pro/assets/js/'],
]
const wanted = new Set([
  'wp-content/plugins/elementor/assets/css/conditionals/lightbox.min.css',
  'wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js',
])
for (const [runtime, base] of runtimes) {
  const src = readFileSync(join(LEGACY, runtime), 'utf8')
  for (const m of src.matchAll(/"([\w.-]+\.bundle\.min\.js)"/g)) {
    // Editor-only chunks are never requested on the public site
    if (!/editor/.test(m[1])) wanted.add(base + m[1])
  }
}

let fetched = 0
let skipped = 0
const failed = []
for (const path of [...wanted].sort()) {
  if (existsSync(join(LEGACY, path)) || existsSync(join(SUPPLEMENT, path))) {
    skipped++
    continue
  }
  const res = await fetch(`${ORIGIN}/${path}`)
  if (!res.ok) {
    failed.push(`${res.status} ${path}`)
    continue
  }
  const file = join(SUPPLEMENT, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  fetched++
}
console.log(`fetch-elementor-chunks: ${fetched} fetched, ${skipped} already present, ${failed.length} failed`)
for (const f of failed) console.log(`  failed: ${f}`)
