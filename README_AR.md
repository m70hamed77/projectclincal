# Smiley Dental Clinic - دليل التشغيل

## 🎉 تم إعداد المشروع بنجاح!

### ✅ ما تم ضبطه:

1. **قاعدة البيانات PostgreSQL (NeonDB)**
   - ✅ الاتصال يعمل بنجاح
   - ✅ جميع الجداول تم إنشاؤها
   - ✅ Schema مضبوط بالكامل

2. **ملف .env**
   - ✅ رابط قاعدة البيانات NeonDB مضبوط
   - ✅ متغيرات NextAuth مضبوطة
   - ✅ جاهز للعمل

3. **Prisma Schema**
   - ✅ تم التحويل من SQLite إلى PostgreSQL
   - ✅ جميع العلاقات مضبوطة
   - ✅ الفهارس مضبوطة

4. **الملفات الأخرى**
   - ✅ .gitignore محدث
   - ✅ package.json محدث
   - ✅ ESLint بدون أخطاء

---

## 🚀 كيفية تشغيل المشروع على VSCode

### الخطوة 1: تحميل المشروع
```bash
# قم بنسخ المشروع من git أو فتحه في VSCode
```

### الخطوة 2: تثبيت التبعيات
افتح terminal في VSCode واكتب:

```bash
# إذا كنت تستخدم npm
npm install

# أو إذا كنت تستخدم bun
bun install
```

### الخطوة 3: التأكد من ملف .env
تأكد من وجود ملف `.env` في مجلد المشروع ويحتوي على:

```env
DATABASE_URL=postgresql://neondb_owner:npg_2HOcLhjFfs4B@ep-bitter-sound-amro63xu-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smiley-dental-clinic-secret-key-2024-production-ready-secure
NODE_ENV=development
```

### الخطوة 4: تهيئة قاعدة البيانات
```bash
# إنشاء Prisma Client
npm run db:generate

# إنشاء الجداول في قاعدة البيانات
npm run db:push
```

### الخطوة 5: تشغيل المشروع
```bash
# تشغيل خادم التطوير
npm run dev
```

### الخطوة 6: فتح المتصفح
افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

---

## 📋 الوظائف المتاحة

### التسجيل:
- ✅ تسجيل مسؤول (Admin)
- ✅ تسجيل طالب (Student)
- ✅ تسجيل مريض (Patient)

### العمليات:
- ✅ إنشاء طلب علاج
- ✅ التقديم على الطلبات
- ✅ قبول/رفض الطلبات
- ✅ إنشاء حالة علاج
- ✅ إنشاء موعد
- ✅ المحادثات بين الطالب والمريض

---

## 🔧 أوامر مفيدة

```bash
# تشغيل المشروع
npm run dev

# فحص الكود
npm run lint

# إصلاح الأخطاء تلقائياً
npm run lint:fix

# إنشاء Prisma Client
npm run db:generate

# تحديث قاعدة البيانات
npm run db:push

# فتح Prisma Studio (لعرض قاعدة البيانات)
npm run db:studio

# بناء المشروع
npm run build
```

---

## 🛠️ حل المشاكل الشائعة

### المشكلة: خطأ في اتصال قاعدة البيانات
```bash
# الحل:
npm run db:generate
npm run db:push
```

### المشكلة: المشروع لا يعمل
```bash
# الحل: إعادة البناء
rm -rf .next node_modules/.prisma
npm run db:generate
npm install
npm run dev
```

### المشكلة: أخطاء في الكود
```bash
# الحل:
npm run lint:fix
```

---

## 📊 حالة قاعدة البيانات الحالية

- Users: 3
- Students: 1
- Patients: 1
- Admins: 1
- Posts: 1
- Applications: 1

---

## 🎯 التقنيات المستخدمة

- **Next.js 16** - Framework
- **TypeScript 5** - Language
- **PostgreSQL** - Database (NeonDB)
- **Prisma** - ORM
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components

---

## ⚠️ ملاحظات مهمة

1. **لا تقم برفع ملف `.env` إلى GitHub** - يحتوي على معلومات حساسة!
2. **في بيئة الإنتاج**، قم بتغيير `NEXTAUTH_SECRET` إلى مفتاح عشوائي آمن
3. **تأكد من اتصال الإنترنت** للوصول إلى قاعدة بيانات NeonDB

---

## 🎉 تم تجهيز كل شيء!

المشروع الآن جاهز للعمل على VSCode الخاص بك!

**بس لعب!** 👍
