# 🚀 تشغيل المشروع على Windows - دليل شامل

## 📋 المتطلبات (Prerequisites)

قبل ما تبدأ، تأكد إنك مركب البرامج دي على جهازك:

### 1. Node.js (مهم جداً)
- **الإصدار المطلوب:** Node.js 20.x أو أحدث
- **التثبيت:** من موقع [nodejs.org](https://nodejs.org/)
- **التأكد من التثبيت:**
  ```bash
  node --version
  npm --version
  ```

### 2. Git (اختياري)
- لو حتاج تعمل clone للـ project من GitHub
- **التثبيت:** من موقع [git-scm.com](https://git-scm.com/)

---

## 📦 خطوات التثبيت

### 1. فتح المشروع في VS Code

```bash
# باستخدام Git
git clone <repository-url>
cd smiley-dental-clinic

# أو فتح المجلد مباشرة في VS Code
```

### 2. تثبيت الاعتماديات (Dependencies)

افتح Terminal في VS Code (Ctrl + `) وشغل:

```bash
npm install
```

*ملاحظة:* الاستغراق الأول قد يستغرق دقائق لأنه يقوم بـ:
- تثبيت جميع الحزم (packages)
- توليد Prisma Client تلقائياً

---

## 🗄️ إعداد قاعدة البيانات

المشروع يستخدم **SQLite** (قاعدة بيانات محلية) - لا تحتاج لتثبيت أي قاعدة بيانات خارجية!

### التأكد من ملف `.env`

ملف `.env` يجب أن يحتوي على:

```env
DATABASE_URL=file:./db/custom.db
```

هذا المسار يعمل على جميع الأنظمة (Windows, macOS, Linux).

### إنشاء/تحديث قاعدة البيانات

```bash
# هذه الأوامر ستقوم بإنشاء قاعدة البيانات تلقائياً
npm run db:push
```

هذا الأمر سيقوم بـ:
- ✅ إنشاء ملف `db/custom.db` تلقائياً
- ✅ إنشاء جميع الجداول (tables)
- ✅ توليد Prisma Client

---

## 🏃 تشغيل المشروع

### طريقة التشغيل (Development Mode)

```bash
npm run dev
```

بعد التشغيل، افتح المتصفح على:
- **URL:** `http://localhost:3000`

---

## 🛠️ الأوامر المفيدة

### أوامر قاعدة البيانات

```bash
# تحديث الـ schema وتطبيقه على قاعدة البيانات
npm run db:push

# توليد Prisma Client فقط
npm run db:generate

# فتح Prisma Studio (واجهة رسومية لإدارة قاعدة البيانات)
npm run db:studio
```

### أوامر التطوير

```bash
# تشغيل مع Turbopack (أسرع)
npm run dev:turbo

# تشغيل مع Webpack (أكثر استقراراً)
npm run dev:webpack

# فحص الكود (Linting)
npm run lint

# فحص الكود وإصلاح الأخطاء تلقائياً
npm run lint:fix

# بناء المشروع للإنتاج
npm run build
```

---

## ⚠️ حل المشاكل الشائعة

### 1. مشكلة: Port 3000 مشغول

**الحل 1:** أغلق البرامج اللي شغالة على المنفذ 3000

**الحل 2:** استخدم منفذ آخر (مثلاً 3001):
- عدل في `package.json`:
  ```json
  "dev": "cross-env TURBOPACK=0 next dev -p 3001"
  ```

### 2. مشكلة: Prisma Client لا يعمل

**الحل:** أعد توليد Prisma Client:

```bash
npm run db:generate
```

أو احذف المجلدات وأعد التثبيت:

```bash
# احذف node_modules والملفات المؤقتة
rm -rf node_modules .next

# أعد التثبيت
npm install

# أعد توليد Prisma
npm run db:push
```

### 3. مشكلة: أخطاء في قاعدة البيانات

**الحل:** احذف قاعدة البيانات وأنشئها من جديد:

```bash
# احذف ملف قاعدة البيانات
rm db/custom.db

# أعد إنشاء قاعدة البيانات
npm run db:push
```

⚠️ **تنبيه:** هذا سيحذف جميع البيانات الموجودة!

### 4. مشكلة: خطأ في Node.js version

**الحل:** تأكد من إصدار Node.js:

```bash
node --version
```

يجب أن يكون `v20.x.x` أو أحدث. لو أقدم من كده، نزل إصدار أحدث من [nodejs.org](https://nodejs.org/).

---

## 📁 هيكل المشروع

```
smiley-dental-clinic/
├── db/                    # مجلد قاعدة البيانات SQLite
│   └── custom.db         # ملف قاعدة البيانات
├── prisma/
│   ├── schema.prisma     # تعريف جداول قاعدة البيانات
│   └── migrations/       # (اختياري) سجل التغييرات
├── src/
│   ├── app/              # صفحات Next.js
│   ├── components/       # مكونات React
│   ├── lib/              # مكتبات ومساعدات
│   └── hooks/            # React Hooks
├── .env                  # متغيرات البيئة (لا تشاركه على GitHub!)
├── .env.example          # مثال على ملف .env
├── package.json          # إعدادات المشروع والاعتماديات
└── next.config.mjs       # إعدادات Next.js
```

---

## 🔐 متغيرات البيانات المهمة

في ملف `.env`، تأكد من:

```env
# قاعدة البيانات (مهم جداً)
DATABASE_URL=file:./db/custom.db

# بيئة التشغيل
NODE_ENV=development

# إعدادات البريد الإلكتروني (اختياري)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**ملاحظة مهمة:** 
- لا تقم أبداً بتحميل ملف `.env` على GitHub أو مشاركته مع أحد!
- استخدم `.env.example` كمرجع فقط

---

## 🌐 التطوير على Windows

### استخدام PowerShell أو CMD

جميع الأوامر المذكورة أعلاه تعمل على:
- PowerShell
- CMD
- Git Bash
- Windows Terminal

### أوامر Windows المختلفة

في PowerShell أو CMD، استخدم:

```powershell
# حذف مجلد
Remove-Item -Recurse -Force node_modules

# حذف ملف
Remove-Item db\custom.db
```

في Git Bash أو WSL، استخدم:

```bash
rm -rf node_modules
rm db/custom.db
```

---

## 📚 موارد مفيدة

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## ✅ التحقق من صحة الإعداد

بعد التثبيت، تأكد من:

1. ✅ Node.js مثبت (`node --version`)
2. ✅ npm مثبت (`npm --version`)
3. ✅ الاعتماديات مثبتة (`npm install` تمت)
4. ✅ قاعدة البيانات مولدة (`db/custom.db` موجود)
5. ✅ Prisma Client مولد (`npm run db:generate` نجحت)
6. ✅ السيرفر يعمل (`npm run dev` يفتح http://localhost:3000)

---

## 🎉 تهانينا!

الآن أنت جاهز لتطوير المشروع على Windows! 💪

إذا واجهت أي مشكلة، تحقق من:
- Terminal output للأخطاء
- Browser console للأخطاء
- هذا الملف للحلول

**سعيد بالتطوير!** 🚀
