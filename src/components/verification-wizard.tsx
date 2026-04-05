'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowRight, ArrowLeft, Mail, Phone, Shield, User, Lock, CheckCircle2, AlertCircle, Sparkles, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Step = 'send' | 'verify' | 'form'

type AccountMode = 'new' | 'edit'

export default function VerificationWizard() {
  const [step, setStep] = useState<Step>('send')
  const [contact, setContact] = useState('')
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [userCode, setUserCode] = useState('')
  const [accountMode, setAccountMode] = useState<AccountMode>('new')
  const [loading, setLoading] = useState(false)
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { toast } = useToast()

  // Step 1: Send verification code
  const handleSendCode = async () => {
    if (!contact) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    
    try {
      // Call backend API to generate and send code
      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      })

      if (!response.ok) {
        throw new Error('Failed to send code')
      }

      const data = await response.json()
      setVerificationCode(data.code.toString())
      
      toast({
        title: 'تم الإرسال ✓',
        description: 'تم إرسال كود التحقق! تحقق من الكونسول.',
      })

      setStep('verify')
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إرسال كود التحقق، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify code
  const handleVerifyCode = async () => {
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
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contact, 
          code: parseInt(userCode) 
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Invalid code')
      }

      toast({
        title: 'تم التحقق ✓',
        description: 'الكود صحيح! يمكنك الآن إنشاء الحساب.',
      })

      setStep('form')
    } catch (error: any) {
      toast({
        title: 'كود غير صحيح ✗',
        description: error.message || 'الكود الذي أدخلته غير صحيح، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Submit account form
  const handleSubmitForm = async () => {
    // Validate form
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

    setLoading(true)

    try {
      const endpoint = accountMode === 'new' ? '/api/auth/register' : '/api/auth/update'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contact,
          verificationCode: userCode,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit')
      }

      toast({
        title: accountMode === 'new' ? 'تم إنشاء الحساب ✓' : 'تم تحديث البيانات ✓',
        description: accountMode === 'new' 
          ? 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.'
          : 'تم تحديث بياناتك بنجاح!',
      })

      // Reset form
      setStep('send')
      setContact('')
      setUserCode('')
      setVerificationCode(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشلت العملية، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const isEmail = contact.includes('@')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🦷</span>
            </div>
            <span className="text-xl font-bold">سمايلي</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">نظام تحقق آمن</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[
              { step: 'send', label: 'إرسال الكود' },
              { step: 'verify', label: 'التحقق' },
              { step: 'form', label: accountMode === 'new' ? 'إنشاء حساب' : 'تعديل البيانات' },
            ].map((item, index) => {
              const currentStepIndex = { send: 0, verify: 1, form: 2 }[step]
              const itemIndex = { send: 0, verify: 1, form: 2 }[item.step as Step]
              const isComplete = itemIndex < currentStepIndex
              const isActive = item.step === step || (item.step === 'form' && step === 'form')

              return (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isComplete
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium transition-all duration-300 ${
                        isActive ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step 1: Send Code */}
          {step === 'send' && (
            <Card className="shadow-2xl border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">إرسال كود التحقق</CardTitle>
                <CardDescription className="text-base">
                  أدخل بريدك الإلكتروني أو رقم هاتفك لتلقي كود التحقق
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">البريد الإلكتروني أو رقم الهاتف</Label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {isEmail ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                    </div>
                    <Input
                      id="contact"
                      type="text"
                      placeholder="example@email.com أو 01xxxxxxxxx"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="pr-10 text-right"
                      dir="auto"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-semibold shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>إرسال كود التحقق</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                  <Shield className="w-4 h-4" />
                  <span>الكود سيظهر في الكونسول (طريقة مجانية للتجربة)</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Verify Code */}
          {step === 'verify' && (
            <Card className="shadow-2xl border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">أدخل كود التحقق</CardTitle>
                <CardDescription className="text-base">
                  أدخل الكود المكون من 6 أرقام الذي تم إرساله
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">كود التحقق</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('send')}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    <span>رجوع</span>
                  </Button>
                  <Button
                    onClick={handleVerifyCode}
                    disabled={loading || userCode.length !== 6}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري التحقق...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>تحقق</span>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full text-sm"
                >
                  <span>إعادة إرسال الكود</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Account Form */}
          {step === 'form' && (
            <Card className="shadow-2xl border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {accountMode === 'new' ? <User className="w-8 h-8 text-white" /> : <Edit className="w-8 h-8 text-white" />}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {accountMode === 'new' ? 'إنشاء حساب جديد' : 'تعديل البيانات'}
                </CardTitle>
                <CardDescription className="text-base">
                  {accountMode === 'new' 
                    ? 'أكمل بياناتك لإنشاء حساب جديد'
                    : 'قم بتحديث بياناتك'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Toggle Mode */}
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setAccountMode('new')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                      accountMode === 'new'
                        ? 'bg-white shadow text-emerald-700'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      <span>إنشاء حساب جديد</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setAccountMode('edit')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                      accountMode === 'edit'
                        ? 'bg-white shadow text-emerald-700'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span>تعديل البيانات</span>
                    </div>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">الاسم الأول *</Label>
                    <Input
                      id="firstName"
                      placeholder="محمد"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">الاسم الأخير *</Label>
                    <Input
                      id="lastName"
                      placeholder="أحمد"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="•••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('verify')}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    <span>رجوع</span>
                  </Button>
                  <Button
                    onClick={handleSubmitForm}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري الحفظ...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>{accountMode === 'new' ? 'إنشاء حساب' : 'تحديث البيانات'}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 سمايلي - منصة ربط طلاب طب الأسنان بالمرضى</p>
          <p className="mt-1">نظام التحقق مجاني للتجربة - الكود يظهر في الكونسول</p>
        </div>
      </footer>
    </div>
  )
}
