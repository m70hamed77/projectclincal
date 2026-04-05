'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  label?: string
  fallbackPath?: string
  className?: string
}

export function BackButton({
  label = 'رجوع',
  fallbackPath = '/dashboard',
  className = '',
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // التحقق من وجود سجل في المتصفح
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackPath)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleBack}
      className={`gap-2 ${className}`}
    >
      <ArrowRight className="w-4 h-4" />
      {label}
    </Button>
  )
}
