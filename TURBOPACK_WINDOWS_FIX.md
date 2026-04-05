# 🔧 حل مشكلة Turbopack على Windows

## 🐛 المشكلة

عند تشغيل `npm run dev` على Windows، يظهر هذا الخطأ:

```
FATAL: An unexpected Turbopack error occurred. A panic log has been written to...
POST /api/auth/login 500 in 3.6s
```

**السبب:** Turbopack (المحول الجديد في Next.js 16) لا يعمل بشكل جيد على Windows في بعض الحالات.

---

## ✅ الحل (تم تطبيقه بالفعل)

تم تحديث `package.json` لاستخدام Webpack بدلاً من Turbopack:

```json
"scripts": {
  "dev": "cross-env TURBOPACK=0 next dev -p 3000",
  "dev:turbo": "next dev -p 3000",
  "dev:webpack": "cross-env TURBOPACK=0 next dev -p 3000",
  "dev:legacy": "cross-env TURBOPACK=0 NEXT_PRIVATE_SKIP_VALIDATION=1 next dev -p 3000",
  ...
}
```

تم أيضاً تثبيت `cross-env` للعمل على جميع أنظمة التشغيل.

---

## 🚀 ما يجب عليك فعله الآن

### الخطوة 1: احصل على التحديثات

```powershell
# في PowerShell
git pull
```

أو إذا كنت لا تستخدم git، تأكد أن ملف `package.json` يحتوي على:
```json
"dev": "cross-env TURBOPACK=0 next dev -p 3000"
```

### الخطوة 2: ثبت cross-env (مرة واحدة فقط)

```powershell
npm install --save-dev cross-env
```

### الخطوة 3: امسح cache القديم

```powershell
# امسح مجلد .next
Remove-Item -Recurse -Force .next

# أو استخدم
rm -r -fo .next
```

### الخطوة 4: شغل السيرفر

```powershell
npm run dev
```

**الآن سيستخدم Webpack بدلاً من Turbopack ولن تظهر مشكلة Panic!**

---

## 📊 المتغيرات المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | ✅ يستخدم Webpack (موصى به على Windows) |
| `npm run dev:turbo` | ⚠️ يستخدم Turbopack (قد يسبب crash على Windows) |
| `npm run dev:webpack` | ✅ يستخدم Webpack |
| `npm run dev:legacy` | ✅ يستخدم Webpack مع skip validation |

---

## 🎯 الفرق بين Turbopack و Webpack

| الميزة | Turbopack | Webpack |
|--------|-----------|---------|
| السرعة | ⚡ أسرع | 🐌 أبطأ |
| الاستقرار على Windows | ⚠️ قد يسبب crash | ✅ مستقر |
| التطوير على Windows | ❌ غير موصى به | ✅ موصى به |
| الإنتاج | ✅ جيد | ✅ جيد |

**التوصية:** استخدم Webpack (`npm run dev`) على Windows للتطوير.

---

## 🔍 ماذا لو ظهرت مشكلة أخرى؟

### الحل 1: استخدم dev:legacy

```powershell
npm run dev:legacy
```

هذا سيتخطى بعض التحقق من Prisma ويساعد في تجنب مشاكل إضافية.

### الحل 2: تأكد من node_modules

```powershell
# حذف node_modules
Remove-Item -Recurse -Force node_modules

# إعادة التثبيت
npm install

# تشغيل السيرفر
npm run dev
```

### الحل 3: تحقق من Prisma

```powershell
npm run db:push
npm run dev
```

---

## ✅ التأكيد النهائي

عند تشغيل `npm run dev` بعد الحل، يجب أن ترى:

```
> smiley-dental-clinic@1.0.0 dev
> cross-env TURBOPACK=0 next dev -p 3000

▲ Next.js 16.1.3
- Local:         http://localhost:3000
- Environments: .env

✓ Starting...
✓ Ready in XXXXms
```

**لاحظ:** سيظهر `Next.js 16.1.3` فقط بدون `(Turbopack)` - هذا يعني أن Webpack يعمل! ✅

---

## 🎉 الخلاصة

**المشكلة:** Turbopack يسبب crash على Windows
**الحل:** تم تغيير `npm run dev` لاستخدام Webpack
**النتيجة:** السيرفر سيعمل بدون أخطاء Panic!

الآن يمكنك:
- ✅ تشغيل `npm run dev` على Windows بدون مشاكل
- ✅ استخدام `/api/auth/login` بدون خطأ 500
- ✅ التطوير بسلاسة بدون Turbopack crashes

---

## 📞 إذا استمرت المشكلة

1. تأكد أنك استخدمت `npm run dev` وليس `npm run dev:turbo`
2. امسح `.next` و `node_modules` وأعد التثبيت
3. تأكد من إصدار Node.js (`node --version` يجب أن يكون 18+)
4. تأكد من وجود `cross-env` في `devDependencies`
