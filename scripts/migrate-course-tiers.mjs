import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { PrismaClient } from '@prisma/client'

const apply = process.argv.includes('--apply')
const bootcampDb = process.env.BOOTCAMP_DB_PATH
const midtransModule = process.env.MIDTRANS_STUDENTS_PATH

if (!bootcampDb || !midtransModule) {
  throw new Error('BOOTCAMP_DB_PATH dan MIDTRANS_STUDENTS_PATH wajib diisi.')
}

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()
const normalizeName = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const excludedEmails = new Set(['bangnevgo@gmail.com', 'bangnding@gmail.com'])

const rawBootcamp = execFileSync('sqlite3', [
  bootcampDb,
  '-json',
  'SELECT nama,email,wa FROM members ORDER BY id',
], { encoding: 'utf8' })
const bootcamp = JSON.parse(rawBootcamp)
  .map((row) => ({ name: String(row.nama || '').trim(), email: normalizeEmail(row.email), phone: String(row.wa || '').trim() }))
  .filter((row) => row.email && !excludedEmails.has(row.email))

const { REAL_MIDTRANS_STUDENTS } = await import(pathToFileURL(midtransModule))
const midtrans = REAL_MIDTRANS_STUDENTS
  .map((row) => ({ name: String(row.name || '').trim(), email: normalizeEmail(row.email) }))
  .filter((row) => row.email && !excludedEmails.has(row.email))

const bootcampEmails = new Set(bootcamp.map((row) => row.email))
const bootcampNames = new Set(bootcamp.map((row) => normalizeName(row.name)))
const exactEmailOverlap = midtrans.filter((row) => bootcampEmails.has(row.email))
const sameNameAliasOverlap = midtrans.filter((row) => !bootcampEmails.has(row.email) && bootcampNames.has(normalizeName(row.name)))
const legacy = midtrans.filter((row) => !bootcampEmails.has(row.email) && !bootcampNames.has(normalizeName(row.name)))

const summary = {
  bootcamp: bootcamp.length,
  legacy: legacy.length,
  exactEmailOverlap: exactEmailOverlap.length,
  sameNameAliasOverlap: sameNameAliasOverlap.length,
}

if (JSON.stringify(summary) !== JSON.stringify({ bootcamp: 34, legacy: 28, exactEmailOverlap: 14, sameNameAliasOverlap: 2 })) {
  throw new Error(`Rekonsiliasi tidak sesuai keputusan owner: ${JSON.stringify(summary)}`)
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', summary }, null, 2))
if (!apply) process.exit(0)

const db = new PrismaClient()
try {
  await db.$transaction(async (tx) => {
    for (const student of legacy) {
      await tx.user.upsert({
        where: { email: student.email },
        update: { name: student.name, tier: 'legacy' },
        create: { email: student.email, name: student.name, passwordHash: 'pending_payment_registration', tier: 'legacy' },
      })
    }

    for (const student of bootcamp) {
      await tx.user.upsert({
        where: { email: student.email },
        update: { name: student.name, tier: 'bootcamp' },
        create: { email: student.email, name: student.name, passwordHash: 'pending_payment_registration', tier: 'bootcamp' },
      })
      const existingLead = await tx.lead.findFirst({ where: { email: student.email, source: 'bootcamp-pioneer' } })
      if (existingLead) {
        await tx.lead.update({ where: { id: existingLead.id }, data: { name: student.name, phone: student.phone } })
      } else {
        await tx.lead.create({ data: { name: student.name, email: student.email, phone: student.phone, source: 'bootcamp-pioneer' } })
      }
    }

    for (const alias of sameNameAliasOverlap) {
      await tx.user.updateMany({ where: { email: alias.email }, data: { tier: 'free' } })
    }

    await tx.user.updateMany({ where: { tier: 'master' }, data: { tier: 'bootcamp' } })
  })

  const counts = await db.user.groupBy({ by: ['tier'], _count: { _all: true } })
  console.log(JSON.stringify({ success: true, counts }, null, 2))
} finally {
  await db.$disconnect()
}
