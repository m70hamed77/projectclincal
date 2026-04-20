import { Suspense } from 'react'
import { AdminUsersPageContent } from './AdminUsersPageContent'

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
      <AdminUsersPageContent />
    </Suspense>
  )
}
