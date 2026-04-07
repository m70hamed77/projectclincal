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
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      <Globe className="w-4 h-4 text-muted-foreground ml-1" />
      {locales.map((loc) => {
        const isSelected = locale === loc
        const label = loc === 'ar' ? 'العربية' : 'English'

        return (
          <Button
            key={loc}
            variant={isSelected ? 'default' : 'ghost'}
            size="sm"
            onClick={() => changeLanguage(loc)}
            className={`h-7 px-3 text-xs font-medium transition-all ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'hover:bg-accent text-muted-foreground'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {label}
              {isSelected && <Check className="w-3 h-3" />}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
