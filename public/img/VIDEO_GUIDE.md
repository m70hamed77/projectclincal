# 🎬 دليل إضافة فيديو شرح المنصة
# Platform Demo Video Guide

## 📍 المكان في الصفحة الرئيسية

الفيديو موجود في **الصفحة الرئيسية** بعد قسم Hero وقبل قسم Features.

**الملف:** `/src/app/page.tsx`  
**السطر:** تقريباً 140-266

---

## 🚀 كيفية إضافة الفيديو (3 طرق)

### الطريقة 1: فيديو محلي (موصى به)

#### الخطوة 1: تحضير الفيديو
```
المواصفات الموصى بها:
- الدقة: 1920x1080 (Full HD) أو أعلى
- التنسيق: MP4 أو WebM
- الحجم: أقل من 50 MB
- المدة: 1-3 دقائق
- الصيغة: 16:9 (wide)
```

#### الخطوة 2: رفع الفيديو
```
1. ضع الفيديو في مجلد: public/img/
2. سمّه باسم واضح مثل: platform-demo.mp4

مثال:
platform-demo.mp4 → public/img/platform-demo.mp4
```

#### الخطوة 3: تحديث الكود

اذهب للملف `/src/app/page.tsx` وابحث عن:

```tsx
{/* 🔹 غيّر هذا المسار لاسم ملف الفيديو الخاص بك */}
<source src="/img/platform-demo.mp4" type="video/mp4" />
```

غيّر `platform-demo.mp4` لاسم ملفك.

#### الخطوة 4 (اختياري): إضافة صورة غلاف (Poster)

```
1. ضع صورة الغلاف في: public/img/
2. سمّها: video-poster.jpg
3. احفظ الفيديو بصيغة 16:9

المواصفات:
- الدقة: نفس الفيديو (1920x1080)
- الحجم: أقل من 1 MB
- التنسيق: JPG أو WebP
```

في الكود، ابحث عن:
```tsx
poster="/img/video-poster.jpg"
```

---

### الطريقة 2: فيديو من YouTube

#### الخطوة 1: احصل على رابط الفيديو
```
رابط YouTube المباشر:
https://www.youtube.com/watch?v=YOUR_VIDEO_ID

Video ID: الجزء بعد v=
مثال: dQw4w9WgXcQ
```

#### الخطوة 2: تحديث الكود

في `/src/app/page.tsx`، ابحث عن قسم YouTube الموجود داخل التعليق:

```tsx
{/* مثال لـ YouTube (افتح التعليق التالي للاستخدام): */}
{/*
<div className="aspect-video">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="Platform Demo"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
*/}
```

1. احذف `{/*` و `*/}` لتفعيل الكود
2. استبدل `YOUR_VIDEO_ID` بـ ID الفيديو الخاص بك
3. علّق أو احذف كود `<video>` الأصلي

#### مثال كامل:
```tsx
<div className="aspect-video">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="Platform Demo"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

---

### الطريقة 3: فيديو من Vimeo

#### الخطوة 1: احصل على رابط الفيديو
```
رابط Vimeo المباشر:
https://vimeo.com/YOUR_VIDEO_ID

Video ID: الرقم في الرابط
مثال: 123456789
```

#### الخطوة 2: تحديث الكود

في `/src/app/page.tsx`، ابحث عن قسم Vimeo الموجود داخل التعليق:

```tsx
{/* مثال لـ Vimeo (افتح التعليق التالي للاستخدام): */}
{/*
<div className="aspect-video">
  <iframe
    className="w-full h-full"
    src="https://player.vimeo.com/video/YOUR_VIDEO_ID"
    title="Platform Demo"
    allow="autoplay; fullscreen; picture-in-picture"
    allowFullScreen
  />
</div>
*/}
```

1. احذف `{/*` و `*/}` لتفعيل الكود
2. استبدل `YOUR_VIDEO_ID` بـ ID الفيديو الخاص بك
3. علّق أو احذف كود `<video>` الأصلي

---

## 🎨 تخصيص مظهر الفيديو

### تغيير لون الإطار (Border)

ابحث عن:
```tsx
<div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
```

غيّر `border-white` إلى:
- `border-emerald-500` - أخضر
- `border-teal-500` - تيل
- `border-blue-500` - أزرق
- `border-purple-500` - بنفسجي
- `border-transparent` - بدون حدود

### تغيير خلفية الفيديو

غيّر `bg-slate-900` إلى:
- `bg-black` - أسود
- `bg-slate-800` - رمادي غامق
- `bg-gradient-to-br from-emerald-900 to-teal-900` - تدرج

---

## 📊 الكروت أسفل الفيديو

يمكنك تخصيص النصوص من خلال ملفات الترجمة:

### العربية: `/public/messages/ar.json`
```json
"videoSection": {
  "title": "عنوان القسم",
  "subtitle": "وصف القسم",
  "quick": "كلمة مختصرة",
  "quickDesc": "وصف مختصر",
  "easy": "كلمة مختصرة",
  "easyDesc": "وصف مختصر",
  "secure": "كلمة مختصرة",
  "secureDesc": "وصف مختصر"
}
```

### الإنجليزية: `/public/messages/en.json`
```json
"videoSection": {
  "title": "Section Title",
  "subtitle": "Section Description",
  "quick": "Short Word",
  "quickDesc": "Short Description",
  "easy": "Short Word",
  "easyDesc": "Short Description",
  "secure": "Short Word",
  "secureDesc": "Short Description"
}
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: الفيديو لا يظهر

