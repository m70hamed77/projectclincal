import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Debug endpoint to check notification system
 */
export async function GET() {
  try {
    // Check how many admins exist
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    // Get recent notifications
    const recentNotifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            role: true,
          }
        }
      }
    })

    // Get unread notification count per admin
    const adminNotificationCounts = await Promise.all(
      admins.map(async (admin) => {
        const unreadCount = await db.notification.count({
          where: {
            userId: admin.id,
            isRead: false
          }
        })

        const totalCount = await db.notification.count({
          where: {
            userId: admin.id
          }
        })

        return {
          adminId: admin.id,
          adminName: admin.name,
          adminEmail: admin.email,
          unreadCount,
          totalCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      adminsCount: admins.length,
      admins: admins,
      adminNotificationCounts,
      recentNotifications: recentNotifications.map(n => ({
        id: n.id,
        userId: n.userId,
        userName: n.user.name,
        userRole: n.user.role,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt
      }))
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
