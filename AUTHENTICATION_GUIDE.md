# 🚀 دليل التشغيل السريع - نظام المصادقة

## ✅ ما تم تنفيذه

نظام مصادقة كامل ومجاني يعمل بنجاح!

### المكونات المُنفذة:

1. ✅ **API تسجيل مستخدم جديد** - `/api/auth/register-user`
   - تشفير كلمة المرور باستخدام Bcrypt
   - التحقق من صحة الإيميل
   - منع التكرار

2. ✅ **API تسجيل الدخول** - `/api/auth/login`
   - مقارنة كلمات المرور المشفرة
   - إنشاء JWT Token
   - حفظ Token في HttpOnly Cookie

3. ✅ **API تسجيل الخروج** - `/api/auth/logout`
   - حذف JWT Token
   - إنهاء الجلسة

4. ✅ **API جلب بيانات المستخدم** - `/api/user/me`
   - التحقق من JWT Token
   - جلب بيانات طازجة من قاعدة البيانات

5. ✅ **Middleware** - `src/middleware.ts`
   - حماية الصفحات المحمية
   - إعادة توجيه المستخدمين

6. ✅ **Hook** - `useCurrentUser()`
   - الحصول على بيانات المستخدم الحالي
   - دعم JWT + localStorage fallback

7. ✅ **Navigation** - Logout function
   - تسجيل خروج آمن
   - مسح Cookies و localStorage

## 🔧 حل مشكلة خطأ 400 Bad Request

### السبب المحتمل:

إذا كنت تحصل على خطأ 400 عند تسجيل الدخول، فالأسباب المحتملة هي:

1. **الإيميل أو كلمة المرور غير مرفقة**
   ```typescript
   // ❌ خطأ
   { email: "user@example.com" } // كلمة المرور مفقودة

   // ✅ صحيح
   { email: "user@example.com", password: "password123" }
   ```

2. **صيغة الإيميل غير صحيحة**
   ```typescript
   // ❌ خطأ
   "user@example" // بدون نطاق

   // ✅ صحيح
   "user@example.com" // صيغة صحيحة
   ```

3. **حقول فارغة**
   ```typescript
   // ❌ خطأ
   { email: "", password: "" } // حقول فارغة

   // ✅ صحيح
   { email: "user@example.com", password: "password123" }
   ```

### كيفية التحقق من المشكلة:

1. افتح Console في المتصفح (F12)
2. حاول تسجيل الدخول
3. ابحث عن الأخطاء في Console
4. سترى logs تفصيلية من الـ API

### Logs التي ستظهر في Console:

```javascript
// عند محاولة تسجيل الدخول
[Login Form] Submitting login with email: user@example.com

// من الـ API
[AUTH] 📝 Login attempt for email: user@example.com
[AUTH] 📦 Request body: { email: 'user@example.com', passwordProvided: true }
[AUTH] 🔍 User found in database: true
[AUTH] 🔐 Password comparison result: false // ❌ كلمة المرور غير صحيحة
```

## 🧪 كيفية الاختبار

### 1. إنشاء حساب جديد

```bash
curl -X POST http://localhost:3000/api/auth/register-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مستخدم تجريبي",
    "email": "test@smiley.com",
    "password": "password123",
    "phone": "01000000000",
    "role": "PATIENT"
  }'
```

### 2. تسجيل الدخول

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@smiley.com",
    "password": "password123"
  }'
```

### 3. جلب بيانات المستخدم (بعد تسجيل الدخول)

```bash
# انسخ الـ token من الاستجابة السابقة
curl -X GET http://localhost:3000/api/user/me \
  -H "Cookie: auth-token=PASTE_YOUR_TOKEN_HERE"
```

### 4. تسجيل الخروج

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## 📊 تدفق النظام

### عملية التسجيل:

```
المستخدم → أدخل البيانات
    ↓
Frontend → POST /api/auth/register-user
    ↓
API → التحقق من البيانات
    ↓
API → تشفير كلمة المرور (Bcrypt)
    ↓
API → حفظ في قاعدة البيانات
    ↓
API → إرجاع success
```

### عملية تسجيل الدخول:

```
المستخدم → أدخل الإيميل والباسورد
    ↓
Frontend → POST /api/auth/login
    ↓
API → البحث عن المستخدم
    ↓
API → مقارنة كلمة المرور (Bcrypt)
    ↓
API → إنشاء JWT Token
    ↓
