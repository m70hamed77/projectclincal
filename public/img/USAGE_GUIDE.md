# 🔹 دليل استخدام الصور في الموقع
# Background Images Usage Guide

## 📁 هيكل المجلدات - Folder Structure

```
public/
└── img/
    ├── README.md                  - هذا الملف التوضيحي
    ├── USAGE_GUIDE.md             - دليل الاستخدام
    ├── login-bg.jpg              - خلفية صفحة تسجيل الدخول
    ├── register-bg.jpg           - خلفية صفحة التسجيل
    ├── forgot-password-bg.jpg    - خلفية صفحة نسيت كلمة المرور
    ├── home-hero-bg.jpg          - خلفية القسم الرئيسي
    ├── dashboard-bg.jpg          - خلفية لوحة التحكم
    └── default-bg.jpg            - خلفية افتراضية
```

---

## 🚀 كيفية إضافة صورة خلفية جديدة

### الخطوة 1: إضافة الصورة
1. انسخ صورتك وضعها في مجلد `public/img/`
2. سمّ الصورة باسم واضح (مثال: `login-bg.jpg`)

### الخطوة 2: استخدام الصورة في الكود

في صفحة Next.js (`.tsx`):

```tsx
{/* المكان الذي تريد إضافة الخلفية فيه */}
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    // استخدم المسار المباشر من مجلد public/img
    backgroundImage: 'url("/img/your-image-name.jpg")',
  }}
/>
```

### الخطوة 3: إضافة طبقة شفافة (اختياري ولكن موصى به)

لتحسين وضوح النصوص فوق الصورة:

```tsx
{/* طبقة شفافة فوق الصورة */}
<div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 to-slate-900/90" />
```

---

## 📝 الصفحات المحدثة

### 1. صفحة تسجيل الدخول
**الملف:** `/src/app/auth/login/page.tsx`
**المسار:** `/img/login-bg.jpg`

```tsx
// ابحث عن هذا الجزء في الكود
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url("/img/login-bg.jpg")',  // ← غيّر هذا المسار
  }}
/>
```

### 2. صفحة التسجيل
**الملف:** `/src/app/auth/register/page.tsx`
**المسار:** `/img/register-bg.jpg`

```tsx
// ابحث عن هذا الجزء في الكود
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url("/img/register-bg.jpg")',  // ← غيّر هذا المسار
  }}
/>
```

### 3. صفحة نسيت كلمة المرور
**الملف:** `/src/app/forgot-password/page.tsx`
**المسار:** `/img/forgot-password-bg.jpg`

```tsx
// ابحث عن هذا الجزء في الكود
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url("/img/forgot-password-bg.jpg")',  // ← غيّر هذا المسار
  }}
/>
```

---

## 🎨 نصائح لاختيار الصور المناسبة

### ✅ مواصفات الصور الموصى بها:

| الخاصية | القيمة الموصى بها |
|---------|-------------------|
| العرض | 1920 بكسل أو أكثر |
| الارتفاع | 1080 بكسل أو أكثر |
| التنسيق | WebP (موصى به) أو JPG/PNG |
| الحجم | أقل من 2 MB (بعد الضغط) |
| الألوان | فاتحة أو متوسطة الإضاءة |
| المحتوى | تجريدي أو غير مشتت |

### 🎯 أنواع الصور المناسبة:

1. **لصفحات تسجيل الدخول/التسجيل:**
   - خلفيات طبية نظيفة
   - صور عيادات أو مستشفيات
   - أشكال هندسية ناعمة
   - تدرجات لونية حديثة

2. **للوحة التحكم:**
   - خلفيات احترافية هادئة
   - صور تعبر عن النظام والأمان
   - أشكال تجريدية بسيطة

3. **للصفحة الرئيسية:**
   - صور ملهمة عن الأسنان والصحة
   - صور لفريق العمل أو العيادة
   - رسومات توضيحية جذابة

---

## 🔧 الصيغ المدعومة

```
✅ .jpg   - الأكثر شيوعاً، جودة عالية
✅ .jpeg  - مثل JPG
✅ .png   - يدعم الشفافية
✅ .webp  - الحجم الأصغر والأداء الأفضل (موصى به)
✅ .svg   - رسومات متجهة (خفيفة جداً)
```

