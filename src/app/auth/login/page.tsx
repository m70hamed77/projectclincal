'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail, AlertCircle, LogIn, User, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslations } from '@/hooks/useTranslations'

export default function LoginPage() {
  const router = useRouter()
  const { t, locale } = useTranslations()
  const isRTL = locale === 'ar'

  // State Management
  const [formData, setFormData] = useState<{
    email: string
    password: string
  }>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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

  // Real-time Validation
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!value.trim()) {
          newErrors.email = t('loginPage.errors.emailRequired')
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = t('loginPage.errors.emailInvalid')
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = t('loginPage.errors.passwordRequired')
        } else if (value.length < 8) {
          newErrors.password = t('loginPage.errors.passwordMinLength')
        } else {
          delete newErrors.password
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  // Handle Blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  // Check if form is valid
  const isFormValid = () => {
    const hasEmail = formData.email && formData.email.trim().length > 5
    const hasPassword = formData.password && formData.password.length >= 6
    return hasEmail && hasPassword
  }

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fieldsToValidate = ['email', 'password']
    const newTouched: Record<string, boolean> = {}

    fieldsToValidate.forEach(field => {
      newTouched[field] = true
      validateField(field, formData[field])
    })

    setTouched(newTouched)

    if (!isFormValid()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
          rememberMe
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(t('loginPage.errors.parseError'))
      }

      if (response.ok) {
        if (!data.success) {
          const errorMessage = data.message || data.error || 'Unknown error'
          setErrors({ submit: errorMessage })
          return
        }

        // Save user data
        try {
          localStorage.setItem('currentUser', JSON.stringify(data.user))
          localStorage.setItem('userId', data.user?.id || '')
          sessionStorage.setItem('currentUser', JSON.stringify(data.user))
          sessionStorage.setItem('userId', data.user?.id || '')
          document.cookie = `userId=${data.user?.id || ''}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=lax`
          document.cookie = `userRole=${data.user?.role || ''}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=lax`
        } catch (storageError) {
          console.warn('Failed to save user session:', storageError)
        }

        // Redirect based on role
        let redirectPath = '/dashboard'
        if (data.user?.role === 'ADMIN') {
          redirectPath = '/admin'
        } else if (data.user?.role === 'STUDENT') {
          redirectPath = '/dashboard/student'
        } else if (data.user?.role === 'PATIENT') {
          redirectPath = '/dashboard/patient'
        }

        const userId = data.user?.id || ''
        router.push(`${redirectPath}?userId=${userId}`)
      } else {
        let errorMessage = t('loginPage.errors.invalidCredentials')
        if (data.error) errorMessage = data.error
        else if (data.message) errorMessage = data.message
        else if (response.status === 401) errorMessage = t('loginPage.errors.invalidCredentials')
        else if (response.status === 500) errorMessage = t('loginPage.errors.serverError')

        setErrors({ submit: errorMessage })
      }
    } catch (error: any) {
      let errorMessage = t('loginPage.errors.connectionError')
      if (error.name === 'AbortError') {
        errorMessage = t('loginPage.errors.timeout')
      } else if (error.message) {
        errorMessage = error.message
      }
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

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

      {/* Back Button - Stylish */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 group"
      >
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all duration-500 hover:scale-110 active:scale-95"
          style={{
            background: "rgba(147, 51, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(147, 51, 234, 0.4)",
            boxShadow: "0 4px 14px rgba(147, 51, 234, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(147, 51, 234, 0.4)";
            e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.6)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(147, 51, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(147, 51, 234, 0.2)";
            e.currentTarget.style.borderColor = "rgba(147, 51, 234, 0.4)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(147, 51, 234, 0.3)";
          }}
        >
          <ArrowRight
            className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
          />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('loginPage.back')}
          </span>
        </div>
      </Link>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col justify-center items-start space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">Smiley Dental</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                {t('loginPage.welcomeToSmiley')}{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  {t('loginPage.brandName')}
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                {t('loginPage.platformDescription')}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4 w-full">
              <div className="group bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('loginPage.securityTitle')}</h3>
                    <p className="text-gray-400 text-sm">{t('loginPage.securityDescFull')}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('loginPage.speedTitle')}</h3>
                    <p className="text-gray-400 text-sm">{t('loginPage.speedDescFull')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-purple-500/30">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 mb-4 animate-bounce-slow">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">{t('loginPage.loginNowBadge')}</span>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{t('loginPage.welcomeBackTitle')}</h2>
                <p className="text-gray-400">{t('loginPage.enterData')}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('loginPage.emailLabel')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <Mail className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                          errors.email && touched.email
                            ? 'border-red-500 group-focus-within:border-red-500'
                            : 'border-white/10 group-focus-within:border-purple-500'
                        }`}
                        placeholder="example@domain.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-400 flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('loginPage.passwordLabel')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3.5 pr-12 pl-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                          errors.password && touched.password
                            ? 'border-red-500 group-focus-within:border-red-500'
                            : 'border-white/10 group-focus-within:border-purple-500'
                        }`}
                        placeholder="••••••••"
                        autoComplete="current-password"
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
                  {errors.password && touched.password && (
                    <p className="text-sm text-red-400 flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded-lg peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all duration-300 group-hover:border-purple-400" />
                      <svg className="absolute inset-0 w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{t('loginPage.rememberMe')}</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors hover:underline font-medium"
                  >
                    {t('loginPage.forgotPassword')}
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98]'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('loginPage.loggingIn')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>{t('loginPage.title')}</span>
                    </div>
                  )}
                </button>

                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-shake">
                    <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900/50 text-gray-400">{t('loginPage.or')}</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="py-3.5 px-4 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="py-3.5 px-4 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Google
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  {t('loginPage.noAccount')}{' '}
                  <Link
                    href="/auth/register-verification"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-all inline-flex items-center gap-1 group hover:underline"
                  >
                    {t('loginPage.createNewAccount')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
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

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
