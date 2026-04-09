import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/debug/admin-notifications
 * Debug endpoint to check admin notifications status
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG ADMIN NOTIFICATIONS] Checking...')

    // Get all admins
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    console.log('[DEBUG ADMIN NOTIFICATIONS] Found admins:', admins.length)

    if (admins.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No admins found in the system',
        admins: []
      })
    }

    // Get notifications for each admin
    const adminNotifications = await Promise.all(
      admins.map(async (admin) => {
        const notifications = await db.notification.findMany({
          where: { userId: admin.id },
          orderBy: { createdAt: 'desc' },
          take: 10
        })

        const unreadCount = await db.notification.count({
          where: {
            userId: admin.id,
            isRead: false
          }
        })

        return {
          admin: admin,
          totalNotifications: notifications.length,
          unreadCount: unreadCount,
          recentNotifications: notifications.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message.substring(0, 50),
            isRead: n.isRead,
            createdAt: n.createdAt
          }))
        }
      })
    )

    return NextResponse.json({
      success: true,
      totalAdmins: admins.length,
      adminNotifications
    })
  } catch (error: any) {
    console.error('[DEBUG ADMIN NOTIFICATIONS] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
