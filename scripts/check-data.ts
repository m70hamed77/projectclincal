import { db } from '../src/lib/db'

async function getTestData() {
  console.log('🔍 جاري البحث عن بيانات الاختبار...')

  try {
    // البحث عن آخر مستخدمين
    const admin = await db.user.findUnique({ where: { email: 'admin@smileydental.com' } })
    const studentUser = await db.user.findUnique({ where: { email: 'student@test.com' } })
    const patientUser = await db.user.findUnique({ where: { email: 'patient@test.com' } })

    console.log('\n📋 المستخدمون الموجودة:')
    if (admin) console.log('   Admin:', admin.email, '- Status:', admin.status)
    if (studentUser) console.log('   Student:', studentUser.email, '- Status:', studentUser.status)
    if (patientUser) console.log('   Patient:', patientUser.email, '- Status:', patientUser.status)

    // البحث عن البوستات والطلبات
    const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' }, take: 3 })
    console.log('\n📝 آخر البوستات:')
    posts.forEach(p => {
      console.log(`   ${p.id}: ${p.title} - Status: ${p.status}`)
    })

    if (posts.length > 0) {
      const applications = await db.application.findMany({
        where: { postId: posts[0].id },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      console.log('\n📋 الطلبات للبوست الأخير:')
      applications.forEach(a => {
        console.log(`   ${a.id}: Status: ${a.status}`)
      })
    }

    console.log('\n✅ تم البحث بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await db.$disconnect()
  }
}

getTestData()
