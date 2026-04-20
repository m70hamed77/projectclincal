import { Suspense } from 'react'
import { VerificationContent } from './VerificationContent'

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{borderTopColor: '#00BFA6', borderRightColor: 'transparent', borderBottomColor: '#008C7A', borderLeftColor: 'transparent'}} />
      </div>
    }>
      <VerificationContent />
    </Suspense>
  )
}
