# 🦷 Smiley Dental Clinic - سمايلي لطب الأسنان

منصة إلكترونية تربط بين طلاب طب الأسنان والمرضى للحصول على علاج مجاني أو بتكلفة منخفضة.

A dental clinic platform connecting dental students with patients for free or low-cost dental treatments.

---

## 📋 المتطلبات / Prerequisites

- Node.js 18+ أو أحدث / Latest version
- npm أو yarn أو pnpm

---

## 🚀 التثبيت على Windows / Installation on Windows

### 1. افتح المشروع في VS Code / Open Project in VS Code

```bash
cd "G:/projrct clinc"
code .
```

### 2. تثبيت الحزم / Install Dependencies

```bash
npm install
```

### 3. إنشاء مجلد قاعدة البيانات / Create Database Folder

```bash
mkdir db
```

### 4. إعداد قاعدة البيانات / Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 5. إنشاء حساب الأدمن / Create Admin Account

```bash
npm run create-admin
```

هذا سينشئ حساب أدمن بالبيانات التالية:
- **Email**: `admin@smileydental.com`
- **Password**: `Admin@123456`

### 6. تشغيل السيرفر / Start Development Server

```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

---

## 🔑 بيانات الدخول للأدمن / Admin Login Credentials

```
Email:    admin@smileydental.com
Password: Admin@123456
```

⚠️ **هام / Important**: بعد تسجيل الدخول لأول مرة، غيّر كلمة المرور من الإعدادات!
/ After first login, change the password from settings!

---

## 📚 الأوامر المتاحة / Available Commands

### تطوير / Development
```bash
npm run dev          # تشغيل سيرفر التطوير / Start dev server
npm run build        # بناء المشروع للإنتاج / Build for production
npm run start        # تشغيل النسخة المبنية / Start production build
npm run lint         # فحص الكود / Lint code
```

### قاعدة البيانات / Database
```bash
npm run db:push      # دفع الـ schema لقاعدة البيانات / Push schema to database
npm run db:generate  # توليد Prisma Client / Generate Prisma Client
npm run db:migrate   # إنشاء migration جديد / Create new migration
npm run db:studio    # فتح Prisma Studio (واجهة إدارة قاعدة البيانات) / Open Prisma Studio
```

### سكريبتات مفيدة / Useful Scripts
```bash
npm run create-admin   # إنشاء حساب أدمن (يُشغل مرة واحدة فقط) / Create admin account (run once)
npm run check-admin    # التحقق من وجود حسابات الأدمن / Check existing admin accounts
npm run reset-students # إعادة تعيين جميع الطلاب (للمطورين فقط) / Reset all students (developers only)
```

---

## 📁 هيكل المشروع / Project Structure

```
smiley-dental-clinic/
├── db/                      # ملفات قاعدة البيانات / Database files
│   └── custom.db           # قاعدة بيانات SQLite / SQLite database
├── prisma/
│   └── schema.prisma       # إعدادات قاعدة البيانات / Database schema
├── src/
│   ├── app/               # صفحات Next.js / Next.js pages
│   │   ├── admin/         # صفحات الأدمن / Admin pages
│   │   ├── auth/          # صفحات المصادقة / Auth pages
│   │   ├── dashboard/     # صفحات لوحة التحكم / Dashboard pages
│   │   └── ...
│   ├── components/        # مكونات React / React components
│   │   ├── ui/           # مكونات shadcn/ui / shadcn/ui components
│   │   └── ...
│   ├── lib/              # مكتبات مساعدة / Utility libraries
│   │   ├── db.ts        # Prisma client / Prisma client
│   │   ├── auth.ts      # Authentication helpers / Authentication helpers
│   │   └── ...
│   └── hooks/            # React hooks
├── scripts/              # سكريبتات مساعدة / Helper scripts
│   ├── create-admin.ts  # إنشاء حساب أدمن / Create admin account
│   ├── check-admin.ts   # التحقق من الأدمن / Check admin accounts
│   └── reset-students.ts # إعادة تعيين الطلاب / Reset students
├── .env                 # متغيرات البيئة / Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ إعداد قاعدة البيانات / Database Setup

### استخدام SQLite (افتراضي) / Using SQLite (Default)

ملف `.env`:
```env
DATABASE_URL="file:./db/custom.db"
```

أذا واجهت مشاكل في المسار، استخدم المسار المطلق:
```env
DATABASE_URL="file:G:/projrct clinc/db/custom.db"
```

### استخدام PostgreSQL (اختياري) / Using PostgreSQL (Optional)

