'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useTranslations } from '@/hooks/useTranslations'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Clock,
  Flag,
  RefreshCw,
  FileText,
  Filter,
  AlertOctagon,
  Ban,
  Pause,
  ShieldAlert,
  Loader2,
} from 'lucide-react'

interface Report {
  id: string
  reporterId: string
  reporterName: string
  reporterEmail: string
  reportedId: string
  reportedName: string
  reportedEmail: string
  reportType: string
  description: string
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  adminDecision: 'DISMISS' | 'WARN' | 'SUSPEND' | 'TEMP_BAN' | 'PERM_BAN' | null
  adminNotes: string | null
  banDuration: number | null
  resolvedBy: string | null
  resolvedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export function AdminReportsPageInner() {
  const { user, loading: userLoading } = useCurrentUser()
  const { t, locale, loading: i18nLoading } = useTranslations()
  const isRTL = locale === 'ar'

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED'>('ALL')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [resolveDialog, setResolveDialog] = useState(false)
  const [resolutionText, setResolutionText] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [actionDialog, setActionDialog] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'WARN' | 'SUSPEND' | 'TEMP_BAN' | 'PERM_BAN' | null>(null)
  const [actionForm, setActionForm] = useState({
    reason: '',
    duration: 7
  })

  const fetchReports = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') {
      setLoading(false)
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

      const response = await fetch('/api/admin/reports', {
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      } else {
        const errorData = await response.json()
        console.error('[Admin Reports] Error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      alert('Error fetching reports')
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.role])

  const ensureAdminRecord = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch('/api/admin/ensure-admin', {
        method: 'POST',
        credentials: 'include',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[Admin Reports] Admin record ensured:', data)
      }
    } catch (error) {
      console.error('Error ensuring admin record:', error)
    }
  }, [user?.id, user?.role])

