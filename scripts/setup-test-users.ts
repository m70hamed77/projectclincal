import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

/**
 * إنشاء مستخدمين تجريبيين
 * استخدم هذا الملف لإنشاء:
 * - Admin: admin@smileydental.com / Admin@123
 * - Student: student@test.com / Student@123
 * - Patient: patient@test.com / Patient@123
 */

async function createTestUsers() {
  console.log('🚀 جاري إنشاء المستخدمين...')

  try {
    // 1. إنشاء Admin
    const adminPassword = await hashPassword('Admin@123')
    const admin = await db.user.upsert({
      where: { email: 'admin@smileydental.com' },
      update: {},
      create: {
        email: 'admin@smileydental.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })
    console.log('✅ تم إنشاء الأدمن:', admin.email)

    // 2. إنشاء Student
    const studentPassword = await hashPassword('Student@123')
    const studentUser = await db.user.upsert({
      where: { email: 'student@test.com' },
      update: {},
      create: {
        email: 'student@test.com',
        password: studentPassword,
        name: 'Test Student',
        role: 'STUDENT',
        status: 'ACTIVE'
      }
    })
    console.log('✅ تم إنشاء حساب الطالب:', studentUser.email)

    // إنشاء بروفايل الطالب
    const student = await db.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        verificationStatus: 'APPROVED',
        city: 'القاهرة',
        universityName: 'جامعة القاهرة',
        collegeName: 'كلية طب الأسنان',
        academicYear: 4,
        isVerified: true
      }
    })
    console.log('✅ تم إنشاء بروفايل الطالب')

    // 3. إنشاء Patient
    const patientPassword = await hashPassword('Patient@123')
    const patientUser = await db.user.upsert({
      where: { email: 'patient@test.com' },
      update: {},
      create: {
        email: 'patient@test.com',
        password: patientPassword,
        name: 'Test Patient',
        role: 'PATIENT',
        status: 'ACTIVE'
      }
    })
    console.log('✅ تم إنشاء حساب المريض:', patientUser.email)

    // إنشاء بروفايل المريض
    const patient = await db.patient.upsert({
      where: { userId: patientUser.id },
      update: {},
      create: {
        userId: patientUser.id,
        age: 25,
        gender: 'male',
        address: 'القاهرة'
      }
    })
    console.log('✅ تم إنشاء بروفايل المريض')

    // 4. إنشاء بوست تجريبي
    const post = await db.post.create({
      data: {
        studentId: student.id,
        title: 'حالة تجريبية للفحص',
        treatmentType: 'CLEANING',
        city: 'القاهرة',
        address: 'وسط المدينة',
        description: 'نحتاج مرضى لفحص وتنظيف الأسنان',
        requiredCount: 3,
        status: 'ACTIVE'
      }
    })
    console.log('✅ تم إنشاء بوست تجريبي:', post.id)

    // 5. إنشاء طلب تجريبي
    const application = await db.application.create({
      data: {
        postId: post.id,
        patientId: patient.id,
        studentId: student.id,
        status: 'PENDING',
        medicalSnapshot: 'حالة عامة جيدة'
      }
    })
    console.log('✅ تم إنشاء طلب تجريبي:', application.id)

    console.log('\n🎉 تم إنشاء جميع المستخدمين بنجاح!')
    console.log('\n📝 بيانات الدخول:')
    console.log('   الأدمن: admin@smileydental.com / Admin@123')
    console.log('   الطالب: student@test.com / Student@123')
    console.log('   المريض: patient@test.com / Patient@123')
    console.log('\n📋 بيانات الاختبار:')
    console.log('   Post ID:', post.id)
    console.log('   Application ID:', application.id)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await db.$disconnect()
  }
}

createTestUsers()
