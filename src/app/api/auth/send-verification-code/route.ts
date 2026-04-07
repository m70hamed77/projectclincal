import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendVerificationCode } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    console.log('[VERIFICATION] Sending verification code to:', email)

    // توليد كود تحقق عشوائي من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // حساب وقت انتهاء الصلاحية (5 دقائق من الآن)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // حذف أي كود قديم لنفس الإيميل
    await db.verificationCode.deleteMany({
      where: { email: email.toLowerCase() }
    })

    // حفظ الكود الجديد في قاعدة البيانات
    await db.verificationCode.create({
      data: {
        email: email.toLowerCase(),
        code,
        expiresAt,
        used: false
      }
    })

    console.log('[VERIFICATION] Code saved to database for:', email.toLowerCase())

    // إرسال الإيميل فعلياً
    await sendVerificationCode(email, code, name)

    console.log('[VERIFICATION] Email sent successfully')

    return NextResponse.json({
      success: true,
      message: 'تم إرسال كود التحقق إلى بريدك الإلكتروني'
    })

  } catch (error: any) {
    console.error('[VERIFICATION ERROR]:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء إرسال كود التحقق' },
      { status: 500 }
    )
  }
}
