// نظام OTP لوضع التطوير (Development Mode)
// يولد كود عشوائي كل مرة ويظهر في Console

interface OtpSession {
  code: string
  email?: string
  phone?: string
  createdAt: number
  expiresAt: number
  attempts: number
}

// تخزين الـ OTPsessions مؤقتاً (في وضع التطوير نستخدم Map)
const otpSessions = new Map<string, OtpSession>()

/**
 * توليد كود OTP جديد من 6 أرقام
 * @param identifier - البريد الإلكتروني أو رقم الهاتف
 * @returns الكود المولد
 */
export function generateOtp(identifier: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // حذف أي كود سابق لنفس المستخدم
  otpSessions.delete(identifier)

  // إنشاء جلسة جديدة
  const session: OtpSession = {
    code,
    email: identifier.includes('@') ? identifier : undefined,
    phone: !identifier.includes('@') ? identifier : undefined,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 دقائق
    attempts: 0,
  }

  otpSessions.set(identifier, session)

  // طباعة الكود في Console مع تنسيق واضح
  console.log('\n' + '='.repeat(60))
  console.log('🔐 [DEV OTP] - وضع التطوير')
  console.log('='.repeat(60))
  console.log(`📱 الهدف: ${identifier}`)
  console.log(`🔑 كود التحقق: ${code}`)
  console.log(`⏰ صالح حتى: ${new Date(session.expiresAt).toLocaleTimeString('ar-EG')}`)
  console.log(`⏳ المدة المتبقية: 10 دقائق`)
  console.log('='.repeat(60) + '\n')

  return code
}

/**
 * التحقق من كود OTP
 * @param identifier - البريد الإلكتروني أو رقم الهاتف
 * @param inputCode - الكود المدخل من المستخدم
 * @returns { success: boolean, message: string }
 */
export function verifyOtp(identifier: string, inputCode: string): { success: boolean; message: string } {
  const session = otpSessions.get(identifier)

  // لا توجد جلسة OTP
  if (!session) {
    console.log(`[DEV OTP] ❌ لا توجد جلسة OTP لـ: ${identifier}`)
    return { success: false, message: 'انتهت صلاحية الكود، يرجى إرسال كود جديد' }
  }

  // الكود منتهي
  if (Date.now() > session.expiresAt) {
    console.log(`[DEV OTP] ❌ انتهت صلاحية الكود لـ: ${identifier}`)
    otpSessions.delete(identifier)
    return { success: false, message: 'انتهت صلاحية الكود (10 دقائق)، يرجى إرسال كود جديد' }
  }

  // عدد المحاولات الزائدة
  if (session.attempts >= 5) {
    console.log(`[DEV OTP] ❌ تم تجاوز الحد الأقصى من المحاولات لـ: ${identifier}`)
    otpSessions.delete(identifier)
    return { success: false, message: 'تم تجاوز الحد الأقصى من المحاولات، يرجى إرسال كود جديد' }
  }

  // تحديث عدد المحاولات
  session.attempts++

  // الكود صحيح
  if (inputCode === session.code) {
    console.log(`[DEV OTP] ✅ تم التحقق بنجاح لـ: ${identifier}`)
    console.log(`[DEV OTP] 📊 عدد المحاولات: ${session.attempts}`)
    otpSessions.delete(identifier) // حذف الجلسة بعد التحقق الناجح
    return { success: true, message: 'تم التحقق بنجاح!' }
  }

  // الكود خطأ
  console.log(`[DEV OTP] ❌ الكود خطأ (محاولة ${session.attempts}/5) لـ: ${identifier}`)
  console.log(`[DEV OTP] 🔑 الكود الصحيح: ${session.code}`)
  return {
    success: false,
    message: `الكود غير صحيح. المتبقي ${5 - session.attempts} محاولات`
  }
}

/**
 * الحصول على الكود الموجود (للـ debug)
 * @param identifier - البريد الإلكتروني أو رقم الهاتف
 * @returns الكود الموجود أو null
 */
export function getCurrentOtp(identifier: string): string | null {
  const session = otpSessions.get(identifier)
  if (!session || Date.now() > session.expiresAt) {
    return null
  }
  return session.code
}

/**
 * حذف جلسة OTP
 * @param identifier - البريد الإلكتروني أو رقم الهاتف
 */
export function deleteOtpSession(identifier: string): void {
  console.log(`[DEV OTP] 🗑️ حذف جلسة OTP لـ: ${identifier}`)
  otpSessions.delete(identifier)
}

/**
 * الحصول على معلومات الجلسة
 * @param identifier - البريد الإلكتروني أو رقم الهاتف
 * @returns معلومات الجلسة أو null
 */
export function getOtpSessionInfo(identifier: string): OtpSession | null {
  const session = otpSessions.get(identifier)
  if (!session || Date.now() > session.expiresAt) {
    return null
  }
  return { ...session }
}

/**
 * تنظيف الجلسات المنتهية (يمكن استدعاؤه بشكل دوري)
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now()
  let cleaned = 0

  for (const [identifier, session] of otpSessions.entries()) {
    if (now > session.expiresAt) {
      otpSessions.delete(identifier)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`[DEV OTP] 🧹 تم تنظيف ${cleaned} جلسة منتهية`)
  }
}
