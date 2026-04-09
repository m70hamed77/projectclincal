import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

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
export const prisma = db
export default db
