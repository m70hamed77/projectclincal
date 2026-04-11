import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth-helper'
import { getOrCreateStats } from '@/lib/stats'

/**
 * GET /api/admin/dashboard-stats
 *
 * Get dashboard statistics for admin
 * Only accessible by ADMIN users
 *
 * Stats are read from SystemStats table (incremented at event time)
 * Only pendingVerifications and averageRating are calculated on-demand
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN STATS] Fetching dashboard statistics...')

    // ✅ Get userId from multiple sources (cookies, headers, query params)
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      console.log('[ADMIN STATS] No user ID found')
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    // Get user with role
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.role !== 'ADMIN') {
      console.log('[ADMIN STATS] User is not admin:', user?.role)
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول' },
        { status: 403 }
      )
    }

    console.log('[ADMIN STATS] User is admin, fetching stats...')

    // Get stats from SystemStats table
    const stats = await getOrCreateStats()

    // Get pending verifications count (calculated on-demand)
    const pendingVerifications = await db.student.count({
      where: { verificationStatus: 'PENDING' }
    })

    // Get average rating (calculated on-demand)
    const ratingStats = await db.rating.aggregate({
      _avg: {
        overallRating: true
      }
    })

    const averageRating = ratingStats._avg.overallRating || 0

    // Calculate total reports
    const totalReports = stats.pendingReports + stats.resolvedReports + stats.dismissedReports + stats.rejectedReports

    console.log('[ADMIN STATS] Stats fetched successfully')
    console.log('[ADMIN STATS] Stats details:', {
      pendingVerifications,
      totalUsers: stats.totalUsers,
      approvedDoctors: stats.approvedDoctors,
      rejectedDoctors: stats.rejectedDoctors,
      deletedUsers: stats.deletedUsers,
      bannedUsers: stats.bannedUsers,
      suspendedUsers: stats.suspendedUsers,
      totalPatients: stats.totalPatients,
      activePatients: stats.activePatients,
      totalStudents: stats.totalStudents,
      activeStudents: stats.activeStudents,
      totalCases: stats.totalCases,
      activeCases: stats.activeCases,
      totalRatings: stats.totalRatings,
      averageRating,
      pendingReports: stats.pendingReports,
      resolvedReports: stats.resolvedReports,
      dismissedReports: stats.dismissedReports,
      rejectedReports: stats.rejectedReports,
      totalReports
    })

    return NextResponse.json({
      success: true,
      stats: {
        pendingVerifications,
        totalUsers: stats.totalUsers,
        approvedDoctors: stats.approvedDoctors,
        rejectedDoctors: stats.rejectedDoctors,
        deletedUsers: stats.deletedUsers,
        bannedUsers: stats.bannedUsers,
        suspendedUsers: stats.suspendedUsers,
        totalPatients: stats.totalPatients,
        activePatients: stats.activePatients,
        totalStudents: stats.totalStudents,
        activeStudents: stats.activeStudents,
        totalCases: stats.totalCases,
        activeCases: stats.activeCases,
        totalRatings: stats.totalRatings,
        averageRating,
        pendingReports: stats.pendingReports,
        resolvedReports: stats.resolvedReports,
        dismissedReports: stats.dismissedReports,
        rejectedReports: stats.rejectedReports,
        totalReports
      }
    })
  } catch (error: any) {
    console.error('[ADMIN STATS] Error:', error)
    console.error('[ADMIN STATS] Error name:', error.name)
    console.error('[ADMIN STATS] Error message:', error.message)
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
