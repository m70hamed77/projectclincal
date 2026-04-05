# 🚀 دليل تشغيل المشروع محلياً على Visual Studio Code

## ⚠️ المشاكل التي تواجهها وحلولها

### المشكلة 1: خطأ Turbopack (FATAL: An unexpected Turbopack error occurred)
**الحل:** لا تستخدم Turbopack على Windows، استخدم Webpack بدلاً منه

### المشكلة 2: POST /api/auth/login 500 (Internal Server Error)
**الحل:** قاعدة البيانات غير مهيأة

### المشكلة 3: GET /img/login-bg.jpg 404
**الحل:** صورة الخلفية غير موجودة (اختياري)

---

## ✅ خطوات الإعداد الصحيحة

### الخطوة 1: إنشاء ملف .env

في مجلد المشروع الرئيسي، أنشئ ملف اسمه `.env` (بدون أي امتداد) وأضف المحتوى التالي:

```env
# Database Configuration (SQLite for local development)
DATABASE_URL="file:./db/dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Email Configuration (Optional - for production)
RESEND_API_KEY=""

# SMS Configuration (Optional - for production)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Environment
NODE_ENV="development"
```

### الخطوة 2: إنشاء مجلد قاعدة البيانات

في مجلد المشروع الرئيسي، أنشئ مجلد اسمه `db`:

```
/home/z/my-project/db/
```

### الخطوة 3: تثبيت الحزم

افتح terminal في VS Code (Ctrl + `) وشغل:

```bash
# إذا كنت تستخدم npm
npm install

# أو إذا كنت تستخدم yarn
yarn install

# أو إذا كنت تستخدم bun (موصى به)
bun install
```

### الخطوة 4: إعداد قاعدة البيانات

```bash
# إذا كنت تستخدم npm
npm run db:push

# أو إذا كنت تستخدم yarn
yarn db:push

# أو إذا كنت تستخدم bun (موصى به)
bun run db:push
```

### الخطوة 5: إنشاء حساب Admin

```bash
# إذا كنت تستخدم npm
npm run create-admin:js

# أو إذا كنت تستخدم yarn
yarn create-admin:js

# أو إذا كنت تستخدم bun
bun run create-admin:js
```

أو يمكنك استخدام TypeScript (أسرع):

```bash
npm run create-admin
# أو
yarn create-admin
# أو
bun run create-admin
```

### الخطوة 6: تشغيل المشروع

**مهم:** استخدم أمر التطوير الذي يُعطل Turbopack:

```bash
# إذا كنت تستخدم npm
npm run dev

# أو إذا كنت تستخدم yarn
yarn dev

# أو إذا كنت تستخدم bun (موصى به)
bun run dev
```

**لا تستخدم:** `npm run dev:turbo` أو `next dev` مباشرة لأنهم يستخدمون Turbopack

---

## 🔐 بيانات الدخول

بعد إتمام كل الخطوات بنجاح، استخدم هذه البيانات للدخول:

```
URL: http://localhost:3000
Email: admin@smileydental.com
Password: Admin@123456
```

---

## 🛠️ حل المشاكل الشائعة

### 1. خطأ: "Cannot find module 'bcryptjs'"

**الحل:**
```bash
npm install bcryptjs @types/bcryptjs
```

### 2. خطأ: "Prisma Client is not initialized"

**الحل:**
```bash
npm run db:generate
npm run db:push
```

### 3. خطأ: "FATAL: An unexpected Turbopack error occurred"

**الحل:** تأكد من استخدام `npm run dev` أو `bun run dev` (الذي يُعطل Turbopack)

### 4. خطأ: "POST /api/auth/login 500"

**الحل:**
1. تأكد من أن ملف `.env` موجود
2. تأكد من تشغيل `bun run db:push`
3. تأكد من إنشاء حساب admin

### 5. خطأ: "GET /img/login-bg.jpg 404"

**الحل:** هذه مشكلة صورة خلفية غير موجودة. يمكنك:
- إضافة صورة في `public/img/login-bg.jpg`
- أو تجاهلها (لن تؤثر على الوظائف)

---

## 📂 هيكل المشروع المطلوب

```
smiley-dental-clinic/
├── .env                    ⭐ ملف الإعدادات (يجب إنشاؤه)
├── db/                     ⭐ مجلد قاعدة البيانات
│   └── dev.db              ⭐ قاعدة البيانات (تُنشأ تلقائياً)
├── public/
│   └── img/
│       └── login-bg.jpg    (اختياري - صورة الخلفية)
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── package.json
├── prisma/
│   └── schema.prisma
└── next.config.ts
```

---

## 🎯 الطريقة السريعة (Windows)

### الخيار 1: استخدام ملف الباتش الموجود

انقر مرتين على: `SETUP_SQLITE.bat`

هذا الملف سيقوم بـ:
1. ✅ إنشاء مجلد `db`
2. ✅ تثبيت الحزم
3. ✅ إنشاء قاعدة بيانات SQLite
4. ✅ إنشاء Admin
5. ✅ تشغيل السيرفر

### الخيار 2: التشغيل اليدوي (التحكم الكامل)

1. أنشئ ملف `.env` بالمحتوى أعلاه
2. افتح VS Code
3. افتح terminal (Ctrl + `)
4. شغل الأوامر بالترتيب:

