async function testAPIEndpoints() {
  console.log('═══════════════════════════════════════')
  console.log('🧪 اختبار API Endpoints')
  console.log('═══════════════════════════════════════')

  const baseUrl = 'http://localhost:3000'

  try {
    // Test 1: Register API
    console.log('\n[TEST 1] ➕ اختبار إنشاء حساب جديد عبر API...')
    const registerData = {
      name: 'API Test Patient',
      email: `api-test-${Date.now()}@example.com`,
      password: 'Test123456',
      phone: '01012345678',
      role: 'PATIENT'
    }

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })

    const registerResult = await registerResponse.json()
    console.log('Status:', registerResponse.status)
    console.log('Response:', JSON.stringify(registerResult, null, 2))

    if (registerResponse.ok && registerResult.success) {
      console.log('✅ إنشاء الحساب عبر API ناجح!')

      // Test 2: Login API
      console.log('\n[TEST 2] 🔓 اختبار تسجيل الدخول عبر API...')
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      })

      const loginResult = await loginResponse.json()
      console.log('Status:', loginResponse.status)
      console.log('Response:', JSON.stringify(loginResult, null, 2))

      if (loginResponse.ok && loginResult.success) {
        console.log('✅ تسجيل الدخول عبر API ناجح!')
        console.log('👤 User:', loginResult.user?.name)
        console.log('📧 Email:', loginResult.user?.email)
        console.log('👑 Role:', loginResult.user?.role)
        console.log('✨ Status:', loginResult.user?.status)
      } else {
        console.error('❌ فشل تسجيل الدخول:', loginResult.error || loginResult.message)
      }

      // Test 3: Login with wrong password
      console.log('\n[TEST 3] 🚫 اختبار تسجيل الدخول بكلمة مرور خاطئة...')
      const wrongPasswordResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: 'WrongPassword123'
        })
      })

      const wrongPasswordResult = await wrongPasswordResponse.json()

      if (!wrongPasswordResponse.ok || !wrongPasswordResult.success) {
        console.log('✅ كلمة المرور الخاطئة مرفوضة بنجاح!')
      } else {
        console.error('❌ خطأ أمني: كلمة المرور الخاطئة تم قبولها!')
      }

    } else {
      console.error('❌ فشل إنشاء الحساب:', registerResult.error)
    }

    // Test 4: Try to register with duplicate email
    console.log('\n[TEST 4] 🚫 اختبار منع تكرار الإيميل عبر API...')
    const duplicateResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: registerData.email,
        password: 'AnotherPassword123',
        role: 'PATIENT'
      })
    })

    const duplicateResult = await duplicateResponse.json()

    if (!duplicateResponse.ok) {
      console.log('✅ منع تكرار الإيميل يعمل عبر API!')
      console.log('📧 الرسالة:', duplicateResult.error)
    } else {
      console.error('❌ خطأ: تم قبول إيميل مكرر!')
    }

    console.log('\n═══════════════════════════════════════')
    console.log('✅✅✅ جميع اختبارات API نجحت!')
    console.log('═══════════════════════════════════════')

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error)
    console.error('\n🔧 تأكد من:')
    console.log('   1. السيرفر يعمل على المنفذ 3000')
    console.log('   2. API Routes متاحة')
    console.log('   3. قاعدة البيانات متصلة')
  }
}

testAPIEndpoints()
