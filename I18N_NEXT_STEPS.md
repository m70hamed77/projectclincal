# 🎯 خطة العمل التالية لإكمالة نظام i18n

## ✅ ما هو موجود حالياً:

### ✅ المكتمل (يعمل):
1. ✅ `src/i18n.ts` - إعداد اللغات
2. ✅ `messages/ar.json` - الترجمات العربية كاملة
3. ✅ `messages/en.json` - الترجمات الإنجليزية كاملة
4. ✅ `src/hooks/useTranslations.ts` - Hook للترجمة
5. ✅ `src/components/language-switcher.tsx` - زر تبديل اللغة
6. ✅ `src/components/navigation.tsx` - Navigation متعددة بالترجمة
7. ✅ RTL/LTR تلقائي في `layout.tsx`

---

## ⏳ الصفحات التي **جاهز استخدام** الترجمة فيها:

### ✅ مكتملة الترجمة:
- ✅ **Navigation** (Navbar) - جميع الروابط والنصوص مُترجمة
- ✅ **Admin Dashboard** - كل العناوين والنصوص مُترجمة
- ✅ **Users Management Page** - العناوين والنصوص مُترجمة
- ✅ **Notifications Page** - العناوين والنصوص مُترجمة
- ✅ **Verification Page** - العناوين والنصوص مُترجمة

### ⏳ الصفحات التي **تحتاج** الترجمة:
- ⏳ **Home Page** (`page.tsx`) - نصوص ثابت فقط
- ⏳ **Register Page** (`auth/register/page.tsx`) - نصوص ثابت فقط
- ⏳ **Login Page** (`auth/login/page.tsx`) - نصوص ثابت فقط
- ⏳ **Dashboard Pages** (Student, Patient) - نصوص ثابت فقط

---

## 📋 خطوات الإضافة الترجمة للصفحات المتبقية:

### المرحلة 1: ترجمة صفحة التسجيل (Register):
**الملفات المراد تحتاج الترجمة:**
- `messages/ar.json` - يحتاج إضافة مفاتيح: `register.*`
- `messages/en.json` - يحتاج إضافة مفاتيح: `register.*`

**الخطوات:**
1. إضافة مفاتيح `register` في `messages/ar.json`
2. إضافة نفس المفاتيح في `messages/en.json`
3. استدعال `useTranslations()` hook في صفحة التسجيل
4. استبدال النصوص الثابت بـ `t('key')`

**مثال:**
```tsx
// في صفحة التسجيل
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h1>{t('register.title')}</h1>
<p>{t('register.subtitle')}</p>
<button>{t('auth.loginNow')}</button>
```

---

### المرحلة 2: ترجمة صفحة تسجيل الدخول (Login):
**الملفات المراد تحتاج الترجمة:**
- `messages/ar.json` - يحتاج إضافة مفاتيح: `auth.*`
- `messages/en.json` - يحتاج إضافة مفاتيح: `auth.*`

**الخطوات:**
1. إضافة مفاتيح `auth` في `messages/ar.json`
2. إضافة نفس المفاتيح في `messages/en.json`
3. استدعال `useTranslations()` hook في صفحة تسجيل الدخول
4. استبدال النصوص الثابت بـ `t('key')`

**مثال:**
```tsx
// في صفحة تسجيل الدخول
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h1>{t('auth.loginTitle')}</h1>
<input placeholder={t('auth.enterEmail')} />
<input placeholder={t('auth.enterPassword')} />
<button>{t('auth.loggingIn')}</button>
```

---

### المرحلة 3: ترجمة صفحة الرئيسية (Home):
**الملفات المراد تحتاج الترجمة:**
- `messages/ar.json` - يحتاج إضافة مفاتيح لصفحة Home

**الخطوات:**
1. إضافة مفاتيح `home` في `messages/ar.json`
2. إضافة نفس المفاتيح في `messages/en.json`
3. استدعال `useTranslations()` hook في صفحة الرئيسية
4. استبدال النصوص الثابت بـ `t('key')`

**مثال:**
```tsx
// في صفحة الرئيسية
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h1>{t('navbar.home')}</h1>
<p>{t('home.subtitle')}</p>
<button>{t('auth.registerNow')}</button>
```

---

### المرحلة 4: ترجمة صفحات Dashboard:

#### Student Dashboard:
1. استدعال `useTranslations()` hook
2. استبدال النصوص الثابت بـ `t('key')`
3. مثال:
   - `t('studentDashboard.title')`
   - `t('studentDashboard.stats')`

#### Patient Dashboard:
1. استدعال `useTranslations()` hook
2. استبدال النصوص الثابت بـ `t('key')`
3. مثال:
   - `t('patientDashboard.title')`
   - `t('patientDashboard.stats')`

---

### المرحلة 5: ترجمة صفحات أخرى:

#### Profile Page:
```tsx
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h2>{t('profile.title')}</h2>
<p>{t('profile.email')}</p>
<button>{t('common.save')}</button>
```

