# 🪟 إعداد المشروع على Windows / Setup Project on Windows

## خطوات تثبيت كاملة على Windows / Complete Installation Steps on Windows

---

## 📋 المتطلبات الأساسية / Basic Requirements

1. **Node.js** (الإصدار 18 أو أحدث / Version 18+)
   - التحميل / Download: https://nodejs.org/
   - اختر LTS version / Choose LTS version

2. **VS Code** (اختياري / Optional)
   - التحميل / Download: https://code.visualstudio.com/

3. **Git** (اختياري / Optional)
   - التحميل / Download: https://git-scm.com/

---

## 🚀 خطوات التثبيت / Installation Steps

### الخطوة 1: فتح المشروع في VS Code / Step 1: Open Project in VS Code

#### الطريقة 1: من VS Code / Method 1: From VS Code
1. افتح VS Code / Open VS Code
2. اضغط `File` → `Open Folder`
3. اختر المجلد / Select folder: `G:\projrct clinc`

#### الطريقة 2: من تيرمينال / Method 2: From Terminal
```powershell
cd "G:\projrct clinc"
code .
```

---

### الخطوة 2: فتح تيرمينال في VS Code / Step 2: Open Terminal in VS Code

1. في VS Code اضغط `Ctrl` + `~` (المفتاح الموجود أسفل Esc)
2. أو اضغط `Terminal` → `New Terminal`
3. تأكد أنك في مجلد المشروع / Make sure you're in project folder:
```powershell
pwd
# يجب أن يظهر / Should show: G:\projrct clinc
```

---

### الخطوة 3: تثبيت الحزم / Step 3: Install Dependencies

```powershell
npm install
```

**انتظر حتى ينتهي التثبيت** / **Wait for installation to complete**

---

### الخطوة 4: إنشاء مجلد قاعدة البيانات / Step 4: Create Database Folder

```powershell
mkdir db
```

**تأكد من وجود المجلد** / **Make sure folder exists**:
```powershell
dir db
```

---

### الخطوة 5: إعداد Prisma / Step 5: Setup Prisma

```powershell
npx prisma generate
npx prisma db push
```

**ماذا يفعل هذا؟** / **What this does?**
- `prisma generate`: يولد Prisma Client للاتصال بقاعدة البيانات / Generates Prisma Client to connect to database
- `prisma db push`: يخلق جداول قاعدة البيانات / Creates database tables

---

### الخطوة 6: إنشاء حساب الأدمن / Step 6: Create Admin Account

```powershell
npm run create-admin
```

**سيظهر لك هذا الإخراج** / **You will see this output**:
```
🚀 Starting admin creation process...
✅ Admin email is available
🔐 Hashing password...
✅ Password hashed
👤 Creating user account...
✅ User created: [some-id]
✅ Admin profile created: [some-id]

╔══════════════════════════════════════════════════════╗
║         ✅ ADMIN CREATED SUCCESSFULLY!               ║
╚══════════════════════════════════════════════════════╝

📝 Login Credentials:
   Email:   admin@smileydental.com
   Password: Admin@123456
```

**⚠️ انسخ كلمة المرور واحفظها!** / **⚠️ Copy and save the password!**

---

### الخطوة 7: تشغيل السيرفر / Step 7: Start Development Server

```powershell
npm run dev
```

**ستظهر هذه الرسالة** / **You will see this message**:
```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
- Environments: .env.local
```

---

### الخطوة 8: فتح المتصفح / Step 8: Open Browser

افتح المتصفح على: http://localhost:3000

---

## 🔑 تسجيل الدخول كأدمن / Logging in as Admin

1. اذهب إلى صفحة تسجيل الدخول / Go to login page:
   http://localhost:3000/auth/login

2. أدخل البيانات التالية / Enter the following credentials:
   ```
   Email:    admin@smileydental.com
   Password: Admin@123456
   ```

3. اضغط "تسجيل الدخول" / Click "Login"

