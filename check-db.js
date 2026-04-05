const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkSchema() {
  try {
    // Get one student to see what fields exist
    const student = await prisma.student.findFirst()
    console.log('Student fields available:')
    console.log(Object.keys(student).join(', '))

    // Check if collegeName and collegeAddress exist
    console.log('\nChecking for collegeName:', 'collegeName' in student)
    console.log('Checking for collegeAddress:', 'collegeAddress' in student)

    console.log('\nActual values:')
    console.log('collegeName:', student.collegeName)
    console.log('collegeAddress:', student.collegeAddress)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSchema()
