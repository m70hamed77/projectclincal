# 📋 نظام المصادقة (Auth System) - الحالة والتوثيق

## ✅ الحالة الحالية

| المكون | الحالة | الملاحظات |
|--------|--------|-----------|
| **قاعدة البيانات** | ✅ شغالة | PostgreSQL (Neon) |
| **Prisma Client** | ✅ جاهز | ملف `src/lib/db.ts` |
| **تشفير كلمات السر** | ✅ جاهز | bcrypt (ملف `src/lib/password.ts`) |
| **إرسال الإيميل** | ✅ جاهز | Gmail SMTP (ملف `src/lib/email.ts`) |
| **الخادم** | ✅ شغال | المنفذ 3000 |

---

## 🔑 نظام تسجيل الدخول

### الملف: `/src/app/api/auth/login/route.ts`

**المميزات:**
- ✅ تشفير كلمات السر بـ bcrypt
- ✅ دعم مقارنة كلمات السر المشفرة
- ✅ التحقق من حالة الحساب (ACTIVE, PENDING, BANNED, SUSPENDED, DELETED)
- ✅ التحقق من حالة التحقق للطلاب (PENDING, APPROVED, REJECTED)
- ✅ تعيين cookies بشكل صحيح
- ✅ logs تفصيلية للتتبع

**الوظيفة:**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**الرد الناجح:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "PATIENT/STUDENT/ADMIN",
    "status": "ACTIVE/PENDING",
    "phone": "...",
    "avatarUrl": "...",
    "createdAt": "..."
  },
  "token": "..."
}
```

---

## 📝 نظام إنشاء الحساب

### الملف: `/src/app/api/auth/register-user/route.ts`

**المميزات:**
- ✅ تشفير كلمة السر تلقائياً بـ bcrypt
- ✅ دعم طالب ومريض
- ✅ التحقق من عدم تكرار الإيميل
- ✅ إنشاء بروفايل تلقائياً
- ✅ الطلاب: حالة PENDING (تتطلب موافقة الأدمن)
- ✅ المرضى: حالة ACTIVE (نشط فوراً)
- ✅ إرسال إشعارات للأدمن (للطلاب)
- ✅ دعم رفع صورة الكارنيه للطلاب

**الوظيفة:**
```bash
POST /api/auth/register-user
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "phone": "01234567890",
  "role": "PATIENT"
}
```

**للطلاب (FormData):**
```bash
POST /api/auth/register-user
FormData:
- name: "أحمد محمد"
- email: "ahmed@student.edu"
- password: "password123"
- phone: "01234567890"
- role: "STUDENT"
- universityEmail: "ahmed@student.edu"
- academicYear: "2024"
- carniehImage: [File]
```

**الرد الناجح:**
```json
{
  "success": true,
  "message": "✅ تم استلام طلبك بنجاح! حسابك الآن قيد المراجعة...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "STUDENT",
    "verificationStatus": "PENDING"
  }
}
```

---

## 🔐 نظام نسيان كلمة السر

### 1. طلب كود التحقق
**الملف:** `/src/app/api/auth/forgot-password/route.ts`

```bash
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

**الرد:**
```json
{
  "success": true,
  "message": "إذا كان البريد الإلكتروني مسجلاً، تم إرسال رمز التحقق"
}
```

### 2. التحقق من الكود
**الملف:** `/src/app/api/auth/verify-otp/route.ts`

