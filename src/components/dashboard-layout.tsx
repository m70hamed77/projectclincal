'use client'

import { BackButton } from '@/components/back-button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string
    email: string
    role: 'PATIENT' | 'STUDENT' | 'ADMIN'
    avatar?: string
  }
  showNavigation?: boolean
  showFooter?: boolean
  showBackButton?: boolean
}

export default function DashboardLayout({
  children,
  user,
  showNavigation = true,
  showFooter = true,
  showBackButton = true,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation user={user} />}
      
      {/* زر الرجوع للخلف - يظهر فوق المحتوى */}
      <div className="container mx-auto px-4 py-4">
        {showBackButton && (
          <div className="mb-4">
            <BackButton />
          </div>
        )}
      </div>

      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  )
}
