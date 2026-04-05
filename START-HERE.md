# 📍 ابدأ من هنا - Start Here

## 👋 أهلاً بك في مشروع Smiley Dental Clinic
**Welcome to Smiley Dental Clinic Project**

---

## 🎯 ماذا تريد أن تفعل؟ / What do you want to do?

### 🆕 أول مرة؟ / First time؟
اذهب إلى **PRIMER-USO.md** (دليل البدء السريع)
Go to **PRIMER-USO.md** (Quick Start Guide)

### 🪟 تعمل على Windows؟ / Working on Windows؟
اذهب إلى **SETUP-Windows.md** (دليل إعداد Windows الكامل)
Go to **SETUP-Windows.md** (Complete Windows Setup Guide)

### 📚 تريد معرفة كل شيء؟ / Want to know everything؟
اذهب إلى **README.md** (الدليل الكامل)
Go to **README.md** (Complete Guide)

---

## 🚀 أسرع طريقة للبدء (3 دقائق) / Fastest Way to Start (3 minutes)

### افتح Terminal في المشروع / Open Terminal in Project Directory

```powershell
# 1. تثبيت الحزم / Install dependencies
npm install

# 2. إنشاء مجلد قاعدة البيانات / Create database folder
mkdir db

# 3. إعداد قاعدة البيانات / Setup database
npx prisma generate
npx prisma db push

# 4. إنشاء حساب أدمن / Create admin account
npm run create-admin

# 5. تشغيل السيرفر / Start server
npm run dev
```

### افتح المتصفح / Open Browser
http://localhost:3000

### تسجيل الدخول / Login
```
Email:    admin@smileydental.com
Password: Admin@123456
```

---

## 📖 الملفات المهمة / Important Files

| الملف / File | الوصف / Description |
|-------------|---------------------|
| `PRIMER-USO.md` | دليل البدء السريع / Quick Start Guide |
| `SETUP-Windows.md` | إعداد Windows التفصيلي / Detailed Windows Setup |
| `README.md` | الدليل الكامل للمشروع / Complete Project Guide |
| `.env` | متغيرات البيئة / Environment Variables |
| `package.json` | الحزم والأوامر / Packages and Commands |
| `prisma/schema.prisma` | إعدادات قاعدة البيانات / Database Schema |

---

## 🔑 بيانات الأدمن / Admin Credentials

```
Email:    admin@smileydental.com
Password: Admin@123456
```

⚠️ **هام** / **Important**: غيّر كلمة المرور بعد أول تسجيل دخول!
/ Change the password after first login!

---

## 🆘 واجهت مشكلة؟ / Facing a problem؟

1. **اقرأ رسالة الخطأ** / **Read the error message**
2. **راجع SETUP-Windows.md** - قسم حل المشاكل / **Check SETUP-Windows.md** - Troubleshooting
3. **تأكد من تشغيل `npm install`** / **Make sure you ran `npm install`**
4. **تأكد من وجود مجلد `db`** / **Make sure `db` folder exists**

---

## 📚 الأوامر الأساسية / Basic Commands

```powershell
npm run dev          # تشغيل السيرفر / Start server
npm run build        # بناء المشروع / Build project
npm run create-admin # إنشاء أدمن / Create admin
npm run check-admin  # فحص الأدمن / Check admin
npm run db:studio    # فتح قاعدة البيانات / Open database UI
```

---

## 🎤 تحتاج مساعدة؟ / Need help؟

- 📖 **README.md** - المعلومات الكاملة / Complete Information
- 🪟 **SETUP-Windows.md** - إعداد Windows / Windows Setup
- 🚀 **PRIMER-USO.md** - البدء السريع / Quick Start

---

## ✅ قائمة التحقق السريعة / Quick Checklist

قبل البدء تأكد من / Before starting, make sure:

- [ ] Node.js مثبت / Node.js installed (v18+)
- [ ] المشروع مفتوح في VS Code / Project opened in VS Code
- [ ] فتحت Terminal في مجلد المشروع / Opened Terminal in project folder
- [ ] شغلت `npm install` / Ran `npm install`
- [ ] مجلد `db` موجود / `db` folder exists
- [ ] شغلت `npx prisma db push` / Ran `npx prisma db push`
- [ ] شغلت `npm run create-admin` / Ran `npm run create-admin`

---

## 🎉 جاهز للبدء! / Ready to Start!

اختر الدليل المناسب لك وابدأ! / Choose the right guide and start!

- ⚡ **سريع** / **Fast**: `PRIMER-USO.md`
- 🪟 **Windows** / **Windows**: `SETUP-Windows.md`
- 📚 **كامل** / **Complete**: `README.md`

---

**تم التحديث** / **Last Updated**: 2025
**المشروع** / **Project**: Smiley Dental Clinic
