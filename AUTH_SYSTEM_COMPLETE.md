# 🔐 نظام Auth الكامل - مرجع شامل

## 📚 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [API Routes](#api-routes)
3. [الاستخدام في Frontend](#الاستخدام-في-frontend)
4. [معالجة الأخطاء](#معالجة-الأخطاء)
5. [أمثلة عملية](#أمثلة-عملية)
6. [التوسعات المقترحة](#التوسعات-المقترحة)

---

## 🎯 نظرة عامة

### الميزات الرئيسية

✅ **آمن تماماً:**
- Password hashing بـ bcrypt
- Validation شامل للبيانات
- معالجة جميع الأخطاء

✅ **JSON دائم:**
- جميع الردود JSON
- لا يوجد crashes

✅ **متوافق مع Prisma:**
- يدعم UserRole
- يدعم AccountStatus
- يدعم العلاقات (student, patient, admin)

✅ **جاهز للتوسع:**
- سهل إضافة JWT
- سهل إضافة Sessions
- سهل إضافة MFA

---

## 🛠️ API Routes

### 1️⃣ POST /api/auth/login

**الغرض:** تسجيل الدخول

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "clxxx...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "PATIENT",
    "status": "ACTIVE",
    "phone": null,
    "avatarUrl": null,
    "createdAt": "2024-03-07T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Errors:**

| Status | Reason | Response |
|--------|--------|----------|
| 400 | بيانات ناقصة | `{ "error": "البريد الإلكتروني وكلمة المرور مطلوبان" }` |
| 401 | بيانات خاطئة | `{ "error": "البريد الإلكتروني أو كلمة المرور غير صحيحة" }` |
| 403 | حساب غير نشط | `{ "error": "حسابك غير نشط. يرجى التواصل مع الدعم" }` |
| 500 | خطأ داخلي | `{ "error": "خطأ في قاعدة البيانات..." }` |

**حالات خاصة (Status 200 مع success: false):**

| السبب | Response |
|-------|----------|
| حساب محذوف | `{ "success": false, "reason": "ACCOUNT_DELETED", "message": "..." }` |
| حساب محظور | `{ "success": false, "reason": "ACCOUNT_BANNED", "message": "..." }` |
| حساب معلق | `{ "success": false, "reason": "ACCOUNT_SUSPENDED", "message": "..." }` |
| طالب قيد المراجعة | `{ "success": false, "reason": "PENDING_VERIFICATION", "message": "..." }` |

---

### 2️⃣ POST /api/auth/register

**الغرض:** تسجيل مستخدم جديد

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "PATIENT"
}
```

**Roles المتاحة:**
- `PATIENT` - مريض
- `STUDENT` - طالب طب أسنان
- `ADMIN` - مسؤول (محمي، يتطلب صلاحيات خاصة)

**Response Success (201):**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "user": {
    "id": "clxxx...",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "PATIENT",
    "status": "PENDING"
  }
}
```

**Response Errors:**

| Status | Reason | Response |
|--------|--------|----------|
| 400 | بيانات ناقصة أو غير صحيحة | `{ "error": "البريد الإلكتروني وكلمة المرور والاسم مطلوبين" }` |
| 400 | بريد إلكتروني غير صحيح | `{ "error": "البريد الإلكتروني غير صحيح" }` |
| 400 | كلمة مرور ضعيفة | `{ "error": "كلمة السر يجب أن تكون 6 أحرف على الأقل" }` |
| 409 | البريد مسجل مسبقاً | `{ "error": "البريد الإلكتروني مسجل مسبقاً" }` |
| 500 | خطأ داخلي | `{ "error": "فشل في إنشاء المستخدم..." }` |

---

### 3️⃣ POST /api/auth/logout

**الغرض:** تسجيل الخروج

**Request Body:** فارغ

**Response Success (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

**Response Errors:**

| Status | Reason | Response |
|--------|--------|----------|
| 500 | خطأ داخلي | `{ "error": "حدث خطأ أثناء تسجيل الخروج" }` |

---

### 4️⃣ GET /api/auth/session

**الغرض:** الحصول على بيانات المستخدم الحالي

**Request Headers:**
- `Cookie: userId=...` (تلقائي من المتصفح)

**Response Success (200):**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "PATIENT",
    "status": "ACTIVE",
    "phone": "+1234567890",
    "avatarUrl": null,
    "createdAt": "2024-03-07T12:00:00Z",
    "student": {
      "id": "clxxx...",
      "verificationStatus": "APPROVED",
      "isVerified": true
    },
    "patient": {
      "id": "clxxx..."
    }
  },
  "authenticated": true
}
```

**حالة طالب قيد المراجعة (200):**
```json
{
  "user": { ... },
  "authenticated": true,
  "verificationStatus": "PENDING",
  "message": "حسابك قيد المراجعة"
}
```

**Response Errors:**

| Status | Reason | Response |
|--------|--------|----------|
| 401 | غير مصدق (no cookie) | `{ "error": "غير مصرح", "authenticated": false }` |
| 403 | حساب محذوف | `{ "error": "تم حذف الحساب", "authenticated": false, "reason": "ACCOUNT_DELETED" }` |
| 403 | حساب محظور | `{ "error": "تم حظر حسابك", "authenticated": false, "reason": "ACCOUNT_BANNED" }` |
| 403 | حساب معلق | `{ "error": "تم إيقاف حسابك مؤقتاً", "authenticated": false, "reason": "ACCOUNT_SUSPENDED" }` |
| 404 | مستخدم غير موجود | `{ "error": "المستخدم غير موجود", "authenticated": false }` |
| 500 | خطأ داخلي | `{ "error": "خطأ في قاعدة البيانات..." }` |

---

## 💻 الاستخدام في Frontend

### Hook: useAuth

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, loading, authenticated, logout, refresh } = useAuth()

  if (loading) {
    return <div>جاري التحميل...</div>
  }

  if (!authenticated) {
    return <div>يرجى تسجيل الدخول</div>
  }

  return (
    <div>
      <h1>مرحباً، {user.name}!</h1>
      <p>دورك: {user.role}</p>
      <button onClick={logout}>تسجيل الخروج</button>
    </div>
  )
}
```

### مثال: Login Form

```typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'فشل تسجيل الدخول')
        return
      }

      // Success
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (data.user.role === 'STUDENT') {
        router.push('/dashboard/student')
      } else {
        router.push('/dashboard/patient')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

### مثال: Register Form

```typescript
function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT'
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'فشل التسجيل')
        return
      }

      // Success - redirect to login
      router.push('/auth/login?registered=true')
    } catch (err) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="الاسم الكامل"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="تأكيد كلمة المرور"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="PATIENT">مريض</option>
        <option value="STUDENT">طالب طب أسنان</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'جاري التسجيل...' : 'تسجيل'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

