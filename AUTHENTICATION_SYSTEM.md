# نظام المصادقة (Authentication System) - سمايلي

## 📋 نظرة عامة

هذا نظام مصادقة كامل ومجاني يعتمد على JWT (JSON Web Tokens) و Bcrypt لتشفير كلمات المرور، متوافق مع Next.js App Router.

## 🔐 المميزات

✅ **مجاني 100%** - لا يحتاج أي خدمات مدفوعة
✅ **JWT Session Management** - إدارة جلسات آمنة باستخدام JWT
✅ **Password Hashing** - تشفير كلمات المرور باستخدام Bcrypt
✅ **HttpOnly Cookies** - تخزين الـ token في cookies آمنة
✅ **Logout** - تسجيل خروج آمن ينتهي الجلسة
✅ **Middleware** - حماية الصفحات المحمية
✅ **Best Practices** - اتباع أفضل ممارسات الأمان

## 🏗️ البنية المعمارية

### المكونات الأساسية

1. **API Routes**
   - `/api/auth/register-user` - إنشاء حساب جديد
   - `/api/auth/login` - تسجيل الدخول
   - `/api/auth/logout` - تسجيل الخروج
   - `/api/user/me` - جلب بيانات المستخدم الحالي

2. **مكتبة `lib/auth.ts`**
   - `hashPassword()` - تشفير كلمة المرور
   - `comparePassword()` - مقارنة كلمة المرور
   - `createToken()` - إنشاء JWT
   - `verifyToken()` - التحقق من JWT

3. **Middleware**
   - حماية الصفحات المحمية
   - إعادة توجيه المستخدمين غير المسجلين

4. **Client Hooks**
   - `useCurrentUser()` - الحصول على بيانات المستخدم الحالي

## 📝 كيفية الاستخدام

### 1. إنشاء حساب جديد (Register)

**طلب API:**
```typescript
POST /api/auth/register-user
Content-Type: application/json

{
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "password": "password123",
  "phone": "01xxxxxxxxx",
  "role": "PATIENT" // أو "STUDENT"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "clxxxxxx",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "PATIENT"
  }
}
```

**ما يحدث في الخلفية:**
1. ✅ التحقق من صحة الإيميل وكلمة المرور
2. ✅ التحقق من أن الإيميل غير مسجل مسبقاً
3. ✅ تشفير كلمة المرور باستخدام Bcrypt (12 rounds)
4. ✅ حفظ المستخدم في قاعدة البيانات
5. ✅ إنشاء البروفايل (Patient أو Student)

### 2. تسجيل الدخول (Login)

