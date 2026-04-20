import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract all form data
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as 'STUDENT' | 'PATIENT'
    const verificationCode = formData.get('verificationCode') as string
    const carniehFile = formData.get('carniehFile') as File | null

    // Basic validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'الاسم الأول والاسم الأخير مطلوبين' },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو رقم الهاتف مطلوب' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور مطلوبة' },
        { status: 400 }
      )
    }

    if (!role || (role !== 'STUDENT' && role !== 'PATIENT')) {
      return NextResponse.json(
        { success: false, error: 'نوع المستخدم غير صالح' },
        { status: 400 }
      )
    }

    // Patient-specific validation
    if (role === 'PATIENT') {
      if (!carniehFile) {
        return NextResponse.json(
          { success: false, error: 'صورة الكارنيه مطلوبة للمرضى' },
          { status: 400 }
        )
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      if (!allowedTypes.includes(carniehFile.type)) {
        return NextResponse.json(
          { success: false, error: 'نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WEBP)' },
          { status: 400 }
        )
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (carniehFile.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' },
          { status: 400 }
        )
      }
    }

    // Student-specific validation (password strength)
    if (role === 'STUDENT') {
      let strengthScore = 0
      if (password.length >= 8) strengthScore++
      if (password.length >= 12) strengthScore++
      if (/[A-Z]/.test(password)) strengthScore++
      if (/[a-z]/.test(password)) strengthScore++
      if (/[0-9]/.test(password)) strengthScore++
      if (/[^A-Za-z0-9]/.test(password)) strengthScore++

      if (strengthScore < 4) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور ضعيفة. يرجى استخدام 8+ أحرف مع حروف كبيرة وصغيرة وأرقام ورموز خاصة' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: email || '' },
          { phone: phone || '' },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'هذا البريد أو الهاتف مسجل بالفعل' },
        { status: 400 }
      )
    }

    // Handle carnieh file upload
    let carniehImageUrl: string | null = null
    if (carniehFile && role === 'PATIENT') {
      // In production, you would upload to a cloud service like Cloudinary, AWS S3, etc.
      // For now, we'll save it as base64 to the database
      const bytes = await carniehFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      carniehImageUrl = `data:${carniehFile.type};base64,${buffer.toString('base64')}`
    }

    // Determine status based on role
    const status = role === 'STUDENT' ? 'ACTIVE' : 'PENDING'

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        phone: phone || null,
        password, // In production, hash this password with bcrypt!
        role,
        status,
      },
    })

    // Create corresponding profile
    if (role === 'STUDENT') {
      await db.student.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === 'PATIENT') {
      await db.patient.create({
        data: {
          userId: user.id,
        },
      })
    }

    console.log('='.repeat(60))
    console.log('✅ NEW USER REGISTRATION')
    console.log('='.repeat(60))
    console.log(`Role: ${role}`)
    console.log(`Name: ${firstName} ${lastName}`)
    console.log(`Email: ${email}`)
    console.log(`Phone: ${phone}`)
    console.log(`Status: ${status}`)
    console.log(`Has Carnieh: ${!!carniehImageUrl}`)
    console.log('='.repeat(60))

    const message = 
      role === 'STUDENT'
        ? 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.'
        : 'تم تقديم طلبك بنجاح! سيتم مراجعته من قبل الإدارة وستُخطر بنتيجة عبر البريد/الهاتف.'

    return NextResponse.json({
      success: true,
      message,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}
