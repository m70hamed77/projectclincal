# نظام الألوان - Color System

## 🎨 الألوان الأساسية (من الصفحة الرئيسية)

### Primary Colors (Teal/Green)
- **Primary**: #00BFA6
- **Primary Dark**: #008C7A
- **Primary Light**: #64f4e8
- **Primary Transparent**: rgba(0,191,166,0.2), rgba(0,191,166,0.4)
- **Primary Light BG**: #E0FAF7, #E8F8F5

### Secondary Colors (Purple)
- **Secondary**: #6C3FC5
- **Secondary Light**: #a78bfa
- **Secondary Dark**: #2d1b69

### Dark Colors (Blue Gradient)
- **Dark 1**: #0D1B40
- **Dark 2**: #1a2a6c
- **Dark 3**: #2d1b69

### Light Backgrounds
- **Light Purple**: #F8F4FF
- **Light Yellow/Gold**: #FFF8E7
- **Light Teal**: #E0FAF7, #E8F8F5

### Accent Colors
- **Gold/Bronze**: #C8A84B, #B8960A (للطلاب)
- **White**: #ffffff
- **Text Dark**: #0D1B40, #1a1a2e, #333
- **Text Gray**: #666, #777, #555, #444

## 🌈 Gradients

### Hero Section
```css
background: linear-gradient(145deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)
```

### Primary Buttons
```css
background: linear-gradient(135deg, #00BFA6, #008C7A)
box-shadow: 0 4px 14px rgba(0,191,166,0.4)
```

### Text Highlight
```css
background: linear-gradient(135deg, #00BFA6, #64f4e8)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

### Logo/Icons
```css
background: linear-gradient(135deg, #00BFA6, #6C3FC5)
```

### Student/Gold Gradient
```css
background: linear-gradient(135deg, #C8A84B, #B8960A)
```

## 🎯 Card Styles

### Glass Cards (Hero Section)
```css
background: rgba(255,255,255,0.08)
backdrop-filter: blur(10px)
border: border border-white/20
```

### Feature Cards
```css
background: white
border: 2px solid #f0f0f0
box-shadow: 0 4px 14px rgba(0,0,0,0.08)
```

### Hover Effect
```css
transform: translateY(-8px) scale(1.03)
box-shadow: 0 20px 35px rgba(0,0,0,0.12)
border-color: #00BFA6
```

## 📋 قواعد التطبيق

### 1. النسب المئوية للخلفيات
- 70-80% من الـ Sections فقط تُلون
- الـ 20-30% المتبقية تبقى بيضاء أو بسيطة

### 2. تباين النصوص
- على خلفيات داكنة: text-white
- على خلفيات فاتحة: text-dark (#0D1B40)
- على خلفيات متوسطة: text-gray (#444, #555, #666)

### 3. العناصر التفاعلية
- أزرار: Primary gradient
- Hover effects: تظليل + scale
- Cards: border color change on hover

### 4. توحيد الأسلوب
- نفس الـ border-radius
- نفس الـ transitions
- نفس الـ shadow styles

---

**تم إنشاؤه**: 2025-03-24
**المرجع**: الصفحة الرئيسية (Home Page)
