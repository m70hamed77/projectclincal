'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, ArrowRight, Home, CheckCircle2, AlertCircle, RefreshCw, Shield, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EnterCodePage() {
  const router = useRouter()
  const [userCode, setUserCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [contactInfo, setContactInfo] = useState<{ value: string; method: string } | null>(null)

  // استرجاع الكود المخزن في localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('verificationCode')
    const savedContact = localStorage.getItem('contactValue')
    const savedMethod = localStorage.getItem('contactMethod')

    if (savedCode && savedContact) {
      setContactInfo({ value: savedContact, method: savedMethod || 'email' })
    } else {
      // لم يتم إرسال كود بعد، Redirect لصفحة إرسال الكود
      router.push('/auth/verify/send-code')
    }
  }, [router])

  // التحقق من الكود
  const verifyCode = async () => {
    setError('')
    setUserCode(userCode.trim())

    if (!userCode.trim()) {
      setError('الرجاء إدخال كود التحقق')
      return
    }

    setIsVerifying(true)

    try {
      // استرجاع الكود من localStorage
      const savedCode = localStorage.getItem('verificationCode')
      
      if (!savedCode) {
        setError('الكود منتهي الصلاحية. يرجى طلب كود جديد')
        setIsVerifying(false)
        return
      }

      // محاكاة استدعاء API للتحقق
      await new Promise(resolve => setTimeout(resolve, 1000))

      // التحقق من الكود
      if (userCode.trim() === savedCode) {
        // الكود صحيح - مسح الكود من localStorage
        localStorage.removeItem('verificationCode')
        localStorage.removeItem('contactValue')
        localStorage.removeItem('contactMethod')
        
        // توجيه لصفحة إنشاء الحساب
        router.push('/auth/register-new')
      } else {
        setError('كود التحقق غير صحيح! حاول مرة أخرى')
      }
    } catch (err) {
      setError('حدث خطأ أثناء التحقق من الكود')
      console.error('[Verify Code Error]:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  // إعادة إرسال الكود
  const resendCode = () => {
    router.push('/auth/verify/send-code')
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🔢</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            إدخال كود التحقق
          </h1>
          <p className="text-muted-foreground text-lg">
            أدخل الكود الذي وصلتك
          </p>
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-accent transition-colors mt-4">
              <Home className="w-4 h-4" />
              العودة للرئيسية
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">التحقق من الكود</CardTitle>
                <CardDescription className="text-sm text-blue-700">
                  أدخل الكود المرسل على {contactInfo?.method === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                  ✓
                </div>
                <span className="text-sm font-medium text-emerald-600">
                  إرسال الكود
                </span>
              </div>
              <div className="w-8 h-0.5 bg-muted"></div>
              <div className={`flex items-center gap-2`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userCode ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                  {userCode ? '✓' : '2'}
                </div>
                <span className={`text-sm font-medium ${userCode ? 'text-blue-600' : 'text-muted-foreground'}`}>
                  إدخال الكود
                </span>
              </div>
              <div className="w-8 h-0.5 bg-muted"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  3
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  إنشاء الحساب
                </span>
              </div>
            </div>

            {/* Contact Info Display */}
            <Alert className="bg-muted/50">
              <AlertDescription className="text-sm">
                <div className="font-medium mb-1">تم إرسال الكود إلى:</div>
                <div className="flex items-center gap-2">
                  {contactInfo?.method === 'email' ? (
                    <>
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="font-mono">{contactInfo.value}</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-mono">{contactInfo.value}</span>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {/* Code Input */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-base font-medium">
                كود التحقق (6 أرقام) *
              </Label>
              <div className="relative">
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={userCode}
                  onChange={(e) => {
                    // قبول أرقام فقط
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setUserCode(value)
                    setError('')
                  }}
                  className="text-center text-3xl tracking-widest font-mono h-14"
                  autoFocus
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={verifyCode}
              disabled={isVerifying || userCode.length !== 6}
              className="w-full h-12 text-base font-semibold bg-green-700 text-white hover:bg-green-800 gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  تحقق من الكود
                </>
              )}
            </Button>

            {/* Resend Link */}
            <div className="text-center">
              <button
                onClick={resendCode}
                className="text-sm text-blue-600 hover:underline font-medium"
                disabled={isVerifying}
              >
                لم يصلك الكود؟
                <br />
                <span className="text-blue-800 font-semibold">إعادة إرسال كود جديد</span>
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center pt-4 border-t">
              <Link
                href="/auth/verify/send-code"
                className="text-sm text-muted-foreground hover:text-foreground font-medium flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                رجوع
              </Link>
            </div>

            {/* Info Alert */}
            <Alert className="bg-muted/50">
              <AlertDescription className="text-sm">
                <strong>تلميح:</strong> الكود صالح لمدة 5 دقائق فقط من وقت الإرسال
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            لديك حساب بالفعل؟ سجل دخولك
          </Link>
        </div>
      </div>
    </div>
  )
}
