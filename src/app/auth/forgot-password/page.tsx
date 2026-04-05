'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, ArrowLeft, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'otp' | 'reset' | 'success'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [devOtp, setDevOtp] = useState('')

  // الخطوة 1: طلب OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('البريد الإلكتروني مطلوب')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      setSuccess('تم إرسال رمز التحقق')
      setDevOtp(data.dev_otp || '')
      
      // الانتقال للخطوة التالية بعد 2 ثانية
      setTimeout(() => {
        setSuccess('')
        setStep('otp')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // الخطوة 2: التحقق من OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('يجب إدخال رمز التحقق المكون من 6 أرقام')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      setSuccess('تم التحقق بنجاح')
      
      // الانتقال للخطوة التالية بعد 1 ثانية
      setTimeout(() => {
        setSuccess('')
        setStep('reset')
      }, 1000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // الخطوة 3: إعادة تعيين كلمة السر
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('كلمة السر الجديدة غير متطابقة')
      return
    }

    if (password.length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      setStep('success')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      setDevOtp(data.dev_otp || '')
      setSuccess('تم إعادة إرسال رمز التحقق')
      setTimeout(() => setSuccess(''), 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl" suppressHydrationWarning={true}>
            {step === 'email' && 'نسيت كلمة السر؟'}
            {step === 'otp' && 'أدخل رمز التحقق'}
            {step === 'reset' && 'إعادة تعيين كلمة السر'}
            {step === 'success' && 'تم بنجاح!'}
          </CardTitle>
          <CardDescription suppressHydrationWarning={true}>
            {step === 'email' && 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة السر'}
            {step === 'otp' && `أدخل رمز التحقق المرسل إلى ${email}`}
            {step === 'reset' && 'أدخل كلمة السر الجديدة'}
            {step === 'success' && 'تم تغيير كلمة السر بنجاح'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-4 h-4 ml-2" />
              {success}
            </Alert>
          )}

          {/* الخطوة 1: إدخال البريد الإلكتروني */}
          {step === 'email' && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={loading}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                {!loading && <ArrowLeft className="w-4 h-4 mr-2" />}
              </Button>
            </form>
          )}

          {/* الخطوة 2: إدخال OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  رمز التحقق (6 أرقام)
                </label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                  dir="ltr"
                  className="text-center text-2xl tracking-widest"
                />
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  إعادة إرسال الرمز
                </button>
              </div>

              {/* عرض OTP في وضع التطوير */}
              {devOtp && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 text-center">
                    🔐 رمز التحقق (للتجربة): <strong className="text-xl">{devOtp}</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  رجوع
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={loading}
                >
                  {loading ? 'جاري التحقق...' : 'تحقق'}
                  {!loading && <ArrowLeft className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          )}

          {/* الخطوة 3: إدخال كلمة السر الجديدة */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  كلمة السر الجديدة
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  تأكيد كلمة السر الجديدة
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('otp')}
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  رجوع
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={loading}
                >
                  {loading ? 'جاري التغيير...' : 'تغيير كلمة السر'}
                  {!loading && <ArrowLeft className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          )}

          {/* الخطوة 4: النجاح */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                تم تغيير كلمة السر بنجاح. يمكنك الآن تسجيل الدخول بكلمة السر الجديدة.
              </p>
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                الذهاب لتسجيل الدخول
                <ArrowLeft className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-emerald-600 flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-3 h-3" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
