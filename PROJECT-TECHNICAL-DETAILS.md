# 📚 التفاصيل التقنية للمشروع - Smiley Dental Clinic

---

## 🚀 اللغات والتقنيات المستخدمة

### 1️⃣ اللغات الأساسية

#### **TypeScript 5.9.3** - اللغة الرئيسية
- **الإصدار:** 5.9.3
- **الاستخدام:**
  - جميع ملفات المشروع مكتوبة بـ TypeScript
  - يوفر type-safety (أمان الأنواع)
  - يقلل الأخطاء البرمجية
  - يساعد في الـ autocompletion في المحررات

**مثال:**
```typescript
// تعريف نوع بيانات المستخدم
type UserRole = 'PATIENT' | 'STUDENT' | 'ADMIN'

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED'
  createdAt: Date
}
```

---

#### **JavaScript (Node.js)** - للسكريبتات الخلفية
- **الاستخدام:**
  - بعض السكريبتات المساعدة مثل `create-admin.js`
  - أدوات بناء وتطوير

**مثال:**
```javascript
// ملف scripts/create-admin.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
```

---

### 2️⃣ إطار العمل (Framework)

#### **Next.js 16.1.1** - الإطار الرئيسي
- **الإصدار:** 16.1.1
- **النمط:** App Router (الإصدار الحديث)
- **الاستخدام:**
  - بناء تطبيقات React Server-Side
  - SSR (Server-Side Rendering)
  - API Routes
  - Static Generation
  - Image Optimization

**المميزات:**
```typescript
// App Router Structure
src/
├── app/
│   ├── page.tsx          // الصفحة الرئيسية
│   ├── layout.tsx        // Layout عام
│   ├── globals.css       // أنماط عامة
│   ├── auth/             // صفحات المصادقة
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── api/              // API Routes
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── register/route.ts
│   └── dashboard/        // صفحات لوحة التحكم
```

---

### 3️⃣ Frontend Libraries

#### **React 19.0.0** - مكتبة الواجهات
- **الإصدار:** 19.0.0
- **الاستخدام:**
  - بناء مكونات الواجهة (Components)
  - إدارة الحالة المحلية
  - Hooks (useState, useEffect, etc.)

**مثال:**
```tsx
'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // تسجيل الدخول
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </form>
  )
}
```

---

#### **Tailwind CSS 4** - لتنسيق الواجهات
- **الإصدار:** 4
- **الاستخدام:**
  - تصميم الواجهات
  - Responsive Design
  - Dark Mode Support
  - Custom Design Tokens

**مثال:**
```tsx
<div className="min-h-screen bg-gradient-hero flex items-center justify-center">
  <div className="glass border-2 border-border/50 rounded-3xl">
    <h1 className="text-responsive-4xl font-bold text-primary">
      مرحباً بك
    </h1>
  </div>
</div>
```

---

#### **shadcn/ui** - مكتبة المكونات الجاهزة
- **الاستخدام:**
  - أزرار (Buttons)
  - Forms
  - Dialogs
  - Modals
  - Dropdowns
  - Tables
  - وغيرها الكثير...

**المكونات المتاحة:**
```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { Table } from '@/components/ui/table'
// ... وأكثر من 50 مكون جاهز
```

---

#### **Lucide React** - مكتبة الأيقونات
- **الإصدار:** 0.525.0
- **الاستخدام:**
  - أيقونات للواجهة
  - أيقونات SVG قابلة للتخصيص

**مثال:**
```tsx
import { Mail, Lock, User, LogIn } from 'lucide-react'

<Mail className="w-5 h-5" />
<Lock className="w-5 h-5" />
```

---

#### **Framer Motion 12.23.2** - للأنيميشن
- **الاستخدام:**
  - Transitions
  - Animations
  - Micro-interactions

**مثال:**
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  محتوى متحرك
</motion.div>
```

---

### 4️⃣ State Management

#### **Zustand 5.0.6** - إدارة الحالة (Client-side)
- **الاستخدام:**
  - إدارة الحالة العامة في الواجهة
  - بسيط وسريع

**مثال:**
```typescript
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

---

#### **TanStack Query 5.82.0** - إدارة الحالة (Server-side)
- **الاستخدام:**
  - إدارة البيانات من API
  - Caching
  - Refetching

---

### 5️⃣ Forms & Validation

