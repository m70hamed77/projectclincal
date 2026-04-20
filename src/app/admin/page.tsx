import { Suspense } from 'react'
import { AdminPageContent } from './AdminPageContent'

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{borderTopColor: '#00BFA6', borderRightColor: 'transparent', borderBottomColor: '#008C7A', borderLeftColor: 'transparent'}} />
            <p className="text-muted-foreground" suppressHydrationWarning={true}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <AdminPageContent />
    </Suspense>
  )
}
