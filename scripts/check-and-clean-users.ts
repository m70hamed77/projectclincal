import { db } from '../src/lib/db'

async function checkAndCleanUsers() {
  try {
    console.log('🔍 Checking current users in database...\n')

    // Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        status: true
      }
    })

    console.log('📊 Current users:')
    console.table(users)

    const adminUsers = users.filter(u => u.role === 'ADMIN')
    const nonAdminUsers = users.filter(u => u.role !== 'ADMIN')

    console.log(`\n📈 Summary:`)
    console.log(`  - Total users: ${users.length}`)
    console.log(`  - Admin users: ${adminUsers.length}`)
    console.log(`  - Non-admin users (PATIENT/STUDENT): ${nonAdminUsers.length}`)

    if (nonAdminUsers.length === 0) {
      console.log('\n✅ No non-admin users to delete. Database is clean!')
      process.exit(0)
    }

    console.log(`\n⚠️  Found ${nonAdminUsers.length} non-admin users to delete`)
    console.log('\nUsers to be deleted:')
    nonAdminUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`)
    })

    console.log('\n🚀 Starting cleanup process...\n')

    const deletedUsers: Array<{email: string, role: string, name: string | null}> = []
    const errors: Array<{email: string, error: string}> = []

    // Delete each user and their related data
    for (const userToDelete of nonAdminUsers) {
      try {
        console.log(`🔄 Processing: ${userToDelete.email} (${userToDelete.role})`)

        // Step 1: Delete all reports where this user is the reporter
        const deletedReports = await db.report.deleteMany({
          where: { reporterId: userToDelete.id }
        })
        if (deletedReports.count > 0) {
          console.log(`   ✓ Deleted ${deletedReports.count} reports`)
        }

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
          console.log(`   → Processing student data`)

          // Delete all posts and their related data
          const posts = await db.post.findMany({
            where: { studentId: student.id },
            select: { id: true }
          })

          for (const post of posts) {
            await db.post.delete({
              where: { id: post.id }
            })
          }
          if (posts.length > 0) {
            console.log(`     ✓ Deleted ${posts.length} posts`)
          }

          // Delete remaining applications
          const deletedApps = await db.application.deleteMany({
            where: { studentId: student.id }
          })
          if (deletedApps.count > 0) {
            console.log(`     ✓ Deleted ${deletedApps.count} applications`)
          }

          // Delete student's badges
          const deletedBadges = await db.studentBadge.deleteMany({
            where: { studentId: student.id }
          })
          if (deletedBadges.count > 0) {
            console.log(`     ✓ Deleted ${deletedBadges.count} badges`)
          }

          // Delete student points
          const studentPoints = await db.studentPoints.findUnique({
            where: { studentId: student.id }
          })
          if (studentPoints) {
            await db.studentPoints.delete({
              where: { studentId: student.id }
            })
            console.log(`     ✓ Deleted student points`)
          }

          // Delete student stats
          const studentStats = await db.studentStats.findUnique({
            where: { studentId: student.id }
          })
          if (studentStats) {
            await db.studentStats.delete({
              where: { studentId: student.id }
            })
            console.log(`     ✓ Deleted student stats`)
          }

          // Delete student record
          await db.student.delete({
            where: { id: student.id }
          })
          console.log(`   ✓ Deleted student record`)
        }

        // Step 4: If user is a patient, delete patient-related data
        if (patient) {
          console.log(`   → Processing patient data`)

          // Delete patient's applications
          const deletedApps = await db.application.deleteMany({
            where: { patientId: patient.id }
          })
          if (deletedApps.count > 0) {
            console.log(`     ✓ Deleted ${deletedApps.count} applications`)
          }

          // Delete patient's medical profile
          const medicalProfile = await db.patientMedicalProfile.findUnique({
            where: { patientId: patient.id }
          })
          if (medicalProfile) {
            await db.patientMedicalProfile.delete({
              where: { patientId: patient.id }
            })
            console.log(`     ✓ Deleted medical profile`)
          }

          // Delete patient record
          await db.patient.delete({
            where: { id: patient.id }
          })
          console.log(`   ✓ Deleted patient record`)
        }

        // Step 5: Delete remaining user data
        const deletedNotifications = await db.notification.deleteMany({
          where: { userId: userToDelete.id }
        })
        if (deletedNotifications.count > 0) {
          console.log(`   ✓ Deleted ${deletedNotifications.count} notifications`)
        }

        const deletedBans = await db.userBan.deleteMany({
          where: { userId: userToDelete.id }
        })
        if (deletedBans.count > 0) {
          console.log(`   ✓ Deleted ${deletedBans.count} bans`)
        }

        const userStrike = await db.userStrike.findUnique({
          where: { userId: userToDelete.id }
        })
        if (userStrike) {
          await db.userStrike.delete({
            where: { userId: userToDelete.id }
          })
          console.log(`   ✓ Deleted user strikes`)
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

        console.log(`   ✅ Successfully deleted user: ${userToDelete.email}\n`)

      } catch (error) {
        console.error(`   ❌ Error deleting user ${userToDelete.email}:`, error)
        errors.push({
          email: userToDelete.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 CLEANUP SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully deleted: ${deletedUsers.length} users`)
    console.log(`❌ Errors: ${errors.length}`)
    console.log('='.repeat(60))

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      errors.forEach(err => {
        console.log(`  - ${err.email}: ${err.error}`)
      })
    }

    console.log('\n✅ Cleanup completed!')

    // Verify final state
    const finalUsers = await db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    })

    console.log('\n📊 Final users in database:')
    console.table(finalUsers)

    process.exit(0)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

checkAndCleanUsers()