#### **React Hook Form 7.60.0**
- **الاستخدام:**
  - إدارة النماذج
  - Validation
  - Performance عالي

**مثال:**
```tsx
import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors } } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: true })} />
  {errors.email && <span>Email is required</span>}
</form>
```

---

#### **Zod 4.0.2** - Validation Library
- **الاستخدام:**
  - التحقق من صحة البيانات
  - Type-safe validation

**مثال:**
```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})
```

---

### 6️⃣ Authentication & Security

#### **bcryptjs 3.0.3** - تشفير كلمات المرور
- **الاستخدام:**
  - Hashing كلمات المرور
  - Comparing hashed passwords

**مثال:**
```typescript
import bcrypt from 'bcryptjs'

// تشفير كلمة المرور
const hashedPassword = await bcrypt.hash(password, 10)

// التحقق من كلمة المرور
const isValid = await bcrypt.compare(password, hashedPassword)
```

---

#### **NextAuth.js 4.24.11** - نظام المصادقة
- **الاستخدام:**
  - نظام مصادقة كامل
  - OAuth (Google, Facebook, etc.)
  - Session management

---

### 7️⃣ Database & ORM

#### **Prisma ORM 6.19.2** - Object-Relational Mapping
- **الإصدار:** 6.19.2
- **الاستخدام:**
  - التفاعل مع قاعدة البيانات
  - Type-safe database queries
  - Migrations
  - Schema management

**مثال:**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// قراءة البيانات
const user = await prisma.user.findUnique({
  where: { email },
  include: { student: true }
})

// إنشاء بيانات جديدة
const newUser = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    name,
    role: 'PATIENT'
  }
})
```

---

### 8️⃣ Internationalization (i18n)

#### **next-intl 4.8.3** - دعم لغات متعددة
- **الاستخدام:**
  - دعم العربية والإنجليزية
  - RTL (Right-to-Left) support
  - Translations

**اللغات المدعومة:**
- 🇸🇦 العربية (العربية)
- 🇬🇧 English (الإنجليزية)

**مثال:**
```typescript
import { useTranslations } from '@/hooks/useTranslations'

const { t } = useTranslations()

<h1>{t('loginPage.title')}</h1>
<button>{t('auth.loginButton')}</button>
```

---

### 9️⃣ Utilities & Helpers

#### **date-fns 4.1.0** - التعامل مع التواريخ
- **الاستخدام:**
  - تنسيق التواريخ
  - حساب الفرق بين التواريخ

**مثال:**
```typescript
import { format, differenceInDays } from 'date-fns'

const formattedDate = format(new Date(), 'yyyy-MM-dd')
const daysAgo = differenceInDays(new Date(), pastDate)
```

---

#### **clsx 2.1.1** & **tailwind-merge 3.3.1** - دمج الـ classes
- **الاستخدام:**
  - دمج CSS classes
  - Conditional classes

**مثال:**
```typescript
import { cn } from '@/lib/utils'

<button className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-primary text-white",
  !isActive && "bg-gray-200"
)}>
  Click me
</button>
```

---

### 🔟 Real-time & Communication

#### **Socket.io** - للاتصال الفوري
- **الاستخدام:**
  - المحادثات (Chat)
  - الإشعارات الفورية
  - التحديثات الحية

---

## 🗄️ قاعدة البيانات المستخدمة

### **PostgreSQL (NeonDB)** - قاعدة البيانات الرئيسية

#### **معلومات قاعدة البيانات:**

| المعلومة | القيمة |
|----------|--------|
| **النوع** | PostgreSQL |
| **المزود** | NeonDB (Cloud Database) |
| **الإصدار** | PostgreSQL 15+ |
| **الموقع** | AWS (US East) |
| **Protocol** | postgresql:// |
| **SSL** | Enabled (sslmode=require) |
| **Connection Pooling** | Enabled (channel_binding=require) |

---

#### **رابط الاتصال:**
```
postgresql://neondb_owner:npg_XENWv3hDBr1i@ep-delicate-forest-aix7rt02-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

#### **لماذا PostgreSQL؟**

