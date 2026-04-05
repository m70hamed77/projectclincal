import { db } from '../src/lib/db'

/**
 * اختبار قبول الطلب
 * يختبر:
 * 1. تحديث حالة الطلب
 * 2. إنشاء Case
 * 3. إنشاء Appointment
 * 4. إنشاء Conversation
 * 5. إنشاء Notification
 */

async function testAcceptApplication() {
  console.log('🧪 جاري اختبار قبول الطلب...')

  try {
    // Application ID من setup-test-users.ts
    const applicationId = 'cmnadmm7f000ap6xgpnx55v8h'

    // 1. الحصول على الطلب
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        post: true,
        patient: {
          include: { user: true }
        }
      }
    })

    if (!application) {
      console.log('❌ الطلب غير موجود')
      return
    }

    console.log('✅ الطلب موجود:', application.status)

    // 2. الحصول على الطالب
    const student = await db.user.findUnique({
      where: { email: 'student@test.com' },
      include: { student: true }
    })

    if (!student) {
      console.log('❌ الطالب غير موجود')
      return
    }

    console.log('✅ الطالب موجود:', student.email)

    // 3. قبول الطلب
    const updatedApplication = await db.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' }
    })
    console.log('✅ تم قبول الطلب')

    // 4. إنشاء Case
    const newCase = await db.case.create({
      data: { applicationId }
    })
    console.log('✅ تم إنشاء Case:', newCase.id)

    // 5. إنشاء Appointment
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)

    const newAppointment = await db.appointment.create({
      data: {
        caseId: newCase.id,
        type: 'APPOINTMENT',
        status: 'SCHEDULED',
        scheduledAt: defaultDate,
        duration: 60,
        location: null
      }
    })
    console.log('✅ تم إنشاء Appointment:', newAppointment.id)

    // 6. إنشاء Conversation
    const newConversation = await db.conversation.create({
      data: {
        caseId: newCase.id,
        studentId: student.student!.id,
        patientId: application.patientId
      }
    })
    console.log('✅ تم إنشاء Conversation:', newConversation.id)

    // 7. تحديث البوست
    await db.post.update({
      where: { id: application.postId },
      data: { acceptedCount: { increment: 1 } }
    })
    console.log('✅ تم تحديث عدد الطلبات المقبولة')

    // 8. إنشاء إشعار
    await db.notification.create({
      data: {
        userId: application.patient.user.id,
        type: 'APPLICATION_ACCEPTED',
        title: 'تم قبول طلبك',
        message: `تم قبول طلبك على إعلان "${application.post.title}"`,
        data: JSON.stringify({
          postId: application.postId,
          applicationId: applicationId,
          caseId: newCase.id,
          conversationId: newConversation.id,
          appointmentId: newAppointment.id,
          studentId: student.student!.id,
          studentName: student.name
        }),
        isRead: false,
        channels: JSON.stringify(['IN_APP'])
      }
    })
    console.log('✅ تم إنشاء إشعار للمريض')

    console.log('\n🎉 اختبار القبول تم بنجاح!')
    console.log('\n📋 العناصر المُنشأة:')
    console.log('   Case:', newCase.id)
    console.log('   Appointment:', newAppointment.id)
    console.log('   Conversation:', newConversation.id)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await db.$disconnect()
  }
}

testAcceptApplication()
