# 🚀 دليل إعداد المشروع على Visual Studio Code (شرح بالعربي)

## ⚠️ المشاكل التي تواجهك وحلولها

### المشكلة 1: خطأ Turbopack
```
FATAL: An unexpected Turbopack error occurred
```
**السبب:** Turbopack غير مستقر على Windows
**الحل:** استخدم أمر `npm run dev` أو `bun run dev` (هذه الأوامر تُعطل Turbopack)

### المشكلة 2: خطأ 500 عند تسجيل الدخول
```
POST /api/auth/login 500
```
**السبب:** قاعدة البيانات غير مُنشأة
**الحل:** شغل `bun run db:push` ثم `bun run create-admin:js`

### المشكلة 3: صورة الخلفية مفقودة
```
GET /img/login-bg.jpg 404
```
**السبب:** صورة الخلفية غير موجودة
**الحل:** هذه مشكلة اختيارية، يمكنك تجاهلها أو إضافة صورة

---

## ✅ خطوات الإعداد الصحيحة (بالعربي)

### الخطوة 1: إنشاء ملف .env

1. افتح مجلد المشروع في VS Code
2. أنشئ ملف جديد اسمه `.env` (نقطة + env)
3. انسخ المحتوى التالي وضعه داخل الملف:

```env
# Database Configuration (SQLite for local development)
DATABASE_URL="file:./db/dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production-min-32-chars-long"

# Email Configuration (Optional - for production)
RESEND_API_KEY=""

# SMS Configuration (Optional - for production)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Environment
NODE_ENV="development"
```

**مهم:** احفظ الملف (Ctrl + S)

---

### الخطوة 2: تثبيت الحزم

1. افتح terminal في VS Code (اضغط `Ctrl + ``)
2. شغل الأمر التالي:

```bash
bun install
```

أو إذا كنت تستخدم npm:
```bash
npm install
```

انتظر حتى ينتهي التثبيت

---

### الخطوة 3: إنشاء قاعدة البيانات

شغل الأمر التالي:

```bash
bun run db:push
```

أو مع npm:
```bash
npm run db:push
```

**ما سينتقص:**
- إنشاء ملف قاعدة البيانات في `db/dev.db`
- إنشاء جميع الجداول المطلوبة

---

### الخطوة 4: إنشاء حساب Admin

شغل الأمر التالي:

```bash
bun run create-admin:js
```

أو مع npm:
```bash
npm run create-admin:js
```

**ما سينتقص:**
- إنشاء حساب admin في قاعدة البيانات
- البريد: `admin@smileydental.com`
- كلمة المرور: `Admin@123456`

---

### الخطوة 5: تشغيل المشروع

**مهم جدًا:** استخدم هذا الأمر فقط (يُعطل Turbopack):

```bash
bun run dev
```

أو مع npm:
```bash
npm run dev
```

**لا تستخدم:**
- ❌ `npm run dev:turbo`
- ❌ `next dev`
- ❌ `npm run dev:legacy`

---

### الخطوة 6: فتح المتصفح

افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

سجل الدخول باستخدام:
```
البريد الإلكتروني: admin@smileydental.com
كلمة المرور: Admin@123456
```

---

## 🎯 الطريقة السريعة (ملف الباتش)

### الخيار الأسرع: انقر مرتين على
```
SETUP_SQLITE.bat
```

هذا الملف سينفذ كل شيء تلقائياً!

---

## 🛠️ حل المشاكل الشائعة

### مشكلة: "Cannot find module 'bcryptjs'"

**الحل:**
```bash
bun install bcryptjs @types/bcryptjs
```

### مشكلة: "Prisma Client is not initialized"

**الحل:**
```bash
bun run db:generate
bun run db:push
```

### مشكلة: "FATAL: An unexpected Turbopack error occurred"

**الحل:** استخدم `bun run dev` فقط (لا تستخدم أي أمر آخر)

### مشكلة: "POST /api/auth/login 500"

**الحل:**
1. تأكد من أن ملف `.env` موجود
2. شغل `bun run db:push`
3. شغل `bun run create-admin:js`
4. أعد تشغيل السيرفر

### مشكلة: الصفحة لا تفتح

**الحل:**
1. أوقف السيرفر (Ctrl + C)
2. احذف مجلد `.next`
3. شغل `bun run dev` مرة أخرى

---

## 📂 هيكل المجلدات المطلوب

تأكد من وجود هذا الهيكل:

```
smiley-dental-clinic/
├── .env                    ← يجب إنشاؤه
├── db/                     ← مجلد قاعدة البيانات
│   └── dev.db              ← يُنشأ تلقائياً
├── public/
│   └── img/
│       └── login-bg.jpg    (اختياري)
├── src/
├── package.json
└── prisma/
    └── schema.prisma
```

---

## 🔍 التحقق من الإعداد

### 1. التحقق من قاعدة البيانات

شغل:
```bash
bun run db:studio
```

ثم افتح: `http://localhost:5555`

### 2. التحقق من حساب Admin

شغل:
```bash
bun run check-admin
```

### 3. التحقق من الاتصال بقاعدة البيانات

شغل:
```bash
bun run test-db
```

---

## ✅ قائمة التحقق

قبل البدء، تأكد من:

- [ ] ملف `.env` موجود ومُعدّل
- [ ] الحزم مثبتة (`bun install`)
- [ ] قاعدة البيانات مُنشأة (`bun run db:push`)
- [ ] حساب Admin مُنشأ (`bun run create-admin:js`)
- [ ] السيرفر يعمل (`bun run dev`)
- [ ] المتصفح يفتح `http://localhost:3000`

---

## 💾 حفظ البيانات

بياناتك تُحفظ في ملف `db/dev.db`

للنسخ الاحتياطي:
```bash
# نسخ ملف قاعدة البيانات
copy db\dev.db db\dev-backup.db
```

للبدء من جديد:
```bash
# حذف قاعدة البيانات
del db\dev.db

# إعادة الإنشاء
bun run db:push
bun run create-admin:js
```

---

## 🆨 عند مواجهة أي مشكلة

1. **اقرأ السجلات في terminal**
2. **أعد تشغيل السيرفر:** Ctrl + C ثم `bun run dev`
3. **حذف .next وأعد البناء:**
   ```bash
   rmdir /s /q .next
   bun run dev
   ```
4. **أعد إنشاء قاعدة البيانات:**
   ```bash
   del db\dev.db
   bun run db:push
   bun run create-admin:js
   ```

---

## 🎉 مبروك! المشروع جاهز!

افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

سجل الدخول:
```
البريد: admin@smileydental.com
كلمة المرور: Admin@123456
```

---

## 📞 للحصول على مساعدة

إذا استمرت المشكلة:

1. تأكد من اتباع كل الخطوات بالترتيب
2. تحقق من وجود ملف `.env`
3. تحقق من وجود مجلد `db/`
4. اقرأ رسائل الخطأ في terminal
5. حاول استخدام ملف `SETUP_SQLITE.bat` بدلاً من الإعداد اليدوي
