# 🛠️ كيفية إصلاح السيرفر إذا توقف

## الطريقة السريعة والبسيطة:

إذا ظهرت لك رسالة **502 Bad Gateway** أو توقف السيرفر، قم بتشغيل هذا الأمر في الـ Terminal:

```bash
cd /home/z/my-project && (bun run dev > dev-server-persistent.log 2>&1 &)
```

---

## شرح سريع:

### الأمر يفعل الآتي:
1. `cd /home/z/my-project` - يذهب لمجلد المشروع
2. `(bun run dev > dev-server-persistent.log 2>&1 &)` - يشغل السيرفر في الخلفية
3. `> dev-server-persistent.log 2>&1` - يحفظ الـ logs في ملف
4. `&` - يشغله في الخلفية

---

## كيف تعرف أن السيرفر اشتغل؟

### بعد تشغيل الأمر، انتظر 10 ثواني ثم شغل:

```bash
curl -s http://localhost:3000 | grep "<title>"
```

### المفروض يظهر لك:
```
<title>Smiley Dental Clinic - سمايلي لطب الأسنان</title>
```

---

## إذا ظهرت لك مشكلة أخرى:

### 1. تأكد أنه لا يوجد سيرفر قديم شغال:

```bash
pkill -9 -f "next dev"
pkill -9 -f "next-server"
fuser -k 3000/tcp
```

### 2. ثم شغل السيرفر الجديد:

```bash
cd /home/z/my-project && (bun run dev > dev-server-persistent.log 2>&1 &)
```

---

## أمر واحد يجمع كل الحلول (الطريقة الأفضل):

```bash
cd /home/z/my-project && pkill -9 -f "next dev" && pkill -9 -f "next-server" && fuser -k 3000/tcp 2>/dev/null && sleep 2 && (bun run dev > dev-server-persistent.log 2>&1 &) && echo "Server started!" && sleep 5 && curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000
```

هذا الأمر:
1. يقتل أي سيرفر قديم
2. ينتظر 2 ثانية
3. يشغل سيرفر جديد
4. ينتظر 5 ثواني
5. يختبر أن السيرفر شغال

---

## كيف تعرف أن السيرفر شغل:

### المفروض يظهر لك:
```
HTTP Status: 200
```

إذا ظهر **200** فالسيرفر شغل تمام! ✅

---

## مثال عملي:

### في الـ Terminal، شغل هذا:

```bash
cd /home/z/my-project && pkill -9 -f "next dev" && pkill -9 -f "next-server" && fuser -k 3000/tcp 2>/dev/null && sleep 2 && (bun run dev > dev-server-persistent.log 2>&1 &) && sleep 8 && curl -s http://localhost:3000 | grep "<title>"
```

### المفروض يظهر لك:
```
Server started!
<title>Smiley Dental Clinic - سمايلي لطب الأسنان</title>
```

---

## 📝 خلاصة:

### أمر واحد فقط تشغله عندما يظهر 502:

```bash
cd /home/z/my-project && pkill -9 -f "next dev" && pkill -9 -f "next-server" && fuser -k 3000/tcp 2>/dev/null && sleep 2 && (bun run dev > dev-server-persistent.log 2>&1 &) && sleep 8 && curl -s http://localhost:3000 | grep "<title>"
```

### إذا ظهر العنوان: **السيرفر شغال!** ✅
### إذا لم يظهر: **أخبرني وسأساعدك!** ❓

---

**حفظ هذا الملف للرجوع إليه عند الحاجة!**
