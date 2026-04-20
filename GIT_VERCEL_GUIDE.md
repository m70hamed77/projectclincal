# 🚀 دليل Git و Vercel - الخطوة بخطوة

## 📋 مقدمة

هذا الدليل يشرح خطوات رفع المشروع على GitHub والنشر على Vercel بشكل مبسط وواضح.

**المتطلبات:**
- حساب على GitHub (مجاني)
- حساب على Vercel (مجاني)
- المشروع على جهازك في VS Code

---

## 🎯 الجزء الأول: Git (رفع المشروع على GitHub)

### الخطوة 1: إعداد Git (مرة واحدة فقط)

افتح Terminal في VS Code (`Ctrl + ~`) وشغل:

```bash
# إعداد اسمك
git config user.name "Mohamed"

# إعداد بريدك الإلكتروني (استخدم نفس بريد GitHub)
git config user.email "mohamed7744650@gmail.com"
```

### الخطوة 2: تهيئة المستودع المحلي

إذا لم تكن قد فعلت ذلك من قبل:

```bash
# تهيئة مستودع Git جديد (مرة واحدة فقط)
git init
```

### الخطوة 3: إنشاء مستودع جديد على GitHub

1. افتح المتصفح واذهب إلى: https://github.com/new
2. أدخل اسم المستودع: `dentistry-platform`
3. **مهم:** لا تقم بإضافة:
   - ❌ README.md (المشروع يحتوي عليه)
   - ❌ .gitignore (المشروع يحتوي عليه)
4. اختر "Public" أو "Private" (Private أفضل للأمان)
5. اضغط "Create repository"

**بعد الإنشاء، انسخ رابط المستودع، مثلاً:**
```
https://github.com/YOUR_USERNAME/dentistry-platform.git
```

### الخطوة 4: ربط المشروع المحلي مع GitHub

افتح Terminal في VS Code:

```bash
# إضافة الملفات للتتبع
git add .

# الالتزام بالتغييرات (Commit)
git commit -m "Initial commit - Dentistry Platform with Neon PostgreSQL"

# ربط المستودع البعيد (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dentistry-platform.git

# رفع إلى GitHub (الفرع الرئيسي)
git branch -M main
git push -u origin main
```

**✅ إذا نجح كل شيء، ستشاهد:**
```
Enumerating objects: 500, done.
Counting objects: 100% (500/500), done.
...
To https://github.com/YOUR_USERNAME/dentistry-platform.git
 * [new branch]      main -> main
```

### الخطوة 5: التحقق من الرفع

اذهب إلى https://github.com/YOUR_USERNAME/dentistry-platform

**تأكد من:**
- ✅ جميع الملفات ظاهرة
- ✅ ملف `.env` **غير** موجود (مهم جداً!)
- ✅ `node_modules/` **غير** موجود
- ✅ `.next/` **غير** موجود

---

## 🌐 الجزء الثاني: Vercel (النشر على السحابة)

### الخطوة 1: تسجيل الدخول إلى Vercel

1. اذهب إلى https://vercel.com
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"
4. تخويل Vercel للوصول إلى حساب GitHub

### الخطوة 2: إنشاء مشروع جديد على Vercel

1. بعد تسجيل الدخول، اضغط "Add New" > "Project"
2. سيقوم Vercel بعرض مستودعات GitHub الخاصة بك
3. ابحث عن `dentistry-platform` في القائمة
4. اضغط "Import"

### الخطوة 3: إعداد المشروع

Vercel سيكتشف Next.js تلقائياً وعرض الإعدادات:

| الخيار | القيمة |
|-------|-------|
| **Framework Preset** | Next.js (محدد تلقائياً) |
| **Root Directory** | `./` (اتركه كما هو) |
| **Build Command** | `npm run build` (محدد تلقائياً) |
| **Output Directory** | `.next` (محدد تلقائياً) |

### الخطوة 4: إضافة Environment Variables (مهم جداً!)

في صفحة إعداد المشروع، اضغط "Environment Variables"

أضف المتغيرات التالية (انسخها من ملف `.env` الخاص بك):

#### المتغير 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** انسخه بالكامل من `.env`:
  ```
  postgresql://neondb_owner:npg_EX1Nn6DYoLwJ@ep-young-base-amribtx8-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
  ```
- **Environment:** All (Production, Preview, Development)
- **اضغط:** Add

#### المتغير 2: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** All
- **اضغط:** Add

#### المتغير 3: EMAIL_USER
- **Name:** `EMAIL_USER`
- **Value:** `mohamed7744650@gmail.com`
- **Environment:** All
- **اضغط:** Add