4. ✅ تم! ستنقل إلى لوحة تحكم الأدمن / Done! You'll be redirected to admin dashboard

---

## 🎯 الخطوات التالية / Next Steps

### 1. تغيير كلمة المرور / Change Password

بعد تسجيل الدخول:
- اضغط على اسمك في أعلى اليمين / Click on your name in the top right
- اختر "الإعدادات" / Choose "Settings"
- اضغط "تغيير كلمة السر" / Click "Change Password"
- أدخل كلمة المرور الجديدة / Enter new password

### 2. إضافة المستخدمين / Add Users

يمكنك:
- مراجعة طلبات التحقق للطلاب / Review student verification requests
- إدارة المستخدمين / Manage users
- عرض البلاغات / View reports

---

## 🔧 حل المشاكل الشائعة / Troubleshooting Common Issues

### المشكلة 1: خطأ "Unable to open the database file" / Error "Unable to open the database file"

**السبب** / **Cause**: مجلد `db` غير موجود / `db` folder doesn't exist

**الحل** / **Solution**:
```powershell
mkdir db
npx prisma db push
```

---

### المشكلة 2: خطأ 401 عند تسجيل الدخول / 401 error on login

**السبب** / **Cause**: حساب الأدمن غير موجود / Admin account doesn't exist

**الحل** / **Solution**:
```powershell
npm run check-admin
```

إذا لم يوجد حساب / If no account exists:
```powershell
npm run create-admin
```

---

### المشكلة 3: خطأ "module not found" / Error "module not found"

**الحل** / **Solution**:
```powershell
rm -rf node_modules .next
npm install
```

**ملاحظة** / **Note**: إذا لم يعمل `rm` على Windows / If `rm` doesn't work on Windows:
```powershell
rmdir /s /q node_modules .next
npm install
```

---

### المشكلة 4: خطأ "ts-node is not recognized" / Error "ts-node is not recognized"

**السبب** / **Cause**: `ts-node` غير مثبت / `ts-node` is not installed

**الحل** / **Solution**:
```powershell
npm install -D ts-node @types/node
```

---

### المشكلة 5: خطأ في المسار / Path Error

**التحقق من ملف `.env`** / **Check `.env` file**:

افتح ملف `.env` وتأكد من / Open `.env` file and ensure:
```env
DATABASE_URL="file:./db/custom.db"
```

إذا لم يعمل، استخدم المسار المطلق / If doesn't work, use absolute path:
```env
DATABASE_URL="file:G:/projrct clinc/db/custom.db"
```

