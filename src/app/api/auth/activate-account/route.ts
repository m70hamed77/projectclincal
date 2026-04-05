import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    console.log('[AUTH ACTIVATE] Activation attempt for email:', email)

    if (!email || !code) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكود التحقق مطلوبان' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('[AUTH ACTIVATE] ❌ User not found:', email)
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.status === 'ACTIVE') {
      console.log('[AUTH ACTIVATE] ⚠️ User already active:', email)
      return NextResponse.json({
        success: true,
        message: 'الحساب موثق بالفعل',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      })
    }

    // تفعيل الحساب
    const activatedUser = await db.user.update({
      where: { email },
      data: {
        status: 'ACTIVE',
        emailVerified: new Date(),
      }
    })

    console.log(`[AUTH ACTIVATE] ✅ Account activated: ${activatedUser.name} (${activatedUser.email})`)

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل حسابك بنجاح',
      user: {
        id: activatedUser.id,
        name: activatedUser.name,
        email: activatedUser.email,
        role: activatedUser.role,
        status: activatedUser.status,
      }
    })
  } catch (error: any) {
    console.error('[AUTH ACTIVATE] ❌ Error:', error)
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تفعيل الحساب' },
      { status: 500 }
    )
  }
}