---

## 🌐 استخدام صور من الإنترنت (للتجربة)

يمكنك استخدام صور مجانية من Unsplash أو Pexels للتطوير:

```tsx
// مثال: صورة طبية من Unsplash
style={{
  backgroundImage: 'url("https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80")',
}}

// مثال: خلفية تجريدية
style={{
  backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&q=80")',
}}
```

**⚠️ ملاحظة:** في الإنتاج النهائي، يفضل تحميل الصور محلياً لضمان:
- سرعة التحميل
- عدم الاعتماد على مصادر خارجية
- الاستقرار والثبات

---

## 📤 مواقع للحصول على صور مجانية

1. **Unsplash:** https://unsplash.com/
   - كلمات بحث مقترحة: dental, medical, clinic, hospital

2. **Pexels:** https://www.pexels.com/
   - كلمات بحث مقترحة: dentist, healthcare, medical office

3. **Freepik:** https://www.freepik.com/
   - رسومات توضيحية وخلفيات طبية

4. **Pixabay:** https://pixabay.com/
   - صور مجانية بدون حقوق ملكية

---

## ⚡ تحسين الأداء

### ضغط الصور قبل الرفع:

1. استخدم أدوات مثل:
   - TinyPNG: https://tinypng.com/
   - Squoosh: https://squoosh.app/
   - ImageOptim (لـ Mac)

2. قلل الحجم بدون التأثير على الجودة

### استخدام WebP:

```bash
# تحويل JPG إلى WebP (باستخدام أدوات متاحة)
cwebp -q 80 input.jpg -o output.webp
```

---

## 🔍 استكشاف الأخطاء

### المشكلة: الصورة لا تظهر

**الحلول:**
1. تأكد من أن الصورة موجودة في `public/img/`
2. تأكد من صحة اسم الملف (حساسة للأحرف الكبيرة والصغيرة)
3. تأكد من المسار يبدأ بـ `/`
4. تحقق من console المتصفح لأي أخطاء

### المشكلة: النصوص غير واضحة

**الحلول:**
1. أضف طبقة شفافة فوق الصورة
2. استخدم ألوان فاتحة للصورة
3. قلل شفافية الطبقة (مثال: `from-slate-950/90`)

### المشكلة: الصورة مشوهة

**الحلول:**
1. استخدم صورة بالأبعاد الصحيحة (16:9)
2. استخدم `bg-cover` بدلاً من `bg-contain`
3. استخدم `bg-center` لمحاذاة الصورة في المنتصف

---

## 📚 أمثلة إضافية

### خلفية متعددة الصور (Background Pattern):

```tsx
<div
  className="absolute inset-0"
  style={{
    backgroundImage: `
      url("/img/pattern-1.png"),
      url("/img/pattern-2.png")
    `,
    backgroundPosition: 'top left, bottom right',
    backgroundRepeat: 'repeat, repeat',
  }}
/>
```

### خلفية متحركة (Animated Background):

```tsx
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pulse"
  style={{
    backgroundImage: 'url("/img/animated-bg.jpg")',
  }}
/>
```

---

## ✅ قائمة التحقق

عند إضافة صورة جديدة، تأكد من:

- [ ] الصورة في المجلد الصحيح `public/img/`
- [ ] اسم الملف صحيح في الكود
- [ ] الصورة بحجم مناسب (1920x1080 أو أكبر)
- [ ] الصورة مضغوطة (أقل من 2 MB)
- [ ] ألوان الصورة فاتحة بما يكفي
- [ ] طبقة شفافة مضافة فوق الصورة
- [ ] النصوص واضحة مقروءة
- [ ] الصورة تظهر في المتصفح
- [ ] لا توجد أخطاء في console

---

## 💡 نصيحة أخيرة

إذا كنت غير متأكد من الصورة المناسبة:
1. ابدأ بخلفية بسيطة (تدرج لوني)
2. جرب صور مختلفة حتى تجد المناسبة
3. اطلب رأي الآخرين
4. تأكد أن الصورة تعكس هوية موقعك

---

**تم إنشاء هذا الدليل بواسطة:** Z.ai Code  
**آخر تحديث:** 2024
