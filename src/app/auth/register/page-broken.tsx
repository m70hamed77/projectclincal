'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  User,
  Stethoscope,
  Mail,
  Lock,
  CheckCircle2,
  Phone,
  ArrowRight,
  Home,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

type VerificationMethod = 'email' | 'phone'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')

  const [userType, setUserType] = useState<'patient' | 'student'>(
    (typeParam === 'patient' || typeParam === 'student') ? typeParam : 'patient'
  )
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  })

  // حالة أخطاء كل حقل (رسائل قصيرة)
  const [fieldErrors, setFieldErrors] = useState<{
    name: string
    phone: string
    email: string
    password: string
    confirmPassword: string
  }>({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // حالة لتعقب الحقول التي تم زيارتها
  const [touched, setTouched] = useState<{
    name: boolean
    phone: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
  }>({
    name: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (typeParam) {
      setUserType(typeParam as 'patient' | 'student')
    }
  }, [typeParam])

  // Regex patterns
  const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/
  const phoneRegex = /^01[0-9]{9}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  // دالة التحقق من حقل معين (رسائل قصيرة)
  const validateField = (field: keyof typeof fieldErrors): string => {
    switch (field) {
      case 'name':
        if (!formData.name || formData.name.trim() === '') {
          return 'مطلوب'
        }
        if (!nameRegex.test(formData.name.trim())) {
          return 'أحرف عربي/إنجليزي فقط'
        }
        return ''

      case 'phone':
        if (!formData.phone || formData.phone.trim() === '') {
          return 'مطلوب'
        }
        if (!phoneRegex.test(formData.phone.trim())) {
          return '11 رقم يبدأ بـ 01'
        }
        return ''

      case 'email':
        if (!formData.email || formData.email.trim() === '') {
          return 'مطلوب'
        }
        if (!emailRegex.test(formData.email.trim())) {
          return 'بريد غير صحيح'
        }
        return ''

      case 'password':
        if (!formData.password) {
          return 'مطلوب'
        }
        if (!passwordRegex.test(formData.password)) {
          return '8 خانات، حرف كبير وصغير ورقم'
        }
        return ''

      case 'confirmPassword':
        if (!formData.confirmPassword) {
          return 'مطلوب'
        }
        if (formData.password !== formData.confirmPassword) {
          return 'غير متطابقة'
        }
        return ''

      default:
        return ''
    }
  }

  // حساب قوة كلمة المرور
  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    return Math.min(strength, 5)
  }

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-400'
      case 3: return 'bg-yellow-400'
      case 4: return 'bg-emerald-400'
      case 5: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0: return ''
      case 1: 'ضعيفة جداً'
      case 2: 'ضعيفة'
      case 3: 'متوسطة'
      case 4: 'قوية'
      case 5: 'قوية جداً'
      default: return ''
    }
  }

  // معالج الخروج من الحقل
  const handleBlur = (field: keyof typeof fieldErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field)
    setFieldErrors((prev) => ({ ...prev, [field]: error }))
  }

  // معالجات إدخال البيانات
  const handleNameInput = (value: string) => {
    const filtered = value.replace(/[^A-Za-z\u0600-\u06FF\s]/g, '')
    setFormData((prev) => ({ ...prev, name: filtered }))

    if (touched.name && fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }))
    }
  }

  const handlePhoneInput = (value: string) => {
    const filtered = value.replace(/\D/g, '').slice(0, 11)
    setFormData((prev) => ({ ...prev, phone: filtered }))

    if (touched.phone && fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: '' }))
    }
  }

  const handleEmailInput = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }))

    if (touched.email && fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordInput = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }))

    if (touched.password && fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }))
    }

    if (touched.confirmPassword && formData.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: value !== formData.confirmPassword ? 'غير متطابقة' : '' }))
    }
  }

  const handleConfirmPasswordInput = (value: string) => {
    setFormData((prev) => ({ ...prev, confirmPassword: value }))

    if (touched.confirmPassword && fieldErrors.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
    }
  }

  const validateForm = (): { isValid: boolean; error: string; field?: string } => {
    const nameError = validateField('name')
    const phoneError = validateField('phone')
    const emailError = validateField('email')
    const passwordError = validateField('password')
    const confirmPasswordError = validateField('confirmPassword')

    setFieldErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })

    setTouched({
      name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (nameError) return { isValid: false, error: nameError, field: 'name' }
    if (phoneError) return { isValid: false, error: phoneError, field: 'phone' }
    if (emailError) return { isValid: false, error: emailError, field: 'email' }
    if (passwordError) return { isValid: false, error: passwordError, field: 'password' }
    if (confirmPasswordError) return { isValid: false, error: confirmPasswordError, field: 'confirmPassword' }

    return { isValid: true, error: '' }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    console.log('[Register Form] Starting submission...')

    const validation = validateForm()
    if (!validation.isValid) {
      toast.error(validation.error, {
        description: 'يرجى تصحيح الأخطاء المميزة',
        position: 'top-right',
      })
      setIsLoading(false)
      console.log('[Register Form] Validation failed:', validation.error, 'Field:', validation.field)
      return
    }

    try {
      let endpoint = ''
      let payload: any = {}

      if (verificationMethod === 'email') {
        endpoint = '/api/auth/send-verification-code'
        payload = { email: formData.email }
        console.log('[Register Form] Sending verification code to:', formData.email)
      } else {
        endpoint = '/api/auth/send-sms-code'
        payload = { phone: formData.phone }
        console.log('[Register Form] Sending SMS verification code to:', formData.phone)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[Register Form] Response status:', response.status)

      const data = await response.json()
      console.log('[Register Form] Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال كود التحقق')
      }

      // حفظ البيانات في localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('registrationData', JSON.stringify({
            ...formData,
            userType,
            verificationMethod,
          }))
          console.log('[Register Form] Data saved to localStorage')
        } catch (storageError) {
          console.error('[Register Form] Failed to save to localStorage:', storageError)
        }
      }

      console.log('[Register Form] Redirecting to verify page...')

      if (verificationMethod === 'email') {
        await router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}&userType=${userType}`)
      } else {
        await router.push(`/auth/verify-sms?phone=${encodeURIComponent(formData.phone)}&userType=${userType}`)
      }
    } catch (err: any) {
      console.error('[Register Form] Error:', err)
      toast.error('فشل إرسال كود التحقق', {
        description: err.message || 'حدث خطأ أثناء إرسال كود التحقق',
        position: 'top-right',
      })
      setIsLoading(false)
    }
  }

  // مكون الحقل المحسّن
  const FormField = ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    icon: Icon,
    required = false,
    maxLength,
    showPasswordToggle = false,
    showStrengthMeter = false,
  }: {
    id: string
    label: string
    type: string
    placeholder?: string
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    error?: string
    icon?: any
    required?: boolean
    maxLength?: number
    showPasswordToggle?: boolean
    showStrengthMeter?: boolean
  }) => {
    const hasError = !!error
    const hasSuccess = !hasError && value && touched[id as keyof typeof touched]
    const passwordStrength = showStrengthMeter ? getPasswordStrength(value) : 0

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={id}
            className={`text-sm font-medium ${hasError ? 'text-red-500' : ''}`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>

          {showStrengthMeter && passwordStrength > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="absolute right-3 top-3 z-10">
            {hasSuccess && (
              <Check className="w-5 h-5 text-emerald-500" />
            )}
            {hasError && (
              <X className="w-5 h-5 text-red-500" />
            )}
            {!hasSuccess && !hasError && Icon && (
              <Icon className={`w-5 h-5 transition-colors ${hasError ? 'text-red-500' : 'text-muted-foreground'}`} />
            )}
          </div>

          <Input
            id={id}
            type={showPassword ? 'text' : type}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={`
              pr-10
              transition-all duration-200
              ${hasError
                ? 'border-red-500 focus-visible:ring-red-500'
                : hasSuccess
                  ? 'border-emerald-500 focus-visible:ring-emerald-500'
                  : 'border-gray-300 focus-visible:ring-emerald-500 hover:border-emerald-400'
              }
              ${hasSuccess ? 'bg-emerald-50/30' : ''}
            `}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>

        {hasError && (
          <p className="text-xs text-red-600 flex items-center gap-1 font-medium animate-in slide-in-from-top-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}

        {!hasError && !value && (
          <p className="text-xs text-muted-foreground">
            {placeholder}
          </p>
        )}

        {hasSuccess && value && touched[id as keyof typeof touched] && (
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            صحيح
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            إنشاء حساب جديد
          </h1>
          <p className="text-muted-foreground text-lg">
            انضم لمنصة سمايلي وابدأ رحلتك 🚀
          </p>
          <Link href="/">
            <Button 
              variant="ghost" 
              className="gap-2 hover:bg-accent transition-colors"
            >
              <Home className="w-4 h-4" />
              العودة للصفحة الرئيسية
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'patient' | 'student')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger 
              value="patient" 
              className="gap-2"
            >
              <User className="w-5 h-5" />
              كمريض
            </TabsTrigger>
            <TabsTrigger 
              value="student" 
              className="gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              كطالب
            </TabsTrigger>
          </TabsList>

          {/* Patient Registration */}
          <TabsContent value="patient">
            <Card className="border-2 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">بيانات المريض</CardTitle>
                    <CardDescription className="text-sm">
                      أدخل بياناتك لإنشاء حساب مريض جديد
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <FormField
                    id="name"
                    label="الاسم الكامل"
                    type="text"
                    placeholder="محمد أحمد مثال"
                    value={formData.name}
                    onChange={handleNameInput}
                    onBlur={() => handleBlur('name')}
                    error={fieldErrors.name}
                    icon={User}
                    required
                  />

                  <FormField
                    id="phone"
                    label="رقم الهاتف"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={handlePhoneInput}
                    onBlur={() => handleBlur('phone')}
                    error={fieldErrors.phone}
                    icon={Phone}
                    required
                    maxLength={11}
                  />

                  <FormField
                    id="email"
                    label="بريد الإلكتروني"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleEmailInput}
                    onBlur={() => handleBlur('email')}
                    error={fieldErrors.email}
                    icon={Mail}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      id="password"
                      label="كلمة المرور"
                      type="password"
                      placeholder="•••••••••"
                      value={formData.password}
                      onChange={handlePasswordInput}
                      onBlur={() => handleBlur('password')}
                      error={fieldErrors.password}
                      icon={Lock}
                      required
                      showPasswordToggle={true}
                      showStrengthMeter={true}
                    />

                    <FormField
                      id="confirm-password"
                      label="تأكيد كلمة المرور"
                      type="password"
                      placeholder="•••••••••"
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordInput}
                      onBlur={() => handleBlur('confirmPassword')}
                      error={fieldErrors.confirmPassword}
                      icon={ShieldCheck}
                      required
                      showPasswordToggle={true}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                        <span>جاري إرسال كود التحقق...</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          إنشاء الحساب
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
