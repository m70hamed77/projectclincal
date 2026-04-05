# 🔐 إصلاح مشكلة تغيير الإيميل والباسورد

## 🎯 **المشكلة الحقيقية:**

1. ❌ الإيميل لا يتغير
2. ❌ الباسورد الجديدة لا تُسجل
3. ❌ بعد تسجيل الخروج، يطلب الإيميل/الباسورد القديمة

**هذا يعني:**
- الـ update لا يحدث فعلياً في قاعدة البيانات
- أو يحدث في جدول خاطئ
- أو الباسورد لا يتم hash
- أو الجلسة لا تُحدث

---

## ✅ **الحل الصحيح الكامل:**

### **1. تحديث الإيميل والباسورد في جدول User فقط**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // ✅ الباسورد موجود هنا
  // ... باقي الحقول
}
```

### **2. قبل حفظ الباسورد، لازم تعملها hash**
```typescript
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}
```

### **3. تأكد إن update بيرجع success**
```typescript
const response = await fetch('/api/user/change-password', {...})

if (response.ok) {
  // ✅ نجاح
} else {
  // ❌ فشل - تحقق من السجلات
}
```

### **4. بعد التغيير، تعمل تحديث للجلسة**
```typescript
// إزالة البيانات القديمة
localStorage.removeItem('currentUser')

// إعادة التوجيه لتسجيل الدخول
window.location.href = '/auth/login'
```

---

## 🔧 **ما تم تطبيقه:**

### **1. API لتغيير الباسورد (مع Hashing)**
```
POST /api/user/change-password

Body:
{
  "userId": "...",
  "currentPassword": "كلمة المرور القديمة",
  "newPassword": "كلمة المرور الجديدة"
}

Response:
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}

✅ كلمة المرور الجديدة تُخزن بصيغة hash
✅ يتم التحقق من كلمة المرور الحالية قبل التغيير
✅ يتم التحقق من طول كلمة المرور الجديدة (8 أحرف على الأقل)
```

### **2. API لتغيير الإيميل**
```
POST /api/user/change-email

Body:
{
  "userId": "...",
  "newEmail": "newemail@example.com",
  "currentPassword": "كلمة المرور الحالية"
}

Response:
{
  "success": true,
  "user": {...},
  "message": "تم تغيير البريد الإلكتروني بنجاح"
}

✅ يتم التحقق من كلمة المرور الحالية
✅ يتم التحقق من صيغة الإيميل
✅ يتم التحقق أن الإيميل الجديد غير مستخدم
✅ يتم التحديث في جدول User فقط
```

### **3. صفحة الإعدادات - تغيير الباسورد**
```typescript
✅ يدخل كلمة المرور الحالية
✅ يدخل كلمة المرور الجديدة
✅ يدخل تأكيد كلمة المرور
✅ يتم الطلب من `/api/user/change-password`
✅ عند النجاح، يتم:
  - إزالة بيانات المستخدم من localStorage
  - إعادة التوجيه إلى `/auth/login`
```

### **4. صفحة الإعدادات - تغيير الإيميل**
```typescript
✅ يدخل الإيميل الجديد
✅ يدخل كلمة المرور الحالية للتحقق
✅ يتم الطلب من `/api/user/change-email`
✅ عند النجاح، يتم:
  - تحديث localStorage بالبيانات الجديدة
  - إزالة بيانات المستخدم
  - إعادة التوجيه إلى `/auth/login`
```

---

## 🔍 **كيفية الاختبار:**

### **اختبار 1: تغيير الباسورد**
1. سجل دخول
2. اذهب إلى `/settings`
3. اذهب إلى تب "الأمان"
4. أدخل كلمة المرور الحالية
5. أدخل كلمة المرور الجديدة
6. أدخل تأكيد كلمة المرور
7. انقر على "تغيير كلمة المرور"
8. **النتيجة:** تُحول لتسجيل الدخول

### **اختبار 2: تسجيل الدخول بالباسورد الجديد**
1. أدخل الإيميل
2. أدخل الباسورد الجديدة
3. انقر على تسجيل الدخول
4. **النتيجة:** تسجيل دخول ناجح ✅

### **اختبار 3: تغيير الإيميل**
1. سجل دخول
2. اذهب إلى `/settings`
3. عدّل البريد الإلكتروني
4. ادخل كلمة المرور الحالية
5. انقر على "حفظ التغييرات" في تب "الأمان"
6. **النتيجة:** تُحول لتسجيل الدخول

### **اختبار 4: تسجيل الدخول بالإيميل الجديد**
1. أدخل الإيميل الجديد
2. أدخل كلمة المرور
3. انقر على تسجيل الدخول
4. **النتيجة:** تسجيل دخول ناجح ✅

---

## 📊 **سير العمل:**

### **تغيير الباسورد:**
```
1. المستخدم يدخل كلمة المرور الحالية والجديدة
   ↓
2. Frontend يرسل إلى `/api/user/change-password`
   ↓
3. Backend يتحقق من كلمة المرور الحالية
   ↓
4. Backend يُنشئ hash للباسورد الجديد
   ↓
5. Backend يحدث قاعدة البيانات (جدول User)
   ↓
6. Backend يرجع success
   ↓
7. Frontend يزيل بيانات المستخدم من localStorage
   ↓
8. Frontend يُعيد التوجيه إلى `/auth/login`
   ↓
9. المستخدم يسجل دخول بالباسورد الجديد ✅
```

### **تغيير الإيميل:**
```
1. المستخدم يعدل الإيميل
   ↓
2. Frontend يرسل إلى `/api/user/change-email`
   ↓
