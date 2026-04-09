import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notifyAdminNewStudent } from '@/lib/notifications'

/**
 * Debug endpoint to test notification system
 */
export async function GET() {
  try {
    console.log('[DEBUG TEST NOTIFICATION] Starting test...')

    // Check if admins exist
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    console.log(`[DEBUG TEST NOTIFICATION] Found ${admins.length} admin(s):`, admins)

    if (admins.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No admins found in the database. Cannot send notifications.'
      })
    }

    // Count current notifications for each admin
    const beforeCounts = await Promise.all(
      admins.map(async (admin) => {
        const count = await db.notification.count({
          where: { userId: admin.id }
        })
        return { adminId: admin.id, adminName: admin.name, count }
      })
    )

    console.log('[DEBUG TEST NOTIFICATION] Before test:', beforeCounts)

    // Send a test notification
    const testStudentId = 'test_' + Date.now()
    const testName = 'طالب تجريبي'
    const testEmail = 'test@student.com'

    console.log('[DEBUG TEST NOTIFICATION] Sending test notification...')

    const result = await notifyAdminNewStudent(testStudentId, testName, testEmail)

    console.log('[DEBUG TEST NOTIFICATION] Notification sent to', result, 'admin(s)')

    // Count notifications after
    const afterCounts = await Promise.all(
      admins.map(async (admin) => {
        const count = await db.notification.count({
          where: { userId: admin.id }
        })
        return { adminId: admin.id, adminName: admin.name, count }
      })
    )

    console.log('[DEBUG TEST NOTIFICATION] After test:', afterCounts)

    // Get the most recent notification
    const latestNotification = await db.notification.findFirst({
      where: { userId: admins[0].id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      adminsFound: admins.length,
      admins: admins,
      notificationsSent: result,
      beforeCounts,
      afterCounts,
      latestNotification: latestNotification ? {
        id: latestNotification.id,
        type: latestNotification.type,
        title: latestNotification.title,
        message: latestNotification.message,
        isRead: latestNotification.isRead,
        createdAt: latestNotification.createdAt
      } : null
    })
  } catch (error: any) {
    console.error('[DEBUG TEST NOTIFICATION] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
