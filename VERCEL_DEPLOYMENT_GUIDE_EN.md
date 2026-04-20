# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - For pushing code
2. **Vercel Account** - For hosting
3. **Neon Account** - For PostgreSQL database
4. **Gmail Account with App Password** - For emails

---

## 🔧 Step 1: Set Up Environment Variables in Vercel

### 1.1 Add Environment Variables

Go to: `Vercel Dashboard` → `Project Settings` → `Environment Variables`

Add the following variables:

```bash
# DATABASE_URL
postgresql://neondb_owner:npg_EX1Nn6DYoLwJ@ep-young-base-amribtx8-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# EMAIL_USER
mohamed7744650@gmail.com

# EMAIL_PASS
orhy vuuj bnsj iaew

# EMAIL_FROM_NAME
Smiley Dental Clinic

# EMAIL_REPLY_TO
mohamed7744650@gmail.com

# NODE_ENV
production

# NEXTAUTH_SECRET
smiley-dental-clinic-secret-key-change-in-production-2024

# NEXTAUTH_URL
https://your-app.vercel.app

# MAX_FILE_SIZE
10485760

# ALLOWED_IMAGE_FORMATS
image/jpeg,image/png,image/webp,image/gif

# RATE_LIMIT_MAX
60

# RATE_LIMIT_WINDOW
60000

# SESSION_MAX_AGE
2592000

# SESSION_UPDATE_AGE
86400

# OTP_EXPIRATION_MINUTES
10

# MAX_OTP_ATTEMPTS
3

# NEXT_PUBLIC_APP_URL
https://your-app.vercel.app

# NEXT_PUBLIC_API_URL
https://your-app.vercel.app/api
```

### 1.2 Where to add variables?

✅ **Environment:** Production, Preview, Development (select all three)

---

## 📤 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already)

```bash
cd /home/z/my-project
git init
git add .
git commit -m "Initial commit - Smiley Dental Clinic"
```

### 2.2 Push to GitHub

1. Create a **new repository** on GitHub
2. Run the following commands:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smiley-dental-clinic.git
git push -u origin main
```

---

## 🚀 Step 3: Connect Project to Vercel

### 3.1 Create New Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Connect your GitHub account
4. Select Repository: `smiley-dental-clinic`

### 3.2 Build Settings

- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave as is)
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`

### 3.3 Deploy

Click **"Deploy"** and wait for the build to complete!

---

## ⚙️ Step 4: Post-Deployment Configuration

### 4.1 Update NEXTAUTH_URL

After first deployment:
1. Copy your app URL from Vercel
2. Update `NEXTAUTH_URL` variable in Vercel:
   - From: `http://localhost:3000`
   - To: `https://your-app.vercel.app`

### 4.2 Update NEXT_PUBLIC_APP_URL

Update `NEXT_PUBLIC_APP_URL` variable:
- From: `http://localhost:3000`
- To: `https://your-app.vercel.app`

### 4.3 Redeploy

After modifying variables, click **"Redeploy"** to apply changes!

---

## ✅ Verify Deployment

### 5.1 Test Database Connection

Open the app and verify:
- ✅ Login works
- ✅ New account creation works
- ✅ Admin dashboard shows statistics

### 5.2 Test Emails

Create a new account and verify:
- ✅ Verification code arrives on Gmail
- ✅ Email is properly formatted

### 5.3 Test Translations

Verify:
- ✅ Language switching works
- ✅ All text is in Arabic and English

---

## 🐛 Troubleshooting Common Issues

### Issue: `prisma generate` fails

**Solution:**
1. Verify `DATABASE_URL` is correct in Vercel
2. Ensure PostgreSQL is running on Neon

### Issue: Blank page after deployment

**Solution:**
1. Check Vercel logs
2. Ensure all environment variables are added

### Issue: Emails not sending

**Solution:**
1. Verify App Password is correct
2. Ensure Gmail allows "Less secure apps" or use App Password
3. Check SPAM folder in Gmail

### Issue: NEXTAUTH session not working

**Solution:**
1. Ensure `NEXTAUTH_SECRET` is unique and secure
2. Verify `NEXTAUTH_URL` is correct

---

## 📝 Important Notes

### ⚠️ Data Security

- ❌ **Do NOT push** `.env` file to GitHub
- ✅ **Use** `.env.example` only
- ✅ **Add** all variables manually in Vercel

### 🔒 Changing NEXTAUTH_SECRET

In Production, use a long random string:

```bash
# Generate a secure secret
openssl rand -base64 32
```

### 📊 Monitoring

Use:
- **Vercel Analytics** to monitor visitors
- **Neon Dashboard** to monitor database
- **Vercel Logs** to view errors

---

## 🎉 Summary

After completing these steps:
- ✅ Project deployed on Vercel
- ✅ Database connected to Neon
- ✅ Emails working
- ✅ Translations working
- ✅ Everything is secure and ready!

**Congratulations! 🚀**
