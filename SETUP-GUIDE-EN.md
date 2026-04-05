# 🚀 Local Development Guide - Smiley Dental Clinic

## 📋 Prerequisites
- Node.js (v20 or higher)
- npm or bun
- VS Code (or any code editor)
- Internet connection (for PostgreSQL connection)

## 🔧 Setup Steps

### 1️⃣ Install Dependencies
```bash
npm install
# or
bun install
```

### 2️⃣ Database Setup
The project is already connected to PostgreSQL (NeonDB), just make sure `.env` file contains:
```
DATABASE_URL=postgresql://neondb_owner:npg_XENWv3hDBr1i@ep-delicate-forest-aix7rt02-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3️⃣ Generate Prisma Client
**Important:** If you see a `DATABASE_URL` error, unset the old environment variable first:

**On Windows (PowerShell):**
```powershell
$env:DATABASE_URL = ""
npm run db:push
```

**On Linux/Mac:**
```bash
unset DATABASE_URL
npm run db:push
```

**Or using bun:**
```bash
bun run db:push
```

### 4️⃣ Verify Admin Account
The admin account already exists in the database:
- 📧 Email: `admin@smileydental.com`
- 🔑 Password: `Admin@123456`

### 5️⃣ Run the Project
```bash
npm run dev
# or
bun run dev
```

The project will run on: `http://localhost:3000`

## 🐛 Troubleshooting Common Issues

### Issue: Error validating datasource `db`
**Cause:** Old `DATABASE_URL` environment variable is set.

**Solution:**
```bash
# Linux/Mac
unset DATABASE_URL

# Windows PowerShell
$env:DATABASE_URL = ""

# Then run the command again
npm run db:push
```

### Issue: Turbopack Error
**Solution:** The project uses `bun run dev` which automatically disables Turbopack.

### Issue: POST /api/auth/login 500
**Solution:** Make sure:
1. Database is connected (try `unset DATABASE_URL && bun run db:push`)
2. Admin account exists
3. Email and password are correct

## ✅ Verifying Project Health

### Test Database:
```bash
unset DATABASE_URL
bun run db:push
```

### Test Pages:
Open your browser and navigate to:
- Home Page: `http://localhost:3000/`
- Login: `http://localhost:3000/auth/login`
- Register: `http://localhost:3000/auth/register`

### Test Login:
Use admin credentials:
- Email: `admin@smileydental.com`
- Password: `Admin@123456`

## 📁 Project Structure
```
/home/z/my-project/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # Components
│   └── lib/          # Helper libraries
├── prisma/
│   └── schema.prisma # Database schema
├── upload/           # Uploaded files
├── .env             # Environment variables
└── package.json     # Project dependencies
```

## 🎯 Key Features
- ✅ Next.js 16 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS 4 with shadcn/ui
- ✅ Prisma ORM + PostgreSQL (NeonDB)
- ✅ Custom authentication system
- ✅ Arabic and English support (RTL)
- ✅ Responsive design
- ✅ Notification system
- ✅ Rating system

## 💡 Important Tips

### Before Running Commands:
Always unset the old `DATABASE_URL` if you see errors:
```bash
unset DATABASE_URL  # Linux/Mac
```

### Check Code Quality:
```bash
# Lint code
npm run lint

# Type check TypeScript
npm run type-check
```

### Reset Database (if needed):
```bash
unset DATABASE_URL
bun run db:push
```

## 📞 Support
If you encounter any issues:
1. Check development logs
2. Ensure internet connection (for PostgreSQL)
3. Verify `.env` file
4. Try unsetting the old `DATABASE_URL`

---

## ✨ Quick Start

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Setup database (unset old variable)
unset DATABASE_URL
npm run db:push

# 3️⃣ Run the project
npm run dev

# 4️⃣ Login
# http://localhost:3000/auth/login
# admin@smileydental.com / Admin@123456
```

---

**Ready to go! 🎉**
