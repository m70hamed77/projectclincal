'use client'

import { useState } from 'react'

interface SmileButtonProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const SMILE_MESSAGES = [
  "ابتسامتك تهمنا، حياتك وضحكتك تكلف حياتنا 😄",
  "ابتسم اليوم، فالسعادة تبدأ منك 🌟",
  "ابتسامتك شعاع نور يضيء حياتنا ☀️",
  "ابتسم، فكل ابتسامة تضيء يوماً جديداً ✨",
  "ابتسامتك أجمل من أي إكسسوار يحتاجه قلبك 💎",
  "الابتسامة لغة الجميع، فلا تتوقف عن التحدث بها 💕",
  "ابتسم، فالحياة جميلة حين ننظر إليها بتفاؤل 🌈",
  "ابتسامتك تفتح الأبواب المغلقة 🔑",
]

export function SmileButton({ size = 'md', showLabel = false, className = '' }: SmileButtonProps) {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  const handleClick = () => {
    // اختيار رسالة عشوائية
    const randomMessage = SMILE_MESSAGES[Math.floor(Math.random() * SMILE_MESSAGES.length)]
    
    // عرض الرسالة
    setMessage(randomMessage)
    setIsVisible(true)

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
      setIsVisible(false)
    }, 5000)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-emerald-500 to-teal-600 
          rounded-xl 
          flex items-center justify-center 
          w-10 h-10
          hover:scale-110 
          active:scale-95 
          transition-transform 
          cursor-pointer
          ${showLabel ? 'gap-2 px-3' : ''}
          ${className}
        `}
        title="اضغط هنا لتشجيعنا"
      >
        <span>🦷</span>
        {showLabel && <span className="text-white text-sm font-bold">سمايلي</span>}
      </button>

      {/* رسالة التشجيع */}
      {isVisible && (
        <div className="absolute top-full mt-2 right-0 bg-white border-2 border-emerald-200 rounded-lg shadow-lg p-3 max-w-xs z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <p className="text-sm text-emerald-700 font-medium">{message}</p>
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t-2 border-l-2 border-emerald-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}
