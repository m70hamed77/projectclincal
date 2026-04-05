const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    console.log('='.repeat(80))
    console.log('📊 Users in Database:')
    console.log('='.repeat(80))
    
    if (users.length === 0) {
      console.log('✅ No users found - Database is clean')
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name} (${user.role})`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Status: ${user.status}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Created: ${user.createdAt}`)
      })
    }
    
    console.log('\n' + '='.repeat(80))
    console.log(`Total users: ${users.length}`)
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
