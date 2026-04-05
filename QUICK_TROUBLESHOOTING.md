# Quick Troubleshooting Guide for Login Issues

## If you're seeing "500 Internal Server Error" on login:

### Option 1: Check your .env file (Most Common Fix)

**Step 1:** Open your `.env` file and verify it has:
```env
DATABASE_URL="postgresql://neondb_owner:npg_nA4wIDb2SxzL@ep-delicate-forest-aix7rt02-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Step 2:** Make sure there's NO `DATABASE_URL` in your Windows environment variables:
- Press `Win + R`
- Type `sysdm.cpl` and press Enter
- Click "Environment Variables"
- Remove any `DATABASE_URL` entry

**Step 3:** Clear cache and restart:
```bash
# PowerShell
Remove-Item -Recurse -Force .next
bun run dev
```

---

### Option 2: Verify Database Connection

Run this command to test if your database is accessible:
```bash
# From your project directory
bun run db:push
```

If this fails, your PostgreSQL connection string might be incorrect.

---

### Option 3: Check Server Logs

Look at your terminal where `bun run dev` is running. You should see:
```
[DB] Database URL type: PostgreSQL
```

If you see `Other` instead of `PostgreSQL`, the DATABASE_URL is not being loaded correctly.

---

### Option 4: Test with curl (Advanced)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected response (if account doesn't exist):
```json
{
  "error": "البريد الإلكتروني أو كلمة المرور غير صحيح"
}
```

If you get a 500 error, there's still a database connection issue.

---

## Common Error Messages and Solutions

### Error: "استجابة غير صحيحة من السيرفر"
**Cause:** Server returned HTML instead of JSON (likely 500 error)
**Solution:** Check server logs, verify DATABASE_URL

### Error: "Can't resolve 'tailwindcss'" (Windows)
**Cause:** Turbopack/Windows issue
**Solution:**
1. Delete `.next` folder
2. Run `bun run dev:legacy` instead of `bun run dev`

### Error: "useSearchParams() should be wrapped in a suspense boundary"
**Cause:** Already fixed in previous session
**Solution:** Pull latest changes if available

---

## What Was Fixed

1. **Database Connection:** Updated `src/lib/db.ts` to automatically read `.env` file if DATABASE_URL is pointing to a file
2. **Code Quality:** Fixed all ESLint errors in `src/` directory
3. **Environment:** Added logging to show which database type is being used

---

## Still Having Issues?

Collect this information and share it:
1. Browser console error (F12 → Console tab)
2. Server terminal output
3. Your `.env` file contents (mask the password!)
4. Windows version and Node.js version (`node --version`)

---

## Quick Checklist

- [ ] `.env` file has PostgreSQL DATABASE_URL
- [ ] No DATABASE_URL in Windows environment variables
- [ ] `.next` folder deleted
- [ ] Dev server restarted
- [ ] Server logs show "Database URL type: PostgreSQL"
- [ ] Can access other pages (not just login)

If all checkboxes are green and it still doesn't work, there might be a network/firewall issue blocking the PostgreSQL connection.
