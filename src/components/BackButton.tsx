'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Home } from 'lucide-react'

/**
 * صفحات Landing/Auth: تعرض زر "الرئيسية" فقط
 * صفحات App: تعرض زر "رجوع" ذكي (يظهر فقط لو history.length > 1)
 */
const LANDING_AUTH_PAGES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/verify-sms',
]

/**
 * الصفحات الرئيسية التي لا تحتاج زر رجوع (Dashboard)
 */
const MAIN_PAGES = [
  '/dashboard/student',
  '/dashboard/patient',
  '/dashboard',
  '/search',
  '/chat',
  '/appointments',
]

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // التحقق من نوع الصفحة الحالية
  const isLandingOrAuth = LANDING_AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(page + '/')
  )

  // التحقق من كونها صفحة رئيسية (Dashboard)
  const isMainPage = MAIN_PAGES.some(
    (page) => pathname === page || pathname.startsWith(page + '/')
  )

  // التحقق من إمكانية الرجوع للخلف (Lazy initialization)
  const [canGoBack] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.history.length > 1
    }
    return false
  })

  /**
   * معالجة زر الرجوع للصفحات العادية
   */
  const handleBack = useCallback(() => {
    if (canGoBack) {
      router.back()
    }
  }, [canGoBack, router])

  /**
   * في صفحات Landing/Auth: لا نعرض زر في الصفحة الرئيسية
   */
  if (isLandingOrAuth && pathname === '/') {
    return null
  }

  /**
   * في صفحات Dashboard الرئيسية: لا نعرض زر رجوع
   * (المستخدم عادة يأتي من Login/Register أو مباشرة)
   */
  if (isMainPage) {
    return null
  }

  /**
   * في صفحات Landing/Auth: نعرض زر "الرئيسية"
   * (مش زر رجوع، بل رابط للصفحة الرئيسية)
   */
  if (isLandingOrAuth) {
    return (
      <Link
        href="/"
        className="
          fixed top-20 left-6 z-50
          flex items-center gap-2
          px-4 py-2
          rounded-full
          bg-primary text-primary-foreground
          shadow-lg
          hover:bg-primary/90
          hover:shadow-xl
          transition-all duration-300
          hover:scale-105
          active:scale-95
          font-medium text-sm
        "
        aria-label="الرئيسية"
        title="العودة للصفحة الرئيسية"
      >
        <Home className="w-4 h-4" />
        <span>الرئيسية</span>
      </Link>
    )
  }

  /**
   * في صفحات App: نعرض زر "رجوع" ذكي
   * (يظهر فقط لو يمكن الرجوع للخلف)
   */
  if (!canGoBack) {
    return null
  }

  return (
    <button
      onClick={handleBack}
      className="
        fixed top-20 left-6 z-50
        flex items-center gap-2
        px-4 py-2
        rounded-full
        bg-primary text-primary-foreground
        shadow-lg
        hover:bg-primary/90
        hover:shadow-xl
        transition-all duration-300
        hover:scale-105
        active:scale-95
        font-medium text-sm
      "
      aria-label="رجوع"
      title="رجوع للصفحة السابقة"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>رجوع</span>
    </button>
  )
}
