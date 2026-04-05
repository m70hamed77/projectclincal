/**
 * سكربت بسيط لاختبار الاتصال بقاعدة البيانات
 * التشغيل: node scripts/test-connection.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('═══════════════════════════════════════')
  console.log('🔄 جاري اختبار الاتصال بقاعدة البيانات...')
  console.log('═══════════════════════════════════════')

  try {
    // 1. اختبار الاتصال الأساسي
    console.log('\n1️⃣ اختبار الاتصال بقاعدة البيانات...')
    await prisma.$connect()
    console.log('✅ الاتصال بقاعدة البيانات ناجح!')

    // 2. التحقق من وجود Admin
    console.log('\n2️⃣ البحث عن مستخدم Admin...')
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@smileydental.com' },
      include: {
        admin: true
      }
    })

    if (!admin) {
      console.log('❌ مستخدم Admin غير موجود!')
      console.log('📝 يرجى تشغيل: npm run create-admin:js')
    } else {
      console.log('✅ مستخدم Admin موجود!')
      console.log('📧 البريد:', admin.email)
      console.log('👤 الاسم:', admin.name)
      console.log('🎭 الدور:', admin.role)
      console.log('📊 الحالة:', admin.status)

      if (admin.admin) {
        console.log('🔐 سجل Admin موجود')
      }
    }

    // 3. حساب عدد المستخدمين
    console.log('\n3️⃣ إحصائيات قاعدة البيانات...')
    const userCount = await prisma.user.count()
    console.log('👥 عدد المستخدمين:', userCount)

    const patientCount = await prisma.patient.count()
    console.log('🏥 عدد المرضى:', patientCount)

    const studentCount = await prisma.student.count()
    console.log('🎓 عدد الطلاب:', studentCount)

    console.log('\n═══════════════════════════════════════')
    console.log('✅ جميع الاختبارات نجحت!')
    console.log('═══════════════════════════════════════')

  } catch (error) {
    console.error('\n❌ حدث خطأ:')
    console.error('Error Name:', error.name)
    console.error('Error Message:', error.message)

    if (error.code === 'P1001') {
      console.error('\n🔌 سبب الخطأ: لا يمكن الاتصال بقاعدة البيانات')
      console.error('📝 تأكد من أن ملف .env يحتوي على DATABASE_URL صحيح')
    } else if (error.code === 'P1003') {
      console.error('\n🔌 سبب الخطأ: قاعدة البيانات لا توجد')
      console.error('📝 شغل: npx prisma db push')
    }

    console.log('\n═══════════════════════════════════════')
    console.log('❌ الاختبار فشل!')
    console.log('═══════════════════════════════════════')

    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات')
  }
}

testConnection()
