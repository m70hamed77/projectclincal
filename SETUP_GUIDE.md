# دليل إعداد المشروع على Visual Studio Code

## 🔧 خطوات التشغيل لأول مرة

### 1️⃣ تثبيت الحزم

```powershell
npm install
```

### 2️⃣ إعداد ملف `.env`

افتح ملف `.env` في جذر المشروع وتأكد من أنه يحتوي على:

```env
DATABASE_URL="file:./db/custom.db"
```

⚠️ **مهم:** تأكد من إنشاء مجلد `db` في جذر المشروع إذا لم يكن موجوداً.

### 3️⃣ إنشاء قاعدة البيانات

```powershell
npx prisma db push
```

### 4️⃣ إنشاء مستخدم Admin (مهم جداً!)

```powershell
node scripts/create-admin.js
```

ستظهر لك رسالة مثل:

```
✅ تم إنشاء مستخدم Admin بنجاح!
═══════════════════════════════════════
📧 البريد الإلكتروني: admin@smileydental.com
🔑 كلمة المرور: Admin@123456
═══════════════════════════════════════
```

### 5️⃣ تشغيل المشروع

```powershell
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 🔐 بيانات الدخول الافتراضية

### Admin
- **البريد:** admin@smileydental.com
- **كلمة المرور:** Admin@123456

### لإنشاء مستخدم جديد

1. افتح التطبيق
2. اضغط على "ابدأ الآن"
3. اختر النوع (طالب/دكتور أو مريض)
4. املأ البيانات
5. اتبع خطوات التحقق

---

## 🐛 حل المشاكل الشائعة

### مشكلة: الخطأ 500 عند تسجيل الدخول

**السبب:** قاعدة البيانات فارغة أو لا يوجد مستخدم Admin

**الحل:**
```powershell
# 1. تأكد من ملف .env
DATABASE_URL="file:./db/custom.db"

# 2. إنشاء قاعدة البيانات
npx prisma db push

# 3. إنشاء مستخدم Admin
node scripts/create-admin.js

# 4. إعادة تشغيل السيرفر
npm run dev
```

### مشكلة: Prisma error - the URL must start with the protocol `file:`

**السبب:** ملف `.env` يحتوي على إعدادات PostgreSQL بدلاً من SQLite

**الحل:** تأكد أن ملف `.env` يحتوي فقط على:
```env
DATABASE_URL="file:./db/custom.db"
```

### مشكلة: Failed to benchmark file I/O

**سبب:** تحذير بسيط من Next.js على Windows، لا يؤثر على عمل المشروع

**الحل:** تجاهل هذا التحذير، المشروع سيعمل بشكل طبيعي

---

## 📁 هيكل المشروع

```
smiley-clinic/
├── src/
│   ├── app/              # صفحات Next.js
│   ├── components/       # مكونات UI
│   ├── lib/             # دوال مساعدة (db, password, etc.)
│   └── hooks/           # React hooks
├── prisma/
│   └── schema.prisma    # Database schema
├── db/                 # مجلد قاعدة البيانات SQLite
├── scripts/            # سكربتات مساعدة
│   └── create-admin.js # إنشاء Admin افتراضي
├── .env                # متغيرات البيئة
└── package.json        # تبعيات المشروع
```

---

## 🚀 للنشر على Vercel

### 1. إعداد Environment Variables في Vercel

أضف الـ Variable التالية في إعدادات Vercel:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

⚠️ **مهم:** استخدم رابط PostgreSQL الفعلي الخاص بـ Neon أو أي قاعدة بيانات PostgreSQL أخرى

### 2. تغيير Provider في Prisma Schema

في ملف `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // غيّر من "sqlite" إلى "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. إنشاء قاعدة البيانات

```powershell
npx prisma generate
npx prisma db push
```

### 4. الرفع على Vercel

```powershell
git add .
git commit -m "Deploy to production"
git push
```

---

## 📝 ملاحظات مهمة

1. **للتطوير المحلي:** استخدم SQLite (`file:./db/custom.db`)
2. **للنشر على Vercel:** استخدم PostgreSQL (`postgresql://...`)
3. **لا ترفع ملف .env** إلى GitHub أو Vercel
4. **كن حذراً** عند تغيير Provider في Prisma Schema

---

## 🆘 الدعم

إذا واجهت أي مشاكل:

1. تأكد من تشغيل `npx prisma db push` بعد أي تغيير في الـ Schema
2. تحقق من ملف `.env` للتأكد من صحة DATABASE_URL
3. أنشئ دائماً مستخدم Admin باستخدام `node scripts/create-admin.js`
4. شغل `npm run dev` لرؤية الأخطاء في Terminal

---

## ✅ قائمة التحقق قبل البدء

- [ ] تم تثبيت الحزم: `npm install`
- [ ] ملف `.env` يحتوي على `DATABASE_URL="file:./db/custom.db"`
- [ ] مجلد `db` موجود
- [ ] تم إنشاء قاعدة البيانات: `npx prisma db push`
- [ ] تم إنشاء مستخدم Admin: `node scripts/create-admin.js`
- [ ] السيرفر يعمل: `npm run dev`
- [ ] يمكن الدخول باستخدام admin@smileydental.com / Admin@123456

---

**تم إنشاء هذا الدليل بواسطة Z.ai Code**