**ملاحظة مهمة** / **Important Note**: استخدم `/` وليس `\` / Use `/` not `\`

---

## 📚 الأوامر المفيدة / Useful Commands

### تطوير / Development
```powershell
npm run dev          # تشغيل السيرفر / Start server
npm run build        # بناء المشروع / Build project
npm run start        # تشغيل الإنتاج / Start production
```

### قاعدة البيانات / Database
```powershell
npm run db:push      # تحديث قاعدة البيانات / Update database
npm run db:generate  # توليد Prisma Client / Generate Prisma Client
npm run db:studio    # فتح واجهة إدارة قاعدة البيانات / Open database UI
```

### السكريبتات / Scripts
```powershell
npm run create-admin   # إنشاء أدمن / Create admin
npm run check-admin    # فحص الأدمن / Check admin
npm run reset-students # إعادة تعيين الطلاب / Reset students
```

---

## 🎨 فتح Prisma Studio / Opening Prisma Studio

لإدارة قاعدة البيانات بشكل مرئي / To manage database visually:

```powershell
npm run db:studio
```

سيفتح المتصفح على: http://localhost:5555

من هنا يمكنك:
- مشاهدة جميع البيانات / View all data
- إضافة/تعديل/حذف البيانات / Add/edit/delete data
- فحص العلاقات / Examine relationships

---

## 📝 ملاحظات هامة / Important Notes

### 1. ملف `.env` لا يجب مشاركته / `.env` file should not be shared

ملف `.env` يحتوي على معلومات حساسة / `.env` file contains sensitive info
- ✅ موجود في `.gitignore` / Added to `.gitignore`
- ❌ لا ترفعه لـ GitHub / Don't upload to GitHub
- ❌ لا تشاركه مع أحد / Don't share with anyone

---

### 2. إيقاف السيرفر / Stopping the Server

في التيرمينال اضغط / In terminal press:
```
Ctrl + C
```

---

### 3. إعادة تشغيل السيرفر / Restarting the Server

1. اضغط `Ctrl + C` لإيقاف / Press `Ctrl + C` to stop
2. اكتب `npm run dev` للإعادة / Type `npm run dev` to restart

---

### 4. مسح الذاكرة المؤقتة / Clearing Cache

إذا واجهت مشاكل غريبة / If you face weird issues:
```powershell
rmdir /s /q .next
npm run dev
```

---

## 🎓 المصادر التعليمية / Learning Resources

### Next.js
- https://nextjs.org/docs
- https://nextjs.org/learn

### Prisma
- https://www.prisma.io/docs
- https://www.prisma.io/docs/concepts/overview

### Tailwind CSS
- https://tailwindcss.com/docs
- https://tailwindcss.com/docs/installation

---

## 💡 نصائح للتطوير / Development Tips

### 1. استخدام إضافات VS Code / VS Code Extensions

- **ESLint**: لفحص الكود / For code linting
- **Prettier**: لتنسيق الكود / For code formatting
- **Prisma**: لإكمال الكود / For code completion
- **Tailwind CSS IntelliSense**: لـ Tailwind / For Tailwind

### 2. الحفاظ على السيرفر يعمل / Keep Server Running

السيرفر يعمل في auto-reload / Server auto-reloads
- عند حفظ ملف، السيرفر يعيد التحميل / When you save, server reloads
- لا تحتاج لإعادة التشغيل يدوياً / No need to manually restart

### 3. فحص الأخطاء / Checking Errors

افتح Console في المتصفح / Open Console in browser:
- اضغط `F12` / Press `F12`
- اختر "Console" / Choose "Console"
- ستظهر الأخطاء هنا / Errors will appear here

---

## 🆘 الحصول على مساعدة / Getting Help

إذا واجهت مشكلة / If you face an issue:

1. **اقرأ رسالة الخطأ** / **Read the error message**
   - غالباً تحتوي على تلميح / Usually contains a hint

2. **راجع هذا الملف** / **Check this file**
   - قسم حل المشاكل / Troubleshooting section

3. **تحقق من Logs** / **Check Logs**
   - logs في Terminal / Logs in Terminal
   - Console في المتصفح / Console in browser

4. **حاول إعادة التثبيت** / **Try reinstalling**
   ```powershell
   rmdir /s /q node_modules .next
   npm install
   npm run dev
   ```

---

## ✅ قائمة التحقق قبل البدء / Checklist Before Starting

- [ ] Node.js مثبت / Node.js installed
- [ ] المشروع مفتوح في VS Code / Project opened in VS Code
- [ ] تم تثبيت الحزم / Dependencies installed
- [ ] مجلد `db` موجود / `db` folder exists
- [ ] Prisma تم إعداده / Prisma setup completed
- [ ] حساب الأدمن تم إنشاؤه / Admin account created
- [ ] السيرفر يعمل / Server is running
- [ ] يمكن فتح http://localhost:3000 / Can open http://localhost:3000
- [ ] يمكن تسجيل الدخول كأدمن / Can login as admin

---

## 🎉 تهانينا! / Congratulations!

الآن المشروع جاهز للعمل على جهازك! / Now the project is ready to work on your machine!

ابدأ في التطوير واستمتع! / Start developing and enjoy!

---

**تم إعداد هذا الملف لتسهيل عملية التثبيت على Windows**
**This file is created to simplify installation on Windows**

**تم التحديث** / **Last Updated**: 2025
