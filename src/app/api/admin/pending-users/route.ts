import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // جلب المستخدمين المعلقين (Pending) من نوع PATIENT فقط
    const pendingUsers = await db.user.findMany({
      where: {
        role: 'PATIENT',
        status: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      users: pendingUsers,
    })
  } catch (error) {
    console.error('[Pending Users] Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الحسابات المعلقة' },
      { status: 500 }
    )
  }
}
