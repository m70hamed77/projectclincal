import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params
    const userId = request.headers.get('X-User-Id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const existingReport = await db.report.findUnique({
      where: { id: reportId }
    })

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    const updatedReport = await db.report.update({
      where: { id: reportId },
      data: {
        status: 'PENDING',
        adminDecision: null,
        adminNotes: null,
        banDuration: null,
        resolvedBy: null,
        resolvedAt: null
      }
    })

    return NextResponse.json({
      success: true,
      report: updatedReport
    })
  } catch (error) {
    console.error('[Admin Reports Reopen] Error:', error)
    return NextResponse.json(
      { error: 'Failed to reopen report' },
      { status: 500 }
    )
  }
}
