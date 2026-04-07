'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Send, ArrowRight, ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle, GraduationCap, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function RegisterWithVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'patient'

  const [userType, setUserType] = useState(type)
  const [step, setStep] = useState(1) // 1=البيانات, 2=كود التحقق, 3=نجاح

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    // طالب فقط
    universityName: '',
    specialization: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Password Strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'name':
        const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/
        if (!value.trim()) {
          newErrors.name = 'الاسم مطلوب'
        } else if (value.trim().length < 3) {
          newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل'
        } else if (!nameRegex.test(value.trim())) {
          newErrors.name = 'الاسم يجب أن يحتوي على أحرف فقط'
        } else {
          delete newErrors.name
        }
        break

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!value.trim()) {
          newErrors.email = 'البريد الإلكتروني مطلوب'
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = 'البريد الإلكتروني غير صحيح'
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = 'كلمة المرور مطلوبة'
        } else if (value.length < 8) {
          newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
        } else {
          delete newErrors.password
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
        } else {
          delete newErrors.confirmPassword
        }
        break

      case 'verificationCode':
        if (!value) {
          newErrors.verificationCode = 'كود التحقق مطلوب'
        } else if (!/^\d{4}$/.test(value)) {
          newErrors.verificationCode = 'الكود يجب أن يكون 4 أرقام'
        } else {
          delete newErrors.verificationCode
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let cleanedValue = value

    if (name === 'verificationCode') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setFormData(prev => ({ ...prev, [name]: cleanedValue }))
    validateField(name, cleanedValue)
  }

  // Send Verification Code
  const sendVerificationCode = async () => {
    // Validate email first
    if (!formData.email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      setErrors({ email: 'البريد الإلكتروني غير صحيح' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          name: formData.name.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        setCountdown(60) // 60 seconds countdown
        setStep(2)
      } else {
        setErrors({ email: data.error || 'فشل في إرسال كود التحقق' })
      }
    } catch (error) {
      setErrors({ email: 'حدث خطأ أثناء إرسال كود التحقق' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify Code and Register
  const verifyAndRegister = async () => {
    if (!/^\d{4}$/.test(formData.verificationCode)) {
      setErrors({ verificationCode: 'الكود يجب أن يكون 4 أرقام' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Determine which API to use
      const apiEndpoint = userType === 'patient'
        ? '/api/auth/register-patient'
        : '/api/auth/register-student'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          name: formData.name.trim(),
          verificationCode: formData.verificationCode,
          // Additional student fields
          ...(userType === 'student' && {
            universityName: formData.universityName,
            specialization: formData.specialization,
          })
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStep(3) // Success step
      } else {
        setErrors({ verificationCode: data.error || 'فشل في التسجيل' })
      }
    } catch (error) {
      setErrors({ verificationCode: 'حدث خطأ أثناء التسجيل' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return formData.name.trim().length >= 3 &&
           /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim()) &&
           formData.password.length >= 8 &&
           formData.password === formData.confirmPassword
  }

  // Step 1: Basic Info
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              {userType === 'patient' ? <User className="w-10 h-10" /> : <GraduationCap className="w-10 h-10" />}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {userType === 'patient' ? 'تسجيل كمريض' : 'تسجيل كطالب'}
            </h1>
            <p className="text-emerald-100">
              {userType === 'patient'
                ? 'أنشئ حسابك وابدأ رحلة العناية بأسنانك'
                : 'أنشئ حسابك وابدأ رحلتك المهنية'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* User Type Toggle */}
            <div className="bg-gray-100 p-1.5 rounded-xl flex gap-2">
              <button
                onClick={() => setUserType('patient')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  userType === 'patient'
                    ? 'bg-white shadow-md text-emerald-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
                مريض
              </button>
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  userType === 'student'
                    ? 'bg-white shadow-md text-emerald-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                طالب
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'
                }`}
                placeholder="أدخل اسمك الكامل"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-11 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                  placeholder="example@domain.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
              {!errors.email && formData.email && (
                <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  سيتم إرسال كود التحقق إلى هذا الإيميل
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-11 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[25, 50, 75, 100].map((threshold) => (
                      <div
                        key={threshold}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          passwordStrength >= threshold
                            ? passwordStrength === 100
                              ? 'bg-emerald-500'
                              : passwordStrength >= 75
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength === 100 ? 'text-emerald-600' :
                    passwordStrength >= 75 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {passwordStrength === 100 ? 'قوية جداً' :
                     passwordStrength >= 75 ? 'قوية' :
                     passwordStrength >= 50 ? 'متوسطة' : 'ضعيفة'}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-11 pl-11 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' :
                    formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-emerald-500' :
                    'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Student Additional Fields */}
            {userType === 'student' && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الجامعة *
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="اسم الجامعة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="التخصص الجامعي"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={sendVerificationCode}
              disabled={!isFormValid() || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري الإرسال...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  إرسال كود التحقق
                </span>
              )}
            </Button>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Step 2: Verification Code
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <Card className="w-full max-w-md shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">أدخل كود التحقق</h1>
            <p className="text-emerald-100 text-sm">
              تم إرسال كود 4 أرقام إلى {formData.email}
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                كود التحقق (صالح لمدة 10 دقائق)
              </label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                className={`w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.verificationCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'
                }`}
                placeholder="_ _ _ _"
                maxLength={4}
                autoFocus
              />
              {errors.verificationCode && (
                <p className="mt-2 text-sm text-red-500 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.verificationCode}
                </p>
              )}
            </div>

            {/* Countdown & Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  يمكنك طلب كود جديد بعد {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  onClick={sendVerificationCode}
                  disabled={isSubmitting}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  إعادة إرسال الكود
                </button>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للبيانات
            </button>

            {/* Verify Button */}
            <Button
              onClick={verifyAndRegister}
              disabled={!/^\d{4}$/.test(formData.verificationCode) || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري التحقق والتسجيل...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  تحقق والتسجيل
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <Card className="w-full max-w-md shadow-2xl overflow-hidden text-center">
          {/* Success */}
          <div className="p-12 space-y-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userType === 'patient' ? 'تم إنشاء حسابك!' : 'تم استلام طلبك!'}
              </h1>
              <p className="text-gray-600">
                {userType === 'patient'
                  ? 'حسابك الآن مفعل ويمكنك تسجيل الدخول فوراً'
                  : 'حسابك الآن قيد المراجعة من قبل الإدارة. سيتم إشعارك عند الموافقة'}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg"
              >
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
