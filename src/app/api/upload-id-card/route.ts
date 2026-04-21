import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * API Route: رفع صورة الكارنيه للطلاب
 * Method: POST
 * Content-Type: multipart/form-data
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD ID CARD] Starting ID card upload...')

    // Parse FormData
    const formData = await request.formData()
    const file = formData.get('idCardFile') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم العثور على ملف الكارنيه' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, أو WebP' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الصورة يجب أن يكون أقل من 5MB' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'id-cards',
      resource_type: 'image',
    })

    console.log('[UPLOAD ID CARD] ✅ File uploaded successfully:', result.secure_url)
    console.log('[UPLOAD ID CARD] File size:', (file.size / 1024).toFixed(2), 'KB')

    return NextResponse.json({
      success: true,
      idCardUrl: result.secure_url,
      message: 'تم رفع صورة الكارنيه بنجاح'
    })

  } catch (error: any) {
    console.error('[UPLOAD ID CARD] ❌ Upload error:', error)
    return NextResponse.json(
      { error: 'فشل رفع صورة الكارنيه. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}