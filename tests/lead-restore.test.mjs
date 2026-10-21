import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

test('lead restore endpoint exists and never creates duplicates', () => {
  const p = 'src/app/api/lead/restore/route.ts'
  assert.ok(existsSync(join(root, p)), 'restore route missing')
  const src = read(p)
  assert.match(src, /findFirst/)
  assert.match(src, /nv-lead-access/)
  assert.ok(!/db\.lead\.create/.test(src), 'restore must not create lead rows')
  assert.ok(!/GOOGLE_SHEET_URL/.test(src), 'restore must not hit sheet')
  assert.ok(!/TELEGRAM/.test(src), 'restore must not notify telegram')
})

test('lead status endpoint returns boolean without PII', () => {
  const src = read('src/app/api/lead/status/route.ts')
  assert.match(src, /registered/)
  assert.match(src, /hasValidLeadAccess/)
  assert.ok(!/phone/.test(src), 'status must not leak phone')
})

test('store can restore previous access', () => {
  const src = read('src/lib/store.ts')
  assert.match(src, /restoreLead/)
  assert.match(src, /\/api\/lead\/restore/)
})

test('modal offers already-registered path', () => {
  const src = read('src/components/lead-capture-modal.tsx')
  assert.match(src, /Sudah Pernah Daftar/)
  assert.match(src, /Pulihkan Akses/)
  assert.match(src, /handleRestore/)
})

test('landing topbar login button opens lead modal in restore mode', () => {
  const src = read('src/components/landing.tsx')
  assert.match(src, /openLeadModal\('restore'\)/)
  assert.ok(!/onClick=\{\(\)\s*=>\s*setView\('login'\)\}/.test(src), 'topbar login must not call dead setView("login")')
})
