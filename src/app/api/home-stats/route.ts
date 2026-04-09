import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [usersCount, postsCount, casesCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count().catch(() => 0),
      prisma.case.count().catch(() => 0),
    ])

    return NextResponse.json({
      success: true,
      data: {
        users: usersCount,
        posts: postsCount,
        cases: casesCount,
        activeStudents: 0,
        activePatients: 0,
        completedCases: 0,
        averageRating: 0
      }
    })

  } catch (error) {
    console.error('home-stats error:', error)
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
