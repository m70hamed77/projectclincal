import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract all fields from FormData
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string | null
    const password = formData.get('password') as string
    const role = formData.get('role') as 'STUDENT' | 'PATIENT'
    const carniehFile = formData.get('carniehFile') as File | null

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      )
    }

    if (password !== formData.get('confirmPassword')) {
      return NextResponse.json(
        { error: 'كلمة المرور غير متطابقة' },
        { status: 400 }
      )
    }

    // Additional validation for patients
    if (role === 'PATIENT' && !carniehFile) {
      return NextResponse.json(
        { error: 'يرجى رفع صورة الكارنيه للمرضى' },
        { status: 400 }
      )
    }

    // Password strength check for students
    if (role === 'STUDENT') {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
          { status: 400 }
        )
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json(
          { error: 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Handle carnieh file upload for patients
    let carniehImagePath: string | null = null
    if (role === 'PATIENT' && carniehFile) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'carnieh')
        await mkdir(uploadsDir, { recursive: true })
        
        // Generate unique filename
        const timestamp = Date.now()
        const ext = carniehFile.name.split('.').pop()
        const filename = `${email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${ext}`
        const filePath = path.join(uploadsDir, filename)
        
        // Convert file to buffer and save
        const bytes = await carniehFile.arrayBuffer()
        await writeFile(filePath, Buffer.from(bytes))
        
        // Store path relative to public directory
        carniehImagePath = `/uploads/carnieh/${filename}`
        
        console.log('✅ Carnieh uploaded:', carniehImagePath)
      } catch (error) {
        console.error('Error uploading carnieh:', error)
        return NextResponse.json(
          { error: 'فشل رفع الكارنيه، يرجى المحاولة بصورة أخرى' },
          { status: 500 }
        )
      }
    }

    // Determine status based on role
    const status = role === 'STUDENT' ? 'ACTIVE' : 'PENDING'

    // Create user in database
    const user = await db.user.create({
      data: {
        email,
        password, // Note: In production, hash this with bcrypt!
        name: `${firstName} ${lastName}`,
        phone: phone || null,
        role: role,
        status,
      },
    })

    console.log('✅ User registered:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      hasCarnieh: !!carniehImagePath,
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: role === 'STUDENT' 
        ? 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدأ في استخدام المنصة.'
        : 'تم استلام طلبك بنجاح! سيتم مراجعة بياناتك والكارنيه من قبل الإدارة، وسيتم تفعيل الحساب فوراً.',
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
      { error: 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    )
  }
}
