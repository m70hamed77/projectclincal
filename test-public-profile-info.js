const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testPublicProfileInfo() {
  try {
    console.log('=== Testing Public Profile Info ===\n')

    const student = await prisma.student.findFirst({
      include: {
        user: true
      }
    })

    if (!student) {
      console.log('No student found')
      return
    }

    console.log('Student Info:')
    console.log(`  Name: ${student.user.name}`)
    console.log(`  Email: ${student.user.email}`)
    console.log(`  Phone: ${student.user.phone}`)
    console.log(`  University: ${student.universityName || 'N/A'}`)
    console.log(`  College: ${student.collegeName || 'N/A'}`)
    console.log(`  College Address: ${student.collegeAddress || 'N/A'}`)
    console.log(`  Academic Year: ${student.academicYear || 'N/A'}`)
    console.log(`  Specialization: ${student.specialization || 'N/A'}`)
    console.log(`  Location: ${student.location || 'N/A'}`)
    console.log(`  City: ${student.city || 'N/A'}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPublicProfileInfo()
