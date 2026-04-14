import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// GET /api/appointments - Get user appointments
export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie (authenticated user)
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'غير مصرح - يرجى تسجيل الدخول' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { patient: true, student: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    let applications: any[] = []

    // If user is patient, get their applications
    if (user.role === 'PATIENT' && user.patient) {
      applications = await db.application.findMany({
        where: { patientId: user.patient.id },
        include: {
          post: {
            include: {
              student: {
                include: { user: true }
              }
            }
          },
          case_: {
            include: {
              appointment: true
            }
          }
        }
      })
    }
    // If user is student, get applications for their posts
    else if (user.role === 'STUDENT' && user.student) {
      applications = await db.application.findMany({
        where: {
          post: {
            studentId: user.student.id
          }
        },
        include: {
          post: {
            include: {
              student: {
                include: { user: true }
              }
            }
          },
          case_: {
            include: {
              appointment: true,
              application: {
                include: {
                  patient: {
                    include: { user: true }
                  }
                }
              }
            }
          }
        }
      })
    }

    // Transform applications into appointments
    const appointments = await Promise.all(
      applications
        .filter(app => app.case_?.appointment)
        .map(async (app) => {
          const appointment = app.case_!.appointment!
          const student = app.post.student

          return {
            id: appointment.id,
            title: app.post.title,
            description: app.post.description || '',
            date: appointment.scheduledAt.toISOString(),
            time: appointment.scheduledAt.toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            location: appointment.location || app.post.address,
            doctorName: student.user.name || 'د. غير معروف',
            doctorPhone: student.user.phone || '',
            doctorId: student.id,
            postId: app.postId,
            caseId: app.case_!.id,
            status: appointment.status,
            notes: appointment.notes,
            duration: appointment.duration,
            type: appointment.type,
            reminder24hSent: appointment.reminder24hSent,
            reminder1hSent: appointment.reminder1hSent,
            createdAt: appointment.createdAt.toISOString(),
            updatedAt: appointment.updatedAt.toISOString(),
            // Include patient info for students
            patientName: user.role === 'STUDENT' ? app.case_!.application.patient.user.name : undefined,
            patientPhone: user.role === 'STUDENT' ? app.case_!.application.patient.user.phone : undefined
          }
        })
    )

    return NextResponse.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('[API] Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المواعيد' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      caseId,
      scheduledAt,
      type = 'APPOINTMENT',
      duration,
      location,
      notes
    } = body

    if (!caseId || !scheduledAt) {
      return NextResponse.json(
        { error: 'معرف الحالة وتاريخ الموعد مطلوبان' },
        { status: 400 }
      )
    }

    // Check if case exists
    const case_ = await db.case.findUnique({
      where: { id: caseId },
      include: { appointment: true }
    })

    if (!case_) {
      return NextResponse.json(
        { error: 'الحالة غير موجودة' },
        { status: 404 }
      )
    }

    if (case_.appointment) {
      return NextResponse.json(
        { error: 'يوجد موعد محدد لهذه الحالة بالفعل' },
        { status: 400 }
      )
    }

    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        caseId,
        scheduledAt: new Date(scheduledAt),
        type,
        duration,
        location,
        notes,
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('[API] Error creating appointment:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الموعد' },
      { status: 500 }
    )
  }
}
