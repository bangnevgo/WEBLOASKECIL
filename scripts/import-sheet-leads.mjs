import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'node:fs'

const prisma = new PrismaClient()

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.log('Usage: node scripts/import-sheet-leads.mjs <path-to-csv-or-json>')
    process.exit(1)
  }

  const raw = readFileSync(filePath, 'utf8')
  let leads = []

  if (filePath.endsWith('.json')) {
    leads = JSON.parse(raw)
  } else if (filePath.endsWith('.csv')) {
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
    const header = lines[0].toLowerCase().split(',')

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim())
      if (cols.length >= 3) {
        leads.push({
          name: cols[0],
          email: cols[1],
          phone: cols[2],
          timestamp: cols[3] || new Date().toISOString(),
          source: cols[4] || 'landing',
        })
      }
    }
  }

  console.log(`Found ${leads.length} leads in ${filePath}. Starting import to Neon DB...`)

  let inserted = 0
  let skipped = 0

  for (const item of leads) {
    const name = (item.name || '').trim()
    const email = (item.email || '').trim().toLowerCase()
    const phone = (item.phone || '').trim()
    const source = (item.source || 'landing').trim()
    const createdAt = item.timestamp || item.createdAt ? new Date(item.timestamp || item.createdAt) : new Date()

    if (!name || !email) {
      skipped++
      continue
    }

    try {
      const existing = await prisma.lead.findFirst({ where: { email } })
      if (existing) {
        skipped++
        continue
      }

      await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          source,
          createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        },
      })
      inserted++
    } catch (err) {
      console.error(`Error inserting ${email}:`, err.message)
    }
  }

  console.log(`✅ Import complete! Inserted: ${inserted}, Skipped/Duplicates: ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
