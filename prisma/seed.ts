import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedCategories() {
  const categories = [
    { name: 'Graphics cards', slug: 'gpu' },
    { name: 'Peripherals', slug: 'peripherals' },
    { name: 'Processors', slug: 'cpu' },
    { name: 'Memory', slug: 'memory' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    })
  }
}

async function main() {
  try {
    await seedCategories()
  } catch (e) {
    process.exit(1)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
