'use client'

import { useState, useEffect } from 'react'
import arData from '@/lib/translations/ar.json'
import enData from '@/lib/translations/en.json'

type TranslationKey = string

export function useTranslations() {
  // ✅ قراءة اللغة من localStorage أولاً قبل useState
  const initialLocale = typeof window !== 'undefined' 
    ? (localStorage.getItem('locale') || 'ar') 
    : 'ar'
  
  const [locale, setLocale] = useState<string>(initialLocale)
  const [translations, setTranslations] = useState<Record<string, any>>(initialLocale === 'ar' ? arData : enData)
  const [loading, setLoading] = useState<boolean>(!initialLocale)

  useEffect(() => {
    // Initialize translations
    const initTranslations = () => {
      try {
        const storageLocale = localStorage.getItem('locale') || 'ar'
        const currentLocale = storageLocale

        setLocale(currentLocale)
        const translationData = currentLocale === 'ar' ? arData : enData
        setTranslations(translationData || {})
        setLoading(false)
      } catch (error) {
        console.error('[i18n] Error initializing translations:', error)
        // Fallback to Arabic
        setTranslations(arData || {})
        setLocale('ar')
        setLoading(false)
      }
    }

    initTranslations()

    // Listen for custom language change event
    const handleLanguageChange = (event: CustomEvent) => {
      const newLocale = event.detail.locale
      console.log('[i18n] Language changed to:', newLocale)
      setLocale(newLocale)
      const translationData = newLocale === 'ar' ? arData : enData
      setTranslations(translationData || {})
    }

    window.addEventListener('localeChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('localeChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const t = (key: string): string => {
    if (loading) return ''

    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  const getData = (key: string): any => {
    if (loading) return []

    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return []
      }
    }

    return value
  }

  return { t, getData, locale, loading }
}
