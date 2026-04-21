'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useTranslations } from '@/hooks/useTranslations'
import {
  Bell, CheckCircle2, MessageCircle, AlertCircle, AlertTriangle,
  User, X, Trash2, Check, FileText, Shield, ShieldAlert, Ban,
  Clock, UserPlus, UserCheck, ShieldCheck,
} from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  isRead: boolean
  actionLink: string
  actionText: string
  data?: string | null
}

interface AdminActionData {
  actionType: 'RESOLVED' | 'WARNED' | 'SUSPENDED' | 'TEMP_BANNED' | 'PERM_BANNED'
  actionTitle: string
  actionMessage: string
  adminName: string
  actionDate: string
  reportId: string
  banDuration?: number | null
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'NEW_VERIFICATION_REQUEST':
    case 'STUDENT_VERIFICATION': return <ShieldAlert className="w-5 h-5 text-amber-600" />
    case 'STUDENT_VERIFIED': return <ShieldCheck className="w-5 h-5 text-emerald-600" />
    case 'NEW_REPORT': return <AlertCircle className="w-5 h-5 text-red-600" />
    case 'REPORT_RESOLVED': return <AlertCircle className="w-5 h-5 text-emerald-600" />
    case 'USER_REGISTERED': return <UserPlus className="w-5 h-5 text-purple-600" />
    case 'USER_APPROVED': return <UserCheck className="w-5 h-5 text-emerald-600" />
    case 'ADMIN_ACTION_RESOLVED': return <Shield className="w-5 h-5 text-emerald-600" />
    case 'ADMIN_ACTION_WARNED': return <AlertTriangle className="w-5 h-5 text-amber-600" />
    case 'ADMIN_ACTION_SUSPENDED': return <Clock className="w-5 h-5 text-orange-600" />
    case 'ADMIN_ACTION_TEMP_BANNED':
    case 'ADMIN_ACTION_PERM_BANNED': return <Ban className="w-5 h-5 text-red-600" />
    case 'SYSTEM_ALERT': return <AlertCircle className="w-5 h-5 text-red-600" />
    case 'NEW_MESSAGE': return <MessageCircle className="w-5 h-5 text-purple-600" />
    default: return <Bell className="w-5 h-5 text-slate-400" />
  }
}

