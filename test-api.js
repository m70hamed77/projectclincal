const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAPI() {
  try {
    // Get the student schema
    const student = await prisma.student.findFirst()
    console.log('Student schema test:')
    console.log('collegeName exists:', 'collegeName' in student)
    console.log('collegeAddress exists:', 'collegeAddress' in student)
    console.log('\nAll fields:', Object.keys(student).join(', '))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPI()
