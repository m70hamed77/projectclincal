import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الصورة يجب أن يكون أقل من 5MB' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'id-cards')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `idcard_${timestamp}_${randomString}.${ext}`
    const filePath = path.join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Return the relative path (to be used with base URL)
    const relativePath = `/uploads/id-cards/${filename}`

    console.log('[UPLOAD ID CARD] ✅ File uploaded successfully:', relativePath)
    console.log('[UPLOAD ID CARD] File size:', (file.size / 1024).toFixed(2), 'KB')

    return NextResponse.json({
      success: true,
      idCardUrl: relativePath,
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
