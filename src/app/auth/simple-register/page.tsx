'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  Stethoscope,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Phone,
  Check,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  validatePasswordMatch,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  validateRegistrationForm,
  RegistrationErrors
} from '@/lib/validation'

export default function SimpleRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')

  const [userType, setUserType] = useState<'patient' | 'student'>(
    (typeParam === 'patient' || typeParam === 'student') ? typeParam : 'patient'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })

  // Individual field errors for real-time validation
  const [fieldErrors, setFieldErrors] = useState<RegistrationErrors>({})
  
  // Track touched fields to show errors only after user interaction
  const [touched, setTouched] = useState<{
    name: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
    phone: boolean
  }>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  })

  // Real-time validation for individual fields
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
    setTouched({ ...touched, [field]: true })

    // Validate individual field
    let errorMessage = ''
    switch (field) {
      case 'name':
        errorMessage = validateName(value).message
        break
      case 'email':
        errorMessage = validateEmail(value).message
        break
      case 'password':
        errorMessage = validatePassword(value).message
        break
      case 'confirmPassword':
        errorMessage = validatePasswordMatch(formData.password, value).message
        break
      case 'phone':
        errorMessage = validatePhone(value).message
        break
    }

    setFieldErrors({
      ...fieldErrors,
      [field]: errorMessage
    })
  }

  // Real-time validation for password confirmation when password changes
  useEffect(() => {
    if (touched.confirmPassword) {
      const result = validatePasswordMatch(formData.password, formData.confirmPassword)
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: result.message
      })
    }
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    console.log('[Simple Register] Starting registration...')

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    })

    // Validate all fields
    const validation = validateRegistrationForm({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
      role: userType.toUpperCase(),
    })

    if (!validation.valid) {
      setFieldErrors(validation.errors)
      // Show first error as main error message
      const firstError = Object.values(validation.errors)[0]
      setError(firstError || 'يرجى تصحيح الأخطاء في النموذج')
      setIsLoading(false)
      return
    }

    try {
      console.log('[Simple Register] Sending registration request...')

      const response = await fetch('/api/auth/simple-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: userType.toUpperCase(),
        }),
      })

      console.log('[Simple Register] Response status:', response.status)

      const data = await response.json()
      console.log('[Simple Register] Response data:', data)

      if (!response.ok) {
        // Handle field-specific errors from server
        if (data.field) {
          setFieldErrors({ ...fieldErrors, [data.field]: data.error })
        }
        throw new Error(data.error || 'فشل إنشاء الحساب')
      }

      setSuccess(true)
      console.log('[Simple Register] ✅ Registration successful!')

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (err: any) {
      console.error('[Simple Register] ❌ Error:', err)
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate password strength
  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/50">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground">انضم لمنصة سمايلي وابدأ رحلتك</p>
        </div>

        {success ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
              <h2 className="text-2xl font-bold mb-2">تم إنشاء الحساب بنجاح!</h2>
              <p className="text-muted-foreground mb-4">
                جاري تحويلك لصفحة تسجيل الدخول...
              </p>
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-emerald-600" />
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs value={userType} onValueChange={(v) => setUserType(v as 'patient' | 'student')} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="gap-2">
                  <User className="w-4 h-4" />
                  كمريض
                </TabsTrigger>
                <TabsTrigger value="student" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  كطالب
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {userType === 'patient' ? (
                    <>
                      <User className="w-5 h-5 text-emerald-600" />
                      بيانات المريض
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-5 h-5 text-emerald-600" />
                      بيانات الطالب
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {userType === 'patient'
                    ? 'أنشئ حساب كمريض وابحث عن علاج مجاني'
                    : 'أنشئ حساب كطالب وابدأ في إكمال متطلباتك الدراسية'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل (حروف فقط)"
                      required
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      className={touched.name && fieldErrors.name ? 'border-red-500' : ''}
                      autoComplete="name"
                    />
                    {touched.name && fieldErrors.name && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className={`pr-10 ${touched.email && fieldErrors.email ? 'border-red-500' : ''}`}
                        required
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => setTouched({ ...touched, email: true })}
                        autoComplete="email"
                      />
                      {touched.email && fieldErrors.email && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01xxxxxxxxx (11 رقم)"
                        className={`pr-10 ${touched.phone && fieldErrors.phone ? 'border-red-500' : ''}`}
                        required
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                        onBlur={() => setTouched({ ...touched, phone: true })}
                        maxLength={11}
                        autoComplete="tel"
                      />
                      {touched.phone && fieldErrors.phone && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="password">كلمة المرور *</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="8 أحرف على الأقل مع رموز"
                        className={`pr-10 ${touched.password && fieldErrors.password ? 'border-red-500' : ''}`}
                        required
                        value={formData.password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        onBlur={() => setTouched({ ...touched, password: true })}
                        autoComplete="new-password"
                      />
                      {touched.password && fieldErrors.password && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
                      )}
                    </div>

                    {/* مؤشر قوة كلمة المرور */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{getPasswordStrengthLabel(passwordStrength)}</span>
                        </div>

                        {/* Password requirements */}
                        <div className="space-y-1 text-xs">
                          <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {formData.password.length >= 8 ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            8 أحرف على الأقل
                          </div>
                          <div className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {/[a-z]/.test(formData.password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            حروف صغيرة (a-z)
                          </div>
                          <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {/[A-Z]/.test(formData.password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            حروف كبيرة (A-Z)
                          </div>
                          <div className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {/[0-9]/.test(formData.password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            أرقام (0-9)
                          </div>
                          <div className={`flex items-center gap-2 ${/[!@#$%^&*]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {/[!@#$%^&*]/.test(formData.password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            رموز خاصة (!@#$%^&*)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="أعد كتابة كلمة المرور"
                        className={`pr-10 ${touched.confirmPassword && fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                        autoComplete="new-password"
                      />
                      {touched.confirmPassword && fieldErrors.confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      'إنشاء حساب'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  {t('auth.haveAccount')}{' '}
                  <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
                    {t('auth.loginButton')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