API → حفظ Token في Cookie
    ↓
API → إرجاع success + user data + token
    ↓
Frontend → حفظ في localStorage + Redirect to Dashboard
```

### عملية تسجيل الخروج:

```
المستخدم → اضغط على تسجيل الخروج
    ↓
Frontend → POST /api/auth/logout
    ↓
API → حذف Cookie
    ↓
Frontend → مسح localStorage
    ↓
Frontend → Redirect to /auth/login
```

## 🔐 الأمان

### ما يتم حمايته:

✅ **كلمات المرور** - مشفرة بـ Bcrypt (12 rounds)
✅ **الجلسات** - JWT Token مع HttpOnly Cookie
✅ **الصفحات** - Middleware يحمي المسارات المحمية
✅ **CSRF** - SameSite Cookie protection
✅ **XSS** - HttpOnly Cookies (لا يمكن قراءتها من JavaScript)

### أفضل الممارسات المتبعة:

1. ✅ لا يتم تخزين كلمات المرور كنص صريح
2. ✅ JWT Token آمن ومشفّر
3. ✅ Cookies HttpOnly و Secure
4. ✅ Password validation (min 6 characters)
5. ✅ Email validation
6. ✅ Session expiration (7 days)

## 🐛 المشاكل الشائعة والحلول

### مشكلة: "البريد الإلكتروني أو كلمة المرور غير صحيح"

**الحل:**
- تأكد من صحة الإيميل وكلمة المرور
- تحقق من أن الحساب مُنشأ في قاعدة البيانات
- تأكد من أن حالة الحساب هي ACTIVE

### مشكلة: "حسابك غير نشط"

**الحل:**
- تحقق من حالة الحساب في قاعدة البيانات
- يجب أن تكون `status: 'ACTIVE'`

### مشكلة: لا يتم حفظ الجلسة

**الحل:**
- تأكد من تفعيل Cookies في المتصفح
- لا تستخدم Private/Incognito mode
- تحقق من إعدادات المتصفح

### مشكلة: خطأ 400 Bad Request

**الحل:**
- تأكد من إرسال البيانات كـ JSON
- تأكد من وجود الإيميل وكلمة المرور
- تحقق من صيغة الإيميل

## 📝 ملاحظات مهمة

### 1. كلمات المرور القديمة

إذا كان لديك مستخدمين في قاعدة البيانات قبل تنفيذ هذا النظام:

❌ **كلمات المرور غير مشفرة** - لن يعمل تسجيل الدخول

**الحل:** يجب على المستخدمين إنشاء حسابات جديدة أو إعادة تعيين كلمات المرور

### 2. JWT Secret

في `.env`، تأكد من إضافة:

```env
JWT_SECRET=your-super-secret-key-min-32-characters-long
```

### 3. Production Mode

عند النشر للإنتاج:

✅ استخدم HTTPS
✅ تأكد من `JWT_SECRET` قوي
✅ استخدم `secure: true` للـ Cookies
✅ قم بمراجعة وإعدادات الأمان

## 🎯 الخطوات التالية

للاستخدام في التطبيق:

1. **صفحة التسجيل** - `/auth/register` ✅ (جاهز)
2. **صفحة تسجيل الدخول** - `/auth/login` ✅ (جاهز)
3. **لوحة التحكم** - `/dashboard/patient` أو `/dashboard/student` ✅ (جاهز)
4. **تسجيل الخروج** - من القائمة المنسدلة في Navigation ✅ (جاهز)

## 📚 الملفات المهمة

- `src/lib/auth.ts` - مكتبة المصادقة
- `src/app/api/auth/login/route.ts` - API تسجيل الدخول
- `src/app/api/auth/logout/route.ts` - API تسجيل الخروج
- `src/app/api/auth/register-user/route.ts` - API التسجيل
- `src/app/api/user/me/route.ts` - API بيانات المستخدم
- `src/middleware.ts` - حماية المسارات
- `src/hooks/useCurrentUser.ts` - Hook للحصول على المستخدم
- `src/components/navigation.tsx` - Navigation مع Logout

## ✅ الخلاصة

نظام المصادحة جاهز بالكامل ومجاني! يعتمد على:

- ✅ JWT للجلسات
- ✅ Bcrypt لتشفير كلمات المرور
- ✅ HttpOnly Cookies للأمان
- ✅ Middleware لحماية الصفحات
- ✅ أفضل ممارسات الأمان

**حظاً موفقاً! 🚀**