1. قم بتثبيت PostgreSQL / Install PostgreSQL
2. أنشئ قاعدة بيانات / Create database:
```sql
CREATE DATABASE smiley_dental_clinic;
```

3. غيّر ملف `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smiley_dental_clinic"
```

4. غيّر `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. شغل الأوامر:
```bash
npx prisma generate
npx prisma db push
```

---

## 🎨 التقنيات المستخدمة / Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Authentication**: Cookie-based auth
- **Icons**: Lucide React
- **State Management**: Zustand
- **Animations**: Framer Motion

---

## 👤 أدوار المستخدمين / User Roles

### 1. الأدمن / Admin
- إدارة المستخدمين / Manage users
- مراجعة طلبات التحقق للطلاب / Review student verification requests
- إدارة البلاغات / Manage reports
- إدارة البوستات / Manage posts
- لوحة تحكم كاملة / Full admin dashboard

### 2. الطالب/الطبيب / Student/Doctor
- إنشاء بوستات للحالات الطبية / Create medical case posts
- استقبال طلبات المرضى / Receive patient applications
- إدارة المحادثات مع المرضى / Manage patient conversations
- تحديث حالة الحالات / Update case status
- رفع صور قبل وبعد العلاج / Upload before/after photos
- التقييمات والمراجعات / Ratings and reviews

### 3. المريض / Patient
- البحث عن حالات طبية / Search for medical cases
- التقديم على البوستات / Apply to posts
- المحادثة مع الأطباء / Chat with doctors
- تقييم الأطباء بعد العلاج / Rate doctors after treatment
- تتبع حالة طلباته / Track application status

---

## 🔧 استكشاف الأخطاء / Troubleshooting

### خطأ "Unable to open the database file" / "Unable to open the database file" error

**الحل / Solution**:
1. تأكد من وجود مجلد `db` / Ensure `db` folder exists:
```bash
mkdir db
```

2. تحقق من ملف `.env` / Check `.env` file:
```env
DATABASE_URL="file:./db/custom.db"
```
أو استخدم المسار المطلق / Or use absolute path:
```env
DATABASE_URL="file:G:/projrct clinc/db/custom.db"
```

3. شغل Prisma push / Run Prisma push:
```bash
npx prisma db push
```

### خطأ 401 عند تسجيل الدخول / 401 error on login

**الحل / Solution**:
1. تحقق من وجود حساب الأدمن / Check if admin exists:
```bash
npm run check-admin
```

2. إذا لم يكن موجوداً، أنشئه / If not exists, create it:
```bash
npm run create-admin
```

### خطأ "module not found" / "module not found" error

**الحل / Solution**:
```bash
rm -rf node_modules .next
npm install
```

### مشاكل Prisma / Prisma issues

**الحل / Solution**:
```bash
npx prisma generate
npx prisma db push
```

---

## 📝 ملاحظات مهمة / Important Notes

### للبيئة الإنتاجية / For Production Environment

1. ✅ غيّر كلمة مرور الأدمن الافتراضية / Change default admin password
2. ✅ استخدم PostgreSQL بدلاً من SQLite / Use PostgreSQL instead of SQLite
3. ✅ أضف متغيرات بيئة إضافية (SMTP, API keys) / Add additional environment variables (SMTP, API keys)
4. ✅ فعّل HTTPS / Enable HTTPS
5. ✅ أضف rate limiting للـ API / Add API rate limiting
6. ✅ قم بتحديث ملف `.env` مع متغيرات البيئة الحقيقية / Update `.env` with real environment variables

### الأمان / Security

- ⚠️ لا تشارك ملف `.env` مع أحد / Never share `.env` file
- ⚠️ ملف `.env` مضاف إلى `.gitignore` / `.env` is added to `.gitignore`
- ⚠️ غيّر كلمة مرور الأدمن فوراً / Change admin password immediately
- ⚠️ استخدم كلمات مرور قوية / Use strong passwords

---

## 📞 الدعم / Support

إذا واجهت أي مشاكل / If you face any issues:

1. راجع قسم استكشاف الأخطاء / Check Troubleshooting section
2. تأكد من اتباع جميع خطوات التثبيت / Ensure you followed all installation steps
3. تحقق من إصدارات Node.js و npm / Check Node.js and npm versions

---

## 📄 الترخيص / License

هذا المشروع مملوك لـ Smiley Dental Clinic.
This project is owned by Smiley Dental Clinic.

---

## 🙏 شكر وتقدير / Acknowledgments

- Next.js team
- Prisma team
- shadcn/ui team
- جميع المساهمين / All contributors

---

**تم التطوير بـ ❤️ لخدمة المجتمع**
**Developed with ❤️ to serve the community**