✅ **مزايا PostgreSQL:**
1. **Open Source** - مفتوح المصدر ومجاني
2. **Reliable** - موثوق وقوي
3. **Scalable** - قابل للتوسع
4. **Supports Complex Queries** - يدعم استعلامات معقدة
5. **ACID Compliant** - يضمن سلامة البيانات
6. **Full Text Search** - بحث متقدم
7. **JSON Support** - يدعم JSON
8. **Transactions** - يدعم المعاملات
9. **Indexing** - فهرسة سريعة
10. **Security** - أمان عالي

---

#### **لماذا NeonDB؟**

✅ **مزايا NeonDB:**
1. **Serverless** - بدون إدارة سيرفر
2. **Auto-scaling** - توسع تلقائي
3. **Backups** - نسخ احتياطي تلقائي
4. **Branching** - لبيئات التطوير
5. **Fast** - سريع جداً
6. **Free Tier** - مجاني للمشاريع الصغيرة
7. **Easy Setup** - إعداد سهل
8. **PostgreSQL Compatible** - متوافق مع PostgreSQL 100%

---

#### **الجداول في قاعدة البيانات (Prisma Schema):**

```prisma
// المستخدمين
model User {
  id              String         @id @default(cuid())
  email           String         @unique
  password        String
  name            String?
  role            UserRole       // PATIENT, STUDENT, ADMIN
  status          AccountStatus  // PENDING, ACTIVE, SUSPENDED, BANNED, DELETED
  // ... المزيد من الحقول
}

// الطلاب
model Student {
  id                 String  @id @default(cuid())
  userId             String  @unique
  universityEmail    String?
  academicYear       Int?
  specialization     String?
  completedCases     Int     @default(0)
  activeCases        Int     @default(0)
  // ... المزيد من الحقول
}

// المرضى
model Patient {
  id        String  @id @default(cuid())
  userId    String  @unique
  age       Int?
  gender    String?
  address   String?
  // ... المزيد من الحقول
}

// الحالات (Posts)
model Post {
  id                 String        @id @default(cuid())
  studentId          String
  title              String
  treatmentType      TreatmentType // FILLING, EXTRACTION, etc.
  city               String
  address            String
  status             PostStatus    // ACTIVE, COMPLETED, ARCHIVED
  // ... المزيد من الحقول
}

// الطلبات (Applications)
model Application {
  id              String            @id @default(cuid())
  postId          String
  patientId       String
  studentId       String
  status          ApplicationStatus // PENDING, ACCEPTED, REJECTED, etc.
  // ... المزيد من الحقول
}

// الحالات الطبية (Cases)
model Case {
  id            String  @id @default(cuid())
  applicationId String  @unique
  startDate     DateTime?
  endDate       DateTime?
  isCompleted   Boolean @default(false)
  // ... المزيد من الحقول
}

// المحادثات (Conversations)
model Conversation {
  id             String  @id @default(cuid())
  caseId         String? @unique
  studentId      String
  patientId      String
  lastMessage    String?
  // ... المزيد من الحقول
}

// الرسائل (Messages)
model Message {
  id             String       @id @default(cuid())
  conversationId String
  messageType    MessageType // TEXT, IMAGE, FILE
  content        String?
  // ... المزيد من الحقول
}

// التقييمات (Ratings)
model Rating {
  id                 String  @id @default(cuid())
  caseId             String  @unique
  patientId          String
  studentId          String
  overallRating      Int
  qualityRating      Int?
  professionalRating Int?
  // ... المزيد من الحقول
}

// الإشعارات (Notifications)
model Notification {
  id         String           @id @default(cuid())
  userId     String
  type       NotificationType
  title      String
  message    String
  isRead     Boolean          @default(false)
  // ... المزيد من الحقول
}

// البلاغات (Reports)
model Report {
  id             String       @id @default(cuid())
  reporterId     String
  reportedUserId String
  reportType     ReportType   // NO_SHOW, ABUSE, etc.
  status         ReportStatus // PENDING, UNDER_REVIEW, RESOLVED
  // ... المزيد من الحقول
}

// الأدمن (Admin)
model Admin {
  id          String  @id @default(cuid())
  userId      String  @unique
  permissions String
  // ... المزيد من الحقول
}

// والمزيد من الجداول...
```

---

#### **أنواع البيانات (Data Types):**

```prisma
// الأنواع المستخدمة:
String      - للنصوص
Int         - للأرقام الصحيحة
Float       - للأرقام العشرية
Boolean     - لقيم الصواب/الخطأ
DateTime    - للتواريخ والأوقات
Json        - لبيانات JSON
```

