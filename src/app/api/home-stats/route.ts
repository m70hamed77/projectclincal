import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch real-time statistics from the database
    const [
      usersCount,
      postsCount,
      casesCount,
      activeStudents,
      activePatients,
      completedCases,
      ratingsResult
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count().catch(() => 0),
      prisma.case.count().catch(() => 0),
      // Count verified students (students with isVerified = true and active user status)
      prisma.student.count({
        where: {
          isVerified: true,
          user: {
            status: 'ACTIVE'
          }
        }
      }).catch(() => 0),
      // Count active patients (patients with active user status)
      prisma.patient.count({
        where: {
          user: {
            status: 'ACTIVE'
          }
        }
      }).catch(() => 0),
      // Count completed cases
      prisma.case.count({
        where: {
          isCompleted: true
        }
      }).catch(() => 0),
      // Calculate average rating from all visible ratings
      prisma.rating.aggregate({
        where: {
          isVisible: true
        },
        _avg: {
          overallRating: true
        }
      }).catch(() => ({ _avg: { overallRating: null } }))
    ])

    // Get average rating or default to 0
    const averageRating = ratingsResult._avg.overallRating ?? 0

    return NextResponse.json({
      success: true,
      data: {
        users: usersCount,
        posts: postsCount,
        cases: casesCount,
        activeStudents,
        activePatients,
        completedCases,
        averageRating
      }
    })

  } catch (error) {
    console.error('[HOME-STATS] Error fetching statistics:', error)
    // Return zero values on error to prevent UI breakage
    return NextResponse.json({
      success: true,
      data: {
        users: 0,
        posts: 0,
        cases: 0,
        activeStudents: 0,
        activePatients: 0,
        completedCases: 0,
        averageRating: 0
      }
    })
  }
}
