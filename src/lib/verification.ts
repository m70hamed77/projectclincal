import crypto from 'crypto'
import { db } from './db'
import { sendVerificationCode } from './email'

/**
 * توليد كود تحقق عشوائي من 4 أرقام
 */
export function generateVerificationCode(): string {
  // توليد رقم عشوائي بين 1000 و 9999
  const min = 1000
  const max = 9999
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

/**
 * تخزين كود التحقق في قاعدة البيانات وإرساله للإيميل
 */
export async function createAndSendVerificationCode(
  email: string,
  name?: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // توليد كود جديد
    const code = generateVerificationCode()

    // حساب وقت انتهاء الصلاحية (10 دقائق من الآن)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // حذف أي كود قديم لنفس الإيميل
    await db.verificationCode.deleteMany({
      where: { email }
    })

    // حفظ الكود الجديد في قاعدة البيانات
    await db.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
        used: false
      }
    })

    // إرسال الكود عبر الإيميل
    await sendVerificationCode(email, code, name)

    console.log(`[VERIFICATION CODE] Created and sent for ${email}: ${code}`)

    return { success: true, code }
  } catch (error: any) {
    console.error('[VERIFICATION CODE ERROR]:', error)
    return { success: false, error: error.message }
  }
}

/**
 * التحقق من صحة الكود
 */
export async function verifyCode(
  email: string,
  inputCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // البحث عن الكود في قاعدة البيانات
    const verificationRecord = await db.verificationCode.findUnique({
      where: { email }
    })

    // التحقق من وجود الكود
    if (!verificationRecord) {
      return { success: false, error: 'لم يتم العثور على كود تحقق. يرجى طلب كود جديد.' }
    }

    // التحقق من أن الكود لم يتم استخدامه
    if (verificationRecord.used) {
      return { success: false, error: 'هذا الكود تم استخدامه من قبل. يرجى طلب كود جديد.' }
    }

    // التحقق من صلاحية الكود (لم ينتهِ)
    if (verificationRecord.expiresAt < new Date()) {
      return { success: false, error: 'هذا الكود منتهي الصلاحية. يرجى طلب كود جديد.' }
    }

    // التحقق من تطابق الكود
    if (verificationRecord.code !== inputCode) {
      return { success: false, error: 'كود التحقق غير صحيح. يرجى المحاولة مرة أخرى.' }
    }

    // تحديث الكود ليكون مستخدماً
    await db.verificationCode.update({
      where: { email },
      data: { used: true }
    })

    console.log(`[VERIFICATION CODE] Verified successfully for ${email}`)

    return { success: true }
  } catch (error: any) {
    console.error('[VERIFICATION ERROR]:', error)
    return { success: false, error: error.message }
  }
}

/**
 * التحقق مما إذا كان هناك كود صالح لهذا الإيميل
 */
export async function hasValidCode(email: string): Promise<boolean> {
  try {
    const verificationRecord = await db.verificationCode.findUnique({
      where: { email }
    })

    if (!verificationRecord) return false
    if (verificationRecord.used) return false
    if (verificationRecord.expiresAt < new Date()) return false

    return true
  } catch (error) {
    console.error('[CHECK VALID CODE ERROR]:', error)
    return false
  }
}
