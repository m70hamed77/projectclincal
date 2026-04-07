# إصلاح مشاكل البرفيو

## المشكلة الحالية:
- الخادم لا يعمل بشكل مستمر في الخلفية
- البرفيو لا يظهر
- Console يظهر أخطاء

## الحل:
يرجى تشغيل الخادم يدوياً باستخدام الأمر التالي:

```bash
cd /home/z/my-project && bun run dev
```

## المشاكل المعروفة:
1. الصور المفقودة:
   - /img/forYou.png
   - /img/features.PNG
   - /img/register.jpg
   - /img/faq.png

   الحل: ضع الصور في مجلد `/public/img/` بالأسماء المذكورة أعلاه.

## الإحصائيات تعمل:
- Active students: 1
- Active patients: 1
- Completed cases: 0
- Average rating: 0

## حالة الخادم:
يعمل على: http://localhost:3000
