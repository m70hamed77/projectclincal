# 🚀 تعليمات التشغيل والنشر على Vercel

## 📦 الخطوة 0: إعداد قاعدة البيانات (Neon PostgreSQL)

### ⭐ خطوة مهمة جداً - قم بها أولاً!

1. اذهب إلى https://neon.tech
2. أنشئ حساب مجاني (Sign up)
3. اضغط "Create a project"
4. أدخل اسم المشروع (مثلاً: `dentistry-platform`)
5. انتظر حتى يتم إنشاء قاعدة البيانات
6. انسخ Connection String من لوحة التحكم:
   ```
   postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
7. احفظ هذا الرابط - سنحتاجه في الخطوات التالية!

---

## 📦 الخطوة 1: تحميل المشروع

```bash
# 1. افتح VS Code وانتقل للمجلد المطلوب
cd D:/dentistry

# 2. استنساخ المشروع (من GitHub)
git clone <your-repo-url>
cd dentistry

# أو إذا كان المشروع موجوداً فعلاً، فقط قم بتحميل الملفات
```

## ⚙️ الخطوة 2: إعداد البيئة المحلية

```bash
# 1. تثبيت المكتبات
npm install

# 2. نسخ ملف البيئة المحلي
cp .env.local.example .env

# 3. تحرير ملف .env وإضافة DATABASE_URL
# استخدم VS Code لفتح .env وعدّل:
# DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 4. توليد Prisma Client
npx prisma generate

# 5. مزامنة قاعدة البيانات (إنشاء الجداول)
npx prisma db push
```

### ✅ تأكد من نجاح الخطوات:
- بعد `npx prisma generate` يجب أن ترى: `✔ Generated Prisma Client`
- بعد `npx prisma db push` يجب أن ترى: `✔ Your database is now in sync`

## 🏃 الخطوة 3: تشغيل المشروع محلياً

```bash
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 🌐 الخطوة 4: رفع المشروع على GitHub

### 4.1 إنشاء مستودع جديد على GitHub
1. اذهب إلى https://github.com/new
2. أنشئ مستودع جديد (مثلاً: `dentistry-platform`)
3. لا تقم بإضافة README أو .gitignore (المشروع يحتوي عليها بالفعل)

### 4.2 ربط المشروع مع GitHub

```bash
# 1. إعداد Git (مرة واحدة فقط)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 2. إضافة الملفات
git add .

# 3. الالتزام بالتغييرات
git commit -m "Initial commit - Dentistry Platform with Neon PostgreSQL"

# 4. ربط المستودع (استبدل <your-username> و <repo-name>)
git remote add origin https://github.com/<your-username>/<repo-name>.git

# 5. رفع إلى GitHub (الفرع الرئيسي)
git branch -M main
git push -u origin main
```

---

## 🚀 الخطوة 5: النشر على Vercel

### 5.1 ربط المشروع على Vercel

#### الطريقة: من GitHub (أسهل وأسرع)
1. اذهب إلى https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط "Add New" > "Project"
4. اختر مستودع `dentistry-platform` من GitHub
5. Vercel سيكتشف Next.js تلقائياً

### 5.2 إعداد Environment Variables على Vercel

في صفحة Project Settings > Environment Variables، أضف:

| المتغير | القيمة | البيئة |
|---------|-------|---------|
| `DATABASE_URL` | رابط Neon PostgreSQL (من الخطوة 0) | All |
| `NODE_ENV` | `production` | All |
| `EMAIL_USER` | (اختياري) بريد Gmail | All |
| `EMAIL_PASS` | (اختياري) App Password | All |

