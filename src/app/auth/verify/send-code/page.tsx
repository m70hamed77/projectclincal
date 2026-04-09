'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Mail, Phone, ArrowRight, Home, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function SendVerificationCodePage() {
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [contactValue, setContactValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [error, setError] = useState('')

  // توليد وإرسال كود التحقق
  const sendCode = async () => {
    setError('')
    
    // التحقق من صحة البيانات
    if (!contactValue.trim()) {
      setError(contactMethod === 'email' ? 'البريد الإلكتروني مطلوب' : 'رقم الهاتف مطلوب')
      return
    }

    // التحقق من صحة التنسيق
    if (contactMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)) {
      setError('البريد الإلكتروني غير صحيح')
      return
    }

    if (contactMethod === 'phone' && !/^01[0-9]{9}$/.test(contactValue)) {
      setError('رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01')
      return
    }

    setIsSending(true)

    try {
      // توليد كود عشوائي 6 أرقام
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // حفظ الكود في الذاكرة (للتجربة)
      setVerificationCode(code)

      // عرض الكود في الكونسول
      console.log('=====================================')
      console.log('🔐 كود التحقق (Verification Code):')
      console.log('📧 القيمة:', contactValue)
      console.log('🔢 الكود:', code)
      console.log('⏰ صالحية: 5 دقائق من الآن')
      console.log('=====================================')

      // في الإنتاج، هنا سيتم إرسال الكود عبر البريد الإلكتروني

      setCodeSent(true)
      setError('')
    } catch (err) {
      setError('حدث خطأ أثناء إرسال كود التحقق')
      console.error('[Send Code Error]:', err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🔐</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            نظام التحقق الآمن
          </h1>
          <p className="text-muted-foreground text-lg">
            احصل على كود التحقق لتأمين حسابك
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
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-emerald-900">إرسال كود التحقق</CardTitle>
                <CardDescription className="text-sm text-emerald-700">
                  اختر طريقة التواصل لتلقي كود التحقق
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${codeSent ? 'bg-emerald-600 text-white' : 'bg-muted'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${codeSent ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  إرسال الكود
                </span>
              </div>
              <div className="w-8 h-0.5 bg-muted"></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${codeSent ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${codeSent ? 'text-blue-600' : 'text-muted-foreground'}`}>
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

            {/* Step 1: Send Code */}
            {!codeSent ? (
              <div className="space-y-6">
                {/* Contact Method Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">اختر طريقة التواصل:</Label>
                  <RadioGroup
                    value={contactMethod}
                    onValueChange={(v: 'email' | 'phone') => {
                      setContactMethod(v)
                      setCodeSent(false)
                      setVerificationCode(null)
                      setContactValue('')
                      setError('')
                    }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <label className={`flex items-center space-x-2 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 ${contactMethod === 'email' ? 'border-emerald-500 bg-emerald-50' : ''}`}>
                      <RadioGroupItem value="email" id="email" />
                      <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-emerald-600" />
                        <div>
                          <div className="font-medium">البريد الإلكتروني</div>
                          <div className="text-xs text-muted-foreground">إرسال على الإيميل</div>
                        </div>
                      </div>
                    </label>
                    <label className={`flex items-center space-x-2 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 ${contactMethod === 'phone' ? 'border-emerald-500 bg-emerald-50' : ''}`}>
                      <RadioGroupItem value="phone" id="phone" />
                      <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-emerald-600" />
                        <div>
                          <div className="font-medium">رقم الهاتف</div>
                          <div className="text-xs text-muted-foreground">إرسال على الموبايل</div>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {/* Contact Value Input */}
                <div className="space-y-2">
                  <Label htmlFor="contactValue">
                    {contactMethod === 'email' ? 'البريد الإلكتروني *' : 'رقم الهاتف *'}
                  </Label>
                  <div className="relative">
                    {contactMethod === 'email' ? (
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    )}
                    <Input
                      id="contactValue"
                      type={contactMethod === 'email' ? 'email' : 'tel'}
                      placeholder={contactMethod === 'email' ? 'example@email.com' : '01xxxxxxxxx'}
                      maxLength={contactMethod === 'phone' ? 11 : undefined}
                      value={contactValue}
                      onChange={(e) => {
                        setContactValue(e.target.value)
                        setError('')
                      }}
                      className="pr-10 text-lg h-12"
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}
                </div>

                {/* Send Button */}
                <Button
                  onClick={sendCode}
                  disabled={isSending || !contactValue.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      إرسال كود التحقق
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // Code Sent State
              <div className="space-y-6">
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                  <AlertDescription className="text-emerald-900">
                    تم إرسال كود التحقق بنجاح! 🎉
                  </AlertDescription>
                </Alert>

                <div className="p-6 bg-white border-2 border-dashed border-emerald-200 rounded-xl text-center space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      كود التحقق (للتجربة فقط):
                    </div>
                    {verificationCode && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                        <div className="text-4xl font-bold tracking-widest text-emerald-900 font-mono">
                          {verificationCode}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>افتح الكونسول لرؤية الكود</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    window.location.href = '/auth/verify/enter-code'
                    // حفظ الكود في localStorage للمرحلة التالية
                    if (verificationCode) {
                      localStorage.setItem('verificationCode', verificationCode)
                      localStorage.setItem('contactValue', contactValue)
                    }
                  }}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2"
                >
                  التالي: إدخال الكود
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setCodeSent(false)
                    setVerificationCode(null)
                    setContactValue('')
                    setError('')
                  }}
                  className="w-full gap-2"
                  disabled={isSending}
                >
                  <RefreshCw className="w-4 h-4" />
                  إرسال كود جديد
                </Button>
              </div>
            )}

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription className="text-blue-900">
                <strong>ملاحظة مهمة:</strong> الكود يظهر في الكونسول للتجربة فقط. في الإنتاج، سيتم إرساله عبر البريد الإلكتروني أو رسالة نصية.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
            لديك حساب بالفعل؟ سجل دخولك
          </Link>
        </div>
      </div>
    </div>
  )
}
