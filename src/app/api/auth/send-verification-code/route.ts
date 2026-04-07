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

    // 🚫 التحقق من أن الإيميل غير مسجل مسبقاً
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      console.log('[VERIFICATION] Email already registered:', email)

      // رسالة مخصصة حسب حالة المستخدم
      if (existingUser.role === 'STUDENT' && existingUser.status === 'PENDING') {
        return NextResponse.json({
          error: 'هذا الإيميل مسجل بالفعل وحسابك قيد المراجعة من الإدارة. يرجى تسجيل الدخول لمعرفة حالة حسابك.'
        }, { status: 400 })
      } else if (existingUser.status === 'ACTIVE') {
        return NextResponse.json({
          error: 'هذا الإيميل مسجل بالفعل. إذا كنت صاحب الحساب، يرجى تسجيل الدخول بدلاً من إنشاء حساب جديد.'
        }, { status: 400 })
      } else {
        return NextResponse.json({
          error: 'هذا الإيميل مسجل بالفعل في النظام. يرجى استخدام إيميل مختلف أو تسجيل الدخول.'
        }, { status: 400 })
      }
    }

    // توليد كود تحقق عشوائي من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // حساب وقت انتهاء الصلاحية (5 دقائق من الآن)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // حفظ الكود الجديد في قاعدة البيانات باستخدام upsert
    await db.verificationCode.upsert({
      where: { email: email.toLowerCase() },
      update: {
        code,
        expiresAt,
        used: false
      },
      create: {
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
