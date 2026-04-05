# 🔗 Figma Integration Guide - دليل الربط مع Figma

## كيف تربط مشروع Next.js بـ Figma

---

## 🎯 الطريقة السريعة (Figma Dev Mode)

### الخطوة 1: افتح Figma
1. افتح ملف Figma الخاص بالمشروع
2. فعّل **Dev Mode** (اضغط `Shift + D`)

### الخطوة 2: انسخ CSS من أي عنصر
- اضغط على العنصر (مثلاً زر أو كارد)
- في الـ右侧 Panel ستجد **Code Section**
- انسخ الـ CSS أو Tailwind Classes

### الخطوة 3: طبّق الكود في المشروع
```tsx
// في Figma Dev Mode تجد:
<button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold">
  Button
</button>

// طبّقه مباشرة في ملف React
```

---

## 🛠️ الطريقة المتقدمة (Using Plugins)

### Plugin 1: Figma to React

**التثبيت:**
```
1. افتح Figma
2. Plugins → Browse plugins → "Figma to React"
3. Install
```

**الاستخدام:**
```
1. حدد العنصر في Figma
2. Plugins → "Figma to React"
3. اضغط "Export"
4. انسخ الكود إلى مشروعك
```

---

### Plugin 2: Builder.io Visual Copilot

**المميزات:**
- يحول Figma لـ React + Tailwind
- يدعم shadcn/ui
- دقيق جداً

**التثبيت:**
```
1. Plugins → "Builder.io Visual Copilot"
2. Connect to GitHub
3. Select your project
```

---

### Plugin 3: TeleportHQ

**المميزات:**
- يحول لـ Next.js
- يدعم TypeScript
- يدعم Tailwind CSS

**التثبيت:**
```
1. Plugins → "TeleportHQ"
2. حدد العنصر
3. Export → Next.js + Tailwind
```

---

## 📐 استخدام Design Tokens من Figma

### الخطوة 1: Export Tokens من Figma

```
1. Plugins → "Design Tokens"
2. Export as JSON
3. احفظ الملف
```

### الخطوة 2: استورد في المشروع

```typescript
// src/lib/tokens.ts
import figmaTokens from './figma-tokens.json'

export const colors = figmaTokens.colors
export const spacing = figmaTokens.spacing
export const borderRadius = figmaTokens.borderRadius
```

### الخطوة 3: استخدم في Tailwind Config

```javascript
// tailwind.config.js
import { colors, spacing, borderRadius } from './src/lib/tokens'

export default {
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius
    }
  }
}
```

---

## 🎨 ربط المكونات بـ Figma

### مثال: Button Component

```tsx
/**
 * Button Component
 * Figma: Buttons / Primary Button
 * Link: https://www.figma.com/file/YOUR-ID?node-id=BUTTONS
 */
import { Button } from '@/components/ui/button'
import { getFigmaLink } from '@/lib/figma-design-system'

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
      {children}
    </Button>
  )
}

// في الكود، يمكنك الرجوع لـ Figma:
// console.log('See design:', getFigmaLink('Button'))
```

---

## 📱 ربط الصفحات بـ Figma

### مثال: Page Component

```tsx
/**
 * Login Page
 * Figma: Pages / Login
 * Link: https://www.figma.com/file/YOUR-ID?node-id=LOGIN-PAGE
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* من Figma: Login Form Container */}
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">تسجيل الدخول</h1>
        
        {/* من Figma: Email Input */}
        <input type="email" className="w-full mb-4" />
        
        {/* من Figma: Password Input */}
        <input type="password" className="w-full mb-6" />
        
        {/* من Figma: Login Button */}
        <button className="w-full">تسجيل الدخول</button>
      </div>
    </div>
  )
}
```

---

## 🔍 التحقق من التوافق مع Figma

### قائمة التحقق:

- [ ] الألوان متطابقة مع Figma
- [ ] المسافات (Spacing) صحيحة
- [ ] زوايا الحدود (Border Radius) متطابقة
- [ ] الخطوط (Typography) مطابقة
- [ ] الظلال (Shadows) متطابقة
- [ ] الأنيميشن مطابق
- [ ] Responsive Design مطابق

---

## 📚 أدوات إضافية

### 1. Figma Tokens
```bash
npm install @figma/tokens
```

### 2. Style Dictionary
```bash
npm install style-dictionary
```

### 3. Figma API
```typescript
// استخدام Figma API لجلب الـ Tokens تلقائياً
import Figma from 'figma-api'

const figma = new Figma.Api({
  personalAccessToken: 'YOUR_TOKEN'
})

// جلب Colors من Figma
const styles = await figma.getFileStyles('FILE_ID')
```

---

## 🎯 Workflow المقترح

### للمطورين:

1. **تصميم في Figma** ← المصمم
2. **Dev Mode** ← المطور يرى الـ CSS
3. **Copy & Paste** ← المطور ينسخ للكود
4. **Review** ← التحقق من التوافق

### للفرق الكبيرة:

1. **Design System in Figma**
2. **Export Tokens** تلقائياً
3. **Sync to GitHub**
4. **Auto-generate Components**

---

## 💡 نصائح مهمة

### ✅ ما يجب فعله:
- استخدم **Figma Dev Mode** دائماً
- نظّم **Components** في Figma
- استخدم **Auto Layout** في Figma
- حدد **Constraints** بشكل صحيح
- استخدم **Variants** في Figma

### ❌ ما يجب تجنبه:
- لا تعتمد فقط على Screenshots
- لا تكتب CSS يدوياً من Figma
- لا تستخدم ألوان عشوائية
- لا تهمل Responsive Design

---

## 🔗 روابط مفيدة

### Figma:
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/1500114456971-Use-Dev-Mode)
- [Figma Plugins](https://www.figma.com/community/plugins)
- [Figma API](https://www.figma.com/developers/api)

### Plugins:
- [Figma to React](https://www.figma.com/community/plugin/852292046727903794)
- [Builder.io](https://www.builder.io/)
- [TeleportHQ](https://teleporthq.io/)

### Tools:
- [Design Tokens](https://tr.designtokens.org/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)

---

## 📞 كيف تسأل المصمم؟

### للربط مع Figma:

```
"هل عندك Figma File للمشروع؟
أريد أن أستخدم Dev Mode لنسخ CSS مباشرة.
أو يمكنك تزويدي برابط Figma للتواصل العكسي."
```

### للتواصل العكسي:

```
"هذه المكونات في الكود تتوافق مع أي عناصر في Figma؟
هل يمكنك تحديد Node IDs للعناصر الرئيسية؟"
```

---

## 🎓 مثال عملي كامل

### من Figma إلى Next.js:

**1. في Figma:**
```
Component: Button Primary
CSS: background: #10b981; padding: 12px 24px; border-radius: 8px;
```

**2. في Next.js:**
```tsx
<button className="bg-emerald-600 px-6 py-3 rounded-lg">
  Button
</button>
```

**3. التحقق:**
- ✅ اللون متطابق
- ✅ المسافة متطابقة
- ✅ الزوايا متطابقة

---

**تم إنشاء هذا الدليل لتسهيل الربط مع Figma**

**Date**: 2025
**Project**: Smiley Dental Clinic
