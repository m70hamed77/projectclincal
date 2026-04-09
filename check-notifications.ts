import { db } from './src/lib/db'

async function checkNotifications() {
  console.log('=== Checking Notifications ===')
  
  // Get all notifications
  const notifications = await db.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  
  console.log(`\nTotal notifications found: ${notifications.length}`)
  
  for (const [i, n] of notifications.entries()) {
    console.log(`\n${i + 1}. ID: ${n.id}`)
    console.log(`   Type: ${n.type}`)
    console.log(`   Title: ${n.title}`)
    console.log(`   Is Read: ${n.isRead}`)
    console.log(`   Created At: ${n.createdAt}`)
    console.log(`   User ID: ${n.userId}`)
  }
  
  // Get all admins
  const admins = await db.user.findMany({
    where: { role: 'ADMIN' }
  })
  
  console.log(`\n\n=== Admins Found: ${admins.length} ===`)
  for (const [i, admin] of admins.entries()) {
    console.log(`\n${i + 1}. ${admin.name} (${admin.email})`)
    console.log(`   ID: ${admin.id}`)
    
    // Count notifications for this admin
    const count = await db.notification.count({
      where: { userId: admin.id, isRead: false }
    })
    console.log(`   Unread notifications: ${count}`)
  }
  
  await db.$disconnect()
}

checkNotifications().catch(console.error)
