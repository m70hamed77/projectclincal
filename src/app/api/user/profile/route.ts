import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    // الحصول على JWT Token من headers
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // التحقق من الـ Token
    const payload = getUserFromToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token غير صالح أو منتهي' },
        { status: 401 }
      )
    }

    // الحصول على المستخدم الحالي
    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // الحصول على البيانات من الطلب
    const body = await request.json()
    const { name, phone, address, bio } = body

    // التحقق من الحقول المطلوبة
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'الاسم مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من الهاتف إذا تم إرساله
    if (phone) {
      const phoneRegex = /^01[0-9]{9}$/
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'رقم الهاتف غير صحيح، يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا' },
          { status: 400 }
        )
      }
    }

    // تحديث بيانات المستخدم
    const updatedUser = await db.user.update({
      where: { id: currentUser.id },
      data: {
        name: name.trim(),
        phone: phone || null,
        // يمكن إضافة المزيد من الحقول هنا مثل address, bio
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user: updatedUser,
    })
  } catch (error: any) {
    console.error('[API] Update profile error:', error)

    // التحقق من تكرار البريد الإلكتروني
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث البيانات' },
      { status: 500 }
    )
  }
}
