const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function updateAdmin() {
  try {
    const targetEmail = 'admin@smileydentalclinac.com'

    console.log('🔄 جاري تحديث بيانات حساب الأدمن...\n')

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@mo#abdo*', 10)

    // Update user
    const admin = await prisma.user.update({
      where: { email: targetEmail },
      data: {
        name: 'System Admin',
        phone: '01010491760',
        password: hashedPassword,
        status: 'ACTIVE',
        emailVerified: new Date()
      },
      include: { admin: true }
    })

    console.log('✅ تم تحديث بيانات الحساب بنجاح!')
    console.log('\n📝 بيانات الدخول النهائية:')
    console.log('─'.repeat(50))
    console.log(`👤 الاسم: ${admin.name}`)
    console.log(`📧 البريد: ${admin.email}`)
    console.log(`🔑 كلمة المرور: Admin@mo#abdo*`)
    console.log(`📱 الهاتف: ${admin.phone}`)
    console.log(`🛡️ الدور: ${admin.role}`)
    console.log(`✅ الحالة: ${admin.status}`)
    console.log('─'.repeat(50))

  } catch (error) {
    console.error('❌ خطأ:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdmin()
