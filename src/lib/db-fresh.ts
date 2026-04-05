import { PrismaClient } from '@prisma/client'

// Create a fresh Prisma client instance without global caching
// This ensures it picks up the latest schema
export const dbFresh = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
