# 🔗 Project Links Guide
# دليل روابط المشروع الكاملة

---

## 📱 Frontend Routes (روابط الصفحات)

### 🔐 Authentication Pages
- **Login:** `/auth/login`
- **Register:** `/auth/register`
- **Simple Register:** `/auth/simple-register`
- **Advanced Register:** `/auth/register-advanced`
- **New Register:** `/auth/register-new`
- **Register Verification:** `/auth/register-verification`
- **Send Verification Code:** `/auth/verify/send-code`
- **Verify Email:** `/auth/verify`
- **Verify SMS:** `/auth/verify-sms`
- **Forgot Password:** `/auth/forgot-password`
- **Reset Password:** `/auth/reset-password`

### 👤 Dashboard Pages
- **Main Dashboard:** `/dashboard`
- **Student Dashboard:** `/dashboard/student`
- **Patient Dashboard:** `/dashboard/patient`
- **Doctor Dashboard:** `/dashboard/doctor`

### 👥 Admin Pages
- **Main Admin:** `/admin`
- **Admin Users:** `/admin/users`
- **Admin Dashboard:** `/admin/dashboard`
- **Admin Notifications:** `/admin/notifications`
- **Admin Verification:** `/admin/verification`
- **Admin Reports:** `/admin/reports`
- **Admin Packages:** `/admin/packages`
- **Admin Travel Types:** `/admin/travel-types`
- **Dev Admin:** `/dev-admin`

### 📝 Content Pages
- **Posts List:** `/posts`
- **My Posts:** `/posts/my-posts`
- **Create Post:** `/posts/create`
- **Post Details:** `/posts/[id]`
- **Post Applications:** `/posts/[id]/applications`

### 🏥 Applications
- **Applications List:** `/applications`
- **Appointments:** `/appointments`

### 🔍 Search & Profile
- **Search:** `/search`
- **Profile:** `/profile`
- **Settings:** `/settings`
- **Change Password:** `/settings/change-password`

### 💬 Chat
- **Chat List:** `/chat/list`
- **Chat Detail:** `/chat/[id]`

---

## 🔌 API Routes (روابط الـ API)

### 🔐 Authentication APIs
- **Verify OTP:** `/api/auth/verify-otp`
- **Login:** `/api/auth/login`
- **Register:** `/api/auth/register`
- **Logout:** `/api/auth/logout`

### 👥 User Management APIs
- **Get All Users:** `/api/admin/users`
- **Get User by ID:** `/api/users/[id]`
- **Update User:** `/api/users/[id]`
- **Delete User:** `/api/users/[id]`

### 📸 File Upload APIs
- **Upload File:** `/api/upload`
- **Get Uploaded File:** `/api/uploads/[...path]`

### 📧 Email APIs
- **Send Email:** `/api/send-email`
- **Send Verification Code:** `/api/send-verification-code`

### 📝 Posts APIs
- **Get Posts:** `/api/posts`
- **Create Post:** `/api/posts`
- **Get Post by ID:** `/api/posts/[id]`
- **Update Post:** `/api/posts/[id]`
- **Delete Post:** `/api/posts/[id]`

### 📋 Applications APIs
- **Get Applications:** `/api/applications`
- **Create Application:** `/api/applications`
- **Update Application:** `/api/applications/[id]`

### 🏥 Cases APIs
- **Get Cases:** `/api/cases`
- **Create Case:** `/api/cases`
- **Update Case:** `/api/cases/[id]`

### 💬 Chat APIs
- **Get Chats:** `/api/chats`
- **Get Messages:** `/api/chats/[id]/messages`
- **Send Message:** `/api/chats/[id]/messages`

### 🔔 Notification APIs
- **Get Notifications:** `/api/notifications`
- **Mark Read:** `/api/notifications/[id]/read`

### 📊 Stats APIs
- **Get Stats:** `/api/stats`

### 🎯 Placeholder API
- **Generate Placeholder:** `/api/generate-placeholder`

### 🎨 Debug APIs
- **Debug Admin Notifications:** `/api/debug/admin-notifications`

---

## 🔌 Websocket Service (خدمة WebSocket)

### Socket.IO Server
- **Server Port:** `3003`
- **Connection URL:** `/?XTransformPort=3003`
- **Service Location:** `/mini-services/chat-service`

---

## 🗄️ Database Links (روابط قاعدة البيانات)

### Database File
- **SQLite Database:** `file:/home/z/my-project/db/custom.db`

