import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword, userId } = body

    // التحقق من وجود بيانات
    if (!currentPassword || !newPassword || !userId) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من طول كلمة المرور الجديدة
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // جلب المستخدم من قاعدة البيانات
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true, name: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من كلمة المرور الحالية
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 401 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // تحديث كلمة المرور في قاعدة البيانات
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    })
  } catch (error) {
    console.error('[Change Password] Error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    )
  }
}
