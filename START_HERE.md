# 🦷 سمايلي لطب الأسنان - دليل التشغيل السريع

## 📋 المتطلبات الأساسية
- Node.js 18+
- Bun (موصى به)
- VS Code

## 🚀 خطوات التشغيل السريع

### 1️⃣ تثبيت الاعتمادات
```bash
cd /home/z/my-project
bun install
```

### 2️⃣ إعداد قاعدة البيانات
```bash
bun run db:push
```

### 3️⃣ تشغيل السيرفر
```bash
bun run dev
```

المشروع سيعمل على: `http://localhost:3000`

---

## 📁 هيكل المشروع

```
my-project/
├── src/
│   ├── app/          # صفحات Next.js
│   │   ├── auth/      # صفحات المصادقة
│   │   ├── dashboard/ # لوحة التحكم
│   │   ├── posts/      # البوستات
│   │   └── chat/       # المحادثات
│   ├── components/   # مكونات React
│   │   └── ui/         # مكونات shadcn/ui
│   ├── lib/          # دوال مساعدة
│   │   ├── db.ts       # Prisma Client
│   │   ├── auth.ts     # مصادقة المستخدم
│   │   └── password.ts  # كلمات المرور
│   └── hooks/        # React Hooks
├── prisma/
│   └── schema.prisma # قاعدة البيانات
├── public/         # ملفات ثابتة
├── scripts/        # سكريبات مساعدة
└── db/             # قاعدة بيانات SQLite
```

---

## 👤 بيانات الدخول التجريبية

### ✅ المستخدمين جاهزون:

1. **الأدمن**:
   - Email: `admin@smileydental.com`
   - Password: `Admin@123`
   - الحالة: ACTIVE

2. **الطالب**:
   - Email: `student@test.com`
   - Password: `Student@123`
   - الحالة: ACTIVE
   - موثّق ومقبول

3. **المريض**:
   - Email: `patient@test.com`
   - Password: `Patient@123`
   - الحالة: ACTIVE

### 📋 بيانات الاختبار الحالية:

- **Post ID الأخير**: `cmnag2f3q0008p6m2s9t3kl1e`
- **Application ID**: `cmnag2f3r000ap6m223080g8n`

---

## 🛠️ الأوامر المفيدة

```bash
# تشغيل السيرفر (الطريقة القياسية)
bun run dev

# تشغيل بدون Turbopack
bun run dev:turbo

# تحديث قاعدة البيانات
bun run db:push

# توليد Prisma Client
bun run db:generate

# فحص الأخطاء
bun run lint

# إنشاء مستخدمين تجريبين
bun run scripts/setup-test-users.ts

# البحث عن بيانات الاختبار
bun run scripts/check-data.ts

# اختبار قبول الطلب
bun run scripts/test-acceptance.ts
```

---

## 📝 الصفحات الرئيسية

- `/` - الصفحة الرئيسية
- `/auth/login` - تسجيل الدخول
- `/auth/register` - إنشاء حساب
- `/dashboard` - لوحة التحكم
- `/posts` - البوستات المتاحة
- `/posts/create` - إنشاء بوست جديد
- `/chat` - المحادثات
- `/settings` - الإعدادات

---

## 🔧 حل المشاكل الشائعة

### السيرفر لا يعمل؟
```bash
# 1. قم بقتل السيرفر
pkill -f "next dev"

# 2. حذف المجلد المؤقت
rm -rf .next

# 3. أعد تشغيل
bun run dev
```

### مشاكل قاعدة البيانات؟
```bash
# إعادة تعيين قاعدة البيانات
rm db/custom.db

# إعادة إنشاء المخطط
bun run db:push

# إعادة توليد Prisma Client
bun run db:generate
```

### أخطاء في الترجمة؟
```bash
# إعادة توليد Prisma Client
bun run db:generate

# تحديث قاعدة البيانات
bun run db:push
```

---

## 📦 الميزات المشروع

✅ **تسجيل المستخدمين** (أدمن، طالب، مريض)
✅ **نظام البوستات** (إنشاء، بحث، تطبيق)
✅ **نظام المحادثات** (دردود + رسائل)
✅ **نظام التقييمات** (تقييم الحالات)
✅ **نظام الإشعارات** (إشعارات Push و In-App)
✅ **لوحة تحكم للأدمن**
✅ **قاعدة بيانات SQLite** (سهلة وفعالة)
✅ **تصميم احتراف باستخدام shadcn/ui**
✅ **دعم اللغتين (عربي وإنجليزي)**

---

## 🎯 الوظائف الأساسية

1. **للمرضى**:
   - تصفح الحالات المتاحة
   - تقديم طلبات للحالات
   - التواصل مع الطلاب
   - تتبع حالة الحالة

2. **للطلاب**:
   - إنشاء بوستات للحالات المطلوبة
   - قبول أو رفض طلبات المرضى
   - إدارة المواعد
   - إكمال الحالات
   - بناء بورتفوليو

3. **للأدمن**:
   - إدارة المستخدمين
   - التحقق من الطلاب
   - متابعة البلاغات
   - إدارة المحتوى

---

## 📞 الدعم

إذا واجهت مشكلة، تواصل معنا:
- 📧 Email: support@smileydental.com
- 💬 WhatsApp: +20 123 456 7890
- 🌐 Website: www.smileydental.com

---

## 📄 الملفات المهمة

- `.env` - متغيرات البيئة
- `prisma/schema.prisma` - قاعدة البيانات
- `src/app/page.tsx` - الصفحة الرئيسية
- `src/app/layout.tsx` - Layout رئيسي
- `src/lib/db.ts` - اتصال قاعدة البيانات
- `src/lib/auth.ts` - نظام المصادقة

---

## 🎉 ملاحظات مهمة

- قاعدة البيانات SQLite مناسبة للتطوير السريع
- البيانات مخزنة في مجلد `db/` في المشروع
- السيرفر يعمل على المنفذ 3000 افتراضياً
- تأكد من تشغيل السيرفر قبل فتح المشروع في المتصفح

---

## 🚀 جاهز للبدء؟

```bash
# 1. اذهب إلى المشروع
cd /home/z/my-project

# 2. شغّل السيرفر
bun run dev

# 3. افتح المتصفح
# انقر على http://localhost:3000
# أو استخدم "Open in New Tab" في Preview Panel
```

**ممتاز! المشروع جاهز للتشغيل!** 🚀
