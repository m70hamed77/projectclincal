import { Suspense } from 'react'
import { SandboxLoginContent } from './SandboxLoginContent'

export default function SandboxLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <SandboxLoginContent />
    </Suspense>
  )
}
