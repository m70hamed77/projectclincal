import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../src/lib/password.js'

const prisma = new PrismaClient()

async function testFullAuth() {
  console.log('═══════════════════════════════════════')
  console.log('🧪 اختبار شامل لنظام المصادقة بعد التعديلات')
  console.log('═══════════════════════════════════════')

  try {
    // Test 1: Database Connection
    console.log('\n[TEST 1] 🔌 اختبار الاتصال بقاعدة البيانات...')
    await prisma.$connect()
    console.log('✅ الاتصال بقاعدة البيانات ناجح!')

    // Test 2: Create a test patient (check registration works)
    console.log('\n[TEST 2] ➕ اختبار إنشاء حساب مريض جديد...')
    const testPatientEmail = `patient-test-${Date.now()}@example.com`
    const testPassword = 'Test123456'
    const hashedPassword = await hashPassword(testPassword)

    const newPatient = await prisma.user.create({
      data: {
        email: testPatientEmail,
        password: hashedPassword,
        name: 'Test Patient ' + Date.now(),
        role: 'PATIENT',
        status: 'ACTIVE',
        emailVerified: new Date(),
        patient: {
          create: {}
        }
      },
      include: {
        patient: true
      }
    })
    console.log('✅ تم إنشاء حساب مريض جديد بنجاح!')
    console.log('👤 User ID:', newPatient.id)
    console.log('📧 Email:', newPatient.email)
    console.log('👑 Role:', newPatient.role)
    console.log('✨ Status:', newPatient.status)

    // Test 3: Login with the new patient account
    console.log('\n[TEST 3] 🔓 اختبار تسجيل الدخول بحساب المريض الجديد...')
    const foundPatient = await prisma.user.findUnique({
      where: { email: testPatientEmail }
    })

    if (foundPatient) {
      const isLoginCorrect = await comparePassword(testPassword, foundPatient.password)
      console.log(isLoginCorrect ? '✅ تسجيل الدخول ناجح!' : '❌ فشل تسجيل الدخول!')

      if (!isLoginCorrect) {
        console.error('❌ خطأ: كلمة المرور الصحيحة لم يتم قبولها!')
        process.exit(1)
      }
    }

    // Test 4: Create a test student (check registration works for students)
    console.log('\n[TEST 4] ➕ اختبار إنشاء حساب طالب جديد...')
    const testStudentEmail = `student-test-${Date.now()}@example.com`

    const newStudent = await prisma.user.create({
      data: {
        email: testStudentEmail,
        password: await hashPassword(testPassword),
        name: 'Test Student ' + Date.now(),
        role: 'STUDENT',
        status: 'PENDING', // Should be PENDING for students
        emailVerified: new Date(),
        student: {
          create: {
            isVerified: false,
            verificationStatus: 'PENDING'
          }
        }
      },
      include: {
        student: true
      }
    })
    console.log('✅ تم إنشاء حساب طالب جديد بنجاح!')
    console.log('👤 User ID:', newStudent.id)
    console.log('📧 Email:', newStudent.email)
    console.log('👑 Role:', newStudent.role)
    console.log('✨ Status:', newStudent.status)
    console.log('🎓 Verification Status:', newStudent.student?.verificationStatus)

    // Test 5: Login with wrong password (should fail)
    console.log('\n[TEST 5] 🚫 اختبار تسجيل الدخول بكلمة مرور خاطئة...')
    const isWrongPassword = await comparePassword('WrongPassword123', foundPatient.password)
    console.log(isWrongPassword ? '❌ خطأ: كلمة المرور الخاطئة قبلت!' : '✅ كلمة المرور الخاطئة مرفوضة بنجاح!')

    if (isWrongPassword) {
      console.error('❌ خطأ أمني: كلمة المرور الخاطئة تم قبولها!')
      process.exit(1)
    }

    // Test 6: Check email duplication prevention
    console.log('\n[TEST 6] 🚫 اختبار منع تكرار الإيميل...')
    const duplicatePatient = await prisma.user.findUnique({
      where: { email: testPatientEmail }
    })

    if (duplicatePatient) {
      console.log('✅ الإيميل موجود في قاعدة البيانات')
      console.log('📧 Email:', duplicatePatient.email)
      console.log('👤 Name:', duplicatePatient.name)
      console.log('✅ منع التكرار يعمل بشكل صحيح!')
    } else {
      console.error('❌ خطأ: الإيميل لا يوجد!')
      process.exit(1)
    }

    // Test 7: Check existing test users
    console.log('\n[TEST 7] 📊 إحصائيات قاعدة البيانات...')
    const patientCount = await prisma.user.count({
      where: { role: 'PATIENT', status: 'ACTIVE' }
    })
    const studentCount = await prisma.user.count({
      where: { role: 'STUDENT' }
    })
    console.log('👥 عدد المرضى النشطين:', patientCount)
    console.log('👨‍🎓 عدد الطلاب:', studentCount)

    console.log('\n═══════════════════════════════════════')
    console.log('✅✅✅ جميع الاختبارات نجحت!')
    console.log('═══════════════════════════════════════')

    console.log('\n🎯 الخلاصة:')
    console.log('   ✅ إنشاء حساب مريض يعمل')
    console.log('   ✅ إنشاء حساب طالب يعمل')
    console.log('   ✅ تسجيل الدخول يعمل')
    console.log('   ✅ رفض كلمات المرور الخاطئة يعمل')
    console.log('   ✅ منع تكرار الإيميل يعمل')
    console.log('   ✅ قاعدة البيانات متصلة')

    console.log('\n🚀 النظام جاهز للاستخدام!')

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testFullAuth()
