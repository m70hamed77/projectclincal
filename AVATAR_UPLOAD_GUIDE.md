# 📸 دليل رفع صورة البروفايل - الكود المصحح

## 📋 **المشاكل التي تم إصلاحها في الكود الأصلي:**

| المشكلة | الكود الأصلي ❌ | الكود المصحح ✅ |
|---------|-----------------|----------------|
| مسار API | `/api/upload-profile` | `/api/user/profile-avatar` |
| اسم الحقل | `image` | `avatar` |
| استخدام Prisma | `import { prisma }` | `import { db }` |
| حقل قاعدة البيانات | `profileImage` | `avatarUrl` |
| إنشاء المجلد | غير موجود | `mkdir` تلقائي |
| Validation | محدود | شامل (نوع + حجم) |
| معاينة الصورة | غير موجود | موجود ✅ |
| رسائل واضحة | `alert()` فقط | UI messages ✅ |

---

## ✅ **الملفات المصححة:**

### 1. `src/components/ProfileImageUpload.tsx` - Component الجديد
### 2. `src/app/api/user/profile-avatar/v2-route.ts` - API Route الجديد

---

## 🚀 **كيفية الاستخدام:**

### **الطريقة 1: استخدام Component الجديد**

```tsx
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function SettingsPage() {
  const { user } = useCurrentUser();

  return (
    <div>
      <h1>إعدادات الحساب</h1>
      <ProfileImageUpload
        userId={user?.id}
        currentImage={user?.avatarUrl}
        onUploadSuccess={(imageUrl) => {
          console.log('Image uploaded:', imageUrl);
        }}
      />
    </div>
  );
}
```

### **الطريقة 2: استخدام الـ API مباشرة**

```typescript
// Example usage in any component
const handleUpload = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append('avatar', file); // ✅ Important: "avatar" not "image"
  formData.append('userId', userId);

  const response = await fetch('/api/user/profile-avatar', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (response.ok) {
    console.log('Success:', data.avatarUrl);
  } else {
    console.error('Error:', data.error);
  }
};
```

---

## 📁 **الهيكل المطلوب:**

```
/home/z/my-project/
├── public/
│   └── uploads/
│       └── avatars/          # ✅ موجود بالفعل
├── src/
│   ├── components/
│   │   └── ProfileImageUpload.tsx  # ✅ Component الجديد
│   ├── app/
│   │   └── api/
│   │       └── user/
│   │           └── profile-avatar/
│   │               ├── route.ts        # API الحالي
│   │               └── v2-route.ts     # API الجديد (مصحح)
│   └── lib/
│       └── db.ts              # ✅ موجود بالفعل
```

---

## 🎯 **المميزات الجديدة:**

### Frontend Features:
- ✅ معاينة الصورة قبل الرفع
- ✅ Validation شامل (نوع الملف + الحجم)
- ✅ رسائل واضحة (نجاح/خطأ) باللغة العربية
- ✅ UI احترافي مع أيقونات
- ✅ Loading state واضح
- ✅ زر مسح للصورة المختارة
- ✅ تحديث localStorage تلقائياً
- ✅ إعادة تحميل الصفحة تلقائياً بعد النجاح

### Backend Features:
- ✅ Logging مفصل لكل خطوة
- ✅ التحقق من وجود المستخدم
- ✅ إنشاء المجلد تلقائياً
- ✅ أسماء فريدة للصور (userId_timestamp.ext)
- ✅ Validation مزدوج (Frontend + Backend)
- ✅ رسائل خطأ واضحة
- ✅ GET endpoint لجلب بيانات المستخدم

---

## 📝 **الملاحظات المهمة:**

### 1. **اسم الحقل مهم جداً**
```typescript
// ❌ خطأ
formData.append("image", file);

// ✅ صحيح
formData.append("avatar", file);
```

### 2. **مسار API**
```typescript
// ❌ خطأ
fetch("/api/upload-profile", ...)

// ✅ صحيح
fetch("/api/user/profile-avatar", ...)
```

### 3. **اسم الحقل في قاعدة البيانات**
```typescript
// ❌ خطأ
await prisma.user.update({
  data: { profileImage: imageUrl }
})

// ✅ صحيح
await db.user.update({
  data: { avatarUrl: imageUrl }
})
```

### 4. **استخدام db وليس prisma**
```typescript
// ❌ خطأ
import { prisma } from "@/lib/db";

// ✅ صحيح
import { db } from "@/lib/db";
```

---

## 🔍 **التشخيص والـ Debug:**

### افتح Console في المتصفح (F12) لرؤية:
```
[ProfileImageUpload] Uploading for user: cmldqgua50000qx7tuudti8vf
[ProfileImageUpload] Response: 200 { success: true, avatarUrl: "/uploads/avatars/..." }
```

### افتح Server Logs:
```bash
tail -f /home/z/my-project/dev.log
```

سترى:
```
[PROFILE-AVATAR] 📸 Upload request received
[PROFILE-AVATAR] Request: { userId: '...', fileName: '...', fileSize: ... }
[PROFILE-AVATAR] ✅ File saved: /home/z/my-project/public/uploads/avatars/...
[PROFILE-AVATAR] ✅ Database updated: { userId: '...', avatarUrl: '...' }
```

---

## 🎨 **مثال كامل:**

```tsx
"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfileImageUpload from "@/components/ProfileImageUpload";

export default function SettingsPage() {
  const { user } = useCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">إعدادات الحساب</h1>

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">صورة البروفايل</h2>

          <ProfileImageUpload
            userId={user?.id}
            currentImage={user?.avatarUrl}
            onUploadSuccess={(imageUrl) => {
              console.log('✅ Image uploaded successfully:', imageUrl);
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## ⚠️ **Common Errors & Solutions:**

### Error: "يجب اختيار صورة"
**Cause:** لم يتم اختيار ملف
**Solution:** تأكد من اختيار صورة قبل الضغط على زر الرفع

### Error: "نوع الملف غير مدعوم"
**Cause:** الملف ليس بصورة
**Solution:** استخدم JPG, PNG, WebP, أو GIF فقط

### Error: "حجم الصورة يجب أن يكون أقل من 5MB"
**Cause:** الصورة كبيرة جداً
**Solution:** قلل حجم الصورة إلى أقل من 5MB

### Error: "المستخدم غير موجود"
**Cause:** userId غير صحيح أو لم يسجل المستخدم الدخول
**Solution:** تأكد من تسجيل الدخول وأن userId صحيح

### Error: 500 Internal Server Error
**Cause:** خطأ في الخادم
**Solution:** تحقق من Server Logs في `dev.log`

---

## 📞 **الدعم:**

إذا واجهت أي مشاكل:
1. افتح Console في المتصفح (F12)
2. تحقق من Network tab للـ API requests
3. راجع Server Logs في `/home/z/my-project/dev.log`
4. تأكد من:
   - ✅ تسجيل الدخول
   - ✅ userId صحيح
   - ✅ نوع وحجم الصورة صحيح
   - ✅ مجلد `public/uploads/avatars` موجود

---

## ✨ **مثال عرض الصورة:**

```tsx
<img
  src={user?.avatarUrl || "/default-avatar.png"}
  alt="Profile"
  className="w-24 h-24 rounded-full object-cover"
/>
```

---

**تم الإنشاء بواسطة:** Z.ai Code Assistant
**التاريخ:** 2024
**الإصدار:** 2.0 (مصحح)
