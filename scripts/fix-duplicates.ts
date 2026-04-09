import { db } from '../src/lib/db'

async function fixDuplicates() {
  console.log('Fixing duplicate phone numbers...\n')

  // Users with duplicate phone
  const duplicatePhone = '01017245964'

  // Get both users
  const users = await db.user.findMany({
    where: { phone: duplicatePhone },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' }
  })

  console.log(`Found ${users.length} users with phone: ${duplicatePhone}\n`)

  if (users.length < 2) {
    console.log('No duplicates to fix!')
    await db.$disconnect()
    return
  }

  // Keep the first user, clear phone for the others
  const userToKeep = users[0]
  const usersToUpdate = users.slice(1)

  console.log(`Keeping: ${userToKeep.name} (${userToKeep.email}) with phone ${userToKeep.phone}\n`)

  for (const user of usersToUpdate) {
    console.log(`Updating ${user.name} (${user.email}) - clearing phone number...`)

    await db.user.update({
      where: { id: user.id },
      data: { phone: null }
    })

    console.log(`✅ Cleared phone for ${user.name}\n`)
  }

  console.log('═══════════════════════════════════════')
  console.log('✅ Fix completed!')
  console.log('═══════════════════════════════════════')

  await db.$disconnect()
}

fixDuplicates().catch(console.error)
