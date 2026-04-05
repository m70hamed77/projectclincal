# 🌐 دليل استخدام نظام اللغات

## 🎯 ما هو نظام اللغات؟

نظام متكامل يسمح لك بعرض الموقع بلغتين (عربي/إنجليزي) بضغطة زر واحد.

---

## 📋 الملفات الأساسية:

### 1. **`src/i18n.ts`**
```typescript
export const locales = ["ar", "en"] as const
export const defaultLocale = "ar" as const
export type Locale = (typeof locales)[number]
```
**الوظيفة:** تحديد اللغات المسموحودة (عربي، إنجليزي)

### 2. **`messages/ar.json`** - الترجمات العربية
### 3. **`messages/en.json`** - الترجمات الإنجليزية

---

## 🎮 كيفية الاستخدام:

### 1. في المكونات:

#### ✅ استيراد Hook:
```tsx
'use client'

import { useTranslations } from '@/hooks/useTranslations'

export default function MyComponent() {
  const { t, locale } = useTranslations()
  
  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{t('navbar.home')}</h1>
      <p>{t('common.loading')}</p>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

#### ✅ الحصول على اللغة الحالية:
```tsx
const { locale } = useTranslations()

<p>اللغة الحالية: {locale === 'ar' ? 'العربية' : 'English'}</p>
```

#### ✅ تبديل اللغة:
```tsx
import { LanguageSwitcher } from '@/components/language-switcher'

<LanguageSwitcher />
```

---

## 🔑 Buttons المتاحة:

### 1. **Language Switcher (زر الأزرار AR/EN)**
- الموقع: `src/components/language-switcher.tsx`
- الوظيفة: يعرض زر AR و EN
- التأثير: عند الضغط يغير اللغة ويُحمل الصفحة
- المكان: Navigation

### 2. **Login/Register Buttons**
- الموقع: `/auth/login` و `/auth/register`
- تستخدم النصوص الثابت حالياً (لا تزال تستخدم `t()`)
- **تحتاج إصلاحها بـ `t()`**

### 3. **Navigation Links**
- الموقع: `src/components/navigation.tsx`
- جميع الروابط تستخدم `t('key')`
- متعددة بالكامل بالترجمة

---

## 📊 البيانات الدخول:

### 🔴 Admin (مدير النظام):
```
الإيميل: admin@smileydental.com
كلمة المرور: admin123
اللغة الافتراضية: العربية (ar)
```

### 🔵 Student (طالب):
```
الإيميل: abdelrahmansaber593@gmail.com
كلمة المرور: student123
اللغة الافتراضية: العربية (ar)
```

### 🟡 Patient (مريض):
```
يُنشأ حساب جديد
كلمة المرور: (ما يدخله)
اللغة الافتراضية: العربية (ar)
```

---

## 🎯 الترجمات الشاملة:

### 🌍 Navbar (القائمة):
- الرئيسية / Home
- المميزات / Features
- كيف يعمل؟ / How It Works
- الأسئلة الشائعة / FAQ
- تسجيل دخول / Login
- ابدأ الآن / Get Started
- تسجيل خروج / Logout
- البروفايل / Profile
- الإعدادات / Settings
- الإشعارات / Notifications
- المحادثات / Messages
- بحث عن حالات / Search Cases
- إنشاء بوست / Create Post
- لوحة الإدارة / Admin Dashboard
- المستخدمين / Users
- البلاغات / Reports
- لوحة التحكم / Dashboard
- لوحة تحكم الطالب / Student Dashboard
- لوحة تحكم المريض / Patient Dashboard

### 🏢 Admin Dashboard:
- لوحة الإدارة
- إدارة المستخدمين
- طلبات في الانتظار
- بلاغات جديدة
- إجمالي الدكاترة
- حالة النظام (قاعدة البيانات، الخادم، المصادقة)
- عرض كل المستخدمين
- مراجعة طلبات التحقق
- مراجعة وموافقة/رفض الطلبات

### 👥 Users Management:
- إدارة المستخدمين
- البحث والفلترة
- حالات الحسابات (قيد المراجعة، موثق، مرفوض، محذوفة، موقوفة)
- معلومات المستخدمين
- معلومات الطالب (الإيميل الجامعي، السنة الدراسية، صورة الكارنيه، سبب الرفض)

### 🔔 Notifications:
- الإشارات غير المقروء
- تحديد الكل كمقروء
- مسح الكل
- رسائل الإشعار
- عرض تفاصيل الإجراء

### 🔐 Authentication:
- عناوين وتسجيل الدخول
- رسائل الخطأ
- صفحات تسجيل الدخول
- رسائل "يجب تسجيل الدخول"، "غير مصرح بالوصول"

### 🛠 Common (الأزرار الشائعة):
- حفظ / Save
- إلغاء / Cancel
- حذف / Delete
- تعديل / Edit
- إضافة / Add
- إزالة / Remove
- تأكيد / Confirm
- إغلاق / Close
- إرسال / Submit
- إعادة تعيين / Reset
- بحث / Search
- فلترة / Filter
- ترتيب / Sort
- جاري التحميل / Loading
- لا توجد بيانات / No data
- خطأ / Error
- نجاح / Success
- تحذير / Warning
- معلومات / Info
- نعم / Yes
- لا / No
- رجوع / Back
- التالي / Next
- السابق / Previous
- متابعة / Continue
- إنهاء / Finish
- اختياري / Optional
- مطلوب / Required

---

## 🔄 خطوات الإضافة الترجمة:

### المرحلة 1: ترجمة صفحة التسجيل (Register)
```bash
# 1. افتح src/app/auth/register/page.tsx
# 2. استدع: import { useTranslations } from '@/hooks/useTranslations'
# 3. استدع: const { t } = useTranslations()
# 4. استبدل النصوص بالترجمة
# 5. استبدل: <h1>{t('register.title')}</h1>
```

### المرحلة 2: ترجمة صفحة تسجيل الدخول (Login)
```bash
# 1. افتح src/app/auth/login/page.tsx
# 2. استدع: import { useTranslations } from '@/hooks/useTranslations'
# 3. استدع: const { t } = useTranslations()
# 4. استبدل النصوص بالترجمة
# 5. استبدل: <h1>{t('auth.loginTitle')}</h1>
```

### المرحلة 3: ترجمة صفحة الرئيسية (Home)
```bash
# 1. افتح src/app/page.tsx
# 2. استدع: import { useTranslations } from '@/hooks/useTranslations'
# 3: استدع: const { t } = useTranslations()
# 4: استبدل النصوص بالترجمة
# 5: استبدل النصوص بالترجمة
# 6: استبدل: <h1>{t('home')}</h1>
```

---

## 🎨 ملاحظظات HTML للمكونات:

### ✅ Layout (Layout):
```html
<html lang={locale} dir={dir}>
```

### ✅ Language Switcher:
```tsx
<LanguageSwitcher />
```

### ✅ Use Translations Hook:
```tsx
const { t, locale } = useTranslations()
```

### ✅ RTL/LTR:
```tsx
<div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