  useEffect(() => {
    ensureAdminRecord()
    fetchReports()
  }, [fetchReports, ensureAdminRecord])

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'ALL') return true
    return report.status === filterStatus
  })

  const handleResolve = async () => {
    if (!selectedReport || !resolutionText.trim()) {
      alert(t('reports.mustWriteSolution'))
      return
    }

    try {
      setActionLoading(selectedReport.id)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/reports/${selectedReport.id}/resolve`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ resolution: resolutionText })
      })

      if (response.ok) {
        await fetchReports()
        setResolveDialog(false)
        setResolutionText('')
        setSelectedReport(null)
        alert(t('reports.resolvedSuccessfully'))
      } else {
        const data = await response.json()
        alert(data.error || t('reports.errorResolving'))
      }
    } catch (error) {
      console.error('Error resolving report:', error)
      alert(t('reports.errorResolving'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleDismiss = async (reportId: string) => {
    if (!confirm(t('reports.confirmDismiss'))) return

    try {
      setActionLoading(reportId)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(`/api/admin/reports/${reportId}/dismiss`, {
        method: 'POST',
        credentials: 'include',
        headers
      })

      if (response.ok) {
        await fetchReports()
        alert(t('reports.dismissedSuccessfully'))
      } else {
        const data = await response.json()
        alert(data.error || t('reports.errorDismissing'))
      }
    } catch (error) {
      console.error('Error dismissing report:', error)
      alert(t('reports.errorDismissing'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleAction = async () => {
    if (!selectedReport || !selectedAction || !actionForm.reason.trim()) {
      alert(t('reports.mustWriteReason'))
      return
    }

    const actionLabel = getActionLabel(selectedAction)
    const confirmed = confirm(`${t('reports.confirmAction')}\n\n${actionLabel}: ${actionForm.reason}`)
    if (!confirmed) return

    try {
      setActionLoading(selectedReport.id)

      let endpoint = ''
      let body = {}

      switch (selectedAction) {
        case 'WARN':
          endpoint = `/api/admin/reports/${selectedReport.id}/warn`
          body = { warningMessage: actionForm.reason }
          break
        case 'SUSPEND':
          endpoint = `/api/admin/reports/${selectedReport.id}/suspend`
          body = { suspensionReason: actionForm.reason }
          break
        case 'TEMP_BAN':
        case 'PERM_BAN':
          endpoint = `/api/admin/reports/${selectedReport.id}/ban`
          body = {
            banType: selectedAction,
            banReason: actionForm.reason,
            banDurationDays: selectedAction === 'TEMP_BAN' ? actionForm.duration : null
          }
          break
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (user?.id) {
        headers['X-User-Id'] = user.id
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchReports()
        setActionDialog(false)
        setSelectedAction(null)
        setActionForm({ reason: '', duration: 7 })
        alert(data.message || t('reports.actionExecutedSuccessfully'))
      } else {
        console.error('[Admin Reports] Action failed:', data)
        alert(data.error || data.details || t('reports.errorExecutingAction'))
      }
    } catch (error) {
      console.error('Error executing action:', error)
      alert(t('reports.errorExecutingAction'))
    } finally {
      setActionLoading(null)
    }
  }

  const getActionLabel = (action: string) => {
    return t(`reports.actionLabels.${action}`) || action
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">{t('reports.pending')}</Badge>
      case 'RESOLVED':
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">{t('reports.resolved')}</Badge>
      case 'DISMISSED':
        return <Badge variant="destructive">{t('reports.dismissed')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'RESOLVED':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'DISMISSED':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getAdminDecisionLabel = (decision: string | null) => {
    if (!decision) return ''
    return t(`reports.decisionLabels.${decision}`) || decision
  }

  const formatDate = (date: Date) => {
    const localeDate = locale === 'ar' ? 'ar-EG' : 'en-US'
    return new Date(date).toLocaleDateString(localeDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!loading && !userLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={undefined} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4 border-slate-200 bg-white">
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800">{t('auth.mustLogin')}</h3>
              <p className="text-slate-600 mb-4">{t('auth.loginRequired')}</p>
              <Button
                onClick={() => {
                  const currentPath = encodeURIComponent('/admin/reports')
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

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation user={user ? { id: user.id, name: user.name || 'مستخدم', email: user.email || '', role: user.role as 'PATIENT' | 'STUDENT' | 'ADMIN' } : undefined} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">{t('reports.loading')}</p>
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
              <h1 className="text-3xl font-bold text-slate-800">{t('reports.title')}</h1>
            </div>
            <p className="text-slate-600">{t('reports.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{t('reports.pending')}</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {reports.filter(r => r.status === 'PENDING').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{t('reports.resolved')}</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {reports.filter(r => r.status === 'RESOLVED').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{t('reports.dismissed')}</p>
                    <p className="text-2xl font-bold text-red-600">
                      {reports.filter(r => r.status === 'DISMISSED').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{t('reports.filter')}</span>
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder={t('reports.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('reports.all')}</SelectItem>
                    <SelectItem value="PENDING">{t('reports.pending')}</SelectItem>
                    <SelectItem value="RESOLVED">{t('reports.resolved')}</SelectItem>
                    <SelectItem value="DISMISSED">{t('reports.dismissed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchReports}
                  className="hover:bg-slate-100 border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredReports.length === 0 ? (
            <Card className="border-slate-200 bg-white">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-100">
                  <Flag className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{t('reports.noReports')}</h3>
                <p className="text-slate-600">{t('reports.noReportsDesc')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="border-slate-200 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-800">{t('reports.newReport')}</h3>
                              {getStatusBadge(report.status)}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">{t('reports.reporter')}</span>
                                <span className="font-medium text-slate-800">{report.reporterName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">{t('reports.reportedUser')}</span>
                                <span className="font-medium text-slate-800">{report.reportedName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">{t('reports.type')}</span>
                                <span className="font-medium text-slate-800">{report.reportType}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">{t('reports.date')}</span>
                                <span className="font-medium text-slate-800">{formatDate(report.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg p-4 bg-slate-50">
                          <p className="text-sm text-slate-600 mb-2">{t('reports.description')}</p>
                          <p className="text-sm text-slate-800">{report.description}</p>
                        </div>

                        {report.adminDecision && (
                          <div className="rounded-lg p-4 bg-slate-50 border border-slate-200">
                            <p className="text-sm mb-2 font-medium text-slate-800">{t('reports.actionTaken')}</p>
                            <p className="text-sm mb-2 text-slate-700">
                              {getAdminDecisionLabel(report.adminDecision)}
                            </p>
                            {report.adminNotes && (
                              <p className="text-sm bg-white p-2 rounded text-slate-700">
                                {t('reports.notes')} {report.adminNotes}
                              </p>
                            )}
                            {report.banDuration && report.adminDecision === 'TEMP_BAN' && (
                              <p className="text-sm bg-white p-2 rounded text-slate-700">
                                {t('reports.banDuration')} {report.banDuration} {locale === 'ar' ? 'أيام' : 'days'}
                              </p>
                            )}
                          </div>
                        )}

                        {!report.adminDecision && report.adminNotes && report.status === 'RESOLVED' && (
                          <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-200">
                            <p className="text-sm mb-2 font-medium text-emerald-800">{t('reports.solution')}</p>
                            <p className="text-sm text-emerald-700">{report.adminNotes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {report.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                setResolveDialog(true)
                              }}
                              disabled={actionLoading === report.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.resolve')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                setSelectedAction('WARN')
                                setActionDialog(true)
                              }}
                              disabled={actionLoading === report.id}
                              className="bg-amber-600 hover:bg-amber-700 text-white border-0"
                            >
                              <ShieldAlert className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.warn')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                setSelectedAction('SUSPEND')
                                setActionDialog(true)
                              }}
                              disabled={actionLoading === report.id}
                              className="bg-blue-700 hover:bg-blue-800 text-white"
                            >
                              <Pause className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.suspend')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                setSelectedAction('TEMP_BAN')
                                setActionDialog(true)
                              }}
                              disabled={actionLoading === report.id}
                              className="bg-blue-700 hover:bg-blue-800 text-white"
                            >
                              <Ban className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.tempBan')}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                setSelectedAction('PERM_BAN')
                                setActionDialog(true)
                              }}
                              disabled={actionLoading === report.id}
                              className="bg-red-700 hover:bg-red-800"
                            >
                              <AlertOctagon className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.permBan')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDismiss(report.id)}
                              disabled={actionLoading === report.id}
                              className="bg-slate-700 hover:bg-slate-800 text-white"
                            >
                              <XCircle className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t('reports.dismiss')}
                            </Button>
                          </>
                        )}
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

      <Dialog open={resolveDialog} onOpenChange={setResolveDialog}>
        <DialogContent className="border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {t('reports.resolveReport')}
            </DialogTitle>
            <DialogDescription>
              {t('reports.resolveDescription')}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={t('reports.writeSolution')}
            value={resolutionText}
            onChange={(e) => setResolutionText(e.target.value)}
            rows={4}
            className="border-slate-200"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResolveDialog(false)
                setResolutionText('')
                setSelectedReport(null)
              }}
              className="hover:bg-slate-100 border-slate-200"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolutionText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <span className="font-bold">{t('reports.confirmResolve')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog} onOpenChange={(open) => !open && setActionDialog(false)}>
        <DialogContent className="max-w-lg border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              {selectedAction === 'WARN' && <ShieldAlert className="w-5 h-5" />}
              {selectedAction === 'SUSPEND' && <Pause className="w-5 h-5" />}
              {(selectedAction === 'TEMP_BAN' || selectedAction === 'PERM_BAN') && <AlertOctagon className="w-5 h-5" />}
              {getActionLabel(selectedAction || '')}
            </DialogTitle>
            <DialogDescription>
              {selectedReport && (`${t('reports.takeActionAgainst')} ${selectedReport.reportedName}`)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-slate-700">
                {t('reports.actionReason')} *
              </label>
              <Textarea
                placeholder={t('reports.writeSolution')}
                value={actionForm.reason}
                onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                rows={4}
                className="border-slate-200"
              />
            </div>
            {selectedAction === 'TEMP_BAN' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block text-slate-700">
                  {t('reports.banDurationDays')} *
                </label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={actionForm.duration}
                  onChange={(e) => setActionForm({ ...actionForm, duration: parseInt(e.target.value) })}
                  className="text-left border-slate-200"
                />
              </div>
            )}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>{t('reports.warningText')}</strong>
                {selectedAction === 'WARN' && t('reports.warnActionDesc')}
                {selectedAction === 'SUSPEND' && t('reports.suspendActionDesc')}
                {selectedAction === 'TEMP_BAN' && `${t('reports.tempBanActionDesc')} ${actionForm.duration} ${locale === 'ar' ? 'يوم' : 'day'}`}
                {selectedAction === 'PERM_BAN' && t('reports.permBanActionDesc')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog(false)
                setSelectedAction(null)
                setActionForm({ reason: '', duration: 7 })
              }}
              disabled={actionLoading !== null}
              className="hover:bg-slate-100 border-slate-200"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleAction}
              disabled={actionLoading !== null || !actionForm.reason.trim()}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {actionLoading === selectedReport?.id ? (
                <>
                  <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('reports.executing')}
                </>
              ) : (
                <span className="font-bold">{t('common.confirm')}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
