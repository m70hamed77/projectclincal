# 🚀 تعليمات تشغيل السيرفر

## ✅ الحالة الحالية:

**السيرفر يعمل بنجاح!** ✅
- HTTP: 200
- Database: متصل (PostgreSQL - NeonDB)
- تسجيل الدخول: يعمل

---

## 🔐 بيانات الدخول للـ Admin:

```
Email: admin@smileydental.com
Password: Admin@123456
```

---

## 🔄 كيفية إعادة تشغيل السيرفر إذا توقف:

### الطريقة 1: استخدم السكريبت الجاهز:

```bash
bash /home/z/my-project/restart-server.sh
```

### الطريقة 2: استخدم سكريبت البداية النظيف:

```bash
bash /home/z/my-project/start-clean-server.sh
```

### الطريقة 3: الأوامر اليدوية:

```bash
# 1. توقف جميع العمليات
pkill -9 -f "next dev"
pkill -9 -f "next-server"
fuser -k 3000/tcp

# 2. انتظر ثانيتين
sleep 2

# 3. ابدأ السيرفر
cd /home/z/my-project
bun run dev > /tmp/nextjs-server.log 2>&1 &

# 4. انتظر 10 ثواني
sleep 10

# 5. اختبر السيرفر
curl -s http://localhost:3000 | grep "<title>"
```

---

## 📊 التحقق من حالة السيرفر:

### تحقق من أن السيرفر يعمل:

```bash
ps aux | grep "next-server" | grep -v grep
```

### تحقق من أن الصفحة تعمل:

```bash
curl -s http://localhost:3000 | grep "<title>"
```

### المفروض يظهر:

```html
<title>Smiley Dental Clinic - سمايلي لطب الأسنان</title>
```

### تحقق من تسجيل الدخول:

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smileydental.com","password":"Admin@123456"}' | jq .
```

---

## 📝 السجلات (Logs):

### مشاهدة سجلات السيرفر:

```bash
tail -f /tmp/nextjs-server.log
```

### أو استخدم سكريبت البداية النظيف:

```bash
tail -f /tmp/nextjs-clean-server.log
```

---

## 🎯 الخطوات الناجحة:

1. ✅ تم إصلاح DATABASE_URL في shell environment
2. ✅ تم توليد Prisma Client مع الرابط الصحيح
3. ✅ تم تشغيل السيرفر بنجاح
4. ✅ قاعدة البيانات متصلة
5. ✅ تسجيل الدخول يعمل

---

## 💡 نصائح مهمة:

1. **استخدم سكريبت `start-clean-server.sh`** عند البدء من الصفر
2. **استخدم سكريبت `restart-server.sh`** عند إعادة التشغيل السريع
3. **تحقق من Logs** إذا واجهت مشاكل
4. **استخدم البيانات الصحيحة** لتسجيل الدخول

---

## 🔧 إذا واجهت مشاكل:

### المشكلة: 502 Bad Gateway

**الحل:** شغل سكريبت إعادة التشغيل:
```bash
bash /home/z/my-project/restart-server.sh
```

### المشكلة: خطأ في قاعدة البيانات

**الحل:** استخدم سكريبت البداية النظيف:
```bash
bash /home/z/my-project/start-clean-server.sh
```

### المشكلة: السيرفر لا يبدأ

**الحل:**
```bash
# توقف كل شيء
pkill -9 -f "next"
pkill -9 -f "node"
fuser -k 3000/tcp

# ابدأ من جديد
bash /home/z/my-project/start-clean-server.sh
```

---

**الآن يمكنك استخدام المشروع في البريفيو!** 🎉
