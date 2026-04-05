/**
 * دالة للتحقق من قوة كلمة المرور
 * الشروط المطلوبة:
 * 1. حروف صغيرة (a-z)
 * 2. حروف كبيرة (A-Z)
 * 3. أرقام (0-9)
 * 4. رموز خاصة (!@#$%^&*)
 * 5. 8 أحرف على الأقل
 */

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  // التحقق من الطول (8 أحرف على الأقل)
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  }

  // التحقق من وجود حروف صغيرة
  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حروف صغيرة (a-z)')
  }

  // التحقق من وجود حروف كبيرة
  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حروف كبيرة (A-Z)')
  }

  // التحقق من وجود أرقام
  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على أرقام (0-9)')
  }

  // التحقق من وجود رموز خاصة
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رموز خاصة (!@#$%^&*)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * دالة للتحقق من قوة كلمة المرور مع إرجاع النقاط
 */
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  checks: {
    hasMinLength: boolean
    hasLowerCase: boolean
    hasUpperCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
} {
  const checks = {
    hasMinLength: password.length >= 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  let label = 'ضعيفة جداً'
  let color = 'bg-red-500'

  if (score >= 5) {
    label = 'قوية جداً'
    color = 'bg-emerald-500'
  } else if (score >= 4) {
    label = 'قوية'
    color = 'bg-emerald-400'
  } else if (score >= 3) {
    label = 'متوسطة'
    color = 'bg-amber-400'
  } else if (score >= 2) {
    label = 'ضعيفة'
    color = 'bg-orange-400'
  }

  return { score, label, color, checks }
}
