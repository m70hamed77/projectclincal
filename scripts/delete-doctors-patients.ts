import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteDoctorsAndPatients() {
  try {
    console.log('🗑️ Starting deletion of doctors and patients...')

    // Get all doctors (STUDENT) and patients (PATIENT)
    const doctors = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      }
    })

    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT'
      }
    })

    console.log(`📊 Found ${doctors.length} doctors and ${patients.length} patients`)

    // Delete doctors
    if (doctors.length > 0) {
      await prisma.user.deleteMany({
        where: {
          role: 'STUDENT'
        }
      })
      console.log(`✅ Deleted ${doctors.length} doctors`)
    }

    // Delete patients
    if (patients.length > 0) {
      await prisma.user.deleteMany({
        where: {
          role: 'PATIENT'
        }
      })
      console.log(`✅ Deleted ${patients.length} patients`)
    }

    // Check remaining users (should only be ADMIN)
    const remainingUsers = await prisma.user.findMany()
    console.log(`\n📋 Remaining users (${remainingUsers.length}):`)
    remainingUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`)
    })

    console.log('\n✨ Deletion completed successfully!')
  } catch (error) {
    console.error('❌ Error deleting users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteDoctorsAndPatients()
