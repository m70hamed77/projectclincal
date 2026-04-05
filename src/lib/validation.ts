/**
 * Comprehensive Validation Utilities
 * Arabic-friendly validation messages for all form fields
 */

export interface ValidationResult {
  valid: boolean
  message: string
}

/**
 * Validates name fields (first name, last name, full name)
 * - Only letters (A-Z, a-z) - English only
 * - Spaces allowed for separation between first and last name
 * - No numbers, special characters, or non-English letters
 * - Required
 */
export function validateName(name: string, fieldName: string = 'الاسم'): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      message: `${fieldName} مطلوب ولا يمكن تركه فارغاً`
    }
  }

  // Only English letters and spaces allowed, at least 2 characters
  const nameRegex = /^[A-Za-z\s]{2,}$/

  if (!nameRegex.test(name.trim())) {
    return {
      valid: false,
      message: `${fieldName} يجب أن يحتوي على حروف إنجليزية فقط (A-Z, a-z)، ويمكن أن يحتوي على مسافات للفصل بين الاسم الأول والأخير`
    }
  }

  // Check for consecutive spaces
  if (/\s{2,}/.test(name)) {
    return {
      valid: false,
      message: `${fieldName} لا يجب أن يحتوي على مسافات متتالية`
    }
  }

  // Check for leading or trailing spaces
  if (name !== name.trim()) {
    return {
      valid: false,
      message: `${fieldName} لا يجب أن يبدأ أو ينتهي بمسافات`
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates phone number
 * - Only digits (0-9)
 * - Exactly 11 digits for Egypt (or configurable length)
 * - Required
 */
export function validatePhone(phone: string, requiredLength: number = 11): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return {
      valid: false,
      message: 'رقم الهاتف مطلوب ولا يمكن تركه فارغاً'
    }
  }

  // Remove any spaces or dashes
  const cleanPhone = phone.replace(/[\s\-]/g, '')

  // Only digits allowed
  const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`)

  if (!phoneRegex.test(cleanPhone)) {
    return {
      valid: false,
      message: `رقم الهاتف يجب أن يكون ${requiredLength} أرقام فقط`
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates email address
 * - Valid email format
 * - Required
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return {
      valid: false,
      message: 'البريد الإلكتروني مطلوب ولا يمكن تركه فارغاً'
    }
  }

  // Standard email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email.trim())) {
    return {
      valid: false,
      message: 'صيغة البريد الإلكتروني غير صحيحة'
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates password strength
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one digit (0-9)
 * - At least one special character (!@#$%^&*)
 * - Minimum 8 characters
 * - Required
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return {
      valid: false,
      message: 'كلمة المرور مطلوبة ولا يمكن تركها فارغة'
    }
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)'
    }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)'
    }
  }

  // Check for at least one digit
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (0-9)'
    }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      valid: false,
      message: 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)'
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates password confirmation matches
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword || confirmPassword.length === 0) {
    return {
      valid: false,
      message: 'تأكيد كلمة المرور مطلوب'
    }
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      message: 'كلمات المرور غير متطابقة'
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates role selection
 */
export function validateRole(role: string): ValidationResult {
  if (!role || role.trim().length === 0) {
    return {
      valid: false,
      message: 'اختيار الدور مطلوب'
    }
  }

  if (role !== 'STUDENT' && role !== 'PATIENT') {
    return {
      valid: false,
      message: 'يجب اختيار طالب أو مريض'
    }
  }

  return { valid: true, message: '' }
}

/**
 * Validates complete registration form
 */
export interface RegistrationData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  role: string
}

export interface RegistrationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  role?: string
}

export function validateRegistrationForm(data: RegistrationData): {
  valid: boolean
  errors: RegistrationErrors
} {
  const errors: RegistrationErrors = {}

  // Validate name
  const nameResult = validateName(data.name)
  if (!nameResult.valid) {
    errors.name = nameResult.message
  }

  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) {
    errors.email = emailResult.message
  }

  // Validate password
  const passwordResult = validatePassword(data.password)
  if (!passwordResult.valid) {
    errors.password = passwordResult.message
  }

  // Validate password confirmation
  const confirmResult = validatePasswordMatch(data.password, data.confirmPassword)
  if (!confirmResult.valid) {
    errors.confirmPassword = confirmResult.message
  }

  // Validate phone (optional)
  if (data.phone) {
    const phoneResult = validatePhone(data.phone)
    if (!phoneResult.valid) {
      errors.phone = phoneResult.message
    }
  }

  // Validate role
  const roleResult = validateRole(data.role)
  if (!roleResult.valid) {
    errors.role = roleResult.message
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates login form
 */
export interface LoginData {
  email: string
  password: string
}

export interface LoginErrors {
  email?: string
  password?: string
}

export function validateLoginForm(data: LoginData): {
  valid: boolean
  errors: LoginErrors
} {
  const errors: LoginErrors = {}

  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) {
    errors.email = emailResult.message
  }

  // Validate password (just check it's not empty for login)
  if (!data.password || data.password.length === 0) {
    errors.password = 'كلمة المرور مطلوبة'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Get password strength indicator (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0

  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*]/.test(password)) strength++

  return strength
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'ضعيفة جداً'
    case 2:
      return 'ضعيفة'
    case 3:
      return 'متوسطة'
    case 4:
      return 'قوية'
    case 5:
      return 'قوية جداً'
    default:
      return ''
  }
}

/**
 * Get password strength color class
 */
export function getPasswordStrengthColor(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'bg-red-500'
    case 2:
      return 'bg-orange-500'
    case 3:
      return 'bg-yellow-500'
    case 4:
      return 'bg-green-500'
    case 5:
      return 'bg-emerald-600'
    default:
      return 'bg-gray-300'
  }
}