---

## 🚨 معالجة الأخطاء

### الاستراتيجية

1. **Validation على المستوىين:**
   - Frontend: للتجربة السريعة
   - Backend: للأمان الشامل

2. **Error Messages واضحة:**
   - عربية للمستخدم النهائي
   - إنجليزية للمطورين في logs

3. **HTTP Status Codes صحيحة:**
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 409: Conflict
   - 500: Internal Server Error

4. **JSON دائم:**
   - حتى في حالة خطأ 500
   - لا يوجد HTML responses

### Logging Pattern

كل API route يستخدم نفس pattern:

```
═══════════════════════════════════════
[API_NAME] Starting operation...
═══════════════════════════════════════
[API_NAME] Step 1 ✅: ...
[API_NAME] Step 2 ✅: ...
...
[API_NAME] ✅: Operation successful
═══════════════════════════════════════
```

في حالة خطأ:
```
═══════════════════════════════════════
[API_NAME] ❌❌❌ ERROR:
[API_NAME] Error Message: ...
[API_NAME] Error Stack: ...
═══════════════════════════════════════
```

---

## 📖 أمثلة عملية

### مثال 1: Protected Route

```typescript
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, loading, authenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/auth/login')
    }
  }, [loading, authenticated, router])

  if (loading) {
    return <div>جاري التحميل...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً، {user.name}!</p>
      <p>دورك: {user.role}</p>
    </div>
  )
}
```

### مثال 2: Check User Role

```typescript
import { useAuth } from '@/hooks/useAuth'

export default function AdminPanel() {
  const { user, loading, authenticated } = useAuth()

  if (loading) return <div>جاري التحميل...</div>

  if (!authenticated || user?.role !== 'ADMIN') {
    return <div>غير مصرح</div>
  }

  return <div>لوحة التحكم للمسؤولين</div>
}
```

### مثال 3: Logout Button

```typescript
import { useAuth } from '@/hooks/useAuth'

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button onClick={logout}>
      تسجيل الخروج
    </button>
  )
}
```

---

## 🚀 التوسعات المقترحة

### 1️⃣ إضافة JWT

```typescript
// في /api/auth/login/route.ts
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
)

return NextResponse.json({
  success: true,
  user,
  token
})
```

### 2️⃣ إضافة Refresh Tokens

```typescript
// إنشاء refresh token
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET!,
  { expiresIn: '30d' }
)

// حفظ في database
await db.refreshToken.create({
  data: {
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
})
```

### 3️⃣ إضافة 2FA (Two-Factor Authentication)

```typescript
// بعد التحقق من كلمة المرور
const twoFactorCode = generate2FACode()
await send2FACode(user.phone, twoFactorCode)

return NextResponse.json({
  success: true,
  requires2FA: true,
  tempToken: createTempToken(user.id)
})
```

### 4️⃣ إضافة Session Storage في Database

```typescript
// إنشاء session
const session = await db.session.create({
  data: {
    userId: user.id,
    token: sessionToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
})
```

---

## ✅ Checklist للإنتاج

### Security
- [x] Password hashing بـ bcrypt
- [x] Validation شامل للبيانات
- [x] Protection against SQL injection (Prisma)
- [x] Protection against XSS (React)
- [ ] CSRF protection (recommended)
- [ ] Rate limiting (recommended)
- [ ] 2FA (optional, recommended)

### Error Handling
- [x] JSON responses دائماً
- [x] HTTP status codes صحيحة
- [x] Error messages واضحة
- [x] Detailed logging في development
- [x] Generic messages في production

### Performance
- [x] Connection pooling (Prisma default)
- [ ] Redis cache (optional)
- [ ] CDN for static assets (optional)

---

## 📞 الدعم

في حالة وجود مشاكل:

1. **تحقق من logs:**
   ```bash
   # في terminal حيث يشتغل السيرفر
   # ابحث عن:
   # [LOGIN], [REGISTER], [LOGOUT], [SESSION]
   ```

2. **تحقق من Database:**
   ```bash
   npx prisma studio
   ```

3. **تحقق من Environment Variables:**
   ```bash
   # تأكد من:
   DATABASE_URL=postgresql://...
   ```

---

## 🎉 الخلاصة

نظام Auth الآن:
- ✅ آمن ومحمي
- ✅ JSON دائم
- ✅ متوافق مع Prisma
- ✅ جاهز للإنتاج
- ✅ سهل التوسع
- ✅ Logging تفصيلي
- ✅ Error handling شامل

**جاهز للاستخدام!** 🚀