**طلب API:**
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "user": {
    "id": "clxxxxxx",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "PATIENT",
    "status": "ACTIVE",
    "phone": "01xxxxxxxxx"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**ما يحدث في الخلفية:**
1. ✅ التحقق من صحة الإيميل وكلمة المرور
2. ✅ البحث عن المستخدم في قاعدة البيانات
3. ✅ مقارنة كلمة المرور المشفرة باستخدام Bcrypt
4. ✅ التحقق من حالة الحساب (ACTIVE)
5. ✅ إنشاء JWT Token (صالح لـ 7 أيام)
6. ✅ حفظ الـ token في HttpOnly Cookie

**بعد نجاح تسجيل الدخول:**
- يتم حفظ الـ token في cookie باسم `auth-token`
- يتم حفظ بيانات المستخدم في `localStorage` للاستخدام في Client-side
- يتم توجيه المستخدم للصفحة المناسبة (Dashboard)

### 3. تسجيل الخروج (Logout)

**طلب API:**
```typescript
POST /api/auth/logout
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

**ما يحدث في الخلفية:**
1. ✅ حذف الـ `auth-token` cookie
2. ✅ مسح بيانات المستخدم من `localStorage` (من Client-side)
3. ✅ إعادة توجيه المستخدم لصفحة تسجيل الدخول

### 4. جلب بيانات المستخدم الحالي (Get Current User)

**طلب API:**
```typescript
GET /api/user/me
Cookie: auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**الاستجابة:**
```json
{
  "user": {
    "id": "clxxxxxx",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "PATIENT",
    "phone": "01xxxxxxxxx",
    "status": "ACTIVE"
  }
}
```

**ما يحدث في الخلفية:**
1. ✅ استخراج الـ token من Cookie
2. ✅ التحقق من صحة الـ token (JWT Verification)
3. ✅ جلب بيانات المستخدم من قاعدة البيانات
4. ✅ إرجاع بيانات المستخدم

## 🔒 الأمان

### تشفير كلمات المرور

- **التشفير:** Bcrypt بـ 12 rounds
- **لماذا Bcrypt؟** بطيء بشكل مقصود (مقاوم للـ brute force)
- **التخزين:** لا يتم تخزين كلمات المرور كنص صريح أبداً

### JWT Token

- **الخوارزمية:** HS256
- **المدة:** 7 أيام
- **التخزين:** HttpOnly Cookie (آمن من XSS)
- **التحقق:** يتم التحقق من الـ token في كل طلب API محمي

### Cookie Security

```typescript
{
  httpOnly: true,        // لا يمكن قراءته من JavaScript
  secure: true,          // HTTPS فقط (في الإنتاج)
  sameSite: 'lax',      // حماية من CSRF
  maxAge: 60 * 60 * 24 * 7,  // 7 أيام
  path: '/',             // متاح في كل المسارات
}
```

## 🛡️ حماية الصفحات

### Middleware

الملف `src/middleware.ts` يحمي الصفحات المحمية:

```typescript
// الصفحات المحمية
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/posts/create',
  '/chat',
  '/notifications',
]

// الصفحات العامة (لا تسمح للمستخدمين المسجلين)
const publicRoutes = ['/auth/login', '/auth/register']
```

**ما يفعله Middleware:**
1. ✅ التحقق من وجود JWT Token
2. ✅ إعادة توجيه المستخدمين غير المسجلين لصفحة تسجيل الدخول
3. ✅ إعادة توجيه المستخدمين المسجلين للداشبورد إذا حاولوا زيارة صفحة عامة

## 🧪 الاختبار

### اختبار التسجيل

```bash
curl -X POST http://localhost:3000/api/auth/register-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مستخدم تجريبي",
    "email": "test@example.com",
    "password": "password123",
    "phone": "01000000000",
    "role": "PATIENT"
  }'
```

### اختبار تسجيل الدخول

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### اختبار جلب بيانات المستخدم

```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"
```

## 🐛 حل المشكلات

### مشكلة: خطأ 400 Bad Request عند تسجيل الدخول

**الأسباب المحتملة:**
1. الإيميل أو كلمة المرور غير مرفقة
2. صيغة الإيميل غير صحيحة
3. الحقول فارغة

**الحل:**
- تأكد من إرسال البيانات كـ JSON
- تأكد من صيغة الإيميل الصحيحة
- تحقق من logs في الـ console

### مشكلة: خطأ 401 Unauthorized

**الأسباب المحتملة:**
1. الإيميل غير مسجل
2. كلمة المرور غير صحيحة
3. الحساب غير نشط (PENDING, SUSPENDED, BANNED)
4. JWT Token غير صحيح أو منتهي

**الحل:**
- تأكد من صحة الإيميل وكلمة المرور
- تحقق من حالة الحساب في قاعدة البيانات
- إذا انتهت صلاحية الـ token، قم بتسجيل الدخول مرة أخرى

### مشكلة: لا يتم حفظ الجلسة

**الأسباب المحتملة:**
1. Cookies غير مفعلة في المتصفح
2. استخدام متصفح يدخل في وضع Private/Incognito
3. مشكلة في إعداد Cookies

**الحل:**
- تأكد من تفعيل Cookies في المتصفح
- استخدم وضع العادي بدلاً من Private
- تحقق من إعدادات Cookies

## 📊 تدفق المصادقة (Authentication Flow)

```
┌─────────────┐
│  Register   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Hash Password  │ (Bcrypt)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Save to DB    │
└─────────────────┘

┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Find User      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Compare Pass    │ (Bcrypt)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Create JWT      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Set Cookie      │ (HttpOnly)
└─────────────────┘

┌─────────────────┐
│ Protected Page │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Verify JWT      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Get User Data   │
└─────────────────┘
```

## 🔄 Logout Flow

```
┌─────────────┐
│   Logout    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Call Logout API│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Delete Cookie   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Clear Local    │ Storage
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Redirect Login  │
└─────────────────┘
```

## 📝 Best Practices

### ✅ الممارسات الصحيحة

1. **استخدام HttpOnly Cookies** - لتجنب XSS attacks
2. **تشفير كلمات المرور** - لا تخزنها كنص صريح
3. **JWT Verification** - تحقق من الـ token في كل طلب
4. **Password Strength** - تطلب كلمات مرور قوية
5. **Session Expiration** - انتهاء صلاحية الجلسات بعد فترة معينة
6. **Error Handling** - معالجة الأخطاء بشكل صحيح
7. **Logging** - تسجيل الأحداث للمراقبة

### ❌ ما يجب تجنبه

1. ❌ تخزين كلمات المرور كنص صريح
2. ❌ استخدام ضعيف للجلسات
3. ❌ إرجاع رسائل خطأ تفصيلية للهاكرز
4. ❌ استخدام JWT بدون إعدادات أمنية
5. ❌ نشر الـ JWT في URL
6. ❌ تخزين JWT في LocalStorage فقط

## 🔧 التخصيص

### تغيير مدة صلاحية الـ Token

في `src/lib/auth.ts`:

```typescript
const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d') // غير الرقم هنا
  .sign(JWT_SECRET)
```

### تغيير قوة تشفير كلمة المرور

في `src/lib/auth.ts`:

```typescript
const SALT_ROUNDS = 12 // زد الرقم لزيادة الأمان
```

### إضافة المزيد من الصفحات المحمية

في `src/middleware.ts`:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  // أضف مساراتك هنا
]
```

## 📚 الموارد

- [JWT.io](https://jwt.io/) - لفهم وتصحيح JWT Tokens
- [Bcrypt](https://github.com/dcodeIO/bcrypt.js) - مكتبة تشفير كلمات المرور
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) - حماية المسارات
- [OWASP Authentication](https://owasp.org/www-community/Authentication_Cheat_Sheet) - أفضل ممارسات الأمان

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من logs في الـ console
2. تأكد من إعدادات قاعدة البيانات
3. تأكد من أن جميع المكتبات مثبتة
4. راجع هذا الملف

---

**تم إنشاؤه لـ Smiley Dental Clinic Platform**
**آخر تحديث:** 2024
