// تخزين الأكواد في الذاكرة (في الإنتاج، استخدم قاعدة البيانات أو Redis)
const verificationCodes = new Map<string, { code: string; expiresAt: number; phone: string }>()

/**
 * دالة مساعدة للحصول على الكود المخزن
 */
export function getSMSVerificationCode(phone: string): string | null {
  const stored = verificationCodes.get(phone)
  if (!stored) return null

  // التحقق من عدم انتهاء صلاحية الكود
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(phone)
    return null
  }

  return stored.code
}

/**
 * دالة مساعدة لحذف الكود
 */
export function deleteSMSVerificationCode(phone: string): void {
  verificationCodes.delete(phone)
}

/**
 * دالة مساعدة لحفظ كود تحقق جديد
 */
export function saveSMSVerificationCode(phone: string, code: string, expiryMinutes: number = 10): void {
  verificationCodes.set(phone, {
    code,
    expiresAt: Date.now() + expiryMinutes * 60 * 1000,
    phone,
  })
}
