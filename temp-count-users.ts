import { db } from './src/lib/db'

const users = await db.user.findMany({
  where: { role: { in: ['STUDENT', 'PATIENT'] } },
  select: { id: true, name: true, email: true, role: true }
})

console.log('Users count:', users.length)
console.log('Users:', JSON.stringify(users, null, 2))