#### المتغير 4: EMAIL_PASS
- **Name:** `EMAIL_PASS`
- **Value:** `orhy vuuj bnsj iaew`
- **Environment:** All
- **اضغط:** Add

### الخطوة 5: النشر

1. بعد إضافة جميع المتغيرات، اضغط "Deploy"
2. انتظر حتى يكتمل البناء (2-3 دقائق)
3. سترى سجل البناء (Build Log)

**✅ عند نجاح البناء، سترى:**
```
✅ Build Completed Successfully
✅ Deployed to: https://dentistry-platform.vercel.app
```

### الخطوة 6: اختبار الموقع

1. اضغط على الرابط الذي أعطاك Vercel
2. اختبر:
   - ✅ الصفحة الرئيسية تعمل
   - ✅ يمكن تسجيل حساب جديد
   - ✅ تسجيل الدخول يعمل
   - ✅ لا توجد أخطاء

---

## 🔄 التحديثات المستقبلية

بعد أي تغييرات في الكود:

### على جهازك:

```bash
# إضافة الملفات المعدلة
git add .

# الالتزام بالتغييرات
git commit -m "وصف التغييرات"

# رفع إلى GitHub
git push
```

### على Vercel:

- Vercel سيكتشف الـ push تلقائياً
- سيقوم بالبناء والنشر تلقائياً
- **لا حاجة للقيام بأي شيء يدوياً!** 🚀

---

## ⚠️ المشاكل الشائعة وحلولها

### ❌ مشكلة: "Authentication failed"

**السبب:** GitHub Token منتهي أو مفقود

**الحل:**
1. اذهب إلى GitHub Settings > Developer Settings > Personal Access Tokens
2. أنشئ Token جديد
3. استخدمه في Terminal:
   ```bash
   git remote set-url origin https://TOKEN@github.com/YOUR_USERNAME/repo.git
   ```

### ❌ مشكلة: "Build failed" على Vercel

**الحل:**
1. افتح Vercel > Project > Deployments
2. اضغط على الـ build الفاشل
3. اقرأ الـ Log
4. تحقق من:
   - ✅ Environment Variables موجودة
   - ✅ Prisma generate نجح
   - ✅ لا توجد أخطاء TypeScript

### ❌ مشكلة: "DATABASE_URL not found"

**الحل:**
1. تأكد من إضافة المتغير في Vercel Environment Variables
2. تأكد من الاسم (`DATABASE_URL`) بالضبط
3. تأكد من القيمة مكتوبة بالكامل بدون مسافات زائدة

### ❌ مشكلة: "Neon database suspended"

**الحل:**
1. اذهب إلى https://console.neon.tech
2. ابحث عن مشروعك
3. إذا كان "Suspended"، اضغط "Resume"
4. انتظر حتى يصبح "Active"

---

## 📊 ملخص سريع

### خطوات Git (مرة واحدة):
1. ✅ `git init`
2. ✅ `git add .`
3. ✅ `git commit -m "Initial commit"`
4. ✅ `git remote add origin https://github.com/YOUR_USERNAME/repo.git`
5. ✅ `git push -u origin main`

### خطوات Vercel (مرة واحدة):
1. ✅ ربط المستودع من GitHub
2. ✅ إضافة Environment Variables
3. ✅ Deploy

### خطوات التحديث (كل مرة):
1. ✅ `git add .`
2. ✅ `git commit -m "Update"`
3. ✅ `git push`
4. ✅ Vercel ينشر تلقائياً!

---

## 🎯 التحقق النهائي

بعد كل شيء، تأكد من:

| التحقق | الوضع |
|-------|-------|
| GitHub: المستودع موجود | ✅ |
| GitHub: الملفات ظاهرة | ✅ |
| GitHub: `.env` غير موجود | ✅ |
| Vercel: المشروع منشور | ✅ |
| Vercel: Build ناجح | ✅ |
| Vercel: الموقع يعمل | ✅ |
| Database: البيانات تُحفظ | ✅ |

---

## 📞 المساعدة

إذا واجهت مشاكل:
1. تحقق من Terminal errors
2. تحقق من Vercel Logs
3. تحقق من Neon Console
4. راجع هذا الدليل

---

**ملاحظة أخيرة:**
- لا تقم بمشاركة `.env` مع أحد
- غيّر كلمة مرور الأدمن فوراً
- راقب الاستخدام والـ logs بانتظام

---

**جاهز للإطلاق! 🚀✨**

---

**تم التحديث:** 2025
**المشروع:** Smiley Dental Clinic
