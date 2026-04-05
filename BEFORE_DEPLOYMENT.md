# ⚠️ قبل النشر - خطوات ضرورية على جهازك

---

## 📝 قائمة التحقق قبل النشر

### ✅ 1. تأكد من بنية الملفات

يجب أن يكون لديك:

```
my-project/
├── .env.example          ✅ موجود
├── .gitignore            ✅ موجود
├── package.json          ✅ محدث
├── vercel.json           ✅ موجود
├── prisma/
│   └── schema.prisma     ✅ جاهز
├── src/
│   └── app/             ✅ التطبيق
└── DEPLOYMENT_GUIDE.md  ✅ الدليل
```

---

### ✅ 2. تثبيت المكتبات

```powershell
cd my-project
npm install
```

---

### ✅ 3. إنشاء ملف .env للإنتاج

**لا ترفع .env على GitHub!**

أنشئ ملف `.env.production.local` على جهازك فقط:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
NODE_ENV="production"
```

**ملاحظة:** ستحتاج للحصول على رابط قاعدة البيانات من Neon أو Supabase.

---

### ✅ 4. اختبار محلي (اختياري)

```powershell
npm run build
npm start
```

افتح المتصفح على: `http://localhost:3000`

---

### ✅ 5. تهيئة Git

```powershell
git init
git add .
git commit -m "Ready for deployment"
```

---

### ✅ 6. رفع على GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

### ✅ 7. تأكد من .gitignore

تأكد أن هذه الملفات **غير** موجودة في Git:
- ✅ `.env` (لكن `.env.example` موجود)
- ✅ `.next/`
- ✅ `node_modules/`
- ✅ `*.log`

---

## 🚀 بعد النشر على Vercel

1. أضف `DATABASE_URL` في Environment Variables
2. انتظر اكتمال النشر
3. شغّل `npx prisma db push` من خلال Vercel CLI
4. اختبر المشروع على الرابط المباشر

---

## ❓ أسئلة شائعة

### س: هل يجب حذف مجلد `db/` مع SQLite؟
ج: نعم، إذا كنت تستخدم PostgreSQL في الإنتاج، يمكنك حذف مجلد `db/`.

### س: هل البيانات ستنقل من SQLite إلى PostgreSQL؟
ج: لا، يجب إنشاء قاعدة بيانات جديدة. البيانات لن تُنقل تلقائياً.

### س: كيف أتأكد أن PostgreSQL يعمل؟
ج: من Vercel Dashboard → Deployments → View Logs، ابحث عن أي أخطاء قاعدة بيانات.

---

## 🎯 الخطوة التالية

بعد التأكد من كل شيء، اتبع الدليل الكامل في:
📄 `DEPLOYMENT_GUIDE.md`
