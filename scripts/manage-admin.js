const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function manageAdmin() {
  try {
    console.log('🔍 جلب جميع المستخدمين بدور ADMIN...\n')

    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: { admin: true }
    })

    console.log(`📊 عدد حسابات الأدمن الموجودة: ${adminUsers.length}\n`)

    if (adminUsers.length > 0) {
      console.log('📋 قائمة الأدمن الحالية:')
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`)
        console.log(`   📧 البريد: ${admin.email}`)
        console.log(`   📱 الهاتف: ${admin.phone || 'غير محدد'}`)
        console.log(`   ✅ الحالة: ${admin.status}`)
        console.log(`   🆔 ID: ${admin.id}`)
        console.log('')
      })
    }

    // Target admin details
    const targetEmail = 'admin@smileydentalclinac.com'
    const targetPhone = '01010491760'

    console.log(`\n🎯 البحث عن الحساب المطلوب: ${targetEmail}`)

    // Check if target admin exists
    let targetAdmin = adminUsers.find(u => u.email === targetEmail)

    if (!targetAdmin) {
      console.log('❌ الحساب المطلوب غير موجود، سيتم إنشاؤه...')
      console.log('')

      // Hash password
      const hashedPassword = await bcrypt.hash('Admin@mo#abdo*', 10)

      // Create user
      targetAdmin = await prisma.user.create({
        data: {
          email: targetEmail,
          password: hashedPassword,
          name: 'System Admin',
          phone: targetPhone,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: new Date(),
          admin: {
            create: {
              permissions: 'all'
            }
          }
        },
        include: { admin: true }
      })

      console.log('✅ تم إنشاء حساب الأدمن بنجاح!')
    } else {
      console.log('✅ الحساب المطلوب موجود بالفعل')

      // Update if needed
      if (targetAdmin.name !== 'System Admin' || targetAdmin.phone !== targetPhone || targetAdmin.status !== 'ACTIVE') {
        await prisma.user.update({
          where: { id: targetAdmin.id },
          data: {
            name: 'System Admin',
            phone: targetPhone,
            status: 'ACTIVE'
          }
        })
        console.log('✅ تم تحديث بيانات الحساب')
      }

      // Ensure admin record exists
      if (!targetAdmin.admin) {
        await prisma.admin.create({
          data: {
            userId: targetAdmin.id,
            permissions: 'all'
          }
        })
        console.log('✅ تم إنشاء سجل الأدمن')
      }
    }

    console.log('')
    console.log('📝 بيانات الحساب الحالي:')
    console.log(`👤 الاسم: ${targetAdmin.name}`)
    console.log(`📧 البريد: ${targetAdmin.email}`)
    console.log(`📱 الهاتف: ${targetAdmin.phone}`)
    console.log(`🛡️ الدور: ${targetAdmin.role}`)
    console.log(`✅ الحالة: ${targetAdmin.status}`)

    // Delete other admins
    const otherAdmins = adminUsers.filter(u => u.email !== targetEmail)
    if (otherAdmins.length > 0) {
      console.log(`\n🗑️ جاري حذف ${otherAdmins.length} حساب/حسابات أدمن أخرى...`)

      for (const admin of otherAdmins) {
        console.log(`   حذف: ${admin.name} (${admin.email})`)
        await prisma.user.delete({
          where: { id: admin.id }
        })
      }

      console.log('✅ تم حذف جميع حسابات الأدمن الأخرى')
    } else {
      console.log('\n✅ لا توجد حسابات أدمن أخرى للحذف')
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ تم الانتهاء بنجاح!')
    console.log('📊 عدد حسابات الأدمن النهائية: 1')
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ خطأ:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

manageAdmin()