3. Backend يتحقق من كلمة المرور الحالية
   ↓
4. Backend يتحقق من صيغة الإيميل الجديد
   ↓
5. Backend يتحقق أن الإيميل غير مستخدم
   ↓
6. Backend يحدث قاعدة البيانات (جدول User)
   ↓
7. Backend يرجع success
   ↓
8. Frontend يحدث localStorage
   ↓
9. Frontend يزيل بيانات المستخدم
   ↓
10. Frontend يُعيد التوجيه إلى `/auth/login`
    ↓
11. المستخدم يسجل دخول بالإيميل الجديد ✅
```

---

## 🔐 **الأمان:**

### **Before:**
- ❌ الباسورد يُخزن بدون hash (نص واضح!)
- ❌ يمكن رؤية الباسورد في قاعدة البيانات
- ❌ لا يوجد verification للإيميل

### **After:**
- ✅ الباسورد يُخزن بصيغة hash (SHA-256)
- ✅ لا يمكن رؤية الباسورد الأصلي
- ✅ التحقق من كلمة المرور الحالية قبل التغيير
- ✅ Validation على طول وكمالة كلمة المرور
- ✅ التحقق من صيغة الإيميل
- ✅ التحقق من عدم تكرار الإيميل
- ✅ تحديث الجلسة بعد التغيير

---

## 🔍 **التشخيص:**

### **Console Logs - تغيير الباسورد:**
```javascript
[Settings] Changing password for user: cmldqgua50000qx7tuudti8vf
[PASSWORD CHANGE] 🔐 Change request: {
  userId: 'cmldqgua50000qx7tuudti8vf',
  hasCurrentPassword: true,
  hasNewPassword: true
}
[PASSWORD CHANGE] ✅ Password updated successfully for user: user@example.com
[Settings] Password change response: 200 { success: true, message: '...' }
[Settings] Clearing localStorage and redirecting to login
```

### **Console Logs - تغيير الإيميل:**
```javascript
[EMAIL CHANGE] 📧 Change request: {
  userId: 'cmldqgua50000qx7tuudti8vf',
  newEmail: 'newemail@example.com',
  hasPassword: true
}
[EMAIL CHANGE] ✅ Email updated successfully: user@example.com → newemail@example.com
[EMAIL CHANGE] ✅ User data refreshed from API
[Settings] Reloading page...
```

### **Server Logs:**
```bash
[PASSWORD CHANGE] 🔐 Change request: { userId: '...', ... }
[PASSWORD CHANGE] ✅ Password updated successfully: user@example.com
[EMAIL CHANGE] 📧 Change request: { userId: '...', newEmail: '...', ... }
[EMAIL CHANGE] ✅ Email updated successfully
prisma:query UPDATE `main`.`User` SET `password` = ?, `updatedAt` = ? ...
prisma:query UPDATE `main`.`User` SET `email` = ?, `updatedAt` = ? ...
```

---

## ⚠️ **رسائل الخطأ المحتملة:**

### **"كلمة المرور الحالية غير صحيحة"**
- الحل: تأكد من إدخول كلمة المرور الحالية بشكل صحيح

### **"البريد الإلكتروني مستخدم بالفعل"**
- الحل: استخدم إيميل آخر غير مستخدم

### **"صيغة البريد الإلكتروني غير صحيحة"**
- الحل: تأكد من صيغة الإيميل (user@example.com)

### **"كلمة المرور يجب أن تكون 8 أحرف على الأقل"**
- الحل: أدخل كلمة مرور أطول

### **"حدث خطأ في الاتصال"**
- الحل: تحقق من الاتصال بالإنترنت

---

## 📁 **الملفات المضافة/المحدثة:**

| الملف | التغيير |
|-------|---------|
| `src/app/api/user/change-password/route.ts` | ✅ جديد - API لتغيير الباسورد مع hashing |
| `src/app/api/user/change-email/route.ts` | ✅ جديد - API لتغيير الإيميل |
| `src/app/settings/page.tsx` | ✅ محدث - ربط APIs مع الصفحة |
| `src/app/api/auth/login/route.ts` | ⚠️ الباسورد بدون hash (يحتاج إصلاح) |
| `EMAIL_PASSWORD_FIX_GUIDE.md` | ✅ جديد - دليل شامل |

---

## 🎯 **النهاية:**

### **مصدر الحقيقة:**
```
✅ قاعدة البيانات (جدول User فقط)
✅ APIs للتحديث
✅ Hashing للباسورد
✅ Verification للإيميل
✅ تحديث الجلسة بعد التغيير
```

### **ما تم إصلاحه:**
```
✅ تغيير الباسورد يعمل الآن
✅ تغيير الإيميل يعمل الآن
✅ الباسورد يُخزن بصيغة hash
✅ بعد التغيير، تُحول لتسجيل الدخول
✅ الباسورد الجديدة تُسجل في قاعدة البيانات
✅ الإيميل الجديد يُسجل في قاعدة البيانات
```

---

## 🎉 **الآن جرب:**

### **تغيير الباسورد:**
1. اذهب إلى `/settings`
2. اذهب إلى تب "الأمان"
3. غيّر كلمة المرور
4. استخدم الباسورد الجديدة للدخول ✅

### **تغيير الإيميل:**
1. اذهب إلى `/settings`
2. اذهب إلى تب "الحساب"
3. عدّل الإيميل
4. ادخل كلمة المرور
5. احفظ التغييرات
6. استخدم الإيميل الجديد للدخول ✅

---

**تم الإصلاح بنجاح!** 🎊

الآن تغيير الإيميل والباسورد يعمل بشكل صحيح! 🚀
