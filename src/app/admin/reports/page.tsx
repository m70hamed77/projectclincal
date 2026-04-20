import { Suspense } from 'react'
import { AdminReportsPageInner } from './AdminReportsPageInner'

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <AdminReportsPageInner />
    </Suspense>
  )
}
