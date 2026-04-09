import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { notifyAdminNewStudent } from '@/lib/notifications'

/**
 * API Route: تسجيل طالب جديد مع كود التحقق
 * Method: POST
 * Body: { email, password, name, verificationCode, universityEmail?, universityName?, ... }
 */
export async function POST(request: NextRequest) {
  console.log('═══════════════════════════════════════')
  console.log('[REGISTER STUDENT] Starting student registration with verification...')
  console.log('═══════════════════════════════════════')

  try {
    // Step 1: Parse request body
    let body
    let email, password, name, verificationCode, phone, address
    let universityEmail, universityName, studentIdNumber, academicYear, specialization, collegeName, collegeAddress, bio, city, idCardUrl

    try {
      body = await request.json()
      email = body.email
      password = body.password
      name = body.name
      verificationCode = body.verificationCode
      phone = body.phone
      address = body.address
      universityEmail = body.universityEmail
      universityName = body.universityName
      studentIdNumber = body.studentIdNumber
      academicYear = body.academicYear
      specialization = body.specialization
      collegeName = body.collegeName
      collegeAddress = body.collegeAddress
      bio = body.bio
      city = body.city
      idCardUrl = body.idCardUrl

      console.log('[REGISTER STUDENT] Step 1 ✅: Parsed request body')
      console.log('[REGISTER STUDENT] Email:', email?.substring(0, 20) + '...')
      console.log('[REGISTER STUDENT] Name:', name)
      console.log('[REGISTER STUDENT] Phone:', phone)
      console.log('[REGISTER STUDENT] City:', city)
      console.log('[REGISTER STUDENT] Academic Year:', academicYear)
      console.log('[REGISTER STUDENT] ID Card URL:', idCardUrl ? 'Present' : 'Not provided')
      console.log('[REGISTER STUDENT] Verification Code:', verificationCode)
    } catch (parseError: any) {
      console.error('[REGISTER STUDENT] Step 1 ❌: Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'فشل في قراءة البيانات' }, { status: 400 })
    }

    // Step 2: Validate required fields
    if (!email || !password || !name || !verificationCode || !phone || !address || !universityName) {
      console.log('[REGISTER STUDENT] Step 2 ❌: Missing required fields')
      return NextResponse.json({
        error: 'جميع الحقول مطلوبة'
      }, { status: 400 })
    }
    console.log('[REGISTER STUDENT] Step 2 ✅: Fields validated')

    // Step 3: Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      console.log('[REGISTER STUDENT] Step 3 ❌: Invalid email format')
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 })
    }

    // Step 3.5: Validate phone format
    if (!/^01[0125][0-9]{8}$/.test(phone.trim())) {
      console.log('[REGISTER STUDENT] Step 3.5 ❌: Invalid phone format')
      return NextResponse.json({ error: 'رقم الهاتف غير صحيح' }, { status: 400 })
    }

    // Step 4: Verify the verification code BEFORE validating password
    // This ensures code errors are shown instead of password errors
    try {
      console.log('[REGISTER STUDENT] Step 4: Verifying code...')

      const verificationRecord = await db.verificationCode.findUnique({
        where: { email: email.trim().toLowerCase() }
      })

      if (!verificationRecord) {
        console.log('[REGISTER STUDENT] Step 4 ❌: No verification code found')
        return NextResponse.json({
          error: 'لم يتم العثور على كود تحقق. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.used) {
        console.log('[REGISTER STUDENT] Step 4 ❌: Code already used')
        return NextResponse.json({
          error: 'هذا الكود تم استخدامه من قبل. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.expiresAt < new Date()) {
        console.log('[REGISTER STUDENT] Step 4 ❌: Code expired')
        return NextResponse.json({
          error: 'انتهت صلاحية كود التحقق. يرجى طلب كود جديد.'
        }, { status: 400 })
      }

      if (verificationRecord.code !== verificationCode) {
        console.log('[REGISTER STUDENT] Step 4 ❌: Invalid code')
        return NextResponse.json({
          error: 'كود التحقق غير صحيح. يرجى المحاولة مرة أخرى.'
        }, { status: 400 })
      }

      console.log('[REGISTER STUDENT] Step 4 ✅: Verification code validated')
    } catch (verifyError: any) {
      console.error('[REGISTER STUDENT] Step 4 ❌: Verification error:', verifyError)
      return NextResponse.json({
        error: 'خطأ في التحقق من الكود'
      }, { status: 500 })
    }

    // Step 5: Validate password strength
    const passwordValidation = await import('@/lib/password').then(m => m.validatePasswordStrength(password))
    if (!passwordValidation.valid) {
      console.log('[REGISTER STUDENT] Step 5 ❌: Password too weak:', passwordValidation.message)
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }
    console.log('[REGISTER STUDENT] Step 5 ✅: Password validated')

    // Step 6: Check if user already exists (AFTER verifying code to prevent giving hints about codes)
    try {
      console.log('[REGISTER STUDENT] Step 6: Checking if user already exists...')
      const existingUser = await db.user.findUnique({
        where: { email: email.trim().toLowerCase() }
      })

      if (existingUser) {
        console.log('[REGISTER STUDENT] Step 6 ❌: Email already registered')
        return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 409 })
      }

      // Check if university email already exists (if provided)
      if (universityEmail) {
        const existingUniversityEmail = await db.student.findUnique({
          where: { universityEmail: universityEmail.trim().toLowerCase() }
        })
        if (existingUniversityEmail) {
          console.log('[REGISTER STUDENT] Step 6 ❌: University email already registered')
          return NextResponse.json({
            error: 'البريد الجامعي مسجل مسبقاً'
          }, { status: 409 })
        }
      }

      // Check if phone number already exists
      const existingPhone = await db.user.findFirst({
        where: { phone: phone.trim() }
      })
      if (existingPhone) {
        console.log('[REGISTER STUDENT] Step 6 ❌: Phone already registered')
        return NextResponse.json({ error: 'رقم الهاتف مسجل مسبقاً' }, { status: 409 })
      }

      console.log('[REGISTER STUDENT] Step 6 ✅: Email, phone, and university email are available')
    } catch (dbError: any) {
      console.error('[REGISTER STUDENT] Step 6 ❌: Database error:', dbError)
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات: ' + dbError.message },
        { status: 500 }
      )
    }

    // Step 7: Hash password
    let hashedPassword
    try {
      console.log('[REGISTER STUDENT] Step 7: Hashing password...')
      hashedPassword = await hashPassword(password)
      console.log('[REGISTER STUDENT] Step 7 ✅: Password hashed')
    } catch (hashError: any) {
      console.error('[REGISTER STUDENT] Step 7 ❌: Failed to hash password:', hashError)
      return NextResponse.json({ error: 'فشل في تشفير كلمة المرور' }, { status: 500 })
    }

    // Step 8: Create user and student in a transaction
    let user
    try {
      console.log('[REGISTER STUDENT] Step 8: Creating user and student...')

      await db.$transaction(async (tx) => {
        // Create user with PENDING status (requires admin approval)
        user = await tx.user.create({
          data: {
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            name: name.trim(),
            role: 'STUDENT',
            status: 'PENDING',
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

        // Create student profile
        await tx.student.create({
          data: {
            userId: user.id,
            universityEmail: universityEmail ? universityEmail.trim().toLowerCase() : null,
            universityName: universityName || null,
            studentIdNumber: studentIdNumber || null,
            academicYear: academicYear ? parseInt(academicYear.toString()) : null,
            specialization: specialization || null,
            collegeName: collegeName || null,
            collegeAddress: collegeAddress || null,
            bio: bio || null,
            idCardUrl: idCardUrl || null,
            location: address || null,
            city: city || null,
            address: address || null,
            verificationStatus: 'PENDING',
            isVerified: false
          }
        })

        // Mark verification code as used
        await tx.verificationCode.update({
          where: { email: email.trim().toLowerCase() },
          data: { used: true }
        })
      })

      console.log('[REGISTER STUDENT] Step 8 ✅: User and student created')
      console.log('[REGISTER STUDENT] User ID:', user.id)
      console.log('[REGISTER STUDENT] User Role:', user.role)
      console.log('[REGISTER STUDENT] User Status:', user.status)
    } catch (dbError: any) {
      console.error('[REGISTER STUDENT] Step 8 ❌: Failed to create user:', dbError)
      console.error('[REGISTER STUDENT] DB Error Details:', dbError.message)
      console.error('[REGISTER STUDENT] DB Error Code:', dbError.code)

      // Handle Prisma unique constraint violations
      if (dbError.code === 'P2002') {
        const targetField = Array.isArray(dbError.meta?.target) ? dbError.meta.target[0] : null
        console.error('[REGISTER STUDENT] Unique constraint violation on:', targetField)

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

    // Step 9: Notify admins about new student
    try {
      console.log('[REGISTER STUDENT] Step 9: Notifying admins about new student...')
      await notifyAdminNewStudent(user.id, user.name, user.email)
      console.log('[REGISTER STUDENT] Step 9 ✅: Admins notified')
    } catch (notifyError) {
      console.error('[REGISTER STUDENT] Step 9 ⚠️: Failed to notify admins:', notifyError)
      // Don't fail the registration if notification fails
    }

    // Step 10: Return success response
    console.log('[REGISTER STUDENT] Step 10 ✅: Registration successful')
    console.log(`[AUTH] ✅✅✅ New student registered: ${user.name} (${user.email})`)
    console.log('═══════════════════════════════════════')

    return NextResponse.json({
      success: true,
      message: '✅ تم استلام طلبك بنجاح! حسابك الآن قيد المراجعة من قبل الإدارة. سيتم تفعيل حسابك قريباً بعد الموافقة.',
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
