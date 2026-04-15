'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { User, Mail, Lock, ShieldCheck, ArrowRight, Home, CheckCircle2, AlertCircle, RefreshCw, UserPlus, Edit, Save, Loader2, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterNewPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'new' | 'edit'>('new')
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Contact info from verification
  const [contactInfo, setContactInfo] = useState<{ email?: string; phone?: string }>({})

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<null | {
    score: number
    text: string
    color: string
  }>(null)

  // Load contact info from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('verificationCode')
    
    if (!savedCode) {
      // لم يتم التحقق من الكود بعد
      router.push('/auth/verify/send-code')
      return
    }

    // استرجاع بيانات التواصل المحفوظة
    const savedEmail = localStorage.getItem('contactValue')
    const savedPhone = localStorage.getItem('contactPhone')

    if (savedEmail || savedPhone) {
      setContactInfo({
        email: savedEmail || '',
        phone: savedPhone || '',
      })
      setFormData(prev => ({
        ...prev,
        email: savedEmail || '',
        phone: savedPhone || '',
      }))
    }
  }, [router])

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

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب'
    }

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

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 خانات على الأقل'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)'
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (0-9)'
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على رمز واحد على الأقل (!@#$%^&*)'
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

    setIsLoading(true)
    setApiError('')

    try {
      // محاكاة استدعاء API للتسجيل
      await new Promise(resolve => setTimeout(resolve, 1500))

      // مسح البيانات المحفوظة
      localStorage.removeItem('verificationCode')
      localStorage.removeItem('contactValue')
      localStorage.removeItem('contactMethod')
      localStorage.removeItem('contactPhone')

      // محاكاة حفظ البيانات في Console
      console.log('=====================================')
      console.log('📝 بيانات الحساب الجديد:')
      console.log('=====================================')
      console.log('الاسم الأول:', formData.firstName)
      console.log('الاسم الأخير:', formData.lastName)
      console.log('البريد الإلكتروني:', formData.email)
      console.log('رقم الهاتف:', formData.phone)
      console.log('نوع الحساب:', mode === 'new' ? 'جديد' : 'تعديل')
      console.log('=====================================')

      // توجيه لصفحة تسجيل الدخول
      router.push('/auth/login?registered=true&mode=new')
    } catch (error: any) {
      console.error('[Register Error]:', error)
      setApiError('حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              {mode === 'new' ? (
                <UserPlus className="w-8 h-8 text-white" />
              ) : (
                <Edit className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {mode === 'new' ? 'إنشاء حساب جديد' : 'تعديل البيانات'}
          </h1>
          <p className="text-muted-foreground text-lg">
            أكمل بياناتك للانضمام إلى منصة سمايلي
          </p>
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-accent transition-colors mt-4">
              <Home className="w-4 h-4" />
              العودة للرئيسية
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mode Toggle */}
        <Card className="mb-6 border-2 shadow-lg">
          <CardContent className="p-4">
            <RadioGroup
              value={mode}
              onValueChange={(v: 'new' | 'edit') => {
                setMode(v)
                setFormData({ firstName: '', lastName: '', email: contactInfo.email || '', phone: contactInfo.phone || '', password: '', confirmPassword: '' })
                setErrors({})
                setPasswordStrength(null)
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer flex items-center gap-2 p-3 border-2 rounded-lg hover:bg-purple-50 transition-colors">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">إنشاء حساب طالب جديد</div>
                    <div className="text-xs text-muted-foreground">للحسابات الجديدة</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="cursor-pointer flex items-center gap-2 p-3 border-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Edit className="w-5 h-5 text-pink-600" />
                  <div>
                    <div className="font-medium">تعديل بيانات</div>
                    <div className="text-xs text-muted-foreground">للحسابات الموجودة</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Main Form Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">
                  {mode === 'new' ? 'إنشاء حساب طالب جديد' : 'تعديل البيانات'}
                </CardTitle>
                <CardDescription className="text-sm text-purple-700">
                  أدخل بياناتك لإكمال العملية
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول *</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="محمد"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pr-10"
                  />
                </div>
                {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير *</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="أحمد"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pr-10"
                  />
                </div>
                {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="•••••••••••••••"
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
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="•••••••••••••••"
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === 'new' ? 'جاري إنشاء الحساب...' : 'جاري تحديث البيانات...'}
                  </>
                ) : (
                  <>
                    {mode === 'new' ? (
                      <>
                        <UserPlus className="w-5 h-5" />
                        إنشاء حساب جديد
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        حفظ التغييرات
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            {/* Back Link */}
            <div className="text-center pt-4 border-t">
              <Link
                href="/auth/verify/enter-code"
                className="text-sm text-muted-foreground hover:text-foreground font-medium flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                رجوع
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-purple-600 hover:underline font-medium">
            {t('auth.haveAccount')} {t('auth.loginButton')}
          </Link>
        </div>
      </div>
    </div>
  )
}
