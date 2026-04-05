'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowRight, ArrowLeft, 
  Mail, Phone, Shield, User, Lock, Upload, 
  CheckCircle2, AlertCircle, Sparkles, 
  CreditCard, Stethoscope, Hospital, 
  ChevronRight, X, AlertTriangle
} from 'lucide-react'

type UserRole = 'STUDENT' | 'PATIENT'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  carniehFile?: File
}

export default function StylishRegisterForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole] = useState<UserRole>('STUDENT')
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    carniehFile: undefined,
  })

  const [userCode, setUserCode] = useState('')
  const [carniehPreview, setCarniehPreview] = useState<string | null>(null)
  const [devCodeDisplay, setDevCodeDisplay] = useState<string>('')
  
  const { toast } = useToast()

  // Send verification code
  const sendCode = async () => {
    if (!formData.email && !formData.phone) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const contact = formData.email || formData.phone
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contact.includes('@') ? 'email' : 'phone',
          value: contact,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setVerificationCode(data.devCode)
        setDevCodeDisplay(data.devCode || '')
        
        console.log('='.repeat(60))
        console.log('🔐 VERIFICATION CODE (BACKEND)')
        console.log('='.repeat(60))
        console.log(`Contact: ${contact}`)
        console.log(`Code: ${data.devCode}`)
        console.log(`Type: ${contact.includes('@') ? 'Email' : 'Phone'}`)
        console.log(`Expires: ${new Date(Date.now() + 5 * 60 * 1000).toLocaleString('ar-EG')}`)
        console.log('='.repeat(60))

        toast({
          title: 'تم الإرسال ✓',
          description: 'تم إرسال كود التحقق! تحقق من الكونسول.',
        })
        setStep(2)
      } else {
        toast({
          title: 'خطأ',
          description: data.error || 'فشل إرسال كود التحقق',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error sending code:', error)
      toast({
        title: 'خطأ',
        description: 'فشل إرسال كود التحقق، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Verify code
  const verifyCode = async () => {
    if (!userCode || userCode.length !== 6) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود التحقق المكون من 6 أرقام',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const contact = formData.email || formData.phone
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contact.includes('@') ? 'email' : 'phone',
          value: contact,
          code: userCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'تم التحقق ✓',
          description: 'الكود صحيح! يمكنك الآن إنشاء الحساب.',
        })
        setStep(3)
      } else {
        toast({
          title: 'كود غير صحيح ✗',
          description: data.error || 'الكود الذي أدخلته غير صحيح',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      toast({
        title: 'خطأ',
        description: 'فشل التحقق من الكود',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, carniehFile: file })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setCarniehPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle registration
  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور غير متطابقة',
        variant: 'destructive',
      })
      return
    }

    if (role === 'PATIENT' && !formData.carniehFile) {
      toast({
        title: 'خطأ',
        description: 'يرجى رفع صورة الكارنيه',
        variant: 'destructive',
      })
      return
    }

    // Password strength check for students
    if (role === 'STUDENT') {
      const password = formData.password
      if (password.length < 8) {
        toast({
          title: 'كلمة مرور ضعيفة',
          description: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
          variant: 'destructive',
        })
        return
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        toast({
          title: 'كلمة مرور ضعيفة',
          description: 'يجب أن تحتوي على حرف كبير، حرف صغير، ورقم',
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append('firstName', formData.firstName)
      submitData.append('lastName', formData.lastName)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('password', formData.password)
      submitData.append('role', role)
      
      if (role === 'PATIENT' && formData.carniehFile) {
        submitData.append('carniehFile', formData.carniehFile)
      }

      const response = await fetch('/api/register-new', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: role === 'STUDENT' ? 'تم إنشاء الحساب ✓' : 'تم التسجيل بنجاح ✓',
          description: data.message || (role === 'STUDENT' ? 'يمكنك الآن تسجيل الدخول' : 'سيتم مراجعة بياناتك وسيتم تفعيل الحساب قريباً'),
        })

        // Reset form
        setStep(1)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          carniehFile: undefined,
        })
        setUserCode('')
        setCarniehPreview(null)
        setDevCodeDisplay('')
        setVerificationCode(null)
      } else {
        toast({
          title: 'خطأ',
          description: data.error || 'حدث خطأ أثناء التسجيل',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'خطأ',
        description: 'فشل التسجيل، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1 as 1 | 2 | 3)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-2 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {role === 'STUDENT' ? (
                    <Stethoscope className="w-6 h-6" />
                  ) : (
                    <Hospital className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-white">
                    {role === 'STUDENT' ? 'تسجيل طالب جديد' : 'تسجيل مريض'}
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    {role === 'STUDENT' 
                      ? 'أنشئ حسابك وابدأ رحلتك المهنية' 
                      : 'احصل على علاج مجاني من طلاب متخصصين'}
                  </CardDescription>
                </div>
              </div>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                نظام آمن ومؤممن
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= s
                        ? 'bg-white text-emerald-600 shadow-lg'
                        : 'bg-white/30 text-white/60'
                    }`}
                  >
                    {step >= s ? <CheckCircle2 className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-8 h-1 rounded-full transition-all ${
                        step >= s ? 'bg-white/60' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Toggle Role */}
            <div className="bg-muted/50 rounded-xl p-1">
              <RadioGroup 
                value={role} 
                onValueChange={(v) => setRole(v as UserRole)}
                className="flex"
              >
                <div className="flex-1">
                  <RadioGroupItem
                    value="STUDENT"
                    className="border-0 data-[state=checked]:bg-white data-[state=checked]:shadow-sm"
                    id="student-role"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">طالب</div>
                        <div className="text-xs text-gray-500">تسجيل مباشر</div>
                      </div>
                    </div>
                  </RadioGroupItem>
                </div>
                <div className="flex-1">
                  <RadioGroupItem
                    value="PATIENT"
                    className="border-0 data-[state=checked]:bg-white data-[state=checked]:shadow-sm"
                    id="patient-role"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Hospital className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">مريض</div>
                        <div className="text-xs text-gray-500">موثق + كارنيه</div>
                      </div>
                    </div>
                  </RadioGroupItem>
                </div>
              </RadioGroup>
            </div>

            {/* Step 1: Basic Info + Send Code */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">الاسم الأول *</Label>
                    <Input
                      id="firstName"
                      placeholder="محمد"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">الاسم الأخير *</Label>
                    <Input
                      id="lastName"
                      placeholder="أحمد"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <Button
                  onClick={sendCode}
                  disabled={loading || (!formData.email && !formData.phone)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 font-semibold shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span>إرسال كود التحقق</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Console notification */}
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center bg-gray-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>الكود سيظهر في الكونسول للتجربة المجانية</span>
                </div>
              </div>
            )}

            {/* Step 2: Enter Code */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">أدخل كود التحقق</h3>
                    <p className="text-sm text-gray-500">
                      تم إرسال كود مكون من 6 أرقام إلى {formData.email || formData.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">كود التحقق *</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono h-14"
                    autoFocus
                  />
                </div>

                {devCodeDisplay && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-amber-700 mb-1">🔐 كود التحقق (للتجربة):</div>
                    <div className="text-2xl font-bold font-mono text-amber-800">{devCodeDisplay}</div>
                    <div className="text-xs text-amber-600 mt-1">
                      انسخ هذا الكود من الكونسول: F12 → Console
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    <span>رجوع</span>
                  </Button>
                  <Button
                    onClick={verifyCode}
                    disabled={loading || userCode.length !== 6}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري التحقق...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>تحقق</span>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={sendCode}
                  disabled={loading}
                  className="w-full text-sm"
                >
                  <span>إعادة إرسال الكود</span>
                </Button>
              </div>
            )}

            {/* Step 3: Final Registration */}
            {step === 3 && (
              <div className="space-y-4">
                {role === 'PATIENT' && (
                  <div className="space-y-2">
                    <Label htmlFor="carnieh">صورة الكارنيه *</Label>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-emerald-300 transition-colors">
                      {carniehPreview ? (
                        <div className="relative">
                          <img
                            src={carniehPreview}
                            alt="كارنيه"
                            className="max-h-48 mx-auto rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => {
                              setCarniehPreview(null)
                              setFormData({ ...formData, carniehFile: undefined })
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="carnieh" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                              <Upload className="w-8 h-8 text-emerald-600" />
                            </div>
                            <span className="text-sm text-gray-600">اضغط هنا لرفع الكارنيه</span>
                            <span className="text-xs text-gray-400">JPG, PNG (حتى 5MB)</span>
                          </div>
                          <input
                            id="carnieh"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="•••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10 text-right"
                    />
                  </div>
                  {role === 'STUDENT' && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                        <span>✓ 8 أحرف على الأقل</span>
                        <span>✓ حرف كبير</span>
                        <span>✓ حرف صغير</span>
                        <span>✓ رقم</span>
                        <span>✓ رمز خاص</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    <span>رجوع</span>
                  </Button>
                  <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري التسجيل...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>{role === 'STUDENT' ? 'إنشاء الحساب' : 'تسجيل المريض'}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
