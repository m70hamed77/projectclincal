import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use DATABASE_URL from env, with fallback
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_8VWQD3iHtPAp@ep-bitter-sound-amro63xu-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

let db: PrismaClient

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ['error', 'warn'],
  })
}

db = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = db
}

export { db }
export default db
