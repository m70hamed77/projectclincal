# 🔥 حل فوري ومباشر لـ Windows - لا تستخدم git pull

## المشكلة الحالية
```
FATAL: An unexpected Turbopack error occurred
POST /api/auth/login 500
```

## الحل المباشر - انسخ هذا وقم بتشغيله في PowerShell

### الخطوة 1: امسح كل شيء
```powershell
# احذف المجلدات
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.prisma

# احذف package-lock.json
Remove-Item -Force package-lock.json
```

### الخطوة 2: قم بتعديل package.json يدوياً

افتح `package.json` وابحث عن سطر `scripts`، واستبدله بهذا:

```json
"scripts": {
  "dev": "cross-env-shell \"set TURBOPACK=0&& next dev -p 3000\"",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "eslint .",
  "db:push": "prisma db push",
  "db:generate": "prisma generate",
  "postinstall": "prisma generate"
},
```

### الخطوة 3: ثبت الحزم
```powershell
npm install
```

### الخطوة 4: ثبت cross-env
```powershell
npm install --save-dev cross-env
```

### الخطوة 5: شغل السيرفر
```powershell
npm run dev
```

---

## ✅ كيف تعرف أن الحل نجح؟

سسترى:
```
▲ Next.js 16.1.3
- Local:         http://localhost:3000
```

**لن ترى `(Turbopack)`** بجانب Next.js - هذا يعني نجح الحل!

---

## ⚠️ إذا استمرت المشكلة

استخدم هذا الأمر مباشرة (بدون تعديل package.json):

```powershell
$env:TURBOPACK="0"; npx next dev -p 3000
```

هذا سيفرض إيقاف Turbopack ويستخدم Webpack.

---

## 🎯 لماذا هذه المشكلة؟

Turbopack في Next.js 16 لديه bug على Windows يسبب:
- Panic errors
- خطأ 500 في API routes
- Crash عند compilation

الحل: استخدام Webpack بدلاً من Turbopack على Windows.

---

## 📞 الخط السريع

نسّخ هذا وشغله مرة واحدة:

```powershell
# 1. امسح cache
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.prisma

# 2. ثبت cross-env
npm install --save-dev cross-env

# 3. شغل بدون Turbopack
$env:TURBOPACK="0"; npx next dev -p 3000
```

هذا **سيعمل فوراً** بدون أي تعديلات أخرى!