---

#### **العلاقات بين الجداول (Relations):**

```prisma
// User 1:1 Student
model User {
  student Student?
}

model Student {
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

// User 1:1 Patient
model User {
  patient Patient?
}

model Patient {
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

// Student 1:N Posts
model Student {
  posts Post[]
}

model Post {
  student     Student @relation(fields: [studentId], references: [id])
  studentId   String
}

// Post 1:N Applications
model Post {
  applications Application[]
}

model Application {
  post    Post   @relation(fields: [postId], references: [id])
  postId String
}

// Patient 1:N Applications
model Patient {
  applications Application[]
}

model Application {
  patient Patient @relation(fields: [patientId], references: [id])
  patientId String
}
```

---

#### **Indexes (الفهارس) للبحث السريع:**

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  role  UserRole
  status AccountStatus

  @@index([email])    // للبحث بالبريد
  @@index([role])     // للبحث بالدور
  @@index([status])   // للبحث بالحالة
}

model Post {
  id            String        @id @default(cuid())
  studentId     String
  city          String
  treatmentType TreatmentType

  @@index([studentId])      // للبحث بالطالب
  @@index([city])           // للبحث بالمدينة
  @@index([treatmentType])  // للبحث بنوع العلاج
}
```

---

## 🎯 ملخص التقنيات المستخدمة

| الفئة | التقنية | الإصدار | الاستخدام |
|-------|---------|---------|----------|
| **لغة البرمجة** | TypeScript | 5.9.3 | الكود الرئيسي |
| **لغة البرمجة** | JavaScript (Node.js) | 20+ | سكريبتات مساعدة |
| **Framework** | Next.js | 16.1.1 | بناء التطبيق |
| **UI Library** | React | 19.0.0 | الواجهات |
| **Styling** | Tailwind CSS | 4 | التنسيق |
| **UI Components** | shadcn/ui | Latest | مكونات جاهزة |
| **Icons** | Lucide React | 0.525.0 | الأيقونات |
| **Animations** | Framer Motion | 12.23.2 | الأنيميشن |
| **State Management** | Zustand | 5.0.6 | الحالة (Client) |
| **State Management** | TanStack Query | 5.82.0 | الحالة (Server) |
| **Forms** | React Hook Form | 7.60.0 | النماذج |
| **Validation** | Zod | 4.0.2 | التحقق من البيانات |
| **Security** | bcryptjs | 3.0.3 | تشفير كلمات المرور |
| **Authentication** | NextAuth.js | 4.24.11 | المصادقة |
| **ORM** | Prisma | 6.19.2 | التعامل مع قاعدة البيانات |
| **i18n** | next-intl | 4.8.3 | دعم لغات متعددة |
| **Dates** | date-fns | 4.1.0 | التعامل مع التواريخ |
| **Real-time** | Socket.io | Latest | الاتصال الفوري |

---

## 🗄️ قاعدة البيانات

| المعلومة | التفاصيل |
|----------|----------|
| **النوع** | PostgreSQL |
| **المزود** | NeonDB (Cloud) |
| **الإصدار** | PostgreSQL 15+ |
| **الموقع** | AWS (US East) |
| **SSL** | Enabled |
| **ORM** | Prisma 6.19.2 |
| **عدد الجداول** | 20+ جدول |
| **النسخ الاحتياطي** | تلقائي (NeonDB) |

---

## ✨ الخلاصة

### اللغات المستخدمة:
1. **TypeScript 5.9.3** - اللغة الرئيسية (95% من الكود)
2. **JavaScript (Node.js)** - للسكريبتات المساعدة (5% من الكود)

### قاعدة البيانات:
- **PostgreSQL** على **NeonDB** (Cloud Database)
- تدار عبر **Prisma ORM**

### لماذا هذا الاختيار؟

**TypeScript:**
- أمان الأنواع (Type Safety)
- تقليل الأخطاء
- Autocompletion أفضل
- صيانة الكود أسهل

**PostgreSQL + NeonDB:**
- موثوق وقوي
- Serverless (لا إدارة سيرفر)
- سريع وقابل للتوسع
- نسخ احتياطي تلقائي
- مجاني للمشاريع الصغيرة

---

**تاريخ التحديث:** مارس 2025
**المشروع:** Smiley Dental Clinic
**الحالة:** الإنتاج (Production Ready) ✅
