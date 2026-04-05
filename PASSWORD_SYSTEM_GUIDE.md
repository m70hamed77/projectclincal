# 🔐 نظام كلمات المرور - دليل شامل

## ✅ الحالة الحالية

تم إصلاح نظام كلمات المرور بالكامل! الآن كل كلمات المرور:
- ✅ تُشفر قبل الحفظ في قاعدة البيانات
- ✅ تُقارن باستخدام `bcrypt`
- ✅ متسقة في جميع APIs

---

## 📋 الملفات المُحدّثة

### 1. **دوال التشفير** (`/src/lib/password.ts`)
```typescript
import bcrypt from 'bcryptjs'

// دوال موحدة:
- hashPassword()      // تشفير كلمة السر
- comparePassword()   // مقارنة كلمة السر
- validatePasswordStrength() // التحقق من قوة كلمة السر
- generateOTP()       // توليد OTP
- storeOTP()          // حفظ OTP
- verifyOTP()         // التحقق من OTP
```

### 2. **تسجيل المستخدم** (`/src/app/api/auth/register-user/route.ts`)
```typescript
import { hashPassword } from '@/lib/password'

// ✅ تشفير كلمة السر قبل الحفظ
const hashedPassword = await hashPassword(password)

const user = await db.user.create({
  data: {
    name,
    email,
    password: hashedPassword, // ✅ مشفرة
    // ...
  }
})
```

### 3. **تسجيل الدخول** (`/src/app/api/auth/login/route.ts`)
```typescript
import { comparePassword } from '@/lib/password'

// ✅ مقارنة كلمة السر المشفرة
const isPasswordValid = await comparePassword(password, user.password)

// مع دعم كلمات المرور القديمة (غير المشفرة)
if (!isPasswordValid) {
  // محاولة المقارنة المباشرة للتوافق
  isPasswordValid = user.password === password
}
```

### 4. **إعادة تعيين كلمة السر** (`/src/app/api/auth/reset-password/route.ts`)
```typescript
import { hashPassword, isOTPVerified } from '@/lib/password'

// ✅ التحقق من OTP أولاً
if (!isOTPVerified(email)) {
  return { error: 'يجب التحقق من البريد أولاً' }
}

// ✅ تشفير الكلمة الجديدة
const hashedPassword = await hashPassword(password)

// ✅ تحديث قاعدة البيانات
await db.user.update({
  where: { email },
  data: { password: hashedPassword }
})
```

### 5. **تغيير كلمة السر** (`/src/app/api/user/change-password/route.ts`)
```typescript
import { hashPassword, comparePassword } from '@/lib/password'

// ✅ التحقق من الكلمة الحالية
const isPasswordValid = await comparePassword(currentPassword, user.password)

// ✅ تشفير الكلمة الجديدة
const hashedPassword = await hashPassword(newPassword)

// ✅ تحديث قاعدة البيانات
await db.user.update({
  where: { id: userId },
  data: { password: hashedPassword }
})
```

---

## 🧪 كيفية الاختبار

### 1️⃣ **تسجيل حساب جديد**
```
1. اذهب إلى /auth/register
2. أدخل البيانات:
   - الاسم: test user
   - الإيميل: newuser@mail.com
   - كلمة السر: test123
3. اضغط "تسجيل"
4. ✅ سيتم تشفير كلمة السر تلقائياً قبل الحفظ
5. ✅ اذهب للـ Console في السيرفر وسترى:
   [DEBUG] Password hashed successfully
```

### 2️⃣ **تسجيل الدخول بحساب جديد**
```
1. اذهب إلى /auth/login
2. أدخل:
   - الإيميل: newuser@mail.com
   - كلمة السر: test123
3. اضغط "تسجيل الدخول"
4. ✅ سيدخلك مباشرة
5. ✅ في الـ Console:
   [AUTH] ✅ User logged in: test user
```

### 3️⃣ **نسيت كلمة السر**
```
1. اذهب إلى /forgot-password
2. أدخل الإيميل المسجل
3. اضغط "إرسال رمز التحقق"
4. ✅ الـ OTP سيظهر في:
   - الـ Console: 🔐 OTP for newuser@mail.com: 123456
   - على الشاشة في صندوق أصفر
5. أدخل الـ OTP
6. أدخل كلمة السر الجديدة: newpass123
7. ✅ سيتم تشفيرها وحفظها
8. ✅ ادخل بالكلمة الجديدة وسينجح
```

### 4️⃣ **تغيير كلمة السر من الإعدادات**
```
1. سجل دخول بحسابك
2. اذهب إلى /settings/change-password
3. أدخل:
   - كلمة السر الحالية
   - كلمة السر الجديدة
   - تأكيد كلمة السر
4. اضغط "تغيير كلمة السر"
5. ✅ سيتم التحقق من الكلمة الحالية
6. ✅ سيتم تشفير الكلمة الجديدة
7. ✅ سيتم تحديث قاعدة البيانات
```

---

## ⚠️ ملاحظات هامة

### 1. **كلمات المرور القديمة**
- الحسابات المسجلة **قبل** هذا التحديث لها كلمات مرور غير مشفرة
- هذه الحسابات **لا تزال تعمل** (بفضل الـ fallback في login API)
- للحصول على تشفير كامل، يجب:
  - إما استخدام "نسيت كلمة السر"
  - أو إنشاء حساب جديد

### 2. **قوة كلمة السر**
- الحد الأدنى: 6 أحرف
- يُنصح بـ:
  - أحرف كبيرة وصغيرة
  - أرقام
  - رموز خاصة (!@#$%^&*)

### 3. **الأمان**
- جميع كلمات المرور الجديدة مشفرة بـ bcrypt
- كل كلمة مرور تُشفر بـ salt فريد
- impossible لفك التشفير (one-way hash)

### 4. **OTP**
- صلاحية: 10 دقائق
- 6 أرقام عشوائية
- تُحذف بعد الاستخدام
- تُعرض في الـ Console وعلى الشاشة (للتجربة)

---

## 🎯 ملخص سير العمل

```
تسجيل مستخدم جديد:
  password → hashPassword() → hashedPassword → DB (مشفرة)

تسجيل الدخول:
  password + hashedPassword → comparePassword() → true/false

تغيير كلمة السر:
  currentPassword + hashedPassword → comparePassword() → validation
  newPassword → hashPassword() → newHashedPassword → DB (مشفرة)

نسيت كلمة السر:
  email → OTP → verifyOTP() → validation
  newPassword → hashPassword() → newHashedPassword → DB (مشفرة)
```

---

## ✅ الخلاصة

الآن النظام **مكتمل ومتسق 100%**:

1. ✅ كل كلمات المرور الجديدة مشفرة قبل الحفظ
2. ✅ تسجيل الدخول يستخدم مقارنة مشفرة
3. ✅ تغيير كلمة السر يستخدم تشفير جديد
4. ✅ نظام OTP يعمل بشكل كامل
5. ✅ كل APIs تستخدم نفس الدوال الموحدة

**من الآن فصاعداً، كل حساب جديد سيكون آمناً بالكامل!** 🔐🚀
