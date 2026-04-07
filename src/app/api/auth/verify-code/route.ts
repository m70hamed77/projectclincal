import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكود التحقق مطلوبين' }, { status: 400 })
    }

    console.log('[VERIFY CODE] Verifying code for:', email)

    // البحث عن الكود في قاعدة البيانات
    const verificationCode = await db.verificationCode.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!verificationCode) {
      console.log('[VERIFY CODE] No code found for email:', email)
      return NextResponse.json({ error: 'لم يتم العثور على كود تحقق لهذا البريد الإلكتروني' }, { status: 404 })
    }

    // التحقق من أن الكود غير مستخدم
    if (verificationCode.used) {
      console.log('[VERIFY CODE] Code already used')
      return NextResponse.json({ error: 'تم استخدام هذا الكود من قبل' }, { status: 400 })
    }

    // التحقق من أن الكود لم ينتهِ صلاحيته
    if (new Date() > verificationCode.expiresAt) {
      console.log('[VERIFY CODE] Code expired')
      // حذف الكود المنتهي
      await db.verificationCode.delete({
        where: { email: email.toLowerCase() }
      })
      return NextResponse.json({ error: 'انتهت صلاحية كود التحقق' }, { status: 400 })
    }

    // التحقق من صحة الكود
    if (verificationCode.code !== code) {
      console.log('[VERIFY CODE] Invalid code')
      return NextResponse.json({ error: 'كود التحقق غير صحيح' }, { status: 400 })
    }

    // الكود صحيح! نحدده كمستخدم
    await db.verificationCode.update({
      where: { email: email.toLowerCase() },
      data: { used: true }
    })

    console.log('[VERIFY CODE] Code verified successfully')

    return NextResponse.json({
      success: true,
      message: 'تم التحقق من الكود بنجاح'
    })

  } catch (error: any) {
    console.error('[VERIFY CODE ERROR]:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء التحقق من الكود' },
      { status: 500 }
    )
  }
}
