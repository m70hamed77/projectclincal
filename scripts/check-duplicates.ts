import { db } from '../src/lib/db'

async function checkDuplicates() {
  console.log('Checking for duplicate emails and phones...\n')

  // Get all users
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
    },
    orderBy: { createdAt: 'asc' }
  })

  console.log(`Total users: ${users.length}\n`)

  // Check for duplicate emails
  const emailMap = new Map<string, any[]>()
  users.forEach(user => {
    if (user.email) {
      const key = user.email.toLowerCase().trim()
      if (!emailMap.has(key)) {
        emailMap.set(key, [])
      }
      emailMap.get(key)!.push(user)
    }
  })

  const duplicateEmails = Array.from(emailMap.entries())
    .filter(([_, users]) => users.length > 1)

  if (duplicateEmails.length > 0) {
    console.log('❌ DUPLICATE EMAILS FOUND:')
    duplicateEmails.forEach(([email, users]) => {
      console.log(`\nEmail: ${email}`)
      users.forEach(u => {
        console.log(`  - ID: ${u.id}, Name: ${u.name}, Role: ${u.role}`)
      })
    })
  } else {
    console.log('✅ No duplicate emails found\n')
  }

  // Check for duplicate phones
  const phoneMap = new Map<string, any[]>()
  users.forEach(user => {
    if (user.phone) {
      const key = user.phone.trim()
      if (!phoneMap.has(key)) {
        phoneMap.set(key, [])
      }
      phoneMap.get(key)!.push(user)
    }
  })

  const duplicatePhones = Array.from(phoneMap.entries())
    .filter(([_, users]) => users.length > 1)

  if (duplicatePhones.length > 0) {
    console.log('\n❌ DUPLICATE PHONES FOUND:')
    duplicatePhones.forEach(([phone, users]) => {
      console.log(`\nPhone: ${phone}`)
      users.forEach(u => {
        console.log(`  - ID: ${u.id}, Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`)
      })
    })
  } else {
    console.log('✅ No duplicate phones found\n')
  }

  // Summary
  console.log('\n═══════════════════════════════════════')
  console.log('SUMMARY:')
  console.log(`Duplicate Emails: ${duplicateEmails.length}`)
  console.log(`Duplicate Phones: ${duplicatePhones.length}`)
  console.log('═══════════════════════════════════════')

  await db.$disconnect()
}

checkDuplicates().catch(console.error)