function AdminNotificationsPageInner() {
  const { user } = useCurrentUser()
  const { t, locale } = useTranslations()
  const isRTL = locale === 'ar'

  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionData, setActionData] = useState<AdminActionData | null>(null)

  const getUserId = () => {
    let userId: string | null = user?.id || null
    if (!userId) { try { userId = localStorage.getItem('userId') } catch (e) {} }
    if (!userId) { try { userId = sessionStorage.getItem('userId') } catch (e) {} }
    return userId
  }

  const fetchNotifications = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') { setLoading(false); return }
    try {
      const userId = getUserId()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (userId) headers['X-User-Id'] = userId
      let apiUrl = '/api/notifications/new'
      if (userId) apiUrl = `${apiUrl}?userId=${encodeURIComponent(userId)}`
      const response = await fetch(apiUrl, { credentials: 'include', headers })
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('[Admin Notifications] ❌ Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.role])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const userId = getUserId()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (userId) headers['X-User-Id'] = userId
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PUT', credentials: 'include', headers,
        body: JSON.stringify({ notificationId: id })
      })
      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) { console.error('Error marking as read:', error) }
  }

  const markAllAsRead = async () => {
    try {
      const userId = getUserId()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (userId) headers['X-User-Id'] = userId
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PUT', credentials: 'include', headers,
        body: JSON.stringify({ markAll: true })
      })
      if (response.ok) { setNotifications(notifications.map(n => ({ ...n, isRead: true }))); setUnreadCount(0) }
    } catch (error) { console.error('Error marking all as read:', error) }
  }

  const deleteNotification = async (id: string) => {
    try {
      const userId = getUserId()
      const headers: HeadersInit = {}
      if (userId) headers['X-User-Id'] = userId
      let apiUrl = `/api/notifications/mark-read?id=${id}`
      if (userId) apiUrl += `&userId=${encodeURIComponent(userId)}`
      const response = await fetch(apiUrl, { method: 'DELETE', credentials: 'include', headers })
      if (response.ok) {
        const wasUnread = !notifications.find(n => n.id === id)?.isRead
        setNotifications(notifications.filter(n => n.id !== id))
        if (wasUnread) setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) { console.error('Error deleting notification:', error) }
  }

  const clearAll = async () => {
    try {
      const userId = getUserId()
      const headers: HeadersInit = {}
      if (userId) headers['X-User-Id'] = userId
      let apiUrl = '/api/notifications/mark-read?deleteAll=true'
      if (userId) apiUrl += `&userId=${encodeURIComponent(userId)}`
      const response = await fetch(apiUrl, { method: 'DELETE', credentials: 'include', headers })
      if (response.ok) { setNotifications([]); setUnreadCount(0) }
    } catch (error) { console.error('Error clearing all:', error) }
  }

  const handleShowActionDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    if (notification.data) {
      try { setActionData(JSON.parse(notification.data) as AdminActionData) }
      catch (e) { setActionData(null) }
    } else { setActionData(null) }
    setActionModalOpen(true)
    markAsRead(notification.id)
  }

  const unreadNotifications = notifications.filter(n => !n.isRead)
  const isAdminAction = (type: string) => type.startsWith('ADMIN_ACTION_')

  const navUser = user ? {
    id: user.id, name: user.name || 'مستخدم', email: user.email || '',
    role: user.role as 'PATIENT' | 'STUDENT' | 'ADMIN', avatar: user.avatarUrl ?? undefined
  } : undefined

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={navUser} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4 border-slate-200 bg-white">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">{t('auth.unauthorized')}</h3>
              <p className="text-slate-600">{t('auth.adminOnly')}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation user={navUser} />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{t('notifications.title')}</h1>
                <p className="text-sm text-slate-600">{unreadCount} {t('notifications.unreadCount')}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}
                className="hover:bg-slate-100 border-slate-200 text-emerald-600 hover:text-emerald-700">
                <Check className="w-4 h-4 mr-2" />
                <span>{t('notifications.markAllAsRead')}</span>
              </Button>
              <Button size="sm" onClick={clearAll} disabled={notifications.length === 0}
                className="bg-red-800 hover:bg-red-900 text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                <span>{t('notifications.clearAll')}</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-slate-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border-slate-200">
                <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-slate-100">
                  <Bell className="w-4 h-4" />
                  <span>{t('notifications.all')}</span>
                  <Badge variant="secondary" className="bg-emerald-600 text-white hover:bg-emerald-700">{notifications.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2 data-[state=active]:bg-slate-100">
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('notifications.unread')}</span>
                  <Badge variant="secondary" className="bg-amber-600 text-white hover:bg-amber-700">{unreadCount}</Badge>
                </TabsTrigger>
              </TabsList>

              {['all', 'unread'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-4">
                    {(tab === 'all' ? notifications : unreadNotifications).map((notification) => (
                      <Card key={notification.id}
                        className={`border-slate-200 hover:shadow-md transition-shadow duration-200 ${!notification.isRead ? 'bg-white' : 'bg-slate-50'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-slate-200">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1 flex items-center gap-2 text-slate-800">
                                {notification.title}
                                {!notification.isRead && (
                                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">{t('notifications.newBadge')}</Badge>
                                )}
                              </h3>
                              <p className="text-sm mb-2 whitespace-pre-line text-slate-600">{notification.message}</p>
                              <p className="text-xs text-slate-500">{notification.time}</p>
                              <div className="flex items-center gap-2 mt-3">
                                {isAdminAction(notification.type) && (
                                  <Button variant="outline" size="sm" onClick={() => handleShowActionDetails(notification)}
                                    className="hover:bg-slate-100 border-slate-200 text-purple-600">
                                    <FileText className={`w-4 h-4 mr-1`} />
                                    <span>{t('notifications.viewActionDetails')}</span>
                                  </Button>
                                )}
                                {!notification.isRead && (
                                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                    <Check className={`w-4 h-4 mr-1`} />
                                    <span>{t('notifications.markAsRead')}</span>
                                  </Button>
                                )}
                                <Button size="sm" onClick={() => deleteNotification(notification.id)}
                                  className="bg-red-700 hover:bg-red-800 text-white">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {(tab === 'all' ? notifications : unreadNotifications).length === 0 && (
                      <Card className="border-slate-200 bg-white">
                        <CardContent className="py-16 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-100">
                            {tab === 'all' ? <Bell className="w-8 h-8 text-slate-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-slate-800">
                            {tab === 'all' ? t('notifications.noNotifications') : t('notifications.allNotificationsRead')}
                          </h3>
                          <p className="text-slate-600">
                            {tab === 'all' ? t('notifications.noNotificationsDesc') : t('notifications.noUnreadNotifications')}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span>{selectedNotification?.title}</span>
            </DialogTitle>
          </DialogHeader>

          {actionData ? (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-center p-4 rounded-lg bg-slate-50 border border-slate-200">
                <Badge className="bg-slate-800 text-white">{actionData.actionTitle}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-emerald-700">{t('notifications.adminMessage')}:</label>
                <div className="p-4 rounded-lg bg-white border border-slate-200">
                  <p className="text-base whitespace-pre-line text-slate-800">{actionData.actionMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700">{t('notifications.admin')}:</p>
                  <p className="font-medium text-slate-800">{actionData.adminName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{t('notifications.actionDate')}:</p>
                  <p className="font-medium text-slate-800">
                    {new Date(actionData.actionDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {actionData.banDuration && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-600">
                    <Ban className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-red-700">{t('notifications.banDuration')}:</p>
                    <p className="font-medium text-red-800">{actionData.banDuration} <span className="mx-1">{t('notifications.days')}</span></p>
                  </div>
                </div>
              )}
              <div className="text-sm text-center pt-2 text-slate-500">
                <p>{t('notifications.reportNumber')}: {actionData.reportId}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-red-50">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-slate-600">{t('notifications.noAdditionalDetails')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminNotificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <AdminNotificationsPageInner />
    </Suspense>
  )
}