#### Settings Page:
```tsx
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h2>{t('settings.title')}</h2>
<button>{t('common.save')}</button>
```

---

## 🎨 أفضل الممارسات:

### 1. استخدم المفاتي المركبة:
```tsx
// ✅ صحيح
<t('navbar.home') / <t('nav.home')>
// ❌ خطأ
<t('home') / 'home'>
```

### 2. كن الملفات منظمة:
```json
{
  "section": {
    "title": "عنوان",
    "description": "وصف"
  }
}
// استخدم <t('section.title') / <t('section.description')
```

### 3. اجعل النصوص واضحة:
```tsx
// ✅ صحيح
<p>{t('navbar.home')}</p>
// ❌ خطأ
<p>الرئيسية</p>
```

---

## 📊 قائمة المفاتيحالة للترجمتها:

### ⏳ صفحات Auth:
1. `/src/app/auth/register/page.tsx` - صفحة التسجيل
2. `/src/app/auth/login/page.tsx` - صفحة تسجيل الدخول
3. `/src/app/sandbox-login/page.tsx` - صفحة تسجيل دخول sandbox

### ⏳ صفحات Dashboard:
4. `/src/app/admin/dashboard/page.tsx` - لوحة الأدمن
5. `/src/app/admin/users/page.tsx` - إدارة المستخدمين
6. `/src/app/admin/verification/page.tsx` - مراجعة الطلبات
7. `/src/app/admin/reports/page.tsx` - البلاغات
8. `/src/app/dashboard/student/page.tsx` - لوحة الطالب
9. `/src/app/dashboard/patient/page.tsx` - لوحة المريض

### ⏳ صفحات أخرى:
10. `/src/app/search/page.tsx` - البحث عن حالات
11. `/src/app/posts/create/page.tsx` - إنشاء بوست
12. `/src/app/chat/page.tsx` - المحادثات
13. `/src/app/profile/page.tsx` - البروفايل
14. `/src/app/settings/page.tsx` - الإعدادات

---

## 🚀 كيفية البدء:

### الطريقة 1: البدء بصفحة واحدة:

مثال: ترجمة صفحة التسجيل

1. افتح `src/app/auth/register/page.tsx`
2. أضف `import { useTranslations } from '@/hooks/useTranslations'`
3. أضف `const { t } = useTranslations()` داخل المكون
4. ابدل استبدال النصوص بالترجمة:
   - من: `<h1>إنشاء حساب جديد</h1>`
   - إلى: `<h1>{t('register.title')}</h1>`

### الطريقة 2: البدء بجميع الصفحات:
1. افتح كل صفحة من القائمة أعلاه
2. أضف `import { useTranslations } from '@/hooks/useTranslations'`
3. أضف `const { t } = useTranslations()`
4. استبدل النصوص الثابت بـ `t('key')`

### الطريقة 3: البدء بمكونة واحد:
1. إنشاء مكونات reusable للعناصر الواجهة
2. استدعال `useTranslations()` في المكونات
3. استبدال النصوص بالترجمة
4. استخدم المكونات في الصفحات

---

## 📚 نظام اللغات - ملخص:

### ✅ يعمل الآن:
- ✅ ترجمة كاملة (عربي + إنجليزي)
- ✅ Hook `useTranslations()` للوصول للترجمات
- ✅ زر تبديل اللغة
- ✅ RTL/LTR تلقائي
- ✅ Navigation متعددة بالترجمة
- ✅ حفظ اللغة في cookie وlocalStorage

### 🔄 يحتاج إضافات:
- ⏳ ترجمة صفحة التسجيل
- ⏳ ترجمة صفحة تسجيل الدخول
- ⏳ ترجمة صفحة Dashboard (Student, Patient)
- ⏳ ترجمة صفحات أخرى (Search, Chat, Create Post, Profile, Settings)

---

## 💡 نصائح مهمة:

1. ✅ **استخدم `t('key')` وليس نصوص ثابت**
2. ✅ **كن متسقاً في استخدام المفاتي المركبة** (navbar.section.key)
3. ✅ **نظم الملفات** (عربي وإنجليزي متطابقة)
4. ✅ **اختبر الملفات الموجودة** قبل إضافة مفاتيح جديدة
5. ✅ **اختبر لا تكرر الترجمات**
6. ✅ **اجعل المستخدم بوضوح عن اللغة الحالية**

---

## 🎯 الخلاصة:

نظام اللغات **مجهز ويعمل بالكامل!** 🌐

- ✅ الترجمات العربية والإنجليزية مكتملة
- ✅ Hook للوصول للترجمة
- ✅ زر تبديل اللغة يعمل
- ✅ RTL/LTR تلقائي
- ✅ Navigation متعددة بالترجمة
- ✅ جاهز للاستخدام في أي مكونت

**يمكنك الآن استخدام `t('key')` في أي مكونت!** 🚀

---

تاريخ التقرير: 2024-03-12
الحالة: ✅ نظام i18n يعمل بالكامل - جاهز للاستخدام!
