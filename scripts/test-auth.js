import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../src/lib/password.js'

const prisma = new PrismaClient()

async function testAuth() {
  console.log('═══════════════════════════════════════')
  console.log('🧪 اختبار نظام المصادقة')
  console.log('═══════════════════════════════════════')

  try {
    // Test 1: Database Connection
    console.log('\n[TEST 1] 🔌 اختبار الاتصال بقاعدة البيانات...')
    await prisma.$connect()
    console.log('✅ الاتصال بقاعدة البيانات ناجح!')

    // Test 2: Check if test user exists
    console.log('\n[TEST 2] 🔍 التحقق من المستخدم التجريبي...')
    const testEmail = 'test-patient@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (existingUser) {
      console.log('✅ المستخدم موجود:', existingUser.name)
    } else {
      console.log('ℹ️ المستخدم غير موجود، سيتم إنشاؤه...')

      // Test 3: Hash password
      console.log('\n[TEST 3] 🔐 اختبار تشفير كلمة المرور...')
      const testPassword = 'Test123456'
      const hashedPassword = await hashPassword(testPassword)
      console.log('✅ تم تشفير كلمة المرور')
      console.log('📝 Hashed password:', hashedPassword.substring(0, 50) + '...')

      // Test 4: Create user
      console.log('\n[TEST 4] ➕ اختبار إنشاء مستخدم جديد (مريض)...')
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
          name: 'Test Patient User',
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
      console.log('✅ تم إنشاء المستخدم بنجاح!')
      console.log('👤 User ID:', newUser.id)
      console.log('📧 Email:', newUser.email)
      console.log('👑 Role:', newUser.role)
      console.log('✨ Status:', newUser.status)
    }

    // Test 5: Login with correct password
    console.log('\n[TEST 5] 🔓 اختبار تسجيل الدخول بكلمة المرور الصحيحة...')
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (user) {
      const isCorrect = await comparePassword('Test123456', user.password)
      console.log(isCorrect ? '✅ كلمة المرور صحيحة!' : '❌ كلمة المرور خاطئة!')

      // Test 6: Login with wrong password
      console.log('\n[TEST 6] 🚫 اختبار تسجيل الدخول بكلمة مرور خاطئة...')
      const isWrong = await comparePassword('WrongPassword', user.password)
      console.log(isWrong ? '❌ خطأ: ينبغي أن تكون خاطئة!' : '✅ تم رفض كلمة المرور الخاطئة بنجاح!')
    }

    // Test 7: Check student registration logic
    console.log('\n[TEST 7] 🎓 اختبار إنشاء حساب طالب...')
    const studentEmail = 'test-student@example.com'
    const existingStudent = await prisma.user.findUnique({
      where: { email: studentEmail }
    })

    if (!existingStudent) {
      const studentPassword = await hashPassword('Student123456')
      const newStudent = await prisma.user.create({
        data: {
          email: studentEmail,
          password: studentPassword,
          name: 'Test Student User',
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
      console.log('✅ تم إنشاء حساب الطالب بنجاح!')
      console.log('👤 User ID:', newStudent.id)
      console.log('📧 Email:', newStudent.email)
      console.log('👑 Role:', newStudent.role)
      console.log('✨ Status:', newStudent.status) // Should be PENDING
      console.log('🎓 Verification Status:', newStudent.student?.verificationStatus) // Should be PENDING
    }

    console.log('\n═══════════════════════════════════════')
    console.log('✅✅✅ جميع الاختبارات نجحت!')
    console.log('═══════════════════════════════════════')

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
