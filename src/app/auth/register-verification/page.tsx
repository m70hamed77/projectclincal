import { Suspense } from 'react'
import { RegisterWithVerificationContent } from './RegisterVerificationContent'

export default function RegisterWithVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    }>
      <RegisterWithVerificationContent />
    </Suspense>
  )
}
