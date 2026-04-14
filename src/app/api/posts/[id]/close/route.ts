import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // جلب userId من الـ cookies
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول' },
        { status: 401 }
      )
    }

    // جلب المستخدم مع معلومات الطالب
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { student: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من أن المستخدم طالب
    if (!user.student) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب أن تكون طالباً' },
        { status: 403 }
      )
    }

    // جلب البوست
    const post = await db.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'البوست غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من أن المستخدم صاحب البوست (مقارنة معرف الطالب)
    if (post.studentId !== user.student.id) {
      return NextResponse.json(
        { error: 'غير مصرح: أنت لست صاحب هذا البوست' },
        { status: 403 }
      )
    }

    // تحديث حالة البوست إلى مكتملة
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        status: 'COMPLETED' as any
      }
    })

    console.log(`[POST CLOSE] ✅ Post ${id} closed by ${user.name}`)

    return NextResponse.json({
      success: true,
      message: 'تم إغلاق الحالة بنجاح',
      post: updatedPost
    })
  } catch (error: any) {
    console.error('[POST CLOSE] Error closing post:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء إغلاق الحالة' },
      { status: 500 }
    )
  }
}
