# 🚀 دليل نشر المشروع على Vercel

## 📋 المتطلبات الأساسية

1. **حساب GitHub** - لرفع الكود
2. **حساب Vercel** - للاستضافة
3. **حساب Neon** - لقاعدة بيانات PostgreSQL
4. **حساب Gmail مع App Password** - للإيميلات

---

## 🔧 الخطوة 1: إعداد البيئة في Vercel

### 1.1 إضافة متغيرات البيئة

اذهب إلى: `Vercel Dashboard` → `Project Settings` → `Environment Variables`

أضف المتغيرات التالية:

```bash
#DATABASE_URL
postgresql://neondb_owner:npg_EX1Nn6DYoLwJ@ep-young-base-amribtx8-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

#EMAIL_USER
mohamed7744650@gmail.com

#EMAIL_PASS
orhy vuuj bnsj iaew

#EMAIL_FROM_NAME
Smiley Dental Clinic

#EMAIL_REPLY_TO
mohamed7744650@gmail.com

#NODE_ENV
production

#NEXTAUTH_SECRET
smiley-dental-clinic-secret-key-change-in-production-2024

#NEXTAUTH_URL
https://your-app.vercel.app

#MAX_FILE_SIZE
10485760

#ALLOWED_IMAGE_FORMATS
image/jpeg,image/png,image/webp,image/gif

#RATE_LIMIT_MAX
60

#RATE_LIMIT_WINDOW
60000

#SESSION_MAX_AGE
2592000

#SESSION_UPDATE_AGE
86400

#OTP_EXPIRATION_MINUTES
10

#MAX_OTP_ATTEMPTS
3

#NEXT_PUBLIC_APP_URL
https://your-app.vercel.app

#NEXT_PUBLIC_API_URL
https://your-app.vercel.app/api
```

### 1.2 أين تضيف المتغيرات؟

✅ **Environment:** Production, Preview, Development (اختر الثلاثة كلهم)

---

## 📤 الخطوة 2: رفع الكود على GitHub

### 2.1 تهيئة Git (إذا لم يكن مهيأ)

```bash
cd /home/z/my-project
git init
git add .
git commit -m "Initial commit - Smiley Dental Clinic"
```

### 2.2 رفع إلى GitHub

1. أنشئ **repository جديد** على GitHub
2. شغّل الأوامر التالية:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smiley-dental-clinic.git
git push -u origin main
```

---

## 🚀 الخطوة 3: ربط المشروع بـ Vercel

### 3.1 إنشاء مشروع جديد

1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط **"Add New..."** → **"Project"**
3. اربط حساب GitHub الخاص بك
4. اختر Repository: `smiley-dental-clinic`

### 3.2 إعدادات البناء

- **Framework Preset:** Next.js
- **Root Directory:** `./` (اتركه كما هو)
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`

### 3.3 تفعيل Deploy

اضغط **"Deploy"** وانتظر حتى ينتهي البناء!

---

## ⚙️ الخطوة 4: إعدادات ما بعد النشر

### 4.1 تحديث NEXTAUTH_URL

بعد النشر الأول:
1. انسخ رابط التطبيق من Vercel
2. عدّل المتغير `NEXTAUTH_URL` في Vercel:
   - من: `http://localhost:3000`
   - إلى: `https://your-app.vercel.app`

### 4.2 تحديث NEXT_PUBLIC_APP_URL

عدّل المتغير `NEXT_PUBLIC_APP_URL`:
- من: `http://localhost:3000`
- إلى: `https://your-app.vercel.app`

### 4.3 إعادة النشر

بعد تعديل المتغيرات، اضغط **"Redeploy"** عشان التغييرات تتفعل!

---

## ✅ التحقق من النشر

### 5.1 اختبار الاتصال بقاعدة البيانات

افتح التطبيق واتأكد من:
- ✅ تسجيل الدخول يعمل
- ✅ إنشاء حساب جديد يعمل
- ✅ صفحة Admin تعرض الإحصائيات

### 5.2 اختبار الإيميلات

سجل حساب جديد وتأكد من:
- ✅ وصول كود التحقق على Gmail
- ✅ الإيميل بالشكل الصحيح

### 5.3 اختبار الترجمات

تأكد من:
- ✅ تغيير اللغة يعمل
- ✅ كل النصوص بالعربي والإنجليزي

---

## 🐛 حل المشاكل الشائعة

### مشكلة: فشل في `prisma generate`

**الحل:**
1. تأكد من `DATABASE_URL` صحيح في Vercel
2. تأكد من PostgreSQL يعمل على Neon

### مشكلة: صفحة بيضاء بعد النشر

**الحل:**
1. تحقق من الـ logs في Vercel
2. تأكد من كل متغيرات البيئة مضافة

### مشكلة: الإيميل لا يصل

**الحل:**
1. تأكد من App Password صحيح
2. تأكد من Gmail يسمح بالـ "Less secure apps" أو استخدم App Password
3. تحقق من الـ SPAM folder في Gmail

### مشكلة: NEXTAUTH session لا يعمل

**الحل:**
1. تأكد من `NEXTAUTH_SECRET` فريد وآمن
2. تأكد من `NEXTAUTH_URL` صحيح

---

## 📝 ملاحظات مهمة

### ⚠️ أمان البيانات

- ❌ **لا ترفع** ملف `.env` إلى GitHub
- ✅ **استخدم** `.env.example` فقط
- ✅ **أضف** كل المتغيرات يدوياً في Vercel

### 🔒 تغيير NEXTAUTH_SECRET

في Production، استخدم سلسلة عشوائية طويلة:

```bash
# لتوليد secret آمن
openssl rand -base64 32
```

### 📊 مراقبة الأداء

استخدم:
- **Vercel Analytics** لمراقبة الزوار
- **Neon Dashboard** لمراقبة قاعدة البيانات
- **Vercel Logs** لرؤية الأخطاء

---

## 🎉 الخلاصة

بعد إكمال هذه الخطوات:
- ✅ المشروع منشور على Vercel
- ✅ قاعدة البيانات متصلة بـ Neon
- ✅ الإيميلات تعمل
- ✅ الترجمات تعمل
- ✅ كل شيء آمن وجاهز!

**مبروك! 🚀**
