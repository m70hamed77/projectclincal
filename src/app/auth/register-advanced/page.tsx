'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  User,
  Stethoscope,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Home,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  FileText,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export function AdvancedRegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')

  // النوع المحدد (طالب أو مريض)
  const [userType, setUserType] = useState<'patient' | 'student'>(
    (typeParam === 'patient' || typeParam === 'student') ? typeParam : 'patient'
  )

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otpCode: '',
    carniehImage: null as File | null,
  })

  // Patient specific states
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [devOtpCode, setDevOtpCode] = useState('') // للتجربة فقط

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpError, setOtpError] = useState('')

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<null | {
    score: number
    text: string
    color: string
  }>(null)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null)
      return
    }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    let text = 'ضعيفة'
    let color = 'text-red-600'

    if (score >= 4) {
      text = 'قوية'
      color = 'text-emerald-600'
    } else if (score >= 3) {
      text = 'متوسطة'
      color = 'text-amber-600'
    } else if (score >= 2) {
      text = 'مقبولة'
      color = 'text-yellow-600'
    }

    setPasswordStrength({ score, text, color })
  }

  // Send OTP
  const sendOtp = async () => {
    setIsSendingOtp(true)
    setOtpError('')

    try {
      const value = verificationMethod === 'email' ? formData.email : formData.phone

      if (!value) {
        setOtpError(verificationMethod === 'email' ? 'البريد الإلكتروني مطلوب' : 'رقم الهاتف مطلوب')
        setIsSendingOtp(false)
        return
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: verificationMethod,
          value,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال كود التحقق')
      }

      setOtpSent(true)
      setDevOtpCode(data.devCode || '') // للتجربة
    } catch (error: any) {
      setOtpError(error.message || 'حدث خطأ أثناء إرسال كود التحقق')
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    setIsVerifyingOtp(true)
    setOtpError('')

    try {
      const value = verificationMethod === 'email' ? formData.email : formData.phone

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: verificationMethod,
          value,
          code: formData.otpCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'كود التحقق غير صحيح')
      }

      setOtpVerified(true)
      setOtpError('')
    } catch (error: any) {
      setOtpError(error.message || 'كود التحقق غير صحيح')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'بريد إلكتروني غير صحيح'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب'
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01'
    }

    // Password validation for students
    if (userType === 'student') {
      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة'
      } else if (formData.password.length < 8) {
        newErrors.password = 'كلمة المرور يجب أن تكون 8 خانات على الأقل'
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل'
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل'
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على رمز واحد على الأقل'
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // For patients, check OTP verification
    if (userType === 'patient' && !otpVerified) {
      setOtpError('يجب التحقق من كود OTP أولاً')
      return
    }

    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('role', userType === 'student' ? 'STUDENT' : 'PATIENT')

      if (userType === 'patient' && formData.carniehImage) {
        formDataToSend.append('carniehImage', formData.carniehImage)
      }

      const response = await fetch('/api/auth/register-user', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل التسجيل')
      }

      // Redirect based on user type
      if (userType === 'student') {
        router.push('/auth/login?registered=true&role=student')
      } else {
        router.push('/auth/login?registered=true&role=patient')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setOtpError(error.message || 'حدث خطأ أثناء التسجيل')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🦷</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            انضم إلى منصة سمايلي
          </h1>
          <p className="text-muted-foreground text-lg">
            اختر نوع حسابك وابدأ رحلتك معنا 🚀
          </p>
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-accent transition-colors mt-4">
              <Home className="w-4 h-4" />
              العودة للصفحة الرئيسية
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* User Type Tabs */}
        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'patient' | 'student')} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-2 bg-muted/50 rounded-xl">
            <TabsTrigger value="patient" className="gap-3 py-4 text-base">
              <User className="w-6 h-6" />
              <div className="text-right">
                <div className="font-semibold">حساب مريض</div>
                <div className="text-xs text-muted-foreground">للبحث عن علاج أسنان</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="student" className="gap-3 py-4 text-base">
              <Stethoscope className="w-6 h-6" />
              <div className="text-right">
                <div className="font-semibold">حساب طالب</div>
                <div className="text-xs text-muted-foreground">للتدريب والممارسة</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Student Registration */}
          <TabsContent value="student">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-purple-900">تسجيل حساب طالب</CardTitle>
                    <CardDescription className="text-sm text-purple-700">
                      أدخل بياناتك لإنشاء حساب طالب جديد
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Alert className="mb-6 bg-purple-50 border-purple-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-purple-900">
                    حساب الطالب يتم تفعيله فوراً بعد إكمال البيانات
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="محمد أحمد مثال"
                        value={formData.name}
                        onChange={handleChange}
                        className="pr-10"
                      />
                    </div>
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pr-10"
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          maxLength={11}
                          value={formData.phone}
                          onChange={handleChange}
                          className="pr-10"
                        />
                      </div>
                      {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pr-10"
                        />
                      </div>
                      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                      {passwordStrength && (
                        <p className={`text-sm ${passwordStrength.color}`}>
                          قوة كلمة المرور: {passwordStrength.text}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                      <div className="relative">
                        <ShieldCheck className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pr-10"
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <Alert className="bg-muted/50">
                    <AlertDescription className="text-sm">
                      <div className="font-semibold mb-2">متطلبات كلمة المرور:</div>
                      <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                        <li>8 أحرف على الأقل</li>
                        <li>حرف كبير واحد على الأقل (A-Z)</li>
                        <li>حرف صغير واحد على الأقل (a-z)</li>
                        <li>رقم واحد على الأقل (0-9)</li>
                        <li>رمز واحد على الأقل (!@#$%^&*)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? 'جاري التسجيل...' : 'تسجيل حساب جديد'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patient Registration */}
          <TabsContent value="patient">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-blue-900">تسجيل حساب مريض</CardTitle>
                    <CardDescription className="text-sm text-blue-700">
                      اتبع الخطوات لإكمال التسجيل
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-900">
                    حساب المريض يحتاج إلى الترسيل من الهوية وموافقة الأدمن قبل التفعيل
                  </AlertDescription>
                </Alert>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className={`flex items-center gap-2 ${otpVerified ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${otpVerified ? 'bg-emerald-600 text-white' : 'bg-muted'}`}>
                      1
                    </div>
                    <span className="text-sm font-medium">التحقق</span>
                  </div>
                  <div className="w-8 h-0.5 bg-muted"></div>
                  <div className={`flex items-center gap-2 ${otpVerified ? 'text-blue-600' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${otpVerified ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                      2
                    </div>
                    <span className="text-sm font-medium">البيانات</span>
                  </div>
                </div>

                {!otpVerified ? (
                  // Step 1: OTP Verification
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>اختر طريقة التحقق:</Label>
                      <RadioGroup
                        value={verificationMethod}
                        onValueChange={(v: 'email' | 'phone') => {
                          setVerificationMethod(v)
                          setOtpSent(false)
                          setOtpVerified(false)
                          setDevOtpCode('')
                        }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="cursor-pointer flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            <div>
                              <div className="font-medium">البريد الإلكتروني</div>
                              <div className="text-xs text-muted-foreground">إرسال كود على الإيميل</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="phone" id="phone" />
                          <Label htmlFor="phone" className="cursor-pointer flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            <div>
                              <div className="font-medium">رقم الهاتف</div>
                              <div className="text-xs text-muted-foreground">إرسال كود على الموبايل</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verifyValue">
                        {verificationMethod === 'email' ? 'البريد الإلكتروني *' : 'رقم الهاتف *'}
                      </Label>
                      <div className="relative">
                        {verificationMethod === 'email' ? (
                          <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Phone className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        )}
                        <Input
                          id="verifyValue"
                          type={verificationMethod === 'email' ? 'email' : 'tel'}
                          placeholder={verificationMethod === 'email' ? 'example@email.com' : '01xxxxxxxxx'}
                          maxLength={verificationMethod === 'phone' ? 11 : undefined}
                          value={verificationMethod === 'email' ? formData.email : formData.phone}
                          onChange={(e) => {
                            const field = verificationMethod === 'email' ? 'email' : 'phone'
                            handleChange(e)
                          }}
                          className="pr-10"
                          name={verificationMethod === 'email' ? 'email' : 'phone'}
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={sendOtp}
                      disabled={isSendingOtp}
                      className="w-full gap-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          إرسال كود التحقق
                        </>
                      )}
                    </Button>

                    {otpSent && (
                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <Alert className="bg-emerald-50 border-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription className="text-emerald-900">
                            تم إرسال كود التحقق بنجاح!
                            {devOtpCode && (
                              <div className="mt-2 p-2 bg-white rounded border text-center font-mono font-bold">
                                كود التحقق (للتجربة): {devOtpCode}
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="otpCode">كود التحقق (6 أرقام) *</Label>
                          <Input
                            id="otpCode"
                            name="otpCode"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            value={formData.otpCode}
                            onChange={handleChange}
                            className="text-center text-2xl tracking-widest"
                          />
                        </div>

                        {otpError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{otpError}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="button"
                          onClick={verifyOtp}
                          disabled={isVerifyingOtp}
                          className="w-full gap-2"
                        >
                          {isVerifyingOtp ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              جاري التحقق...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              تحقق من الكود
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={sendOtp}
                          disabled={isSendingOtp}
                          className="w-full text-sm"
                        >
                          إرسال كود جديد
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Step 2: Complete Registration
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Alert className="mb-6 bg-emerald-50 border-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription className="text-emerald-900">
                        تم التحقق بنجاح! أكمل بياناتك للمرحلة التالية
                      </AlertDescription>
                    </Alert>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="محمد أحمد مثال"
                          value={formData.name}
                          onChange={handleChange}
                          className="pr-10"
                        />
                      </div>
                      {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>

                    {/* Password */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور *</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="pr-10"
                          />
                        </div>
                        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pr-10"
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    {/* Carnieh Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="carnieh">صورة الكارنيه الجامعي *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent cursor-pointer transition-colors">
                        <input
                          type="file"
                          id="carnieh"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData(prev => ({ ...prev, carniehImage: file }))
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="carnieh" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">اضغط لرفع صورة الكارنيه</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG حتى 5MB
                          </p>
                          {formData.carniehImage && (
                            <p className="text-sm text-emerald-600 mt-2">
                              تم اختيار: {formData.carniehImage.name}
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    {otpError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{otpError}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {isLoading ? 'جاري التسجيل...' : 'إكمال التسجيل'}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setOtpVerified(false)
                        setOtpSent(false)
                      }}
                      className="w-full text-sm gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      رجوع
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdvancedRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="max-w-4xl mx-auto flex items-center justify-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </div>
    }>
      <AdvancedRegisterContent />
    </Suspense>
  )
}
