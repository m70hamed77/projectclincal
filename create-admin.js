const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // بيانات الأدمن
    const adminData = {
      name: 'Admin User',
      email: 'admin@smiley.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date()
    }

    console.log('[CREATE ADMIN] Creating admin account...')

    // التحقق من وجود الأدمن
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingAdmin) {
      console.log('[CREATE ADMIN] Admin already exists:', existingAdmin.email)
      console.log('[CREATE ADMIN] Admin details:', {
        id: existingAdmin.id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
        status: existingAdmin.status
      })

      // التحقق من وجود سجل Admin
      const adminRecord = await prisma.admin.findUnique({
        where: { userId: existingAdmin.id }
      })

      if (!adminRecord) {
        console.log('[CREATE ADMIN] Creating Admin record...')
        await prisma.admin.create({
          data: {
            userId: existingAdmin.id,
            permissions: 'all'
          }
        })
        console.log('[CREATE ADMIN] Admin record created successfully!')
      } else {
        console.log('[CREATE ADMIN] Admin record already exists')
      }
    } else {
      // إنشاء مستخدم الأدمن
      const admin = await prisma.user.create({
        data: adminData
      })

      console.log('[CREATE ADMIN] Admin user created:', admin.id)

      // إنشاء سجل Admin
      await prisma.admin.create({
        data: {
          userId: admin.id,
          permissions: 'all'
        }
      })

      console.log('[CREATE ADMIN] Admin account created successfully!')
      console.log('[CREATE ADMIN] Login details:')
      console.log('  - Email:', adminData.email)
      console.log('  - Password: admin123')
      console.log('  - Please change the password after first login!')
    }

  } catch (error) {
    console.error('[CREATE ADMIN] Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
