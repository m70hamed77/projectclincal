# 🚀 دليل النشر السريع - Smiley Dental Clinic

---

## ⚡ خطوات سريعة (للمستخدم المتقدم)

### 1. رفع على GitHub
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. إنشاء قاعدة بيانات
- افتح [neon.tech](https://neon.tech)
- أنشئ مشروع مجاني
- انسخ Connection String

### 3. النشر على Vercel
1. افتح [vercel.com](https://vercel.com)
2. Import repository
3. أضف Environment Variables:
   - `DATABASE_URL` = (رابط قاعدة البيانات من Neon)
4. Deploy

### 4. إنشاء الجداول
```powershell
npm install -g vercel
vercel login
vercel link
npx prisma db push
```

✅ **تم!** المشروع الآن على الإنترنت! 🎉

---

## 📖 دليل مفصل

للمزيد من التفاصيل، راجع ملف `DEPLOYMENT_GUIDE.md`

---

## 🛠️ المتطلبات

- GitHub account
- Vercel account
- Neon/Supabase account (PostgreSQL)

---

## 🆘 المساعدة

- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