---

## 🌍 اللغات المدعومة:

### العربية (ar) - RTL:
```json
{
  "navbar": {
    "home": "الرئيسية",
    "features": "المميزات"
  },
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف"
  }
}
```

### الإنجليزية (en) - LTR:
```json
{
  "navbar": {
    "home": "Home",
    "features": "Features"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

---

## 🚀 كيف تبدأ:

### 1. في أي مكونت، أضف هذا:
```tsx
import { useTranslations } from '@/hooks/useTranslations'

export default function MyComponent() {
  const { t, locale } = useTranslations()
  
  return (
    <div>
      {/* المحتوى هنا */}
      <h1>{t('navbar.home')}</h1>
    </div>
  )
}
```

### 2. زر تبديل اللغة موجود بالفعل في Navbar
```tsx
import { LanguageSwitcher } from '@/components/language-switcher'

<LanguageSwitcher />
```

### 3. اللغة ستتحدد تلقائياً:
- **عندما تضغط AR** → الصفحة RTL
- **عندما تضغط EN** → الصفحة LTR

---

## 📊 الخريطة النظام اللغات:

```
┌─────────────────────────────────────────────────┐
│  🏠 Home Page (صفحة الرئيسية)                  │
│  ⏳ يستخدم نصوص ثابت                 │
│  ⏳ يحتاج الترجمة                   │
│  │  └──► يمكنك إضافت الترجمة ←──┘    │
│  │                                           │
│  │  🏠 Auth Pages (صفحات المصادقة)            │
│  │  ⏳ يستخدم نصوص ثابت                 │
│  │  ⏳ يحتاج الترجمة                   │
│  │  │  └──► يمكنك إضافة الترجمة ←──┘    │
│  │                                           │
│  │  🏠 Dashboard Pages (لوحات التحكم)        │
│  │  ⏳ يستخدم نصوص ثابت                 │
│  │  ⏳ يحتاج الترجمة                   │
│  │  │  └──► يمكنك إضافة الترجمة ←──┘    │
│  │                                           │
│  │  🏠 Other Pages                          │
│  │  ⏳ تستخدم نصوص ثابت                 │
│  │  ⏳ يحتاج الترجمة                   │
│  │  │  └──► يمكنك إضافة الترجمة ←──┘    │
│  │                                           │
│  └─────────────────────────────────────────────┘
│                                           │
│  🌍 Navigation (القائمة)                         │
│  ✅ مكتملة الترجمة                                 │
│  │  • جميع النصوص تستخدم `t('key')`                     │
│  │  • RTL/LTR تلقائي (العربية RTL، الإنجليزية LTR)        │
│  │  • جميع الروابط تستخدم `withUserId(href)`                     │
│  │  • زر تبديل اللغة موجود بالفعل في Navbar                    │
│  │                                           │
│  └─────────────────────────────────────────────┘
│                                           │
│  🌐 Language Switcher (زر الأزرار AR/EN)                   │
│  ✅ موجود في Navigation                            │
│  │  • زر AR / EN                                    │
│  │  • يغير اللغة فوراً بدون كسر المشروع                     │
│  │  • يحفظ اللغة في cookie/localStorage                  │
│  │                                           │
│  └─────────────────────────────────────────────┘
│                                           │
│  🎯 useTranslations Hook                             │
│  ✅ موجود في `src/hooks/useTranslations.ts`                  │
│  │  • يقرأ من `/messages/{lang}.json`              │
│  │  • يوفر دالة `t(key): string` للوصول للترجمات           │
│  │  • يوفر اللغة الحالية: `locale: 'ar' | 'en'`  │
│  │  • يدعم مفاتي مركبة: `t('navbar.home')` = 'الرئيسية'  │
│  │  │                                           │
│  └─────────────────────────────────────────────┘
```

---

## 🎓 بيانات الدخول:

### 🔴 Admin:
```
الإيميل: admin@smileydental.com
كلمة المرور: admin123
اللغة الافتراضية: العربية
```

### 🔵 Student:
```
الإيميل: abdelrahmansaber593@gmail.com
كلمة المرور: student123
اللغة الافتراضية: العربية
```

### 🟡 Patient:
```
يُنشأ حساب جديد
كلمة المرور: (ما يدخله)
اللغة الافتراضية: العربية
```

---

## 🚀 خطوات سريعة للبدء:

### 1. اختر صفحة واحدة للبدء
   - `src/app/auth/register/page.tsx` (أسهل - نصوص أقل)
   - `src/app/auth/login/page.tsx` (أسهل - نصوص أقل)

### 2. افتح الملف وأضف:
   ```tsx
   import { useTranslations } from '@/hooks/useTranslations'
   const { t } = useTranslations()
   ```

### 3. استبدل النصوص:
   - من: `<h1>إنشاء حساب جديد</h1>`
   - إلى: `<h1>{t('register.title')}</h1>`

### 4. اختبر النتيج:
   - افتح Console (F12)
   - تأكد أن لا توجد أخطاء ESLint
   - اضغط على زر اللغة
   - تأكد أن الصفحة تعمل بدون تذبذب

### 5. تكرر العمل لكل صفحة
   - لا تنتقل كل الصفحات مرة واحدة
   - ركّل الصفحة وتأكد أنها تعمل
   - انتقل للصفحة التالية

---

## 💡 نصائح هامة:

### ✅ افعل:
- ✅ استخدم `t('key')` وليس نصوص ثابت
- ✅ استخدم مفاتي مركبة (navbar.section.key)
- ✅ نظم الملفات (عربي وإنجليزي متطابقة)
- ✅ ابدأ بصفحة واحدة فقط
- ✅ اختبر النتيج قبل الانتقال للصفحة التالية

### ❌ تجنب:
- ❌ لا تستخدم نصوص ثابت مع `useTranslations()` موجود
- ❌ لا تضف مفاتيح جديدة دون النسخ في messages/ar.json
- ❌ لا تضف مفاتيح جديدة دون النسخ في messages/en.json
- ❌ لا تكرر صفحات كثيرة مرة واحدة

---

## 🎉 الخلاصة:

نظام اللغات **مجهز ومستقر**! 🌐

- ✅ الترجمات كاملة (عربي + إنجليزي)
- ✅ Hook للوصول للترجمة
- ✅ زر تبديل اللغة يعمل
- ✅ RTL/LTR تلقائي
- ✅ Navigation متعددة بالترجمة
- ✅ جاهز للاستخدام في أي مكونت

**يمكنك الآن استخدام `t('key')` في أي مكونت!** 🚀

---

تاريخ التقرير: 2024-03-12
الحالة: ✅ نظام i18n يعمل بالكامل - جاهز للاستخدام!
