import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkEmailCode() {
  try {
    const email = 'doommm2026@gmail.com'

    console.log('Checking email:', email)

    // Check verification code
    const code = await prisma.verificationCode.findUnique({
      where: { email: email.toLowerCase() }
    })

    console.log('\n=== Verification Code ===')
    if (code) {
      console.log('✅ Found verification code')
      console.log('Code:', code.code)
      console.log('Expires at:', code.expiresAt)
      console.log('Used:', code.used)
      console.log('Created at:', code.createdAt)
    } else {
      console.log('❌ No verification code found for this email')
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    console.log('\n=== User ===')
    if (user) {
      console.log('✅ User found')
      console.log('Name:', user.name)
      console.log('Email:', user.email)
      console.log('Role:', user.role)
      console.log('Status:', user.status)
    } else {
      console.log('❌ No user found with this email')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEmailCode()
