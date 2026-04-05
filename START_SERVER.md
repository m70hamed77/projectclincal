# 🚀 تشغيل السيرفر - أمر واحد فقط

## إذا ظهر 502 Bad Gateway أو توقف السيرفر:

### شغل هذا الأمر فقط:

```bash
bash /home/z/my-project/restart-server.sh
```

---

## أو استخدم الأمر الكامل:

```bash
pkill -9 -f "next dev" && pkill -9 -f "next-server" && fuser -k 3000/tcp 2>/dev/null && sleep 2 && cd /home/z/my-project && (bun run dev > /tmp/nextjs-server.log 2>&1 &) && sleep 10 && curl -s http://localhost:3000 | grep "<title>"
```

---

## 📋 التحقق من أن السيرفر يعمل:

```bash
curl -s http://localhost:3000 | grep "<title>"
```

### المفروض يظهر:
```html
<title>Smiley Dental Clinic - سمايلي لطب الأسنان</title>
```

---

## 🔐 بيانات الدخول:

```
Email: admin@smileydental.com
Password: Admin@123456
```

---

## ✅ ما تم إصلاحه:

- ✅ قاعدة البيانات متصلة (PostgreSQL - NeonDB)
- ✅ Prisma Client مُحدث
- ✅ السيرفر يعمل
- ✅ تسجيل الدخول يعمل

---

**شغل الأمر أعلاه إذا احتجت لإعادة تشغيل السيرفر!** 🎯
