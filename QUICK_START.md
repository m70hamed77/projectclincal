# ⚡ البدء السريع

## المشكلة: خطأ 500 عند تسجيل الدخول؟

الحل بسيط! اتبع هذه الخطوات:

---

## 🚀 الخطوات (5 دقائق فقط)

### 1️⃣ تأكد من ملف `.env`

افتح `.env` وتأكد أنه يحتوي على:

```env
DATABASE_URL="file:./db/custom.db"
```

---

### 2️⃣ تأكد من وجود مجلد `db`

في مجلد المشروع، يجب أن يكون مجلد اسمه `db`

إذا لم يكن موجوداً، أنشئه:
```powershell
mkdir db
```

---

### 3️⃣ أنشئ قاعدة البيانات

```powershell
npx prisma db push
```

---

### 4️⃣ أنشئ مستخدم Admin (مهم جداً!)

**الطريقة الأولى (باستخدام npm):**
```powershell
npm run create-admin:js
```

**الطريقة الثانية (مباشرة):**
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

### 5️⃣ شغل المشروع

```powershell
npm run dev
```

افتح المتصفح: `http://localhost:3000`

---

## 🔐 الدخول

استخدم هذه البيانات:

```
البريد: admin@smileydental.com
كلمة المرور: Admin@123456
```

---

## ❓ ماذا لو ما زال الخطأ 500 يظهر؟

### الحل 1: احذف قاعدة البيانات وأنشئها من جديد

```powershell
# احذف ملف قاعدة البيانات
rm db/custom.db

# أنشئها من جديد
npx prisma db push

# أنشئ Admin من جديد
npm run create-admin:js

# أعد تشغيل السيرفر
npm run dev
```

### الحل 2: تحقق من logs في Terminal

افتح Terminal وابحث عن أخطاء مثل:
- `PrismaClientInitializationError`
- `Database connection error`
- `Invalid datasource URL`

---

## 📞 مزيد من المساعدة

اقرأ الملف الكامل: `SETUP_GUIDE.md`

---

**ملاحظة:** هذا الخطأ 500 يحدث عادة لأن قاعدة البيانات فارغة وليس هناك مستخدم Admin للدخول!
