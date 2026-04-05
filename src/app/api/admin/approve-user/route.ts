import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.role !== 'PATIENT') {
      return NextResponse.json(
        { error: 'يمكن الموافقة فقط على حسابات المرضى' },
        { status: 400 }
      )
    }

    if (user.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'الحساب ليس في حالة انتظار' },
        { status: 400 }
      )
    }

    // تفعيل الحساب
    await db.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
      },
    })

    console.log(`[APPROVE] User ${user.name} (${user.email}) has been approved`)

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل الحساب بنجاح',
    })
  } catch (error) {
    console.error('[Approve User] Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تفعيل الحساب' },
      { status: 500 }
    )
  }
}
