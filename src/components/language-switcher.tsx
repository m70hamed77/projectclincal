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
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 via-slate-300/20 to-slate-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Main Container */}
      <div className="relative flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Globe Icon */}
        <div className="relative ml-0.5 mr-1">
          <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </div>

        {/* Language Buttons */}
        <div className="flex items-center gap-0.5">
          {locales.map((loc) => {
            const isSelected = locale === loc
            const label = loc === 'ar' ? 'ع' : 'EN'

            return (
              <button
                key={loc}
                onClick={() => changeLanguage(loc)}
                className={`
                  px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-300
                  ${isSelected
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <span className="flex items-center gap-1">
                  {label}
                  {isSelected && <Check className="w-3 h-3" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
