import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { hashPassword } from '@/lib/auth'
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRole
} from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, role } = body

    console.log('[AUTH] 📝 Simple Register attempt for email:', email)
    console.log('[AUTH] 📦 Request body:', { name, email, role, phone, passwordProvided: !!password })

    // Validate name
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      console.log('[AUTH] ❌ Name validation failed:', nameValidation.message)
      return NextResponse.json(
        { error: nameValidation.message, field: 'name' },
        { status: 400 }
      )
    }

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      console.log('[AUTH] ❌ Email validation failed:', emailValidation.message)
      return NextResponse.json(
        { error: emailValidation.message, field: 'email' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log('[AUTH] ❌ Password validation failed:', passwordValidation.message)
      return NextResponse.json(
        { error: passwordValidation.message, field: 'password' },
        { status: 400 }
      )
    }

    // Validate phone (required)
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
      console.log('[AUTH] ❌ Phone validation failed:', phoneValidation.message)
      return NextResponse.json(
        { error: phoneValidation.message, field: 'phone' },
        { status: 400 }
      )
    }

    // Validate role
    const roleValidation = validateRole(role)
    if (!roleValidation.valid) {
      console.log('[AUTH] ❌ Role validation failed:', roleValidation.message)
      return NextResponse.json(
        { error: roleValidation.message, field: 'role' },
        { status: 400 }
      )
    }

    // التحقق من وجود الإيميل مسبقاً
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('[AUTH] ❌ Email already exists')
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password)
    console.log('[AUTH] 🔐 Password hashed successfully')

    // إنشاء المستخدم الجديد
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone, // Phone is required now
        role: role === 'STUDENT' ? UserRole.STUDENT : UserRole.PATIENT,
        status: 'ACTIVE', // الحساب نشط فوراً
        emailVerified: new Date(), // الإيميل موثق فوراً
      }
    })

    // إنشاء البروفايل حسب النوع
    if (role === 'STUDENT') {
      await db.student.create({
        data: {
          userId: user.id,
          isVerified: false,
        }
      })
    } else {
      await db.patient.create({
        data: {
          userId: user.id,
        }
      })
    }

    console.log(`[AUTH] ✅ User created successfully: ${user.name} (${user.email}) as ${user.role}`)

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        createdAt: user.createdAt,
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('[AUTH] ❌ Register error:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    )
  }
}