### Prisma Files
- **Schema File:** `/prisma/schema.prisma`
- **Production Schema:** `/prisma/schema.prisma.production`

---

## 🌐 External Services Links (روابط الخدمات الخارجية)

### Email Service
- **Gmail SMTP:** `smtp.gmail.com`
- **SMTP Port:** `587`
- **Email User:** `mohamed7744650@gmail.com`
- **App Password:** `orhy vuuj bnsj iaew`

### Google App Passwords
- **Get App Password:** https://myaccount.google.com/apppasswords

---

## 📁 File Storage Paths (مسارات تخزين الملفات)

### Uploads Directory
- **Uploads Path:** `/public/uploads/`
- **API Access:** `/api/uploads/[...path]`

### Static Assets
- **Images:** `/public/img/`
- **Videos:** `/public/img/`
- **Icons:** `/public/`
- **Logo:** `/public/logo.svg`
- **Dental Icon:** `/public/dental.svg`

---

## 🌍 Development URLs (روابط التطوير)

### Local Development
- **Development Server:** `http://localhost:3000`
- **NextAuth URL:** `http://localhost:3000` (when enabled)

### Preview Environment
- **Preview Panel:** Available in the IDE
- **Open in New Tab:** Click button above Preview Panel

---

## 🔐 Environment Variables (متغيرات البيئة)

### Database
- **DATABASE_URL:** `file:/home/z/my-project/db/custom.db`

### Authentication
- **NEXTAUTH_URL:** `http://localhost:3000` (currently commented)
- **NEXTAUTH_SECRET:** `your-secret-key-here` (needs to be generated)

### App Settings
- **NODE_ENV:** `development`

### Email Configuration
- **EMAIL_USER:** `mohamed7744650@gmail.com`
- **EMAIL_PASS:** `orhy vuuj bnsj iaew`

---

## 📝 Translation Files (ملفات الترجمة)

### Arabic Translations
- **Frontend:** `/src/lib/translations/ar.json`
- **Public:** `/public/messages/ar.json`

### English Translations
- **Frontend:** `/src/lib/translations/en.json`
- **Public:** `/public/messages/en.json`

---

## 🎨 Configuration Files (ملفات الإعدادات)

### Main Configuration
- **Next.js Config:** `/next.config.ts`
- **TypeScript Config:** `/tsconfig.json`
- **Tailwind Config:** `/tailwind.config.ts`
- **PostCSS Config:** `/postcss.config.mjs`
- **ESLint Config:** `/eslint.config.mjs`
- **Caddy Config:** `/Caddyfile`

### Prisma Configuration
- **Schema:** `/prisma/schema.prisma`
- **Client:** `/src/lib/db.ts`

---

## 🔧 Development Scripts (سكربتات التطوير)

### Package Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:generate": "prisma generate"
}
```

---

## 📊 Monitoring & Debugging (المراقبة والتصحيح)

### Server Logs
- **Dev Log:** `/home/z/my-project/dev.log`
- **Work Log:** `/home/z/my-project/worklog.md`

### Health Check
- **Health Check Script:** `/health-check.js`

---

## 🔗 Related Documentation (الوثائق ذات الصلة)

### Setup Guides
- **Main README:** `/README.md`
- **Arabic README:** `/README_AR.md`
- **Quick Start:** `/QUICK_START.md`
- **Windows Quick Start:** `/WINDOWS_QUICK_START.txt`

### Authentication
- **Auth System:** `/AUTHENTICATION_SYSTEM.md`
- **Auth Guide:** `/AUTHENTICATION_GUIDE.md`
- **OTP System:** `/OTP_SYSTEM.md`

### Deployment
- **Deployment Guide:** `/DEPLOYMENT_GUIDE.md`
- **Vercel Deploy:** `/VERCEL_DEPLOYMENT.md`
- **Deployment Checklist:** `/DEPLOYMENT_CHECKLIST.md`

---

## 📞 Quick Reference (مرجع سريع)

### Useful Commands
```bash
# Start development server
bun run dev

# Check code quality
bun run lint

# Push database schema
bun run db:push

# Open Prisma Studio
bun run db:studio

# Generate Prisma Client
bun run db:generate
```

### Important Ports
- **Next.js Dev Server:** `3000`
- **WebSocket Service:** `3003`
- **Any API Request:** Use `?XTransformPort={Port}` in query

---

**تاريخ التحديث:** April 15, 2025
**المشروع:** Next.js 16 + Prisma + NextAuth v7