```bash
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### 3. إعادة تعيين كلمة السر
**الملف:** `/src/app/api/auth/reset-password/route.ts`

```bash
POST /api/auth/reset-password
{
  "email": "user@example.com",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**المتطلبات:**
- ✅ كلمة السر 6 أحرف على الأقل
- ✅ يجب التحقق من OTP أولاً
- ✅ كلمة السر الجديدة مشفرة بـ bcrypt

---

## 📧 نظام الإيميل

### الملف: `/src/lib/email.ts`

**الإعدادات:**
```env
EMAIL_USER=mohamed7744650@gmail.com
EMAIL_PASS=orhy vuuj bnsj iaew
```

**المميزات:**
- ✅ Gmail SMTP
- ✅ إرسال كود التحقق بتصميم جميل
- ✅ إرسال إيميل ترحيبي
- ✅ دعم HTML و Plain Text

**دالة إرسال كود التحقق:**
```typescript
await sendVerificationCode(email: string, code: string, name?: string)
```

---

## 🔐 كلمات السر

### الملف: `/src/lib/password.ts`

**الدوال المتوفرة:**

1. **تشفير كلمة السر:**
```typescript
const hashed = await hashPassword("password123")
```

2. **مقارنة كلمة السر:**
```typescript
const isValid = await comparePassword("password123", hashedPassword)
```

3. **التحقق من قوة كلمة السر:**
```typescript
const validation = validatePasswordStrength("password123")
// { valid: true } أو { valid: false, message: "..." }
```

4. **إدارة OTP:**
```typescript
// توليد OTP
const otp = generateOTP() // 6 أرقام عشوائية

// حفظ OTP
storeOTP(email, otp, 10) // 10 دقائق صلاحية

// جلب OTP
const stored = getStoredOTP(email)

// التحقق من OTP
const result = verifyOTP(email, "123456")

// تأكيد OTP
markOTPVerified(email)

// حذف OTP
deleteOTP(email)
```

---

## 🗄️ قاعدة البيانات

### Prisma Schema: `/prisma/schema.prisma`

**النماذج الرئيسية:**

1. **User** - المستخدم الأساسي
   - email (unique)
   - password (مشفر)
   - role (PATIENT/STUDENT/ADMIN)
   - status (PENDING/ACTIVE/SUSPENDED/BANNED/DELETED)

2. **Student** - بروفايل الطالب
   - userId (relation to User)
   - isVerified
   - verificationStatus (PENDING/APPROVED/REJECTED)
   - universityEmail
   - idCardUrl

3. **Patient** - بروفايل المريض
   - userId (relation to User)

4. **VerificationCode** - أكواد التحقق
   - email (unique)
   - code
   - expiresAt
   - used

5. **Admin** - بروفايل الأدمن
   - userId (relation to User)
   - permissions

---

## ✨ المميزات الإضافية

### 1. Logs تفصيلية
كل API يحتوي على logs واضحة:
```bash
[LOGIN] Starting login request...
[LOGIN] DATABASE_URL type: PostgreSQL
[LOGIN] Step 1 ✅: Parsed request body
[LOGIN] Step 2 ✅: Credentials validated
[LOGIN] Step 3 ✅: User found
[LOGIN] Step 4 ✅: Password verified
[AUTH] ✅✅✅ User logged in: ...
```

### 2. رسائل خطأ واضحة
- رسائل بالعربية
- توضح السبب بالتفصيل
- تساعد المستخدم على فهم المشكلة

### 3. أمان
- ✅ جميع كلمات السر مشفرة بـ bcrypt
- ✅ CSRF protection عبر cookies
- ✅ OTP صالح لمدة محدودة (10 دقائق)
- ✅ التحقق من حالة الحساب

---

## 🚀 كيفية الاستخدام

### إنشاء حساب مريض:
1. الذهاب إلى صفحة التسجيل
2. إدخال: الاسم، الإيميل، كلمة السر، الهاتف
3. اختيار: "مريض"
4. الضغط على "إنشاء حساب"
5. ✅ الحساب نشط فوراً

### إنشاء حساب طالب:
1. الذهاب إلى صفحة التسجيل
2. إدخال: الاسم، الإيميل، كلمة السر، الهاتف
3. اختيار: "طالب"
4. إدخال: الإيميل الجامعي، السنة الدراسية
5. رفع: صورة الكارنيه
6. الضغط على "إنشاء حساب"
7. ⏳ الحساب قيد المراجعة (يحتاج موافقة الأدمن)

### تسجيل الدخول:
1. الذهاب إلى صفحة تسجيل الدخول
2. إدخال: الإيميل وكلمة السر
3. الضغط على "تسجيل الدخول"
4. ✅ الدخول بنجاح

### نسيان كلمة السر:
1. الذهاب إلى صفحة "نسيت كلمة السر"
2. إدخال: الإيميل
3. الضغط على "إرسال كود التحقق"
4. ✅ الكود يصل للإيميل (يظهر في Console أيضاً)
5. إدخال الكود
6. إدخال كلمة السر الجديدة
7. ✅ تم تغيير كلمة السر بنجاح

---

## 📝 ملخص

✅ **كل الأنظمة جاهزة وموظفة!**

- ✅ نظام إنشاء الحساب (طالب + مريض)
- ✅ نظام تسجيل الدخول (مع التحقق من الحالة)
- ✅ نظام نسيان كلمة السر (مع OTP)
- ✅ نظام إرسال الإيميل (Gmail SMTP)
- ✅ تشفير كلمات السر (bcrypt)
- ✅ قاعدة بيانات PostgreSQL

**الكل جاهز للاستخدام!** 🎉
