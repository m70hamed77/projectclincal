import { prisma } from '@/lib/db'
import { sendVerificationCode } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // التحقق من وجود الإيميل
    if (!email) {
      return Response.json(
        { error: 'الإيميل مطلوب' },
        { status: 400 }
      )
    }

    // 1. توليد كود عشوائي من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 2. حساب وقت انتهاء الكود (10 دقائق)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // 3. التحقق من وجود كود سابق لنفس الإيميل وتحديثه
    const existingCode = await prisma.verificationCode.findUnique({
      where: { email }
    })

    if (existingCode) {
      // تحديث الكود الموجود
      await prisma.verificationCode.update({
        where: { email },
        data: {
          code,
          expiresAt,
          used: false
        }
      })
    } else {
      // إنشاء كود جديد
      await prisma.verificationCode.create({
        data: {
          email,
          code,
          expiresAt,
          used: false
        }
      })
    }

    // 4. إرسال الكود على إيميل المستخدم
    await sendVerificationCode(email, code)

    return Response.json({
      message: 'تم إرسال كود التحقق على إيميلك',
      success: true
    })
  } catch (error: any) {
    console.error('[REGISTER ERROR]:', error)
    return Response.json(
      {
        error: 'حدث خطأ أثناء إرسال كود التحقق',
        details: error.message
      },
      { status: 500 }
    )
  }
}
