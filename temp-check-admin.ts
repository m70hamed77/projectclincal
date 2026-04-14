import { db } from './src/lib/db.ts'

const admin = await db.user.findFirst({ where: { role: 'ADMIN' } })
console.log('Admin user:', JSON.stringify(admin, null, 2))
