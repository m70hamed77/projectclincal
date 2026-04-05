# 🔐 Auth System - Quick Start

## 📁 الملفات الجديدة

```
src/app/api/auth/
├── login/
│   └── route.ts          ✅ موجود ومحدث
├── register/
│   └── route.ts          ✅ جديد - تسجيل مستخدم
├── logout/
│   └── route.ts          ✅ جديد - تسجيل خروج
└── session/
    └── route.ts          ✅ جديد - جلب الجلسة

src/hooks/
└── useAuth.ts            ✅ جديد - Hook لإدارة الجلسة
```

---

## 🚀 الاستخدام السريع

### 1️⃣ تسجيل الدخول

```typescript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

// Response (200)
{
  "success": true,
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "PATIENT"
  },
  "token": "..."
}
```

### 2️⃣ تسجيل مستخدم جديد

```typescript
// POST /api/auth/register
{
  "email": "new@example.com",
  "password": "password123",
  "name": "New User",
  "role": "PATIENT"  // أو "STUDENT"
}

// Response (201)
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "user": { ... }
}
```

### 3️⃣ تسجيل الخروج

```typescript
// POST /api/auth/logout

// Response (200)
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

### 4️⃣ جلب الجلسة الحالية

```typescript
// GET /api/auth/session

// Response (200)
{
  "user": { ... },
  "authenticated": true
}
```

---

## 💻 استخدام useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, loading, authenticated, logout } = useAuth()

  if (loading) return <div>جاري التحميل...</div>
  
  if (!authenticated) return <div>يرجى تسجيل الدخول</div>

  return (
    <div>
      <h1>مرحباً، {user.name}!</h1>
      <p>دورك: {user.role}</p>
      <button onClick={logout}>تسجيل الخروج</button>
    </div>
  )
}
```

---

## 📊 HTTP Status Codes

| Status | معناه |
|--------|--------|
| 200 | نجاح |
| 201 | تم الإنشاء بنجاح |
| 400 | بيانات خاطئة أو ناقصة |
| 401 | غير مصرح (بيانات خاطئة) |
| 403 | حساب غير نشط |
| 404 | غير موجود |
| 409 | البريد مسجل مسبقاً |
| 500 | خطأ داخلي |

---

## 🛡️ الأمان

✅ Password hashing بـ bcrypt
✅ Validation شامل
✅ معالجة جميع الأخطاء
✅ JSON responses دائماً
✅ Logging تفصيلي

---

## 📚 الوثائق الكاملة

راجع `AUTH_SYSTEM_COMPLETE.md` للتفاصيل الكاملة.
