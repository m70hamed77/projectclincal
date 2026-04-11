import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import {
  incrementTotalUsers,
  incrementTotalPatients,
  incrementActivePatients
} from '@/lib/stats'

/**
 * API Route: تسجيل مريض جديد مع كود التحقق
 * Method: POST
 * Body: { email, password, name, verificationCode, age?, gender?, address? }
 */
export async function POST(request: NextRequest) {
  console.log('═══════════════════════════════════════')
  console.log('[REGISTER PATIENT] Starting patient registration with verification...')
  console.log('═══════════════════════════════════════')

  try {
    // Step 1: Parse request body
    let body
    let email, password, name, verificationCode, phone, governorate, address, age, gender

    try {
      body = await request.json()
      email = body.email
      password = body.password
      name = body.name
      verificationCode = body.verificationCode
      phone = body.phone
      governorate = body.governorate
      address = body.address
      age = body.age
      gender = body.gender

      console.log('[REGISTER PATIENT] Step 1 ✅: Parsed request body')
      console.log('[REGISTER PATIENT] Email:', email?.substring(0, 20) + '...')
      console.log('[REGISTER PATIENT] Name:', name)
      console.log('[REGISTER PATIENT] Phone:', phone)
      console.log('[REGISTER PATIENT] Governorate:', governorate)
      console.log('[REGISTER PATIENT] Verification Code:', verificationCode)
    } catch (parseError: any) {
      console.error('[REGISTER PATIENT] Step 1 ❌: Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'فشل في قراءة البيانات' }, { status: 400 })
    }

    // Step 2: Validate required fields
    if (!email || !password || !name || !verificationCode || !phone || !governorate || !address) {
      console.log('[REGISTER PATIENT] Step 2 ❌: Missing required fields')
      return NextResponse.json({
        error: 'جميع الحقول مطلوبة'
      }, { status: 400 })
    }
    console.log('[REGISTER PATIENT] Step 2 ✅: Fields validated')

    // Step 3: Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      console.log('[REGISTER PATIENT] Step 3 ❌: Invalid email format')
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 })
    }

    // Step 3.5: Validate phone format
    if (!/^01[0125][0-9]{8}$/.test(phone.trim())) {
      console.log('[REGISTER PATIENT] Step 3.5 ❌: Invalid phone format')
      return NextResponse.json({ error: 'رقم الهاتف غير صحيح' }, { status: 400 })
    }

    // Step 4: Verify the verification code BEFORE validating password
    // This ensures code errors are shown instead of password errors
    try {
      console.log('[REGISTER PATIENT] Step 4: Verifying code...')

      const verificationRecord = await db.verificationCode.findUnique({
        where: { email: email.trim().toLowerCase() }
      })

      if (!verificationRecord) {
        console.log('[REGISTER PATIENT] Step 4 ❌: No verification code found')
        return NextResponse.json({
          error: 'لم يتم العثور على كود تحقق. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.used) {
        console.log('[REGISTER PATIENT] Step 4 ❌: Code already used')
        return NextResponse.json({
          error: 'هذا الكود تم استخدامه من قبل. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.expiresAt < new Date()) {
        console.log('[REGISTER PATIENT] Step 4 ❌: Code expired')
        return NextResponse.json({
          error: 'انتهت صلاحية كود التحقق. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.code !== verificationCode) {
        console.log('[REGISTER PATIENT] Step 4 ❌: Invalid code')
        return NextResponse.json({
          error: 'كود التحقق غير صحيح. يرجى المحاولة مرة أخرى.'
        }, { status: 400 })
      }

      console.log('[REGISTER PATIENT] Step 4 ✅: Verification code validated')
    } catch (verifyError: any) {
      console.error('[REGISTER PATIENT] Step 4 ❌: Verification error:', verifyError)
      return NextResponse.json({
        error: 'خطأ في التحقق من الكود'
      }, { status: 500 })
    }

    // Step 5: Validate password strength
    const passwordValidation = await import('@/lib/password').then(m => m.validatePasswordStrength(password))
    if (!passwordValidation.valid) {
      console.log('[REGISTER PATIENT] Step 5 ❌: Password too weak:', passwordValidation.message)
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }
    console.log('[REGISTER PATIENT] Step 5 ✅: Password validated')

    // Step 6: Check if user already exists (AFTER verifying code to prevent giving hints about codes)
    try {
      console.log('[REGISTER PATIENT] Step 6: Checking if user already exists...')
      const existingUser = await db.user.findUnique({
        where: { email: email.trim().toLowerCase() }
      })

      if (existingUser) {
        console.log('[REGISTER PATIENT] Step 6 ❌: Email already registered')
        return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 409 })
      }

      // Check if phone number already exists
      const existingPhone = await db.user.findFirst({
        where: { phone: phone.trim() }
      })
      if (existingPhone) {
        console.log('[REGISTER PATIENT] Step 6 ❌: Phone already registered')
        return NextResponse.json({ error: 'رقم الهاتف مسجل مسبقاً' }, { status: 409 })
      }

      console.log('[REGISTER PATIENT] Step 6 ✅: Email and phone are available')
    } catch (dbError: any) {
      console.error('[REGISTER PATIENT] Step 6 ❌: Database error:', dbError)
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات: ' + dbError.message },
        { status: 500 }
      )
    }

    // Step 7: Hash password
    let hashedPassword
    try {
      console.log('[REGISTER PATIENT] Step 7: Hashing password...')
      hashedPassword = await hashPassword(password)
      console.log('[REGISTER PATIENT] Step 7 ✅: Password hashed')
    } catch (hashError: any) {
      console.error('[REGISTER PATIENT] Step 7 ❌: Failed to hash password:', hashError)
      return NextResponse.json({ error: 'فشل في تشفير كلمة المرور' }, { status: 500 })
    }

    // Step 8: Create user and patient in a transaction
    let user
    try {
      console.log('[REGISTER PATIENT] Step 8: Creating user and patient...')

      await db.$transaction(async (tx) => {
        // Create user with ACTIVE status
        user = await tx.user.create({
          data: {
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            name: name.trim(),
            role: 'PATIENT',
            status: 'ACTIVE',
            emailVerified: new Date(),
            phone: phone.trim(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true
          }
        })

        // Create patient profile
        await tx.patient.create({
          data: {
            userId: user.id,
            age: age ? parseInt(age.toString()) : null,
            gender: gender || null,
            governorate: governorate || null,
            address: address || null
          }
        })

        // Mark verification code as used
        await tx.verificationCode.update({
          where: { email: email.trim().toLowerCase() },
          data: { used: true }
        })
      })

      console.log('[REGISTER PATIENT] Step 8 ✅: User and patient created')
      console.log('[REGISTER PATIENT] User ID:', user.id)
      console.log('[REGISTER PATIENT] User Role:', user.role)
      console.log('[REGISTER PATIENT] User Status:', user.status)

      // 📊 Increment stats
      await incrementTotalUsers()
      await incrementTotalPatients()
      await incrementActivePatients()
      console.log('[REGISTER PATIENT] Stats incremented successfully')
    } catch (dbError: any) {
      console.error('[REGISTER PATIENT] Step 8 ❌: Failed to create user:', dbError)
      console.error('[REGISTER PATIENT] DB Error Details:', dbError.message)
      console.error('[REGISTER PATIENT] DB Error Code:', dbError.code)

      // Handle Prisma unique constraint violations
      if (dbError.code === 'P2002') {
        const targetField = Array.isArray(dbError.meta?.target) ? dbError.meta.target[0] : null
        console.error('[REGISTER PATIENT] Unique constraint violation on:', targetField)

        if (targetField === 'email') {
          return NextResponse.json(
            { error: 'البريد الإلكتروني مسجل مسبقاً' },
            { status: 409 }
          )
        } else if (targetField === 'phone') {
          return NextResponse.json(
            { error: 'رقم الهاتف مسجل مسبقاً' },
            { status: 409 }
          )
        }
      }

      return NextResponse.json(
        { error: 'فشل في إنشاء المستخدم: ' + dbError.message },
        { status: 500 }
      )
    }

    // Step 9: Return success response
    console.log('[REGISTER PATIENT] Step 9 ✅: Registration successful')
    console.log(`[AUTH] ✅✅✅ New patient registered: ${user.name} (${user.email})`)
    console.log('═══════════════════════════════════════')

    return NextResponse.json({
      success: true,
      message: '✅ تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
      user
    }, { status: 201 })

  } catch (error: any) {
    console.error('═══════════════════════════════════════')
    console.error('[AUTH] ❌❌❌ UNEXPECTED ERROR:')
    console.error('[AUTH] Error Message:', error.message)
    console.error('[AUTH] Error Stack:', error.stack)
    console.error('[AUTH] Error Name:', error.name)
    console.error('═══════════════════════════════════════')

    return NextResponse.json(
      {
        error: error.message || 'حدث خطأ غير متوقع أثناء التسجيل',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
