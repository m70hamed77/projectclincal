import { Suspense } from 'react'
import { SimpleRegisterContent } from './SimpleRegisterContent'

export default function SimpleRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 px-4 bg-muted/50">
        <div className="max-w-md mx-auto flex items-center justify-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </div>
    }>
      <SimpleRegisterContent />
    </Suspense>
  )
}
