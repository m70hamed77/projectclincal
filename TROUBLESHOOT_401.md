# ⚠️ إذا ظهر خطأ 401 Unauthorized

## 🔍 المشكلة

خطأ 401 يعني أن **كلمة المرور غير صحيحة** أو البيانات التي تُرسل ليست هي نفس البيانات المتوقعة.

---

## ✅ الحل - اتبع هذه الخطوات بالضبط:

### الخطوة 1: امسح الـ Cache والـ Cookies
1. افتح المتصفح
2. اضغط `Ctrl + Shift + Delete` (Windows/Linux) أو `Cmd + Shift + Delete` (Mac)
3. اختر "All time"
4. حدد:
   - ✅ Cookies and other site data
   - ✅ Cached images and files
5. اضغط "Clear data"
6. أعد تحميل الصفحة (`F5`)

---

### الخطوة 2: استخدم البيانات الصحيحة
اذهب إلى `/auth/login` وأدخل بالضبط:

#### للدخول كمدير (Admin):
```
الإيميل: admin@smileydental.com
كلمة المرور: admin123
```

**⚠️ هام جداً:**
- ✅ استخدم **أحرف صغيرة فقط** في كلمة المرور: `admin123`
- ❌ لا تستخدم `Admin123` (أحرف كبيرة)
- ❌ لا تستخدم `ADMIN123` (كله كبير)
- ✅ الإيميل يمكن أن يكون بأي حالة (كبير/صغير)

---

### الخطوة 3: افحص Console
1. افتح Console (`F12` أو Right Click → Inspect → Console)
2. حاول تسجيل الدخول
3. انسخ ما يظهر في Console وأرسله لي

---

## 🧪 طريقة بديلة (مباشر من الـ API)

إذا لم يعمل من الصفحة، جرب من سطر الأوامر:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smileydental.com","password":"admin123"}'
```

---

## 🔍 فحص البيانات في قاعدة البيانات

إذا كنت تستخدم هذا على جهازك المحلي، جرب هذا:

```bash
cd /home/z/my-project
cat > check.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function check() {
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@smileydental.com' }
  })
  
  if (admin) {
    console.log('✅ Admin موجود')
    console.log('الإيميل:', admin.email)
    console.log('الحالة:', admin.status)
    
    const test = await bcrypt.compare('admin123', admin.password)
    console.log('كلمة المرور "admin123":', test ? '✅ صحيحة' : '❌ خاطئة')
    
    const test2 = await bcrypt.compare('Admin123', admin.password)
    console.log('كلمة المرور "Admin123":', test2 ? '✅ صحيحة' : '❌ خاطئة')
  } else {
    console.log('❌ Admin غير موجود')
  }
  
  await prisma.$disconnect()
}
check()
EOF
bun check.js
```

---

## 💡 نصائح إضافية

### 1. تأكد من عدم وجود مسافات
- ✅ صحيح: `admin123`
- ❌ خطأ: ` admin123` (مسافة في البداية)
- ❌ خطأ: `admin123 ` (مسافة في النهاية)

### 2. تأكد من حالة الأحرف
- ✅ صحيح: `admin123` (كلها صغيرة)
- ❌ خطأ: `Admin123` (A كبيرة)
- ❌ خطأ: `ADMIN123` (كلها كبيرة)
- ❌ خطأ: `aDmIn123` (حروف مختلطة)

### 3. انسخ والصق
للتجنب الأخطاء:
1. انسخ الإيميل: `admin@smileydental.com`
2. انسخ كلمة المرور: `admin123`
3. الصق في الحقول

---

## 🔄 إعادة تعيين كلمة المرور (إذا لزم الأمر)

إذا ما زلت المشكلة مستمرة، أعد إنشاء Admin:

```bash
cd /home/z/my-project
cat > reset.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function reset() {
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@smileydental.com' }
  })
  
  if (admin) {
    const hash = await bcrypt.hash('admin123', 10)
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hash }
    })
    console.log('✅ تم إعادة تعيين كلمة المرور')
    console.log('الإيميل: admin@smileydental.com')
    console.log('كلمة المرور: admin123')
  }
  
  await prisma.$disconnect()
}
reset()
EOF
bun reset.js
```

---

## 📞 ماذا تفعل إذا استمرت المشكلة؟

1. ✅ امسح Cache وCookies
2. ✅ تأكد من البيانات (أحرف صغيرة، لا مسافات)
3. ✅ افتح Console وأرسل لي Logs
4. ✅ حاول من متصفح آخر (Chrome, Firefox, Edge)
5. ✅ تأكد من أن السيرفر يعمل (bun run dev)

---

تاريخ التحديث: 2024-03-12
