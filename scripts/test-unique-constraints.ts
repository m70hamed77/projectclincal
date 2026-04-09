import { db } from '../src/lib/db'

async function testUniqueConstraints() {
  console.log('Testing Unique Constraints...\n')

  // Test 1: Try to create user with duplicate email
  console.log('Test 1: Creating user with duplicate email...')
  try {
    await db.user.create({
      data: {
        email: 'moabdo1760@gmail.com', // Existing email
        password: 'test123',
        name: 'Test User',
        role: 'STUDENT',
        status: 'ACTIVE',
        phone: '01111111111',
      }
    })
    console.log('❌ FAIL: Should have thrown error for duplicate email\n')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('✅ PASS: Database correctly rejected duplicate email\n')
    } else {
      console.log(`❌ FAIL: Wrong error: ${error.code}\n`)
    }
  }

  // Test 2: Try to create user with duplicate phone
  console.log('Test 2: Creating user with duplicate phone...')
  try {
    await db.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'test123',
        name: 'Test User 2',
        role: 'STUDENT',
        status: 'ACTIVE',
        phone: '01017245964', // Existing phone
      }
    })
    console.log('❌ FAIL: Should have thrown error for duplicate phone\n')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('✅ PASS: Database correctly rejected duplicate phone\n')
    } else {
      console.log(`❌ FAIL: Wrong error: ${error.code}\n`)
    }
  }

  // Test 3: Create user with unique email and phone
  console.log('Test 3: Creating user with unique data...')
  try {
    await db.user.create({
      data: {
        email: 'testuser' + Date.now() + '@example.com',
        password: 'test123',
        name: 'Test User 3',
        role: 'STUDENT',
        status: 'ACTIVE',
        phone: '012' + Math.floor(Math.random() * 100000000),
      }
    })
    console.log('✅ PASS: Successfully created user with unique data\n')
  } catch (error: any) {
    console.log(`❌ FAIL: Should have succeeded: ${error.message}\n`)
  }

  console.log('═══════════════════════════════════════')
  console.log('Testing completed!')
  console.log('═══════════════════════════════════════')

  await db.$disconnect()
}

testUniqueConstraints().catch(console.error)
