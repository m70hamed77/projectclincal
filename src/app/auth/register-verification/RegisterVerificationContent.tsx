'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Send, ArrowRight, ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle, GraduationCap, Clock, Phone, MapPin, Sparkles, Shield, Zap, Heart, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslations } from '@/hooks/useTranslations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// قائمة المحافظات المصرية مع الترجمات
const GOVERNORATES: Record<string, { ar: string; en: string }> = {
  "cairo": { ar: "القاهرة", en: "Cairo" },
  "giza": { ar: "الجيزة", en: "Giza" },
  "alexandria": { ar: "الإسكندرية", en: "Alexandria" },
  "dakahlia": { ar: "الدقهلية", en: "Dakahlia" },
  "sharqia": { ar: "الشرقية", en: "Sharqia" },
  "monufia": { ar: "المنوفية", en: "Monufia" },
  "qalyubia": { ar: "القليوبية", en: "Qalyubia" },
  "beheira": { ar: "البحيرة", en: "Beheira" },
  "gharbia": { ar: "الغربية", en: "Gharbia" },
  "kafr_elsheikh": { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  "damietta": { ar: "الدلتا", en: "Damietta" },
  "ismailia": { ar: "الإسماعيلية", en: "Ismailia" },
  "port_said": { ar: "بور سعيد", en: "Port Said" },
  "suez": { ar: "السويس", en: "Suez" },
  "north_sinai": { ar: "شمال سيناء", en: "North Sinai" },
  "south_sinai": { ar: "جنوب سيناء", en: "South Sinai" },
  "fayoum": { ar: "الجيزة (الواحة)", en: "Fayoum" },
  "minya": { ar: "المنيا", en: "Minya" },
  "asyut": { ar: "أسيوط", en: "Asyut" },
  "sohag": { ar: "سوهاج", en: "Sohag" },
  "qena": { ar: "قنا", en: "Qena" },
  "luxor": { ar: "الأقصر", en: "Luxor" },
  "aswan": { ar: "أسوان", en: "Aswan" },
  "red_sea": { ar: "البحر الأحمر", en: "Red Sea" },
  "new_valley": { ar: "الوادي الجديد", en: "New Valley" },
  "matrouh": { ar: "مطروح", en: "Matrouh" },
}

export function RegisterWithVerificationContent() {
  const { t, locale } = useTranslations()
  const isRTL = locale === 'ar'
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'patient'

  const [userType, setUserType] = useState(type)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    governorate: '',
    address: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    universityName: '',
    academicYear: '',
  })

  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

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

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Password Strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  // Handle ID Card Upload
  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors({ idCard: 'يجب أن تكون الصورة بتنسيق JPG أو PNG' })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ idCard: 'حجم الصورة يجب أن يكون أقل من 5MB' })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setIdCardPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIdCardFile(file)
    delete errors.idCard
    setErrors(errors)
  }

  // Upload ID Card to server
  const uploadIdCard = async (): Promise<string | null> => {
    if (!idCardFile) return null
setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('idCardFile', idCardFile)
const response = await fetch('/api/upload-id-card', {
        method: 'POST',
        body: formDataUpload,
      })

      // ✅ الحل الصحيح - قراءة النص أولاً ثم التحقق
      const text = await response.text()

      if (!response.ok) {
        console.error('[UPLOAD ID CARD] ❌ Server error:', text)
        console.error('[UPLOAD ID CARD] ❌ Status:', response.status)
        return null
      }

      // الآن نحاول تحليل JSON بعد التأكد من نجاح الطلب
      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error('[UPLOAD ID CARD] ❌ Failed to parse response as JSON:', text)
        return null
      }

      // ✅ التحقق من idCardUrl بدلاً من url
      if (data.success && data.idCardUrl) {
        console.log('[UPLOAD ID CARD] ✅ Upload successful:', data.idCardUrl)
        return data.idCardUrl
      } else {
        console.error('[UPLOAD ID CARD] ❌ Invalid response:', data)
        return null
      }
    } catch (error) {
      console.error('[UPLOAD ID CARD] ❌ Error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'name':
        const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/
        if (!value.trim()) {
          newErrors.name = 'الاسم مطلوب'
        } else if (value.trim().length < 3) {
          newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل'
        } else if (!nameRegex.test(value.trim())) {
          newErrors.name = 'الاسم يجب أن يحتوي على أحرف فقط'
        } else {
          delete newErrors.name
        }
        break

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!value.trim()) {
          newErrors.email = 'البريد الإلكتروني مطلوب'
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = 'البريد الإلكتروني غير صحيح'
        } else {
          delete newErrors.email
        }
        break

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'رقم الهاتف مطلوب'
        } else if (!/^01[0125][0-9]{8}$/.test(value.trim())) {
          newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01)'
        } else {
          delete newErrors.phone
        }
        break

      case 'governorate':
        if (!value.trim()) {
          newErrors.governorate = 'المحافظة مطلوبة'
        } else {
          delete newErrors.governorate
        }
        break

      case 'address':
        if (!value.trim()) {
          newErrors.address = 'العنوان بالتفصيل مطلوب'
        } else if (value.trim().length < 10) {
          newErrors.address = 'العنوان يجب أن يكون 10 أحرف على الأقل'
        } else {
          delete newErrors.address
        }
        break

      case 'universityName':
        if (!value.trim()) {
          newErrors.universityName = 'الجامعة مطلوبة'
        } else {
          delete newErrors.universityName
        }
        break

      case 'academicYear':
        if (userType === 'student' && !value.trim()) {
          newErrors.academicYear = 'السنة الدراسية مطلوبة'
        } else {
          delete newErrors.academicYear
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = 'كلمة المرور مطلوبة'
        } else if (value.length < 8) {
          newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
        } else {
          delete newErrors.password
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
        } else {
          delete newErrors.confirmPassword
        }
        break

      case 'verificationCode':
        if (!value) {
          newErrors.verificationCode = 'كود التحقق مطلوب'
        } else if (!/^\d{4}$/.test(value)) {
          newErrors.verificationCode = 'الكود يجب أن يكون 4 أرقام'
        } else {
          delete newErrors.verificationCode
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let cleanedValue = value

    if (name === 'phone') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 11)
    }

    if (name === 'verificationCode') {
      cleanedValue = value.slice(0, 4)
    }

    setFormData(prev => ({ ...prev, [name]: cleanedValue }))
    validateField(name, cleanedValue)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  // Send Verification Code
  const sendVerificationCode = async () => {
    const allValid = validateAllFields()
    if (!allValid) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          name: formData.name.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        setCountdown(60)
        setStep(2)
      } else {
        setErrors({ email: data.error || 'فشل في إرسال كود التحقق' })
      }
    } catch (error) {
      setErrors({ email: 'حدث خطأ أثناء إرسال كود التحقق' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateAllFields = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب'
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    if (!formData.governorate.trim()) newErrors.governorate = 'المحافظة مطلوبة'
    if (!formData.address.trim()) newErrors.address = 'العنوان بالتفصيل مطلوب'
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'

    if (userType === 'student') {
      if (!formData.universityName.trim()) newErrors.universityName = 'الجامعة مطلوبة'
      if (!formData.academicYear.trim()) newErrors.academicYear = 'السنة الدراسية مطلوبة'
      if (!idCardFile) newErrors.idCard = 'صورة الكارنيه مطلوبة'
    }

    if (formData.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (formData.phone && !/^01[0125][0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'رقم الهاتف غير صحيح'
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
    }

    if (formData.address && formData.address.trim().length < 10) {
      newErrors.address = 'العنوان يجب أن يكون 10 أحرف على الأقل'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const verifyAndRegister = async () => {
    if (!/^\d{4}$/.test(formData.verificationCode)) {
      setErrors({ verificationCode: 'الكود يجب أن يكون 4 أرقام' })
      return
    }

    // Validate ID card for students
    if (userType === 'student' && !idCardFile) {
      setErrors({ idCard: 'صورة الكارنيه مطلوبة' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Upload ID card first for students
      let idCardUrl: string | null = null
      if (userType === 'student' && idCardFile) {
        idCardUrl = await uploadIdCard()
        if (!idCardUrl) {
          setErrors({ idCard: 'فشل في رفع صورة الكارنيه' })
          setIsSubmitting(false)
          return
        }
      }

      const apiEndpoint = userType === 'patient'
        ? '/api/auth/register-patient'
        : '/api/auth/register-student'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          name: formData.name.trim(),
          verificationCode: formData.verificationCode,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          ...(userType === 'student' && {
            universityName: formData.universityName,
            city: formData.governorate.trim(),
            academicYear: parseInt(formData.academicYear),
            idCardUrl: idCardUrl,
          }),
          ...(userType === 'patient' && {
            governorate: formData.governorate.trim(),
            gender: null,
            age: null,
          })
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStep(3)
      } else {
        // Handle different error types
        const errorMessage = data.error || 'فشل في التسجيل'

        // Check if error is related to email or phone
        if (errorMessage.includes('البريد الإلكتروني')) {
          // Go back to step 1 to show the email error
          setStep(1)
          // Clear all errors first, then set email error
          setErrors({})
          setTimeout(() => {
            setErrors({ email: errorMessage })
          }, 0)
        } else if (errorMessage.includes('رقم الهاتف')) {
          // Go back to step 1 to show the phone error
          setStep(1)
          // Clear all errors first, then set phone error
          setErrors({})
          setTimeout(() => {
            setErrors({ phone: errorMessage })
          }, 0)
        } else {
          // Other errors show in verification code field (stay on step 2)
          setErrors({ verificationCode: errorMessage })
        }
      }
    } catch (error) {
      setErrors({ verificationCode: 'حدث خطأ أثناء التسجيل' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const studentFieldsValid = userType === 'student'
      ? formData.universityName.trim().length > 0 &&
        formData.academicYear.trim().length > 0 &&
        idCardFile !== null
      : true

    return formData.name.trim().length >= 3 &&
           /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim()) &&
           /^01[0125][0-9]{8}$/.test(formData.phone.trim()) &&
           formData.governorate.trim().length > 0 &&
           formData.address.trim().length >= 10 &&
           formData.password.length >= 8 &&
           formData.password === formData.confirmPassword &&
           studentFieldsValid
  }

  // Step 1: Registration Form
  if (step === 1) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '0s',
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
            }}
          />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"
          />

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-particle-1" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-particle-2" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-particle-3" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-particle-4" />
        </div>

        {/* Main Container */}
        <div className="relative w-full max-w-4xl z-10 animate-slide-in-up">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden hover:shadow-purple-500/20 transition-all duration-500 hover:border-purple-500/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {userType === 'patient' ? <User className="w-10 h-10 text-white" /> : <GraduationCap className="w-10 h-10 text-white" />}
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2 animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {userType === 'patient' ? t('registerPage.registerAsPatient') : t('registerPage.registerAsStudent')}
                </h1>
                <p className="text-gray-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                  {userType === 'patient'
                    ? t('registerPage.patientDesc')
                    : t('registerPage.studentDesc')}
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-5">
              {/* User Type Toggle */}
              <div className="bg-white/5 backdrop-blur-sm p-1.5 rounded-2xl flex gap-2 border border-white/10">
                <button
                  onClick={() => setUserType('patient')}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group ${
                    userType === 'patient'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <User className={`w-5 h-5 ${userType === 'patient' ? 'group-hover:scale-110 transition-transform' : ''}`} />
                  {t('registerPage.patient')}
                </button>
                <button
                  onClick={() => setUserType('student')}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group ${
                    userType === 'student'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 ${userType === 'student' ? 'group-hover:scale-110 transition-transform' : ''}`} />
                  {t('registerPage.studentDoctor')}
                </button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.fullNameLabel')}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-center">
                    <User className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.name ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder={t('registerPage.fullNamePlaceholder')}
                    />
                  </div>
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.emailLabel')}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-center">
                    <Mail className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.email ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder="example@domain.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
                {!errors.email && formData.email && (
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {t('registerPage.codeSentTo' )}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.phoneLabel')}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-center">
                    <Phone className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.phone ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder="01xxxxxxxxx"
                      autoComplete="tel"
                      maxLength={11}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Governorate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.governorateLabel')}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative">
                    <Select value={formData.governorate} onValueChange={(value) => handleSelectChange('governorate', value)}>
                      <SelectTrigger className={`w-full bg-slate-800/50 border-2 rounded-xl text-white focus:ring-0 transition-all duration-300 ${
                        errors.governorate ? 'border-red-500' : 'border-white/10'
                      }`}>
                        <SelectValue placeholder={isRTL ? "اختر المحافظة" : "Select Governorate"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto bg-slate-800 border-white/10">
                        {Object.entries(GOVERNORATES).map(([key, gov]) => (
                          <SelectItem key={key} value={key} className="text-white hover:bg-purple-500/20">
                            {isRTL ? gov.ar : gov.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {errors.governorate && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.governorate}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.addressLabel' )}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-start">
                    <MapPin className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleChange(e as any)}
                      rows={3}
                      className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                        errors.address ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder={t('registerPage.addressPlaceholder' )}
                    />
                  </div>
                </div>
                {errors.address && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.passwordLabel' )}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 pl-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.password ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
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

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[25, 50, 75, 100].map((threshold) => (
                        <div
                          key={threshold}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            passwordStrength >= threshold
                              ? passwordStrength === 100
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : passwordStrength >= 75
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-orange-500 to-red-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      passwordStrength === 100 ? 'text-green-400' :
                      passwordStrength >= 75 ? 'text-yellow-400' :
                      'text-orange-400'
                    }`}>
                      {passwordStrength === 100 ? 'قوية جداً ✨' :
                       passwordStrength >= 75 ? 'قوية 👍' :
                       passwordStrength >= 50 ? 'متوسطة' : 'ضعيفة'}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">{t('registerPage.confirmPasswordLabel' )}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-center">
                    <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 pl-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-500 group-focus-within:border-red-500' :
                        formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-green-500' :
                        'border-white/10 group-focus-within:border-purple-500'
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Student Additional Fields */}
              {userType === 'student' && (
                <div className="space-y-4 pt-4 border-t border-white/10 animate-slide-in-down">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">{t('registerPage.universityLabel' )}</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                      <div className="relative flex items-center">
                        <GraduationCap className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          name="universityName"
                          value={formData.universityName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3.5 pr-12 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                            errors.universityName ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-blue-500'
                          }`}
                          placeholder={t('registerPage.universityPlaceholder' )}
                        />
                      </div>
                    </div>
                    {errors.universityName && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                        <AlertCircle className="w-4 h-4" />
                        {errors.universityName}
                      </p>
                    )}
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">السنة الدراسية *</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                      <div className="relative">
                        <Select value={formData.academicYear} onValueChange={(value) => handleSelectChange('academicYear', value)}>
                          <SelectTrigger className={`w-full bg-slate-800/50 border-2 rounded-xl text-white focus:ring-0 transition-all duration-300 ${
                            errors.academicYear ? 'border-red-500' : 'border-white/10'
                          }`}>
                            <SelectValue placeholder="اختر السنة الدراسية" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64 overflow-y-auto bg-slate-800 border-white/10">
                            <SelectItem value="1" className="text-white hover:bg-purple-500/20">السنة الأولى</SelectItem>
                            <SelectItem value="2" className="text-white hover:bg-purple-500/20">السنة الثانية</SelectItem>
                            <SelectItem value="3" className="text-white hover:bg-purple-500/20">السنة الثالثة</SelectItem>
                            <SelectItem value="4" className="text-white hover:bg-purple-500/20">السنة الرابعة</SelectItem>
                            <SelectItem value="5" className="text-white hover:bg-purple-500/20">السنة الخامسة</SelectItem>
                            <SelectItem value="6" className="text-white hover:bg-purple-500/20">سنة الامتياز 🌟</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {errors.academicYear && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                        <AlertCircle className="w-4 h-4" />
                        {errors.academicYear}
                      </p>
                    )}
                  </div>

                  {/* ID Card Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">صورة الكارنيه *</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleIdCardUpload}
                          className={`w-full px-4 py-3.5 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 cursor-pointer ${
                            errors.idCard ? 'border-red-500' : 'border-white/10 group-focus-within:border-cyan-500'
                          }`}
                        />
                      </div>
                    </div>
                    {idCardPreview && (
                      <div className="mt-2 rounded-lg overflow-hidden border-2 border-white/20">
                        <img
                          src={idCardPreview}
                          alt="معاينة الكارنيه"
                          className="w-full max-h-48 object-contain"
                        />
                      </div>
                    )}
                    {errors.idCard && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                        <AlertCircle className="w-4 h-4" />
                        {errors.idCard}
                      </p>
                    )}
                    {!errors.idCard && !idCardFile && (
                      <p className="text-xs text-gray-400">يجب أن تكون الصورة بتنسيق JPG أو PNG وحجمها أقل من 5MB</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={sendVerificationCode}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group ${
                  !isSubmitting && isFormValid()
                    ? 'bg-green-700 hover:bg-green-800 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('registerPage.sending' )}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    {t('register.form.sendCode')}
                  </span>
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-gray-400">
                {t('auth.haveAccount')}{' '}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-all inline-flex items-center gap-1 group hover:underline">
                  {t('auth.loginButton' )}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </Card>
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

          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slide-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
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

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
          .animate-particle-1 { animation: particle-1 15s ease-in-out infinite; }
          .animate-particle-2 { animation: particle-2 18s ease-in-out infinite; }
          .animate-particle-3 { animation: particle-3 12s ease-in-out infinite; }
          .animate-particle-4 { animation: particle-4 20s ease-in-out infinite; }
          .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
          .animate-slide-in-down { animation: slide-in-down 0.4s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        `}</style>
      </div>
    )
  }

  // Step 2: Verification Code
  if (step === 2) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative w-full max-w-md z-10 animate-slide-in-up">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden hover:shadow-purple-500/20 transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">{t('registerPage.verifyCode' )}</h1>
                <p className="text-gray-300 text-sm">
                  {t('registerPage.codeSentTo' )} {formData.email}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 text-center">{t('registerPage.verifyCode')} ({t('registerPage.codeValidity')})</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300 pointer-events-none" />
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 bg-slate-800/50 ${
                      errors.verificationCode ? 'border-red-500 group-focus-within:border-red-500' : 'border-white/10 group-focus-within:border-cyan-500'
                    }`}
                    placeholder="_ _ _ _"
                    maxLength={4}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                {errors.verificationCode && (
                  <p className="text-sm text-red-400 text-center flex items-center justify-center gap-1 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {errors.verificationCode}
                  </p>
                )}
              </div>

              {/* Countdown */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-pulse" />
                    {t('registerVerificationPage.canRequestNewCode')} {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button
                    onClick={sendVerificationCode}
                    disabled={isSubmitting}
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-all hover:underline flex items-center justify-center gap-1 group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {t('registerPage.resendCode')}
                  </button>
                )}
              </div>

              {/* Back Button */}
              <button
                onClick={() => {
                  setStep(1)
                  setErrors({})
                }}
                className="w-full py-3.5 border-2 border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {t('registerVerificationPage.backToData')}
              </button>

              {/* Verify Button */}
              <Button
                onClick={verifyAndRegister}
                disabled={!/^\d{4}$/.test(formData.verificationCode) || isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden group ${
                  !isSubmitting && /^\d{4}$/.test(formData.verificationCode)
                    ? 'bg-green-700 hover:bg-green-800 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('registerPage.submitting')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   {t('registerVerificationPage.verifyAndRegister')}
                  </span>
                )}
              </Button>
            </div>
          </Card>
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

          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
          .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </div>
    )
  }

  // Step 3: Success
  if (step === 3) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '0s',
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
            }}
          />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative w-full max-w-md z-10 animate-slide-in-up">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden hover:shadow-green-500/20 transition-all duration-500 text-center">
            <div className="p-12 space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-bounce-slow">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">
                  {t('registerPage.errors.RegisteredSuccessfully')}
                </h1>
                <p className="text-gray-300 leading-relaxed">
                  {t('registerPage.errors.accountCreated')}
                </p>
              </div>

              <div className="space-y-3 pt-6">
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    {t('auth.loginButton')}
                  </span>
                </Button>
              </div>
            </div>
          </Card>
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

          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
          .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  return null
}

