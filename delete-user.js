const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function deleteUser() {
  const emailToDelete = 'ahmed.hassan@cu.edu.eg'

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: emailToDelete },
      include: { student: true, patient: true }
    })

    if (!user) {
      console.log('❌ User not found:', emailToDelete)
      return
    }

    console.log('🔍 Found user:', user.name, '(', user.role, ')')
    console.log('   Email:', user.email)
    console.log('   Status:', user.status)

    // Delete the user (this will cascade delete all related data)
    await prisma.user.delete({
      where: { id: user.id }
    })

    console.log('✅ User deleted successfully:', emailToDelete)

    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
      select: { email: true, name: true, role: true }
    })
    console.log('\n📊 Remaining users:', remainingUsers.length)
    remainingUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.role}): ${u.email}`)
    })

  } catch (error) {
    console.error('❌ Error deleting user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
