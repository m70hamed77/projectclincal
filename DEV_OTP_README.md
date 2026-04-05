# نظام OTP لوضع التطوير (Dev Mode)

هذا النظام مصمم ليعمل في وضع التطوير بدلاً من إرسال SMS أو Email حقيقي.

## 🔹 كيفية العمل

### 1. **توليد كود OTP**
عندما يضغط المستخدم على "إرسال كود التحقق"، يتم:
- توليد كود جديد عشوائي من 6 أرقام
- طباعة الكود في Console بشكل واضح ومميز
- حفظ الكود لمدة 10 دقائق

### 2. **عرض الكود في Console**
```bash
============================================================
🔐 [DEV OTP] - وضع التطوير
============================================================
📱 الهدف: user@example.com
🔑 كود التحقق: 123456
⏰ صالح حتى: 3:45:30 PM
⏳ المدة المتبقية: 10 دقائق
============================================================
```

### 3. **التحقق من الكود**
- المستخدم يدخل الكود في صفحة التحقق
- يتم المقارنة مع الكود المخزن
- إذا صحيح → يتم حذف الجلسة والتمرير
- إذا خطأ → يظهر عدد المحاولات المتبقية (حد أقصى 5 محاولات)

## 🔹 الاستخدام

### في Next.js / React

### إرسال كود التحقق:

```typescript
import { generateOtp } from '@/lib/devOtp'

// إرسال كود
const code = generateOtp('user@example.com')
// الكود يظهر تلقائياً في Console
```

### التحقق من الكود:

```typescript
import { verifyOtp } from '@/lib/devOtp'

// التحقق
const result = verifyOtp('user@example.com', '123456')

if (result.success) {
  console.log('✅ تم التحقق بنجاح!')
} else {
  console.log('❌', result.message)
}
```

## 🔹 الـ API Routes

### إرسال كود (Email)
```typescript
POST /api/auth/send-verification-code
Body: { email: "user@example.com" }
Response: { success: true, devCode: "123456" } // في وضع التطوير فقط
```

### إرسال كود (SMS)
```typescript
POST /api/auth/send-sms-code
Body: { phone: "01012345678" }
Response: { success: true, devCode: "123456" } // في وضع التطوير فقط
```

### التحقق من الكود (Email)
```typescript
POST /api/auth/verify-code
Body: { email: "user@example.com", code: "123456" }
Response: { success: true, message: "تم التحقق بنجاح" }
```

### التحقق من الكود (SMS)
```typescript
POST /api/auth/verify-sms-code
Body: { phone: "01012345678", code: "123456" }
Response: { success: true, message: "تم التحقق بنجاح" }
```

## 🔹 الميزات

✅ **آمن للتطوير**
- لا يتم إرسال SMS أو Email حقيقي
- لا يوجد تكلفة مالية
- لا حاجة لـ API Keys خارجية

✅ **ديناميكي**
- كل ضغطة تولد كود جديد
- الكود صالح لمدة 10 دقائق فقط
- يمكن إعادة الإرسال للحصول على كود جديد

✅ **محدود المحاولات**
- حد أقصى 5 محاولات للتحقق
- بعد تجاوز الحد، يجب إرسال كود جديد
- يظهر عدد المحاولات المتبقية للمستخدم

✅ **تنظيف تلقائي**
- الجلسات المنتهية تُحذف تلقائياً
- يمكن استدعاء `cleanupExpiredSessions()` يدوياً

✅ **سهل التحويل لاحقاً**
- يمكن بسهولة استبدال Console Log بإرسال SMS حقيقي
- يمكن استخدام نفس المنطق مع Redis في الإنتاج
- الكود جاهز للعمل مع أي خدمة إرسال

## 🔹 الفوائد مقارنة بالطرق الأخرى

| الميزة | نظام Dev OTP | SMS حقيقي | Email حقيقي |
|--------|--------------|------------|--------------|
| التكلفة | مجاني | مدفوع | مدفوع |
| السرعة | فوري | تأخير بسيط | تأخير بسيط |
| الموثوقية | عالي للـ Dev | عالي | عالي |
| سهولة التطوير | بسيط جداً | متوسط | متوسط |
| قابلية التحويل | سهل | لا يحتاج تحويل | لا يحتاج تحويل |

## 🔹 أمثلة الاستخدام

### مثال 1: تسجيل مستخدم جديد
```typescript
// 1. المستخدم يضغط "إرسال كود"
const code = generateOtp(userEmail)

// 2. الكود يظهر في Console
// [DEV OTP] كود التحقق: 123456

// 3. المستخدم يدخل الكود في صفحة التحقق
const result = verifyOtp(userEmail, inputCode)

// 4. إذا صحيح، إنشاء الحساب
if (result.success) {
  await createUser(userData)
}
```

### مثال 2: إعادة إرسال الكود
```typescript
// المستخدم يضغط "إعادة إرسال"
const newCode = generateOtp(userEmail)
// كود جديد تماماً يظهر في Console
```

### مثال 3: التحقق متعدد
```typescript
// المحاولة 1
verifyOtp(userEmail, '111111') // ❌ خطأ (4 محاولات متبقية)

// المحاولة 2
verifyOtp(userEmail, '222222') // ❌ خطأ (3 محاولات متبقية)

// المحاولة 3
verifyOtp(userEmail, '123456') // ✅ صحيح!
```

## 🔹 ملاحظات مهمة

⚠️ **وضع التطوير فقط**
- هذا النظام مصمم للاستخدام في وضع التطوير
- في الإنتاج، يجب استبداله بـ SMS أو Email حقيقي
- Console Logs لا تظهر في الإنتاج

⚠️ **لا تستخدم في الإنتاج**
- في الإنتاج، استخدم Twilio لـ SMS أو Resend لـ Email
- استخدم Redis أو قاعدة بيانات لتخزين الأكواد
- لا تعتمد على Map في الإنتاج

⚠️ **الأمان**
- الكودات صالحة لمدة 10 دقائق فقط
- بعد التحقق الناجح، يُحذف الكود فوراً
- حد أقصى 5 محاولات للتحقق

## 🔹 الدوال المتاحة

```typescript
// توليد كود جديد
generateOtp(identifier: string): string

// التحقق من كود
verifyOtp(identifier: string, inputCode: string): { success: boolean; message: string }

// الحصول على الكود الحالي (للـ debug)
getCurrentOtp(identifier: string): string | null

// الحصول على معلومات الجلسة
getOtpSessionInfo(identifier: string): OtpSession | null

// حذف جلسة OTP
deleteOtpSession(identifier: string): void

// تنظيف الجلسات المنتهية
cleanupExpiredSessions(): void
```

## 🔹 الخلاصة

هذا النظام مثالي لـ:
- 🧪 التطوير والاختبار بدون تكلفة
- 🚧 البرمجة والتطوير السريع
- 📱 اختبار تدفقات الـ UI/UX
- 🎓 التعليم والتدريب

نفس المنطق يمكن استخدامه لاحقاً مع أي خدمة إرسال حقيقية! 🎯