**الحلول:**
1. تأكد من أن الفيديو في المجلد الصحيح `public/img/`
2. تأكد من صحة اسم الملف (حساسة للأحرف الكبيرة والصغيرة)
3. تأكد من أن المسار يبدأ بـ `/`
4. تحقق من console المتصفح لأي أخطاء
5. تأكد من أن المتصفح يدعم صيغة الفيديو

### المشكلة: الفيديو لا يعمل في بعض المتصفحات

**الحل:**
أضف صيغ بديلة (كما هو موجود في الكود):
```tsx
<video controls>
  <source src="/img/video.mp4" type="video/mp4" />
  <source src="/img/video.webm" type="video/webm" />
  <source src="/img/video.ogg" type="video/ogg" />
</video>
```

### المشكلة: الفيديو يأخذ وقت طويل للتحميل

**الحل:**
1. قلل حجم الفيديو (استخدم أدوات ضغط)
2. استخدم تنسيق WebM أو VP9 (أفضل ضغط)
3. استخدم خادم CDN إذا كان الفيديو كبيراً
4. استخدم رابط YouTube/Vimeo بدلاً من فيديو محلي

---

## 📝 نصائح لإنشاء فيديو احترافي

### المحتوى المقترح:
1. **المقدمة** (10 ثواني):
   - شعار المنصة
   - الهدف من المنصة

2. **للمرضى** (30 ثانية):
   - كيفية التسجيل
   - كيفية البحث عن حالات
   - كيفية التقديم
   - كيفية التواصل

3. **للطلاب** (30 ثانية):
   - كيفية التسجيل
   - كيفية رفع الكارنيه
   - كيفية إنشاء بوست
   - كيفية قبول الطلبات

4. **المميزات** (30 ثانية):
   - التقييمات
   - المراجعات
   - الأمان

5. **الختام** (10 ثانية):
   - دعوة للتسجيل
   - شعار المنصة

### الأدوات الموصى بها:
- **تسجيل الشاشة:** OBS Studio, Loom
- **تحرير الفيديو:** DaVinci Resolve (مجاني), CapCut (مجاني)
- **ضغط الفيديو:** HandBrake, TinyPNG Video

---

## ✅ قائمة التحقق

قبل نشر الفيديو، تأكد من:

- [ ] الفيديو في المجلد الصحيح `public/img/`
- [ ] اسم الملف صحيح في الكود
- [ ] الفيديو يعمل في المتصفحات المختلفة
- [ ] الفيديو يبدو جيداً على الجوال
- [ ] الصوت واضح
- [ ] الجودة جيدة (1080p أو أعلى)
- [ ] الحجم مناسب (أقل من 50 MB)
- [ ] الصورة الغلاف موجودة (اختياري)
- [ ] الترجمات صحيحة في العربية والإنجليزية
- [ ] لا توجد أخطاء في console المتصفح

---

## 💡 نصائح إضافية

1. **استخدم موسيقى هادئة في الخلفية** (اختياري)
2. **أضف تعليقات نصية** للمحتوى المهم
3. **اجعل الفيديو قصيراً** (1-3 دقائق)
4. **استخدم رسومات بسيطة وواضحة**
5. **ركز على المميزات الرئيسية فقط**
6. **اختبر الفيديو على أجهزة مختلفة**

---

## 🎯 أمثلة على ردود الفعل

### منصة L (مثال إلهام):
```
المقدمة: شعار + "تعلم كيف تستخدم منصتنا في 2 دقيقة"
المحتوى: شاشة حقيقية للمنصة
النهاية: "ابدأ الآن" + رابط التسجيل
```

### منصة Coursera (مثال إلهام):
```
المقدمة: مشهد متحرك جذاب
المحتوى: خطوات واضحة مع أرقام
النهاية: دعوة للتسجيل
```

---

**تم الإنشاء بواسطة:** Z.ai Code  
**آخر تحديث:** 2024
