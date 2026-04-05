# 🚀 دليل استخدام المشروع على VS Code

## 📋 متطلبات VS Code Extensions

### الموصى بتثبيت:
1. **ESLint** - لفحص الأكواد
2. **Prisma** - لإدارة قاعدة البيانات
3. **Tailwind CSS IntelliSense** - للكتابة CSS
4. **Prettier** - تنسيق الكود
5. **Auto Rename Tag** - إعادة تسمية العناصر تلقائياً
6. **Path Intellisense** - مسارات الملفات

## 🔧 الإعدادات الأساسية في VS Code

### 1. TypeScript
```json
{
  "typescript.tsdk": "latest",
  "typescript.enablePromptTypeHints": true,
  "typescript.typescript.enableImportSort": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "prettier"
}
```

### 2. ESLint
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint.problems": "explicit"
  }
}
```

### 3. Prettier
```json
{
  "editor.defaultFormatter": "prettier",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "prettier"
  }
}
```

## 🏃 تشغيل المشروع من VS Code

### الطريقة 1: Using Terminal
```bash
# فتح Terminal في VS Code (Ctrl + `)
cd /home/z/my-project
bun install
bun run db:push
bun run dev
```

### الطريقة 2: Using VS Code Tasks
أضف هذه المهام في `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Server",
      "type": "shell",
      "command": "bun run dev",
      "problemMatcher": []
    },
    {
      "label": "Setup Database",
      "type": "shell",
      "command": "bun run db:push",
      "problemMatcher": []
    },
    {
      "label": "Create Test Users",
      "type": "shell",
      "command": "bun run scripts/setup-test-users.ts",
      "problemMatcher": []
    },
    {
      "label: Check Test Data",
      "type": "shell",
      "command": "bun run scripts/check-data.ts",
      "problemMatcher": []
    }
  ]
}
```

### الطريقة 3: Using Launch Configuration
أضف في `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Start Dev Server",
      "type": "node",
      "request": "launch",
      "program": "bun",
      "args": ["run", "dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "internalConsoleOptions": {
        "env": {
          "NODE_ENV": "development"
        }
      }
    }
  ]
}
```

## 🗂️ فتح المشروع في VS Code

### الهيكل المجلدات المهمة:
```
src/
├── app/           # صفحات Next.js
├── components/    # مكونات React
├── lib/          # دوال مساعدة
├── hooks/        # React Hooks
└── styles/       # أنماط CSS (إن وجد)
```

### الملفات المهمة:
```
src/app/page.tsx      # الصفحة الرئيسية
src/app/layout.tsx    # Layout رئيسي
src/lib/db.ts        # Prisma Client
src/lib/auth.ts      # نظام المصادقة
src/lib/password.ts   # كلمات المرور
prisma/schema.prisma  # قاعدة البيانات
.env                  # متغيرات البيئة
package.json           # الاعتمادات
```

## 🐛 حل المشاكل الشائعة

### السيرفر لا يعمل؟

**في Terminal:**
```bash
# 1. قتال أي عمليات node/next قديمة
pkill -f "next dev"

# 2. حذف المجلد المؤقت
rm -rf .next

# 3. أعد التشغيل
bun run dev
```

**أو في VS Code:**
1. افتح Terminal (Ctrl + `)
2. اكتب: `cd /home/z/my-project && bun run dev`
3. انتظر السيرفر يبدأ على http://localhost:3000

### مشاكل قاعدة البيانات

```bash
# إعادة تعيين قاعدة البيانات
rm db/custom.db

# إعادة إنشاء المخطط
bun run db:push

# إعادة توليد Prisma Client
bun run db:generate
```

### أخطاء ESLint

```bash
# فحص الأخطاء فقط
bun run lint

# فحص أخطاء src فقط
bun run lint 2>&1 | grep "src/"
```

### أخطاء TypeScript

```bash
# توليد Prisma Client
bun run db:generate

# فحص نوع الملفات
tsc --noEmit
```

## 🎯 المهام المتكررة

### إعادة تعيين قاعدة البيانات
```bash
rm db/custom.db
bun run db:push
bun run scripts/setup-test-users.ts
```

### إعادة إنشاء المستخدمين
```bash
bun run scripts/setup-test-users.ts
```

### فحص البيانات
```bash
bun run scripts/check-data.ts
```

## 📊 فحص السجلات

### سجلات السيرفر:
```bash
# Linux/Mac
tail -f /tmp/dev-*.log

# إذا لم يوجد سجل، شاهد Terminal
```

### سجلات Prisma:
```bash
# التحقق من الاستعلامات
grep -r "Prisma" logs/
```

## 🚀 الخطوات النهائية

### 1. التشغيل
```bash
cd /home/z/my-project
bun run dev
```

### 2. فتح المتصفح
```bash
# Firefox/Chrome: http://localhost:3000
# أو استخدم Preview Panel في VS Code
```

### 3. تسجيل الدخول
- الأدمن: `admin@smileydental.com` / `Admin@123`
- الطالب: `student@test.com` / `Student@123`
- المريض: `patient@test.com` / `patient@test.com`

### 4. التحقق من الوظائف
- قائمة البوستات
- إنشاء بوست جديد
- تقديم طلب
- المحادثات

## 📝 ملاحظات مهمة

- **قاعدة البيانات**: SQLite موجودة في `db/custom.db`
- **المنفذ**: 3000 افتراضياً
- **اللغة**: العربية RTL بالرسم
- **التطوير**: Development mode
- **Lint**: فقط للجودة الكود (ليست من الملفات المساعدة)

## 🔍 الملفات الأساسية التي يجب تعديلها

### لإضافة صفحة جديدة:
1. أنشئ ملف في `src/app/[pagename]/page.tsx`
2. أضف المحتوى
3. السيرفر سيكتشفه تلقائياً

### لإضافة مكون جديد:
1. أنشئ ملف في `src/components/[name].tsx`
2. تصدير من المكون أو أنشئ واحد جديد
3. استخدم شادcn/ui components كأساس

### لإضافة API route:
1. أنشئ ملف في `src/app/api/[endpoint]/route.ts`
2. تصدير الـ request/response
3. تصدير من Prisma

## 🎓 التعليمات

### لقراءة كود المشروع:
- افتح الملف في VS Code
- اقرأ الكود مع التعليقات
- استخدم Ctrl + D لعرض التعريف
- استخدم Ctrl + Click للانتقال للتعريف

### للبحث في المشروع:
- Ctrl + Shift + F
- Ctrl + T (Search files by name)
- Ctrl + Shift + H (Search and replace)
- Ctrl + P (Quick Open)

### للتنسيق الكود:
- Right-click → Format Document
- Ctrl + Shift + F
- Prettier format on save

## 🚀 جاهز للبدء!

```bash
cd /home/z/my-project
bun run dev
```

افتح المتصفح على: **http://localhost:3000**

أو استخدم "Open in New Tab" في Preview Panel.
