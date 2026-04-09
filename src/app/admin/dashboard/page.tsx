'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CheckCircle2,
  XCircle,
  User,
  Clock,
  Mail,
  Phone,
  FileText,
  Shield,
  AlertTriangle,
  Loader2,
  Eye,
  RefreshCw,
  Bell,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface PendingUser {
  id: string
  name: string
  email: string
  phone: string
  carniehImage: string | null
  createdAt: string
}

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  const fetchPendingUsers = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/admin/pending-users')
      const data = await response.json()

      if (response.ok) {
        setPendingUsers(data.users || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل جلب الحسابات' })
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب الحسابات' })
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/new')
      const data = await response.json()

      if (data.success) {
        setUnreadNotificationCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    fetchPendingUsers()
    fetchNotifications()
  }, [])

  const handleApprove = async (userId: string) => {
    if (!confirm('هل أنت متأكد من تفعيل هذا الحساب؟')) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل تفعيل الحساب' })
      }
    } catch (error) {
      console.error('Error approving user:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تفعيل الحساب' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectClick = (user: PendingUser) => {
    setSelectedUser(user)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  const handleReject = async () => {
    if (!selectedUser) return

    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/reject-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          reason: rejectReason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setPendingUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        setRejectDialogOpen(false)
        setSelectedUser(null)
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل رفض الحساب' })
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء رفض الحساب' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewCarnieh = (imageUrl: string) => {
    window.open(imageUrl, '_blank')
  }

  const refreshData = () => {
    fetchPendingUsers()
    fetchNotifications()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation user={{
        id: 'admin-1',
        name: 'مدير النظام',
        email: 'admin@smiley.com',
        role: 'ADMIN',
        avatar: '',
      }} />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-800">لوحة تحكم الأدمن</h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-500" />
                إدارة الحسابات المعلقة للموافقة
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className="relative hover:bg-slate-100 hover:text-slate-900 border-slate-200"
              >
                <a href="/admin/notifications" className="gap-2">
                  <Bell className="w-4 h-4" />
                  الإشعارات
                  {unreadNotificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {unreadNotificationCount}
                    </Badge>
                  )}
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isRefreshing}
                className="gap-2 hover:bg-slate-100 hover:text-slate-900"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </div>

          {message && (
            <Alert className={`mb-6 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className="font-medium">{message.text}</AlertDescription>
            </Alert>
          )}

          {unreadNotificationCount > 0 && (
            <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
              <Bell className="h-4 w-4 text-amber-600" />
              <AlertDescription className="font-medium">
                لديك {unreadNotificationCount} {unreadNotificationCount === 1 ? 'إشعار جديد' : 'إشعارات جديدة'}!{' '}
                <a href="/admin/notifications" className="underline hover:text-amber-900 font-semibold">
                  اضغط هنا للعرض
                </a>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">حسابات معلقة</CardDescription>
                <CardTitle className="text-3xl text-slate-800">
                  {pendingUsers.length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">الحالة</CardDescription>
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  في انتظار المراجعة
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">الإجراء</CardDescription>
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  مراجعة وموافقة
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                    <User className="w-5 h-5 text-slate-600" />
                    الحسابات المعلقة للموافقة
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    راجع بيانات المريض وصورة الكارنيه قبل التفعيل
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">جاري تحميل البيانات...</p>
                  </div>
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-800">لا توجد حسابات معلقة</h3>
                  <p className="text-slate-600 mb-4">
                    جميع الحسابات تمت مراجعتها والموافقة عليها
                  </p>
                  <Button onClick={refreshData} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    تحديث القائمة
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <Card key={user.id} className="border-2 border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <Avatar className="w-20 h-20 border-4 border-slate-100">
                            {user.carniehImage ? (
                              <AvatarImage src={user.carniehImage} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="text-3xl bg-slate-100 text-slate-600 font-semibold">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                                {user.name}
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                  <Clock className="w-3 h-3 ml-1" />
                                  معلق
                                </Badge>
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                تاريخ التسجيل: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">البريد:</span>
                                <span className="font-medium text-slate-800">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">الهاتف:</span>
                                <span className="font-medium text-slate-800">{user.phone}</span>
                              </div>
                            </div>

                            {user.carniehImage && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCarnieh(user.carniehImage!)}
                                className="w-fit gap-2 hover:bg-slate-100"
                              >
                                <Eye className="w-4 h-4" />
                                عرض صورة الكارنيه
                              </Button>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 min-w-[150px]">
                            <Button
                              onClick={() => handleApprove(user.id)}
                              disabled={isProcessing}
                              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              موافقة
                            </Button>
                            <Button
                              onClick={() => handleRejectClick(user)}
                              disabled={isProcessing}
                              className="w-full gap-2 bg-slate-700 hover:bg-slate-800 text-white"
                            >
                              <XCircle className="w-4 h-4" />
                              رفض
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
              <XCircle className="w-5 h-5 text-red-600" />
              رفض الحساب
            </DialogTitle>
            <DialogDescription>
              أنت على وشك رفض حساب {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">سبب الرفض (اختياري)</Label>
              <Textarea
                id="reason"
                placeholder="اكتب سبب رفض هذا الحساب..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>

            {selectedUser && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  سيتم حذف هذا الحساب نهائياً ولن يتمكن المستخدم من إعادة التسجيل بنفس البيانات
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={isProcessing}>
              إلغاء
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              className="gap-2 bg-slate-700 hover:bg-slate-800 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الرفض...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  تأكيد الرفض
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
