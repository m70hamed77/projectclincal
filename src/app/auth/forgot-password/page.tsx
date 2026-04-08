'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Shield, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
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
  const [devOtp, setDevOtp] = useState('')

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
      setDevOtp(data.dev_otp || '')

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

      setDevOtp(data.dev_otp || '')
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
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{
            animationDelay: '0s',
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"
        />

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-particle-1" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-particle-2" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-particle-3" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-particle-4" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      {/* Back Button */}
      <Link
        href="/auth/login"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
      >
        {isRTL ? <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
        <span className="text-sm font-medium">{t('forgotPasswordPage.back')}</span>
      </Link>

      {/* Main Container */}
      <div className="relative w-full max-w-lg z-10">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-purple-500/30 animate-slide-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 mb-4 animate-bounce-slow">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Smiley Dental</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 animate-float-slow">
              <IconComponent className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">{stepInfo.title}</h2>
            <p className="text-gray-400">{stepInfo.description}</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-shake">
              <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Mail className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      placeholder={t('forgotPasswordPage.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                  <input
                    type="text"
                    placeholder={t('forgotPasswordPage.otpPlaceholder')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    required
                    dir="ltr"
                    className="w-full px-4 py-3.5 bg-slate-800/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 text-center text-2xl tracking-widest focus:outline-none focus:border-purple-500 transition-all duration-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 transition-colors group"
                >
                  <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                  {t('forgotPasswordPage.resendCode')}
                </button>
              </div>

              {/* Dev OTP Display */}
              {devOtp && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-sm text-amber-400 text-center">
                    🔐 {t('forgotPasswordPage.checkConsole')} <strong className="text-xl ml-2">{devOtp}</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                  {t('forgotPasswordPage.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                  }`}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('forgotPasswordPage.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 pr-12 pl-12 bg-slate-800/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('forgotPasswordPage.passwordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 pr-12 pl-12 bg-slate-800/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300"
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
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                  {t('forgotPasswordPage.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                  }`}
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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 text-sm">
                  {t('forgotPasswordPage.successMessage')}
                </p>
              </div>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-center gap-3">
                  {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  <span>{t('forgotPasswordPage.goToLogin')}</span>
                </div>
              </button>
            </div>
          )}

          {/* Bottom Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              {t('forgotPasswordPage.haveAccount')}{' '}
              <Link
                href="/auth/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-all inline-flex items-center gap-1 group hover:underline"
              >
                {t('forgotPasswordPage.login')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">{t('loginPage.securityNote')}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-particle-1 {
          animation: particle-1 15s ease-in-out infinite;
        }

        .animate-particle-2 {
          animation: particle-2 18s ease-in-out infinite;
        }

        .animate-particle-3 {
          animation: particle-3 12s ease-in-out infinite;
        }

        .animate-particle-4 {
          animation: particle-4 20s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
