'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useTranslations } from '@/hooks/useTranslations'
import { useSearchParams } from 'next/navigation'
import {
  Check,
  X,
  User,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  Image as ImageIcon,
  GraduationCap,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  FileText,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

interface UserData {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  role: 'STUDENT' | 'PATIENT'
  userStatus: string
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null
  universityEmail?: string | null
  idCardUrl?: string | null
  academicYear?: number | null
  createdAt: Date
  rejectionReason?: string | null
}

export default function AdminUsersPage() {
  const { user } = useCurrentUser()
  const { t, locale, loading: i18nLoading } = useTranslations()
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get('userId') || ''
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState<'ALL' | 'STUDENT' | 'PATIENT'>('ALL')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED' | 'BANNED' | 'SUSPENDED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; studentId: string | null }>({
    open: false,
    studentId: null
  })
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [viewUserDialog, setViewUserDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  })
  const [deleteReason, setDeleteReason] = useState('')

  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') {
      return
    }

    try {
      setLoading(true)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch('/api/admin/users', {
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        const errorData = await response.json()
        console.error('[Admin Users Page] ❌ Error response:', errorData)
        alert(`${t('common.error')}: ${errorData.error || t('users.errorFetchingUsers')}`)
      }
    } catch (error) {
      console.error('[Admin Users Page] ❌ Fetch error:', error)
      alert(t('users.errorConnectingServer'))
    } finally {
      setLoading(false)
    }
  }, [user, t])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(user => {
    if (filterRole !== 'ALL' && user.role !== filterRole) return false

    if (filterStatus !== 'ALL' && ['DELETED', 'BANNED', 'SUSPENDED'].includes(filterStatus)) {
      if (user.userStatus !== filterStatus) return false
    }

    if (filterStatus !== 'ALL' && ['PENDING', 'APPROVED', 'REJECTED'].includes(filterStatus)) {
      if (user.role === 'STUDENT' && user.verificationStatus !== filterStatus) {
        return false
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.includes(query)
      )
    }

    return true
  })

  const handleApprove = async (studentId: string) => {
    try {
      setActionLoading(studentId)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/verification/${studentId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers
      })

      if (response.ok) {
        await fetchUsers()
        alert(t('users.approvedSuccessfully'))
        if (viewUserDialog) setViewUserDialog(false)
      } else {
        const data = await response.json()
        alert(data.error || t('users.errorApproving'))
      }
    } catch (error) {
      console.error('Error approving student:', error)
      alert(t('users.errorApproving'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteClick = (userId: string) => {
    setDeleteDialog({ open: true, userId })
    setDeleteReason('')
  }

  const handleDelete = async () => {
    if (!deleteDialog.userId) return

    if (!deleteReason.trim()) {
      alert(t('users.mustWriteReason'))
      return
    }

    try {
      setActionLoading(deleteDialog.userId)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/users/${deleteDialog.userId}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ deleteReason: deleteReason.trim() })
      })

      if (response.ok) {
        await fetchUsers()
        setDeleteDialog({ open: false, userId: null })
        setDeleteReason('')
        alert(t('users.deletedSuccessfully'))
        if (viewUserDialog) setViewUserDialog(false)
      } else {
        const data = await response.json()
        alert(data.error || t('users.errorDeleting'))
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(t('users.errorDeleting'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectDialog.studentId || !rejectionReason.trim()) {
      alert(t('users.mustWriteRejectionReason'))
      return
    }

    try {
      setActionLoading(rejectDialog.studentId)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/verification/${rejectDialog.studentId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ rejectionReason })
      })

      if (response.ok) {
        await fetchUsers()
        setRejectDialog({ open: false, studentId: null })
        setRejectionReason('')
        alert(t('users.rejectedSuccessfully'))
        if (viewUserDialog) setViewUserDialog(false)
      } else {
        const data = await response.json()
        alert(data.error || t('users.errorRejecting'))
      }
    } catch (error) {
      console.error('Error rejecting student:', error)
      alert(t('users.errorRejecting'))
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (user: UserData) => {
    if (user.userStatus === 'DELETED') {
      return <Badge variant="destructive">{t('users.deleted')}</Badge>
    }

    if (user.userStatus === 'BANNED') {
      return <Badge variant="destructive">{t('users.banned')}</Badge>
    }

    if (user.userStatus === 'SUSPENDED') {
      return <Badge className="bg-blue-700 text-white">{t('users.suspended')}</Badge>
    }

    if (user.role === 'PATIENT') {
      return <Badge variant={user.userStatus === 'ACTIVE' ? 'default' : 'secondary'}>
        {user.userStatus === 'ACTIVE' ? t('common.yes') : user.userStatus}
      </Badge>
    }

    switch (user.verificationStatus) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">{t('users.pending')}</Badge>
      case 'APPROVED':
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">{t('users.verified')}</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">{t('users.rejected')}</Badge>
      default:
        return <Badge variant="outline">{t('common.no')}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    const localeDate = locale === 'ar' ? 'ar-EG' : 'en-US'
    return new Date(date).toLocaleDateString(localeDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={undefined} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4 border-slate-200 bg-white">
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800">{t('auth.loginTitle')}</h3>
              <p className="text-slate-600 mb-4">{t('auth.loginRequired')}</p>
              <Button
                onClick={() => {
                  const currentPath = encodeURIComponent('/admin/users')
                  window.location.href = `/sandbox-login?redirect=${currentPath}`
                }}
                className="bg-slate-800 hover:bg-slate-900 text-white"
              >
                {t('auth.loginButton')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' | 'ADMIN' } : undefined} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4 border-slate-200 bg-white">
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800">{t('auth.unauthorized')}</h3>
              <p className="text-slate-600">{t('auth.adminOnly')}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' | 'ADMIN' } : undefined} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">{t('common.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' | 'ADMIN' } : undefined} />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">{t('users.title')}</h1>
            </div>
            <p className="text-slate-600">{t('users.subtitle')}</p>
          </div>

          <Card className="mb-6 border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder={t('users.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="w-48">
                  <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
                    <SelectTrigger className="border-slate-200">
                      <Filter className="w-4 h-4 ml-2 text-slate-500" />
                      <SelectValue placeholder={t('users.filterType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t('users.all')}</SelectItem>
                      <SelectItem value="STUDENT">{t('users.doctorsStudents')}</SelectItem>
                      <SelectItem value="PATIENT">{t('users.patients')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48">
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="border-slate-200">
                      <Filter className="w-4 h-4 ml-2 text-slate-500" />
                      <SelectValue placeholder={t('users.filterStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t('users.all')}</SelectItem>
                      <SelectItem value="PENDING">{t('users.pending')}</SelectItem>
                      <SelectItem value="APPROVED">{t('users.verified')}</SelectItem>
                      <SelectItem value="REJECTED">{t('users.rejected')}</SelectItem>
                      <SelectItem value="DELETED">{t('users.deleted')}</SelectItem>
                      <SelectItem value="BANNED">{t('users.banned')}</SelectItem>
                      <SelectItem value="SUSPENDED">{t('users.suspended')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchUsers}
                  className="hover:bg-slate-100 border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {!loading && users.length === 0 ? (
            <Card className="border-slate-200 bg-white">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-100">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{t('users.noUsers')}</h3>
                <p className="text-slate-600 mb-4">{t('users.noUsersDesc')}</p>
                <Button variant="outline" onClick={fetchUsers} className="hover:bg-slate-100 border-slate-200">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  {t('users.retry')}
                </Button>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="border-slate-200 bg-white">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-100">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{t('users.noResults')}</h3>
                <p className="text-slate-600">{t('users.noResultsDesc')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((userData) => (
                <Card 
                  key={userData.id}
                  className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800">
                          {userData.role === 'STUDENT' ? (
                            <GraduationCap className="w-6 h-6 text-white" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-slate-800">{userData.name}</h3>
                            {getStatusBadge(userData)}
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{userData.email}</span>
                            </div>
                            {userData.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>{userData.phone}</span>
                              </div>
                            )}
                            {userData.role === 'STUDENT' && userData.universityEmail && (
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-3 h-3 text-slate-500" />
                                <span>{userData.universityEmail}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                {t('users.joinDate')}: {formatDate(userData.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(userData)
                            setViewUserDialog(true)
                          }}
                          className="hover:bg-slate-100 border-slate-200"
                        >
                          {t('users.viewDetails')}
                        </Button>

                        {userData.role === 'STUDENT' && userData.verificationStatus === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(userData.id)}
                              disabled={actionLoading === userData.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="w-4 h-4 ml-1" />
                              {t('users.approve')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setRejectDialog({ open: true, studentId: userData.id })}
                              disabled={actionLoading === userData.id}
                              className="bg-slate-700 hover:bg-slate-800 text-white"
                            >
                              <X className="w-4 h-4 ml-1" />
                              {t('users.reject')}
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          onClick={() => handleDeleteClick(userData.userId)}
                          disabled={actionLoading === userData.userId}
                          className="bg-red-800 hover:bg-red-900 text-white"
                        >
                          <Trash2 className="w-4 h-4 ml-1" />
                          <span>{t('users.delete')}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              {selectedUser?.role === 'STUDENT' ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              {t('users.viewDetails')}
            </DialogTitle>
            <DialogDescription>
              {t('users.fullInfo')} {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">{t('users.basicInfo')}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">{t('users.name')}:</span>
                    <p className="font-medium text-slate-800">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{t('users.type')}:</span>
                    <p className="font-medium text-slate-800">
                      {selectedUser.role === 'STUDENT' ? t('users.doctorStudent') : t('users.patient')}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">{t('users.email')}:</span>
                    <p className="font-medium text-slate-800">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div className="col-span-2">
                      <span className="text-slate-600">{t('users.phone')}:</span>
                      <p className="font-medium text-slate-800">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600">{t('users.status')}:</span>
                    <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t('users.joinDate')}:</span>
                    <p className="font-medium text-slate-800">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              {selectedUser.role === 'STUDENT' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800">{t('users.studentInfo')}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedUser.universityEmail && (
                      <div className="col-span-2">
                        <span className="text-slate-600">{t('users.universityEmail')}:</span>
                        <p className="font-medium text-slate-800">{selectedUser.universityEmail}</p>
                      </div>
                    )}
                    {selectedUser.academicYear && (
                      <div>
                        <span className="text-slate-600">{t('users.academicYear')}:</span>
                        <p className="font-medium text-slate-800">{selectedUser.academicYear}</p>
                      </div>
                    )}
                    {selectedUser.rejectionReason && selectedUser.verificationStatus === 'REJECTED' && (
                      <div className="col-span-2">
                        <span className="text-slate-600">{t('users.rejectionReason')}:</span>
                        <p className="font-medium text-red-700">{selectedUser.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {selectedUser.idCardUrl && (
                    <div>
                      <span className="text-slate-600 text-sm">{t('users.idCard')}:</span>
                      <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden">
                        <img
                          src={selectedUser.idCardUrl || ''}
                          alt={t('users.idCardAlt')}
                          className="w-full max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => selectedUser.idCardUrl && window.open(selectedUser.idCardUrl, '_blank')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedUser.role === 'STUDENT' && selectedUser.verificationStatus === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => handleApprove(selectedUser.id)}
                    disabled={actionLoading === selectedUser.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {actionLoading === selectedUser.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        {t('users.approve')}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setRejectDialog({ open: true, studentId: selectedUser.id })}
                    disabled={actionLoading === selectedUser.id}
                    className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
                  >
                    {actionLoading === selectedUser.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4 ml-2" />
                        {t('users.reject')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, studentId: null })}>
        <DialogContent className="border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              {t('verification.reject')}
            </DialogTitle>
            <DialogDescription>
              {t('verification.rejectReasonDesc')}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={t('verification.writeReason')}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            className="border-slate-200"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, studentId: null })}
              className="hover:bg-slate-100 border-slate-200"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              {t('users.confirmReject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open, userId: null })}>
        <DialogContent className="max-w-lg border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <span>{t('users.deleteAccount')}</span>
            </DialogTitle>
            <DialogDescription>
              {t('users.deleteAccountDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {t('users.deleteReasonLabel')} <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder={t('users.deleteReasonPlaceholder')}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="min-h-[100px] resize-none border-slate-200"
                disabled={actionLoading !== null}
              />
              <p className="text-xs text-slate-500">
                {t('users.deleteReasonNote')}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-800">
                    {t('users.importantWarning')}
                  </p>
                  <p className="text-sm text-red-700">
                    {t('users.softDeleteWarning')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialog({ open: false, userId: null })
                setDeleteReason('')
              }}
              disabled={actionLoading !== null}
              className="hover:bg-slate-100 border-slate-200"
            >
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-red-800 hover:bg-red-900 text-white"
              onClick={handleDelete}
              disabled={actionLoading !== null || !deleteReason.trim()}
            >
              {actionLoading === deleteDialog.userId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>{t('users.deleting')}</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>{t('users.deleteAccount')}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
