import { NextRequest, NextResponse } from 'next/server'

// تخزين الأكواد المؤقتة في الذاكرة (في الإنتاج، استخدم Redis)
const otpStore = new Map<string, { code: string; expiresAt: number; type: 'email' | 'phone' }>()

// صلاحية الكود: 5 دقائق
const OTP_EXPIRY = 5 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, value } = body // type = 'email' | 'phone', value = email or phone number

    // التحقق من البيانات
    if (!type || !value) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    if (type !== 'email' && type !== 'phone') {
      return NextResponse.json(
        { error: 'نوع التحقق غير صالح' },
        { status: 400 }
      )
    }

    // التحقق من صحة البيانات
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }

    if (type === 'phone' && !/^01[0-9]{9}$/.test(value)) {
      return NextResponse.json(
        { error: 'رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01' },
        { status: 400 }
      )
    }

    // توليد كود OTP عشوائي من 6 أرقام
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + OTP_EXPIRY

    // تخزين الكود
    otpStore.set(value, { code: otp, expiresAt, type })

    // عرض الكود في Console (للتجربة) - إضافة تنسيق
    console.log('\n' + '='.repeat(70))
    console.log('🔐 VERIFICATION CODE SENT')
    console.log('='.repeat(70))
    console.log(`📧 Type: ${type.toUpperCase()}`)
    console.log(`📱 Contact: ${value}`)
    console.log(`🔑 Code: ${otp}`)
    console.log(`⏰ Expires: ${new Date(expiresAt).toLocaleString('ar-EG')}`)
    console.log(`📍 IP: ${request.headers.get('x-forwarded-for') || 'Unknown'}`)
    console.log('='.repeat(70) + '\n')

    // TODO: إرسال الكود عبر البريد الإلكتروني أو SMS في الإنتاج

    return NextResponse.json({
      success: true,
      message: 'تم إرسال كود التحقق بنجاح',
      // في الإنتاج، لا ترجع الكود هنا
      devCode: otp, // للتجربة فقط
    })
  } catch (error) {
    console.error('[Send OTP] Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال كود التحقق' },
      { status: 500 }
    )
  }
}

// دالة مساعدة للتحقق من الكود (ستستخدمها في verify-otp)
export function verifyOtpValue(value: string, code: string): boolean {
  const stored = otpStore.get(value)

  if (!stored) {
    return false
  }

  // التحقق من انتهاء الصلاحية
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(value)
    return false
  }

  // التحقق من الكود
  if (stored.code !== code) {
    return false
  }

  // الكود صحيح - حذفه
  otpStore.delete(value)
  return true
}
