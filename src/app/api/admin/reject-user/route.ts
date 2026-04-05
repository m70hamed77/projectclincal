import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, reason } = body

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
        { error: 'يمكن رفض فقط حسابات المرضى' },
        { status: 400 }
      )
    }

    if (user.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'الحساب ليس في حالة انتظار' },
        { status: 400 }
      )
    }

    // حذف الحساب (أو تعديل الحالة إلى REJECTED)
    // هنا سنقوم بحذفه لأنه لم يتم تفعيله بعد
    await db.user.delete({
      where: { id: userId },
    })

    console.log(`[REJECT] User ${user.name} (${user.email}) has been rejected. Reason: ${reason || 'No reason provided'}`)

    return NextResponse.json({
      success: true,
      message: 'تم رفض الحساب بنجاح',
    })
  } catch (error) {
    console.error('[Reject User] Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفض الحساب' },
      { status: 500 }
    )
  }
}