```bash
# التثبيت
bun install

# إعداد قاعدة البيانات
bun run db:push

# إنشاء Admin
bun run create-admin:js

# التشغيل (بدون Turbopack)
bun run dev
```

---

## 🚫 ما لا تفعله

❌ **لا تستخدم:**
- `npm run dev:turbo` (يستخدم Turbopick - قد يسبب أخطاء على Windows)
- `next dev` مباشرة (يستخدم Turbopack في Next.js 16)
- تشغيل المشروع بدون `.env`
- تشغيل المشروع بدون `bun run db:push`

✅ **استخدم دائماً:**
- `npm run dev` أو `bun run dev` (يُعطل Turbopack)
- قاعدة بيانات SQLite محلية للتطوير
- ملف `.env` صحيح

---

## 🔍 التحقق من الإعداد

### 1. التحقق من قاعدة البيانات

```bash
# افتح Prisma Studio
npm run db:studio
# أو
bun run db:studio
```

افتح `http://localhost:5555` في المتصفح

### 2. التحقق من حساب Admin

```bash
npm run check-admin
# أو
bun run check-admin
```

### 3. التحقق من الاتصال بقاعدة البيانات

```bash
npm run test-db
# أو
bun run test-db
```

---

## 🎨 ملاحظة حول الصور

صورة الخلفية `/img/login-bg.jpg` غير موجودة، لكنها اختيارية. إذا أردت إضافتها:

1. أنشئ مجلد: `public/img/`
2. ضع صورة باسم: `login-bg.jpg`
3. سيتم عرضها تلقائياً في صفحة تسجيل الدخول

أو يمكنك:
- تعديل ملف `src/app/auth/login/page.tsx`
- إزالة أو تغيير مسار الصورة
- استخدام خلفية متدرجة بدلاً من الصورة

---

## 💾 حفظ البيانات

باستخدام SQLite:
- البيانات تُحفظ في ملف `db/dev.db`
- يمكن نسخ هذا الملف للنسخ الاحتياطي
- يمكن حذفه وإعادة الإنشاء عبر `bun run db:push`

---

## 🆘 الدعم

إذا واجهت مشكلة:

1. **تحقق من السجلات:** انظر في terminal VS Code
2. **أعد تشغيل السيرفر:** أوقف التشغيل (Ctrl + C) وشغل `bun run dev` مرة أخرى
3. **حذف .next وأعد البناء:**
   ```bash
   rm -rf .next
   bun run dev
   ```
4. **أعد إنشاء قاعدة البيانات:**
   ```bash
   rm db/dev.db
   bun run db:push
   bun run create-admin:js
   ```

---

## ✅ قائمة التحقق النهائية

قبل البدء، تأكد من:

- [ ] ملف `.env` موجود ومُعدّل
- [ ] مجلد `db/` موجود
- [ ] الحزم مثبتة (`bun install`)
- [ ] قاعدة البيانات مُنشأة (`bun run db:push`)
- [ ] حساب Admin مُنشأ (`bun run create-admin:js`)
- [ ] السيرفر يعمل (`bun run dev`)
- [ ] يمكن الدخول إلى `http://localhost:3000`

---

**🎉 تهانينا! المشروع جاهز الآن!**

افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

سجل الدخول باستخدام:
```
Email: admin@smileydental.com
Password: Admin@123456
```
