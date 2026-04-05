# 🚀 دليل البدء السريع - Quick Start Guide

## للبدء فوراً على Windows / To start immediately on Windows

### 1. افتح المشروع في VS Code / Open project in VS Code
```powershell
cd "G:/projrct clinc"
code .
```

### 2. افتح Terminal واكتب / Open Terminal and type:
```powershell
npm install
```

### 3. أنشئ مجلد قاعدة البيانات / Create database folder
```powershell
mkdir db
```

### 4. إعداد قاعدة البيانات / Setup database
```powershell
npx prisma generate
npx prisma db push
```

### 5. أنشئ حساب أدمن / Create admin account
```powershell
npm run create-admin
```

**بيانات الدخول** / **Login Credentials**:
- Email: `admin@smileydental.com`
- Password: `Admin@123456`

### 6. شغل السيرفر / Start server
```powershell
npm run dev
```

### 7. افتح المتصفح / Open browser
http://localhost:3000

---

## ✅ المطلوب / Requirements

- Node.js 18+
- npm (يأتي مع Node.js / comes with Node.js)

---

## 📚 مزيد من المعلومات / More Info

- **README.md** - دليل كامل / Complete guide
- **SETUP-Windows.md** - إعدادات Windows التفصيلية / Detailed Windows setup

---

## 🆘 مشاكل؟ / Problems؟

راجع **SETUP-Windows.md** - قسم حل المشاكل / Check SETUP-Windows.md - Troubleshooting section

---

**تم التحديث** / **Last Updated**: 2025
