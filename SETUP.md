# إعداد المشروع - Smiley Dental Clinic

## ✅ الملفات المضبوطة

### 1. `.env` - متغيرات البيئة
تم ضبط قاعدة بيانات PostgreSQL من NeonDB:

```env
# Database - NeonDB PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_2HOcLhjFfs4B@ep-bitter-sound-amro63xu-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smiley-dental-clinic-secret-key-2024-production-ready-secure

# Environment
NODE_ENV=development
```

### 2. `prisma/schema.prisma` - قاعدة البيانات
تم تغيير مصدر البيانات من SQLite إلى PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. `.gitignore` - الملفات المستثناة
تم تحديث الملف لحماية:
- ✅ `.env` - متغيرات البيئة
- ✅ `node_modules/` - التبعيات
- ✅ `.next/` - ملفات بناء Next.js
- ✅ ملفات السجلات والمؤقتة

### 4. `package.json` - الأوامر
الأوامر الرئيسية:

```json
{
  "dev": "cross-env TURBOPACK=0 next dev -p 3000",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "eslint .",
  "db:push": "prisma db push",
  "db:generate": "prisma generate",
  "db:studio": "prisma studio"
}
```

## 📊 حالة قاعدة البيانات

### الاتصال الناجح:
- ✅ Database Type: PostgreSQL (NeonDB)
- ✅ Connection: Working
- ✅ Tables: All created and synced

### البيانات الحالية:
- Users: 3
- Students: 1
- Patients: 1
- Admins: 1
- Posts: 1
- Applications: 1

## 🚀 التشغيل على VSCode

### الخطوة 1: استنساخ المشروع
```bash
git clone <your-repo-url>
cd smiley-dental-clinic
```

### الخطوة 2: تثبيت التبعيات
```bash
npm install
# أو
bun install
```

### الخطوة 3: إعداد متغيرات البيئة
قم بإنشاء ملف `.env` في مجلد المشروع:

```env
# Database - NeonDB PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_2HOcLhjFfs4B@ep-bitter-sound-amro63xu-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smiley-dental-clinic-secret-key-2024-production-ready-secure

# Environment
NODE_ENV=development
```

### الخطوة 4: تهيئة قاعدة البيانات
```bash
# إنشاء Prisma Client
npm run db:generate

# إنشاء/تحديث الجداول في قاعدة البيانات
npm run db:push
```

### الخطوة 5: تشغيل المشروع
```bash
npm run dev
# أو
bun run dev
```

افتح المتصفح على: `http://localhost:3000`

## 🔧 الأوامر المفيدة

### قاعدة البيانات:
```bash
# إنشاء Prisma Client
npm run db:generate

# دفع التغييرات لقاعدة البيانات
npm run db:push

# إنشاء ملف ترحيل جديد
npm run db:migrate

# إعادة تعيين قاعدة البيانات
npm run db:reset

# فتح Prisma Studio (واجهة رسومية)
npm run db:studio
```

### التطوير:
```bash
# تشغيل خادم التطوير
npm run dev

# فحص الكود
npm run lint

# إصلاح مشاكل الكود تلقائياً
npm run lint:fix

# بناء المشروع للإنتاج
npm run build

# تشغيل نسخة الإنتاج
npm run start
```

## 📁 هيكل المشروع

```
smiley-dental-clinic/
├── .env                    # متغيرات البيئة (لا ترفعه إلى Git!)
├── .gitignore              # الملفات المستثناة من Git
├── package.json            # التبعيات والأوامر
├── prisma/
│   └── schema.prisma      # قاعدة البيانات (PostgreSQL)
├── src/
│   ├── app/               # صفحات التطبيق
│   │   ├── page.tsx       # الصفحة الرئيسية
│   │   ├── layout.tsx     # التخطيط الرئيسي
│   │   ├── auth/          # صفحات المصادقة
│   │   ├── dashboard/     # لوحات التحكم
│   │   └── api/           # API Routes
│   ├── components/        # المكونات
│   ├── hooks/             # Custom Hooks
│   ├── lib/               # المكتبات المساعدة
│   │   ├── db.ts          # اتصال قاعدة البيانات
│   │   └── auth.ts        # أدوات المصادقة
│   └── i18n/              # الترجمات
└── public/                # الملفات العامة
    └── uploads/           # الملفات المرفوعة
```

## 🎯 الوظائف المتاحة

### التسجيل:
- ✅ تسجيل كمسؤول (Admin)
- ✅ تسجيل كطالب (Student)
- ✅ تسجيل كمريض (Patient)

### الطلبات:
- ✅ إنشاء طلب علاج (Post)
- ✅ التقديم على طلب (Application)
- ✅ قبول/رفض الطلبات (Accept/Reject)
- ✅ إنشاء حالة علاج (Case)
- ✅ إنشاء موعد (Appointment)
- ✅ إنشاء محادثة (Conversation)

### الإدارة:
- ✅ لوحة تحكم المسؤول
- ✅ إدارة المستخدمين
- ✅ التحقق من الطلاب
- ✅ معالجة الشكاوى

## 🛠️ حل المشاكل

### المشكلة: خطأ في اتصال قاعدة البيانات
```bash
# حل: إعادة إنشاء Prisma Client
npm run db:generate
npm run db:push
```

### المشكلة: أخطاء في ESLint
```bash
# حل: تشغيل التصحيح التلقائي
npm run lint:fix
```

### المشكلة: المشروع لا يعمل
```bash
# حل: بناء نظيف
rm -rf .next node_modules/.prisma
npm run db:generate
npm install
npm run dev
```

## 🔒 الأمان

### ⚠️ هام جداً للإنتاج:
1. قم بتغيير `NEXTAUTH_SECRET` إلى مفتاح عشوائي آمن
2. استخدم متغيرات بيئة منفصلة للإنتاج
3. قم بحماية بيانات الاعتماد (API Keys, Passwords)
4. استخدم HTTPS في الإنتاج

### توليد مفتاح سري جديد:
```bash
# على Linux/Mac
openssl rand -base64 32

# على Windows (PowerShell)
New-Guid
```

## 📱 التقنيات المستخدمة

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js v4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📚 الوثائق

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [NeonDB Documentation](https://neon.tech/docs)

## ✨ الميزات القادمة

- [ ] نظام الإشعارات المتقدم
- [ ] تكامل مع تقويم Google
- [ ] نظام التقييمات والمراجعات
- [ ] رفع وتخزين الصور
- [ ] نظام البحث المتقدم
- [ ] لوحة تحكم تحليلية

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع قسم حل المشاكل أعلاه
2. تحقق من سجلات الخطأ في الـ console
3. تأكد من أن جميع متغيرات البيئة مضبوطة بشكل صحيح
4. تأكد من اتصال الإنترنت (للتواصل مع NeonDB)

---

**تم تطويره بـ ❤️ لـ Smiley Dental Clinic**
