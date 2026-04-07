import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/home-stats
 * Fetch real-time statistics for the home page (public endpoint - no auth required)
 */
export async function GET() {
  try {
    console.log('[HOME STATS] Fetching real-time statistics...')

    // Get active students (verified and active)
    const activeStudents = await db.student.count({
      where: {
        verificationStatus: 'APPROVED',
        user: {
          status: 'ACTIVE'
        }
      }
    })
    console.log('[HOME STATS] Active students:', activeStudents)

    // Get active patients
    const activePatients = await db.patient.count({
      where: {
        user: {
          status: 'ACTIVE'
        }
      }
    })
    console.log('[HOME STATS] Active patients:', activePatients)

    // Get completed cases count
    const completedCases = await db.case.count({
      where: {
        isCompleted: true
      }
    })
    console.log('[HOME STATS] Completed cases:', completedCases)

    // Calculate average rating
    const ratings = await db.rating.findMany({
      where: {
        isVisible: true
      },
      select: {
        overallRating: true
      }
    })

    let averageRating = 0
    if (ratings.length > 0) {
      const totalRating = ratings.reduce((sum, r) => sum + r.overallRating, 0)
      averageRating = Math.round((totalRating / ratings.length) * 10) / 10 // Round to 1 decimal place
    }
    console.log('[HOME STATS] Average rating:', averageRating, 'from', ratings.length, 'ratings')

    return NextResponse.json({
      success: true,
      data: {
        activeStudents,
        activePatients,
        completedCases,
        averageRating
      }
    })

  } catch (error: any) {
    console.error('[HOME STATS] Error fetching statistics:', error)
    console.error('[HOME STATS] Error message:', error.message)
    console.error('[HOME STATS] Error stack:', error.stack)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        details: error.message
      },
      { status: 500 }
    )
  }
}
