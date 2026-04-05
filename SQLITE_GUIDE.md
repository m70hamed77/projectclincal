# 🚀 دليل إعداد المشروع باستخدام SQLite

## ✅ لماذا SQLite؟

- ✅ **سهل التثبيت** - لا يحتاج لخادم قاعدة بيانات
- ✅ **سريع** - يعمل مباشرة على جهازك
- ✅ **مثالي للتطوير** - لا يحتاج إعدادات معقدة
- ✅ **قاعدة بيانات محلية** - جميع البيانات على جهازك

---

## 📋 خطوات الإعداد (5 دقائق فقط):

### الخطوة 1: شغل سكربت الإعداد

انقر مرتين على ملف: **`SETUP_SQLITE.bat`**

أو في PowerShell:

```powershell
cd "G:\smiley clinc"
.\SETUP_SQLITE.bat
```

السكربت سيقوم بـ:
- ✅ إنشاء مجلد `db`
- ✅ تثبيت الحزم
- ✅ إنشاء قاعدة بيانات SQLite
- ✅ إنشاء مستخدم Admin
- ✅ تشغيل السيرفر تلقائياً

---

### الخطوة 2: تسجيل الدخول

افتح المتصفح: `http://localhost:3000`

استخدم:
```
البريد: admin@smileydental.com
كلمة المرور: Admin@123456
```

---

## 🔧 الأوامر اليدوية (إذا أردت التحكم الكامل):

### 1️⃣ إنشاء قاعدة البيانات

```powershell
npx prisma db push
```

### 2️⃣ إنشاء Admin

```powershell
npm run create-admin:js
```

### 3️⃣ تشغيل السيرفر

```powershell
npm run dev
```

---

## 📂 الملفات المهمة:

| الملف | الوظيفة |
|-------|---------|
| `SETUP_SQLITE.bat` | إعداد كامل + تشغيل |
| `START_SQLITE.bat` | تشغيل سريع |
| `.env` | إعدادات قاعدة البيانات |
| `.env.sqlite.example` | مثال على ملف البيئة |
| `prisma/schema.prisma` | هيكل قاعدة البيانات |

---

## 🗄️ قاعدة البيانات SQLite:

- **الموقع:** `db/custom.db`
- **النوع:** SQLite 3
- **التعامل:** Prisma ORM
- **إدارة البيانات:** يمكن استخدام Prisma Studio

---

## 🔍 فتح قاعدة البيانات:

```powershell
npm run db:studio
```

سيفتح لوحة تحكم لعرض وتعديل البيانات.

---

## ✅ اختبار الاتصال:

```powershell
npm run test-db
```

يجب أن ترى:
```
✅ الاتصال بقاعدة البيانات ناجح!
✅ مستخدم Admin موجود!
```

---

## 🚀 الخطوات اليومية:

### للبدء:

```powershell
.\START_SQLITE.bat
```

### لإعادة تعيين قاعدة البيانات:

```powershell
# احذف قاعدة البيانات
del db\custom.db

# أنشئها من جديد
npx prisma db push

# أنشئ Admin
npm run create-admin:js
```

---

## ⚠️ ملاحظات مهمة:

### للنشر على Vercel:

1. في Vercel، أضف Environment Variable:
   ```
   DATABASE_URL=postgresql://...
   ```

2. عدّل `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. شغل:
   ```powershell
   npx prisma generate
   npx prisma db push
   ```

---

## 🐛 حل المشاكل:

### مشكلة: Database not found

**الحل:**
```powershell
if not exist db mkdir db
npx prisma db push
```

### مشكلة: Admin not found

**الحل:**
```powershell
npm run create-admin:js
```

### مشكلة: Schema out of sync

**الحل:**
```powershell
npx prisma db push
```

---

## ✅ قائمة التحقق:

- [ ] تم تشغيل `SETUP_SQLITE.bat`
- [ ] مجلد `db` موجود
- [ ] ملف `db/custom.db` تم إنشاؤه
- [ ] Admin تم إنشاؤه
- [ ] السيرفر يعمل على `http://localhost:3000`
- [ ] يمكن تسجيل الدخول باستخدام admin@smileydental.com / Admin@123456

---

## 📊 معلومات المشروع:

- **الإطار:** Next.js 16
- **قاعدة البيانات:** SQLite (تطوير) / PostgreSQL (إنتاج)
- **ORM:** Prisma
- **اللغة:** TypeScript
- **الستايل:** Tailwind CSS + shadcn/ui
- **اللغة الواجهة:** العربية (RTL)

---

**تم إنشاء هذا الدليل بواسطة Z.ai Code**
