import { Suspense } from 'react'
import { AdvancedRegisterContent } from './AdvancedRegisterContent'

export default function AdvancedRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="max-w-4xl mx-auto flex items-center justify-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </div>
    }>
      <AdvancedRegisterContent />
    </Suspense>
  )
}
