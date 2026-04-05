# 🚀 دليل تشغيل المشروع محلياً - Smiley Dental Clinic

## 📋 المتطلبات الأساسية
- Node.js (v20 أو أحدث)
- npm أو bun
- VS Code (أو أي محرر كود آخر)
- اتصال بالإنترنت (للاتصال بقاعدة بيانات PostgreSQL)

## 🔧 خطوات التشغيل

### 1️⃣ تثبيت الحزم
```bash
npm install
# أو
bun install
```

### 2️⃣ إعداد قاعدة البيانات
المشروع متصل بـ PostgreSQL (NeonDB) بالفعل، فقط تأكد من أن ملف `.env` يحتوي على:
```
DATABASE_URL=postgresql://neondb_owner:npg_XENWv3hDBr1i@ep-delicate-forest-aix7rt02-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3️⃣ توليد Prisma Client
**مهم:** إذا ظهر خطأ `DATABASE_URL`، قم بإلغاء ضبط المتغير القديم أولاً:

**على Windows (PowerShell):**
```powershell
$env:DATABASE_URL = ""
npm run db:push
```

**على Linux/Mac:**
```bash
unset DATABASE_URL
npm run db:push
```

**أو استخدام bun:**
```bash
bun run db:push
```

### 4️⃣ التحقق من حساب الأدمن
حساب الأدمن موجود بالفعل في قاعدة البيانات:
- 📧 البريد الإلكتروني: `admin@smileydental.com`
- 🔑 كلمة المرور: `Admin@123456`

### 5️⃣ تشغيل المشروع
```bash
npm run dev
# أو
bun run dev
```

المشروع سيعمل على: `http://localhost:3000`

## 🐛 حل المشاكل الشائعة

### مشكلة: Error validating datasource `db`
**السبب:** متغير `DATABASE_URL` القديم مضبوط في البيئة.

**الحل:**
```bash
# Linux/Mac
unset DATABASE_URL

# Windows PowerShell
$env:DATABASE_URL = ""

# ثم قم بتشغيل الأمر مرة أخرى
npm run db:push
```

### مشكلة: Turbopack Error
**الحل:** المشروع يستخدم `bun run dev` تلقائياً الذي يعطل Turbopack.

### مشكلة: POST /api/auth/login 500
**الحل:** تأكد من:
1. قاعدة البيانات متصلة (جرب `unset DATABASE_URL && bun run db:push`)
2. حساب الأدمن موجود
3. البريد الإلكتروني وكلمة المرور صحيحة

## ✅ التحقق من صحة المشروع

### اختبار قاعدة البيانات:
```bash
unset DATABASE_URL
bun run db:push
```

### اختبار الصفحات:
افتح المتصفح وانتقل إلى:
- الصفحة الرئيسية: `http://localhost:3000/`
- تسجيل الدخول: `http://localhost:3000/auth/login`
- التسجيل: `http://localhost:3000/auth/register`

### اختبار تسجيل الدخول:
استخدم بيانات الأدمن:
- البريد: `admin@smileydental.com`
- كلمة المرور: `Admin@123456`

## 📁 هيكل المشروع
```
/home/z/my-project/
├── src/
│   ├── app/          # صفحات Next.js
│   ├── components/   # المكونات
│   └── lib/          # المكتبات المساعدة
├── prisma/
│   └── schema.prisma # سكيمة قاعدة البيانات
├── upload/           # الملفات المرفوعة
├── .env             # متغيرات البيئة
└── package.json     # اعتماديات المشروع
```

## 🎯 الميزات الرئيسية
- ✅ Next.js 16 مع App Router
- ✅ TypeScript
- ✅ Tailwind CSS 4 مع shadcn/ui
- ✅ Prisma ORM + PostgreSQL (NeonDB)
- ✅ نظام مصادقة مخصص
- ✅ دعم العربية والإنجليزية (RTL)
- ✅ تصميم متجاوب (Responsive)
- ✅ نظام إشعارات
- ✅ نظام تقييمات

## 💡 نصائح مهمة

### قبل تشغيل الأوامر:
تأكد دائماً من إلغاء ضبط `DATABASE_URL` القديم إذا ظهرت أخطاء:
```bash
unset DATABASE_URL  # Linux/Mac
```

### فحص الأخطاء:
```bash
# فحص نوعية الكود
npm run lint

# فحص TypeScript
npm run type-check
```

### إعادة ضبط قاعدة البيانات (إذا لزم الأمر):
```bash
unset DATABASE_URL
bun run db:push
```

## 📞 الدعم
إذا واجهت أي مشاكل:
1. تحقق من سجلات التطوير
2. تأكد من اتصال الإنترنت (لـ PostgreSQL)
3. تحقق من صحة `.env`
4. حاول إلغاء ضبط `DATABASE_URL` القديم

---

## ✨ ملخص سريع

```bash
# 1️⃣ تثبيت الحزم
npm install

# 2️⃣ إعداد قاعدة البيانات (مع إلغاء المتغير القديم)
unset DATABASE_URL
npm run db:push

# 3️⃣ تشغيل المشروع
npm run dev

# 4️⃣ تسجيل الدخول
# http://localhost:3000/auth/login
# admin@smileydental.com / Admin@123456
```

---

**تم التجهيز بنجاح! 🎉**
