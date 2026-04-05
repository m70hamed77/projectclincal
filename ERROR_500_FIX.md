# 🐛 حل خطأ 500 عند تسجيل الدخول

## المشكلة
عند محاولة تسجيل الدخول، يظهر هذا الخطأ:
```
POST http://localhost:3000/api/auth/login 500 (Internal Server Error)
```

---

## ✅ الحل (3 خطوات فقط)

### الخطوة 1: تأكد من ملف `.env`

افتح ملف `.env` في جذر المشروع وتأكد أنه يحتوي فقط على:

```env
DATABASE_URL="file:./db/custom.db"
```

⚠️ إذا كان يحتوي على رابط PostgreSQL، احذفه واستبدله بالسطر أعلاه.

---

### الخطوة 2: أنشئ قاعدة البيانات

في PowerShell، شغل:

```powershell
npx prisma db push
```

يجب أن ترى:
```
✅ Database created successfully
```

---

### الخطوة 3: أنشئ مستخدم Admin (الأهم!)

```powershell
npm run create-admin:js
```

أو:

```powershell
node scripts/create-admin.js
```

ستظهر لك هذه الرسالة:
```
✅ تم إنشاء مستخدم Admin بنجاح!
═══════════════════════════════════════
📧 البريد الإلكتروني: admin@smileydental.com
🔑 كلمة المرور: Admin@123456
═══════════════════════════════════════
```

---

### الخطوة 4: شغل المشروع

```powershell
npm run dev
```

---

## 🔐 جرب الدخول الآن

افتح المتصفح: `http://localhost:3000`

الدخول:
- **البريد:** admin@smileydental.com
- **كلمة المرور:** Admin@123456

---

## ❓ ماذا لو ما زال لا يعمل؟

### احذف قاعدة البيانات وأنشئها من جديد:

```powershell
# 1. احذف الملف القديم
Remove-Item db/custom.db

# 2. أنشئ قاعدة بيانات جديدة
npx prisma db push

# 3. أنشئ Admin
npm run create-admin:js

# 4. أعد تشغيل السيرفر
npm run dev
```

---

## 📋 قائمة التحقق السريع

- [ ] ملف `.env` يحتوي على `DATABASE_URL="file:./db/custom.db"`
- [ ] مجلد `db` موجود
- [ ] تم تشغيل `npx prisma db push`
- [ ] تم إنشاء Admin باستخدام `npm run create-admin:js`
- [ ] السيرفر يعمل على `http://localhost:3000`

---

## 💡 لماذا يحدث هذا الخطأ؟

الخطأ 500 يحدث لأن:
1. قاعدة البيانات فارغة
2. لا يوجد مستخدمين في قاعدة البيانات
3. عند محاولة الدخول، السيرفر لا يجد مستخدم للتحقق من بياناته

الحل هو إنشاء مستخدم Admin أولاً!

---

## 📚 مزيد من المعلومات

- `SETUP_GUIDE.md` - دليل شامل
- `QUICK_START.md` - دليل سريع
- `.env.example` - مثال على ملف البيئة

---

**تم إنشاء هذا الملف بواسطة Z.ai Code**
