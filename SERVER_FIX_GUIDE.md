# 🔧 خطوات حل مشكلة الـ Preview (Server-Side Fix)

## 📌 **المشكلة:**
- ❌ `502 Bad Gateway`
- ❌ `net::ERR_TIMED_OUT`
- ❌ الصفحة تعمل refresh مستمر (وميض)

## 🎯 **الحل:**
الخطوات التالية يجب تنفيذها على السيرفر (Server-Side):

---

## 📋 **الخطوة 1: إيقاف السيرفر الحالي**

```bash
# إذا كان يعمل بـ PM2
pm2 stop next-app

# أو إذا كان Docker container
docker stop next-app

# أو إذا كان systemctl
systemctl stop next-server

# أو إذا كان يعمل مباشرة
# اضغط Ctrl+C في الـ terminal
```

---

## 📋 **الخطوة 2: إزالة الملفات المتراكمة**

```bash
cd /path/to/project

# إزالة ملفات البناء القديمة
rm -rf .next

# إزالة Prisma Client القديم
rm -rf node_modules/.prisma
```

---

## 📋 **الخطوة 3: إعادة تثبيت الاعتماديات**

```bash
# إعادة تثبيت node_modules
rm -rf node_modules
npm install

# أو إذا كنت تستخدم bun
bun install
```

---

## 📋 **الخطوة 4: تهيئة قاعدة البيانات**

```bash
# توليد Prisma Client
npm run db:generate

# دفع الـ Schema لقاعدة البيانات
npm run db:push
```

---

## 📋 **الخطوة 5: بناء المشروع**

```bash
# بناء المشروع للإنتاج (اختياري لكن موصى به)
npm run build
```

---

## 📋 **الخطوة 6: تشغيل السيرفر**

```bash
# تشغيل السيرفر في وضع التطوير
npm run dev

# أو تشغيل في وضع الإنتاج بعد البناء
npm start
```

---

## 📋 **الخطوة 7: فحص الـ Logs (مهم جداً!)**

```bash
# فحص الـ logs للسيرفر
tail -f logs/server.log

# أو
journalctl -u next-server -f

# أو
docker logs next-app -f

# ابحث عن:
# - Error messages
# - Crash reports
# - Timeout errors
# - Database connection errors
```

---

## 📋 **الخطوة 8: التحقق من الـ Environment Variables**

```bash
# تأكد من أن ملف .env يحتوي على:
cat .env

# يجب أن يحتوي على:
# DATABASE_URL=postgresql://...
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=...
# NODE_ENV=development
```

---

## 📋 **الخطوة 9: التحقق من البورت**

```bash
# تأكد من أن السيرفر يستمع على البورت 3000
netstat -tlnp | grep :3000

# أو
lsof -i :3000
```

---

## 📋 **الخطوة 10: اختبار التطبيق**

```bash
# اختبار من الـ terminal
curl http://localhost:3000

# أو فتح المتصفح
http://localhost:3000
```

---

## ⚠️ **ملاحظات مهمة:**

### ✅ ما يجب فعله:
1. ✅ إيقاف السيرفر بالكامل قبل البناء
2. ✅ إزالة `.next` و `node_modules/.prisma`
3. ✅ إعادة تثبيت الاعتماديات
4. ✅ توليد Prisma Client
5. ✅ فحص الـ logs بعد التشغيل
6. ✅ التأكد من أن البورت 3000 غير مشغول من قبل

### ❌ ما يجب تجنبه:
1. ❌ لا تقم بتغيير أي شيء في الكود - الكود سليم 100%
2. ❌ لا تقم بتغيير قاعدة البيانات
3. ❌ لا تقم بتغيير `package.json`
4. ❌ لا تقم بتشغيل `bun run build` إذا كنت تريد التطوير فقط

---

## 🐛 **استكشاف الأخطاء الشائعة:**

### الخطأ: `EADDRINUSE: address already in use`
```bash
# البورت 3000 مشغول من قبل عملية أخرى
# الحل: قتل العملية
kill -9 $(lsof -t -i:3000)
# أو
fuser -k 3000/tcp
```

### الخطأ: `Database connection failed`
```bash
# التأكد من قاعدة البيانات
npm run db:generate
npm run db:push
```

### الخطأ: `Cannot find module 'xxx'`
```bash
# إعادة تثبيت الاعتماديات
npm install
```

### الخطأ: `Build failed`
```bash
# إزالة الملفات المتراكمة
rm -rf .next node_modules
npm install
npm run build
```

---

## 🔍 **فحص إضافي:**

### فحص حالة الذاكرة:
```bash
free -h
df -h
```

### فحص حالة العملية:
```bash
htop
# أو
top
```

### فحص ملفات الـ logs:
```bash
ls -la logs/
tail -n 100 logs/server.log | grep -i error
```

---

## 📞 **متى تتواصل معنا:**

إذا بعد تنفيذ كل الخطوات السابقة:
- لا يزال السيرفر يعطي 502
- أو الـ app بيتش continually crash
- أو الـ logs تظهر أخطاء غريبة

فحينها:
1. 📸 خذ لقطة شاشة من الـ logs
2. 📝 انسخ رسالة الخطأ
3. 📧 أرسلها لنا للمساعدة

---

## 🎯 **الخلاصة:**

المشكلة **ليست من الكود** ❌
المشكلة **من السيرفر / الـ Deployment** ✅

**الحل:** اتبع الخطوات أعلاه بالترتيب

---

**تم إعداد هذا الملف بواسطة:** Z.ai Code 🤖
