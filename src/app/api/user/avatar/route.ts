import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const avatarFile = formData.get('avatar') as File | null
    const userId = formData.get('userId') as string

    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    if (!avatarFile) {
      return NextResponse.json({ error: 'يجب اختيار صورة' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(avatarFile.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024
    if (avatarFile.size > maxSize) {
      return NextResponse.json({ error: 'حجم الصورة يجب أن يكون أقل من 5MB' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // Upload to Cloudinary
    const bytes = await avatarFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'avatars', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const avatarUrl = result.secure_url

    await db.user.update({
      where: { id: userId },
      data: { avatarUrl }
    })

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'تم تحديث صورة البروفايل بنجاح'
    })

  } catch (error: any) {
    console.error('[AVATAR] ❌ Error:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحديث الصورة' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        phone: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'حدث خطأ' },
      { status: 500 }
    )
  }
}