**مثال كامل لـ DATABASE_URL:**
```
postgresql://neondb_owner:YOUR_PASSWORD@ep-young-base-amribtx8-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 5.3 نشر المشروع

1. عد إلى صفحة Projects
2. اضغط "Deploy" بجانب المشروع
3. انتظر حتى يكتمل البناء (عادة 2-3 دقائق)
4. سيحصل Vercel على عنوان مثل:
   ```
   https://dentistry-platform.vercel.app
   ```

---

## ✅ التحقق من نجاح النشر

بعد اكتمال النشر:

1. افتح الرابط الخاص بمشروعك على Vercel
2. تأكد من:
   - ✅ الصفحة الرئيسية تعمل
   - ✅ التسجيل والدخول يعملان
   - ✅ لا توجد أخطاء في Console

---

## ⚠️ المشاكل المحتملة والحلول

### ❌ مشكلة: `DATABASE_URL` not found
**السبب:** المتغير غير مضاف في Environment Variables
**الحل:**
- أضف `DATABASE_URL` في `.env` محلياً
- أضف `DATABASE_URL` في Vercel Environment Variables

### ❌ مشكلة: Connection to database failed
**السبب:** رابط Neon غير صحيح أو قاعدة البيانات معطلة
**الحل:**
1. اذهب إلى https://console.neon.tech
2. تأكد من أن المشروع نشط (Active)
3. انسخ Connection String مرة أخرى
4. تأكد من استخدام `sslmode=require`

### ❌ مشكلة: Prisma Client not generated
**الحل:**
```bash
npx prisma generate
```

### ❌ مشكلة: TypeScript errors
**الحل:**
```bash
npm run lint
```

### ❌ مشكلة: Build failed on Vercel
**الحلول:**
1. تحقق من Logs في Vercel (Build Log)
2. تأكد من وجود جميع المتغيرات البيئية
3. تأكد من أن Prisma schema متوافق مع PostgreSQL
4. تأكد من أن الحساب على Neon نشط

### ❌ مشكلة: Port 3000 already in use
**الحل محلياً:**
```bash
# على Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# على Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### ❌ مشكلة: Neon database suspended (معطل)
**السبب:** حساب Neon المجاني قد يتم تعطيله بسبب عدم النشاط
**الحل:**
1. اذهب إلى https://console.neon.tech
2. افتح المشروع
3. إذا كان معطل (Suspended)، اضغط "Resume"
4. انتظر حتى يصبح نشطاً (Active)

---

## 📝 ملاحظات مهمة

### ✅ ما سيتم رفعه إلى GitHub:
- ✅ كل ملفات المشروع (ما عدا الملفات المحمية بـ .gitignore)
- ✅ الكود المصدري
- ✅ ملفات التكوين (package.json, tsconfig.json, etc.)
- ✅ ملف Prisma schema
- ✅ ملفات التوثيق (README.md, DEPLOYMENT.md)

### ❌ ما لن يُرفع إلى GitHub (محمي):
- ❌ `.env` (المتغيرات البيئية) ⚠️ **مهم جداً**
- ❌ `.env.local` (المتغيرات المحلية)
- ❌ `node_modules/` (المكتبات)
- ❌ `.next/` (ملفات البناء)
- ❌ السجلات (logs)

### 💡 نصيحة ذهبية:
**نفس قاعدة البيانات (Neon) تستخدم:**
- ✅ على جهازك المحلي (localhost:3000)
- ✅ على Vercel (production)
- ✅ البيانات مشتركة ومزامنة!

---

## 🔄 التحديثات المستقبلية

بعد أي تعديلات على الكود:

```bash
# 1. إضافة الملفات المعدلة
git add .

# 2. الالتزام بالتغييرات
git commit -m "وصف التغييرات"

# 3. رفع إلى GitHub
git push

# Vercel سيقوم بالترتيب والنشر تلقائياً! 🚀
```

**ملاحظة:** لا حاجة لتشغيل `npx prisma db push` بعد كل تحديث، فقط إذا قمت بتغيير `prisma/schema.prisma`.

---

## 📱 إدارة قاعدة البيانات على Neon

1. اذهب إلى https://console.neon.tech
2. اختر مشروعك
3. من هنا يمكنك:
   - ✅ رؤية البيانات (SQL Editor)
   - ✅ تشغيل استعلامات SQL
   - ✅ إدارة المستخدمين
   - ✅ مشاهدة الـ logs
   - ✅ مراقبة استخدام الموارد

---

## 📊 ملخص سريع

| البيئة | قاعدة البيانات | DATABASE_URL |
|-------|--------------|-------------|
| Local (VS Code) | Neon PostgreSQL | من `.env` |
| Vercel (Production) | نفس قاعدة Neon | من Vercel Env Variables |

---

## 🎯 خطوات سريعة:

```bash
# 1. إعداد Neon (مرة واحدة فقط)
# https://neon.tech → Create Project → Copy Connection String

# 2. إعداد المشروع
npm install
npx prisma generate
npx prisma db push

# 3. تحديث .env بالـ DATABASE_URL من Neon

# 4. تشغيل محلياً
npm run dev

# 5. رفع إلى GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 6. النشر على Vercel
# - ربط المستودع من GitHub
# - إضافة DATABASE_URL في Environment Variables
# - Deploy! 🚀
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Logs في Vercel
2. تحقق من Neon Console (هل المشروع نشط؟)
3. تأكد من Environment Variables
4. تأكد من أن DATABASE_URL صحيح
5. تأكد من تشغيل `npx prisma generate`

---

**ملاحظة:** هذا الملف فقط للإرشادات، يمكنك حذفه إذا أردت.
