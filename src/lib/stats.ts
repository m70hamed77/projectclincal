import { db } from '@/lib/db'
import { SystemStats } from '@prisma/client'

/**
 * Get or create system stats record
 */
export async function getOrCreateStats(): Promise<SystemStats> {
  let stats = await db.systemStats.findFirst()

  if (!stats) {
    stats = await db.systemStats.create({
      data: {}
    })
  }

  return stats
}

/**
 * Increment total users count
 */
export async function incrementTotalUsers() {
  await db.systemStats.updateMany({
    data: {
      totalUsers: { increment: 1 }
    }
  })
}

/**
 * Increment approved doctors count
 */
export async function incrementApprovedDoctors() {
  await db.systemStats.updateMany({
    data: {
      approvedDoctors: { increment: 1 }
    }
  })
}

/**
 * Increment rejected doctors count
 */
export async function incrementRejectedDoctors() {
  await db.systemStats.updateMany({
    data: {
      rejectedDoctors: { increment: 1 }
    }
  })
}

/**
 * Increment deleted users count
 */
export async function incrementDeletedUsers() {
  await db.systemStats.updateMany({
    data: {
      deletedUsers: { increment: 1 }
    }
  })
}

/**
 * Increment banned users count
 */
export async function incrementBannedUsers() {
  await db.systemStats.updateMany({
    data: {
      bannedUsers: { increment: 1 }
    }
  })
}

/**
 * Increment suspended users count
 */
export async function incrementSuspendedUsers() {
  await db.systemStats.updateMany({
    data: {
      suspendedUsers: { increment: 1 }
    }
  })
}

/**
 * Increment total patients count
 */
export async function incrementTotalPatients() {
  await db.systemStats.updateMany({
    data: {
      totalPatients: { increment: 1 }
    }
  })
}

/**
 * Increment active patients count
 */
export async function incrementActivePatients() {
  await db.systemStats.updateMany({
    data: {
      activePatients: { increment: 1 }
    }
  })
}

/**
 * Decrement active patients count
 */
export async function decrementActivePatients() {
  await db.systemStats.updateMany({
    data: {
      activePatients: { decrement: 1 }
    }
  })
}

/**
 * Increment total students count
 */
export async function incrementTotalStudents() {
  await db.systemStats.updateMany({
    data: {
      totalStudents: { increment: 1 }
    }
  })
}

/**
 * Increment active students count
 */
export async function incrementActiveStudents() {
  await db.systemStats.updateMany({
    data: {
      activeStudents: { increment: 1 }
    }
  })
}

/**
 * Decrement active students count
 */
export async function decrementActiveStudents() {
  await db.systemStats.updateMany({
    data: {
      activeStudents: { decrement: 1 }
    }
  })
}

/**
 * Increment total cases count (completed cases)
 */
export async function incrementTotalCases() {
  await db.systemStats.updateMany({
    data: {
      totalCases: { increment: 1 }
    }
  })
}

/**
 * Increment active cases count
 */
export async function incrementActiveCases() {
  await db.systemStats.updateMany({
    data: {
      activeCases: { increment: 1 }
    }
  })
}

/**
 * Decrement active cases count
 */
export async function decrementActiveCases() {
  await db.systemStats.updateMany({
    data: {
      activeCases: { decrement: 1 }
    }
  })
}

/**
 * Increment total ratings count
 */
export async function incrementTotalRatings() {
  await db.systemStats.updateMany({
    data: {
      totalRatings: { increment: 1 }
    }
  })
}

/**
 * Increment pending reports count
 */
export async function incrementPendingReports() {
  await db.systemStats.updateMany({
    data: {
      pendingReports: { increment: 1 }
    }
  })
}

/**
 * Decrement pending reports count
 */
export async function decrementPendingReports() {
  await db.systemStats.updateMany({
    data: {
      pendingReports: { decrement: 1 }
    }
  })
}

/**
 * Increment resolved reports count
 */
export async function incrementResolvedReports() {
  await db.systemStats.updateMany({
    data: {
      resolvedReports: { increment: 1 }
    }
  })
}

/**
 * Increment dismissed reports count
 */
export async function incrementDismissedReports() {
  await db.systemStats.updateMany({
    data: {
      dismissedReports: { increment: 1 }
    }
  })
}

/**
 * Increment rejected reports count
 */
export async function incrementRejectedReports() {
  await db.systemStats.updateMany({
    data: {
      rejectedReports: { increment: 1 }
    }
  })
}
