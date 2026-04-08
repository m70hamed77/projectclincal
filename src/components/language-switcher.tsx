'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { locales, type Locale } from '@/i18n'

/* eslint-disable react-hooks/immutability */

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('ar')

  useEffect(() => {
    // Read locale from localStorage only (simplified)
    const storageLocale = localStorage.getItem('locale') as Locale
    const currentLocale = (storageLocale || 'ar') as Locale
    setLocale(currentLocale)
  }, [])

  const changeLanguage = (newLocale: Locale) => {
    // Update state only (no reload)
    setLocale(newLocale)

    // Save to localStorage
    try {
      localStorage.setItem('locale', newLocale)
    } catch (e) {
      // Ignore
    }

    // Save to cookie without page reload
    try {
      document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=lax`
    } catch (e) {
      // Ignore
    }

    // Emit custom event to notify all components
    try {
      const event = new CustomEvent('localeChanged', { detail: { locale: newLocale } })
      window.dispatchEvent(event)
      console.log('[LanguageSwitcher] Locale changed to:', newLocale)
    } catch (e) {
      console.error('[LanguageSwitcher] Error dispatching event:', e)
    }
  }

  return (
    <div className="relative group">
      {/* Glowing effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110" />

      {/* Main Container */}
      <div className="relative flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full p-1.5 border-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group-hover:scale-105">
        {/* Animated Globe Icon */}
        <div className="relative ml-1">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-sm opacity-50 animate-pulse" />
          <Globe className="relative w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>

        {/* Language Buttons */}
        <div className="flex items-center gap-1">
          {locales.map((loc) => {
            const isSelected = locale === loc
            const label = loc === 'ar' ? 'ع' : 'EN'
            const fullLabel = loc === 'ar' ? 'العربية' : 'English'

            return (
              <button
                key={loc}
                onClick={() => changeLanguage(loc)}
                className={`
                  relative overflow-hidden px-4 py-2 rounded-full font-bold text-sm transition-all duration-500
                  ${isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:scale-105'
                  }
                `}
                style={{
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* Shimmer effect for selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
                )}

                <span className="relative flex items-center gap-2">
                  <span className="text-sm md:text-base">{label}</span>
                  {isSelected && (
                    <span className="hidden sm:inline text-xs md:text-sm opacity-90">
                      {fullLabel}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 animate-bounce-subtle" />
                  )}
                </span>

                {/* Selection indicator dot */}
                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Floating particles decoration */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-1 transition-opacity duration-500" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-2 transition-opacity duration-500" />
    </div>
  )
}

// Add custom animations
const style = document.createElement('style')
style.textContent = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  @keyframes float-1 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(5px, -10px) scale(1.2);
    }
  }

  @keyframes float-2 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(-5px, 10px) scale(1.1);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }

  .animate-float-1 {
    animation: float-1 3s ease-in-out infinite;
  }

  .animate-float-2 {
    animation: float-2 4s ease-in-out infinite;
  }
`

if (typeof document !== 'undefined' && !document.getElementById('language-switcher-animations')) {
  style.id = 'language-switcher-animations'
  document.head.appendChild(style)
}
