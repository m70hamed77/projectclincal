'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Shield, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/hooks/useTranslations'

type Step = 'email' | 'otp' | 'reset' | 'success'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t, locale } = useTranslations()
  const isRTL = locale === 'ar'

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mouse position for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError(t('forgotPasswordPage.errors.emailRequired'))
      return
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      setError(t('forgotPasswordPage.errors.emailInvalid'))
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
        throw new Error(data.error || t('forgotPasswordPage.errors.unknownError'))
      }

      setSuccess(t('forgotPasswordPage.codeSent'))

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

  // Handle Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError(t('forgotPasswordPage.errors.otpRequired'))
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
        throw new Error(data.error || t('forgotPasswordPage.errors.unknownError'))
      }

      setSuccess(t('forgotPasswordPage.verified'))

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

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('forgotPasswordPage.errors.passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setError(t('forgotPasswordPage.errors.passwordMinLength'))
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
        throw new Error(data.error || t('forgotPasswordPage.errors.unknownError'))
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
        throw new Error(data.error || t('forgotPasswordPage.errors.unknownError'))
      }

      setSuccess(t('forgotPasswordPage.codeSent'))
      setTimeout(() => setSuccess(''), 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStepInfo = () => {
    switch (step) {
      case 'email':
        return {
          title: t('forgotPasswordPage.stepEmailTitle'),
          description: t('forgotPasswordPage.stepEmailDesc'),
          icon: Lock
        }
      case 'otp':
        return {
          title: t('forgotPasswordPage.stepOtpTitle'),
          description: t('forgotPasswordPage.stepOtpDesc').replace('{email}', email),
          icon: Mail
        }
      case 'reset':
        return {
          title: t('forgotPasswordPage.stepResetTitle'),
          description: t('forgotPasswordPage.stepResetDesc'),
          icon: Lock
        }
      case 'success':
        return {
          title: t('forgotPasswordPage.stepSuccessTitle'),
          description: t('forgotPasswordPage.stepSuccessDesc'),
          icon: CheckCircle
        }
      default:
        return {
          title: '',
          description: '',
          icon: Lock
        }
    }
  }

  const stepInfo = getStepInfo()
  const IconComponent = stepInfo.icon

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #581c87 50%, #020617 100%)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'rgba(147, 51, 234, 0.2)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s',
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'rgba(236, 72, 153, 0.1)',
            animation: 'pulse-slow 8s ease-in-out infinite'
          }}
        />

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full" style={{ animation: 'particle-1 15s ease-in-out infinite' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full" style={{ animation: 'particle-2 18s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full" style={{ animation: 'particle-3 12s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full" style={{ animation: 'particle-4 20s ease-in-out infinite' }} />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-lg z-10">
        {/* Card */}
        <div className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-500" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4" style={{ background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))', animation: 'bounce-slow 3s ease-in-out infinite' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#c084fc' }} />
              <span className="text-sm font-medium" style={{ color: '#d8b4fe' }}>Smiley Dental</span>
              <Sparkles className="w-4 h-4" style={{ color: '#f472b6' }} />
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', animation: 'float-slow 4s ease-in-out infinite' }}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">{stepInfo.title}</h2>
            <p className="text-gray-400">{stepInfo.description}</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
              <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('forgotPasswordPage.emailLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(90deg, #9333ea, #ec4899)' }} />
                  <div className="relative flex items-center">
                    <Mail className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      placeholder={t('forgotPasswordPage.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="w-full px-4 py-3.5 pr-12 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{ background: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group disabled:cursor-not-allowed hover:bg-green-800"
                style={{ background: loading ? '#4b5563' : '#16a34a' }}
              >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }} />
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('forgotPasswordPage.sending')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    <span>{t('forgotPasswordPage.sendCode')}</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('forgotPasswordPage.otpLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none -z-10" style={{ background: 'linear-gradient(90deg, #9333ea, #ec4899)' }} />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t('forgotPasswordPage.otpPlaceholder')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    required
                    dir="ltr"
                    autoComplete="one-time-code"
                    className="w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-center text-2xl tracking-widest focus:outline-none transition-all duration-300 z-10 relative"
                    style={{ background: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full mt-2 text-sm flex items-center justify-center gap-2 transition-colors group"
                  style={{ color: '#c084fc' }}
                >
                  <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                  {t('forgotPasswordPage.resendCode')}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                >
                  {isRTL ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                  {t('forgotPasswordPage.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group hover:scale-105 disabled:cursor-not-allowed"
                  style={{ background: loading ? '#4b5563' : '#16a34a' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('forgotPasswordPage.verifying')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      <span>{t('forgotPasswordPage.verify')}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('forgotPasswordPage.newPasswordLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(90deg, #9333ea, #ec4899)' }} />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('forgotPasswordPage.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 pr-12 pl-12 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{ background: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 text-gray-400 hover:text-purple-400 transition-colors hover:scale-110 active:scale-95"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('forgotPasswordPage.confirmPasswordLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(90deg, #9333ea, #ec4899)' }} />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('forgotPasswordPage.passwordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 pr-12 pl-12 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{ background: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 text-gray-400 hover:text-purple-400 transition-colors hover:scale-110 active:scale-95"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                >
                  {isRTL ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                  {t('forgotPasswordPage.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group hover:scale-105 disabled:cursor-not-allowed"
                  style={{ background: loading ? '#4b5563' : '#16a34a' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('forgotPasswordPage.changing')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      <span>{t('forgotPasswordPage.resetPassword')}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.2)', border: '2px solid rgba(34, 197, 94, 0.3)' }}>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                <p className="text-green-400 text-sm">
                  {t('forgotPasswordPage.successMessage')}
                </p>
              </div>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(90deg, #9333ea, #ec4899)' }}
              >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }} />
                <div className="flex items-center justify-center gap-3">
                  {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  <span>{t('forgotPasswordPage.goToLogin')}</span>
                </div>
              </button>
            </div>
          )}

          {/* Bottom Link */}
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-gray-400 text-sm">
              {t('forgotPasswordPage.haveAccount')}{' '}
              <Link
                href="/auth/login"
                className="font-semibold transition-all inline-flex items-center gap-1 group hover:underline"
                style={{ color: '#c084fc' }}
              >
                {t('forgotPasswordPage.login')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 backdrop-blur-sm border rounded-full px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Shield className="w-4 h-4" style={{ color: '#c084fc' }} />
            <span className="text-sm text-gray-400">{t('loginPage.securityNote')}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(100px, -50px) scale(1.5); opacity: 1; }
        }

        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-80px, 100px) scale(1.3); opacity: 1; }
        }

        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(120px, 80px) scale(1.4); opacity: 1; }
        }

        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-100px, -60px) scale(1.2); opacity: 1; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
