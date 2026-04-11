import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Clean all users except admin
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Get all non-admin users
    const nonAdminUsers = await db.user.findMany({
      where: {
        role: {
          in: ['PATIENT', 'STUDENT']
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    })

    console.log(`[CLEAN USERS] Found ${nonAdminUsers.length} non-admin users to delete`)

    const deletedUsers = []
    const errors = []

    // Delete each user and their related data
    for (const userToDelete of nonAdminUsers) {
      try {
        // Step 1: Delete all reports where this user is the reporter (with cascade)
        await db.report.deleteMany({
          where: { reporterId: userToDelete.id }
        })

        // Step 2: Get user's student and patient records
        const student = await db.student.findUnique({
          where: { userId: userToDelete.id },
          select: { id: true }
        })

        const patient = await db.patient.findUnique({
          where: { userId: userToDelete.id },
          select: { id: true }
        })

        // Step 3: If user is a student, delete student-related data
        if (student) {
          console.log(`[CLEAN USERS] Processing student: ${userToDelete.email}`)

          // Delete all posts and their related data
          const posts = await db.post.findMany({
            where: { studentId: student.id },
            select: { id: true }
          })

          for (const post of posts) {
            // Posts are cascaded to applications, which cascade to cases, appointments, etc.
            await db.post.delete({
              where: { id: post.id }
            })
          }

          // Delete remaining applications (if any)
          await db.application.deleteMany({
            where: { studentId: student.id }
          })

          // Delete student's badges
          await db.studentBadge.deleteMany({
            where: { studentId: student.id }
          })

          // Delete student points
          if (await db.studentPoints.findUnique({ where: { studentId: student.id } })) {
            await db.studentPoints.delete({
              where: { studentId: student.id }
            })
          }

          // Delete student stats
          if (await db.studentStats.findUnique({ where: { studentId: student.id } })) {
            await db.studentStats.delete({
              where: { studentId: student.id }
            })
          }

          // Delete student record (will cascade to conversations, messages, case photos, certificates)
          await db.student.delete({
            where: { id: student.id }
          })
        }

        // Step 4: If user is a patient, delete patient-related data
        if (patient) {
          console.log(`[CLEAN USERS] Processing patient: ${userToDelete.email}`)

          // Delete patient's applications (will cascade to cases, appointments, etc.)
          await db.application.deleteMany({
            where: { patientId: patient.id }
          })

          // Delete patient's medical profile
          const medicalProfile = await db.patientMedicalProfile.findUnique({
            where: { patientId: patient.id }
          })
          if (medicalProfile) {
            await db.patientMedicalProfile.delete({
              where: { patientId: patient.id }
            })
          }

          // Delete patient record (will cascade to conversations, messages, certificates, consents)
          await db.patient.delete({
            where: { id: patient.id }
          })
        }

        // Step 5: Delete remaining user data
        await db.notification.deleteMany({
          where: { userId: userToDelete.id }
        })

        await db.userBan.deleteMany({
          where: { userId: userToDelete.id }
        })

        const userStrike = await db.userStrike.findUnique({
          where: { userId: userToDelete.id }
        })
        if (userStrike) {
          await db.userStrike.delete({
            where: { userId: userToDelete.id }
          })
        }

        // Step 6: Delete the user
        await db.user.delete({
          where: { id: userToDelete.id }
        })

        deletedUsers.push({
          email: userToDelete.email,
          role: userToDelete.role,
          name: userToDelete.name
        })

        console.log(`[CLEAN USERS] Deleted user: ${userToDelete.email}`)

      } catch (error) {
        console.error(`[CLEAN USERS] Error deleting user ${userToDelete.email}:`, error)
        errors.push({
          email: userToDelete.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    console.log(`[CLEAN USERS] Completed. Deleted: ${deletedUsers.length}, Errors: ${errors.length}`)

    return NextResponse.json({
      success: true,
      deletedCount: deletedUsers.length,
      errorCount: errors.length,
      deletedUsers,
      errors
    })

  } catch (error) {
    console.error('[CLEAN USERS] Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
