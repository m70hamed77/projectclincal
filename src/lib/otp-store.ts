// 🔐 OTP Store System (في وضع التطوير)
// يتم تخزين أكواد التحقق مؤقتاً في الذاكرة

type OTPRecord = {
  code: string
  verified: boolean
  createdAt: number
}

// مخزن الأكواد (في الذاكرة)
const otpStore: Record<string, OTPRecord> = {}

// تنظيف الأكواد القديمة (أكثر من 10 دقائق)
function cleanupOldCodes() {
  const now = Date.now()
  const TEN_MINUTES = 10 * 60 * 1000

  Object.keys(otpStore).forEach(key => {
    if (now - otpStore[key].createdAt > TEN_MINUTES) {
      delete otpStore[key]
      console.log(`🧹 Cleaned up expired OTP for: ${key}`)
    }
  })
}

// تشغيل التنظيف كل دقيقة
setInterval(cleanupOldCodes, 60 * 1000)

/**
 * إرسال كود التحقق (يظهر في Console فقط)
 */
export function sendVerificationCode(target: string): { success: boolean; message: string; code?: string } {
  // توليد كود عشوائي من 6 أرقام
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // حفظ الكود
  otpStore[target] = {
    code,
    verified: false,
    createdAt: Date.now()
  }

  // عرض الكود في Console للمطورين
  console.log('==============================')
  console.log('🔐 OTP Verification Code')
  console.log(`📩 Target: ${target}`)
  console.log(`🔑 Code: ${code}`)
  console.log(`⏰ Valid for: 10 minutes`)
  console.log('==============================')

  return {
    success: true,
    message: 'تم إرسال كود التحقق (تحقق من الـ Console)',
    code // نعيد الكود للعرض في التنبيهات (للتطوير فقط)
  }
}

/**
 * إعادة إرسال كود التحقق (يولد كود جديد)
 */
export function resendVerificationCode(target: string): { success: boolean; message: string } {
  if (!otpStore[target]) {
    return {
      success: false,
      message: 'لم يتم العثور على طلب تحقق سابق'
    }
  }

  // إرسال كود جديد (يستبدل القديم)
  const result = sendVerificationCode(target)
  return {
    success: true,
    message: 'تم إرسال كود تحقق جديد (تحقق من الـ Console)'
  }
}

/**
 * التحقق من الكود
 */
export function verifyCode(target: string, inputCode: string): { success: boolean; message: string } {
  const record = otpStore[target]

  if (!record) {
    return {
      success: false,
      message: 'لم يتم إرسال كود تحقق بعد'
    }
  }

  // التحقق من انتهاء صلاحية الكود
  const now = Date.now()
  const TEN_MINUTES = 10 * 60 * 1000
  if (now - record.createdAt > TEN_MINUTES) {
    delete otpStore[target]
    return {
      success: false,
      message: 'انتهت صلاحية كود التحقق، يرجى طلب كود جديد'
    }
  }

  if (record.code !== inputCode) {
    return {
      success: false,
      message: '❌ كود التحقق غير صحيح'
    }
  }

  // تحديد الحساب كموثق
  record.verified = true

  console.log(`✅ OTP Verified for: ${target}`)

  return {
    success: true,
    message: '🎉 تم التحقق بنجاح'
  }
}

/**
 * التحقق من أن البريد/الهاتف موثق قبل إنشاء الحساب
 */
export function isVerified(target: string): boolean {
  const record = otpStore[target]
  return record?.verified === true
}

/**
 * حذف الكود بعد إنشاء الحساب
 */
export function clearOTP(target: string): void {
  delete otpStore[target]
  console.log(`🗑️ Cleared OTP for: ${target}`)
}

/**
 * الحصول على معلومات الكود (للتصحيح)
 */
export function getOTPInfo(target: string): OTPRecord | null {
  return otpStore[target] || null
}
