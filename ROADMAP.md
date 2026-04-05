# 🚀 خطة تطوير Smiley Dental - الخطوات القادمة

## ✅ تم إنجازه

- [x] Email Verification System
- [x] SMS Verification System
- [x] Professional Logging with [DEV] prefix
- [x] Security: devCode only in development
- [x] Code expiration (10 minutes)
- [x] Environment separation (dev/prod)

---

## 🔐 الخطوات القادمة الموصى بها

### Priority 1: Security & Rate Limiting ⚡

#### 1. Rate Limiting (حماية من الهجمات)
**الهدف:** منع إرسال أكواد تحقق بشكل متكرر من نفس IP/رقم/إيميل

**التنفيذ:**
```typescript
// src/lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes
  analytics: true,
})

export async function checkRateLimit(identifier: string) {
  const { success, remaining } = await ratelimit.limit(identifier)
  return { allowed: success, remaining }
}
```

**استخدام في API:**
```typescript
const ip = request.headers.get('x-forwarded-for') || 'unknown'
const rateLimit = await checkRateLimit(`send-code:${email}:${ip}`)

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'تجاوزت الحد المسموح من المحاولات، حاول مرة أخرى بعد 10 دقائق' },
    { status: 429 }
  )
}
```

**الأولوية:** عالية جداً 🔥

---

#### 2. Rate Limiting لكل رقم هاتف
**الهدف:** منع إرسال أكثر من 3 رسائل لنفس الرقم في ساعة

```typescript
const phoneRateLimit = await checkRateLimit(`phone:${phone}`)
if (!phoneRateLimit.allowed) {
  return NextResponse.json(
    { error: 'تم إرسال الكثير من الرسائل لهذا الرقم، حاول مرة أخرى بعد ساعة' },
    { status: 429 }
  )
}
```

---

### Priority 2: Code Management & Security 🛡️

#### 3. محاولة التحقق المحدودة
**الهدف:** منع تخمين الكود

```typescript
// src/lib/verification-attempts.ts
const attemptsMap = new Map<string, { count: number; expiresAt: number }>()

export async function checkVerificationAttempts(identifier: string): Promise<{ allowed: boolean; attemptsLeft: number }> {
  const attempt = attemptsMap.get(identifier)

  if (!attempt) {
    attemptsMap.set(identifier, { count: 1, expiresAt: Date.now() + 15 * 60 * 1000 })
    return { allowed: true, attemptsLeft: 4 }
  }

  if (Date.now() > attempt.expiresAt) {
    attemptsMap.set(identifier, { count: 1, expiresAt: Date.now() + 15 * 60 * 1000 })
    return { allowed: true, attemptsLeft: 4 }
  }

  if (attempt.count >= 5) {
    return { allowed: false, attemptsLeft: 0 }
  }

  attempt.count++
  return { allowed: true, attemptsLeft: 5 - attempt.count }
}
```

**استخدام:**
```typescript
const { allowed, attemptsLeft } = await checkVerificationAttempts(email)

if (!allowed) {
  return NextResponse.json(
    { error: 'تجاوزت عدد المحاولات المسموح به، حاول مرة أخرى بعد 15 دقيقة' },
    { status: 429 }
  )
}
```

---

#### 4. تنظيف الأكواد المنتهية تلقائياً
**الهدف:** تحسين الأداء ومنع تسريب الذاكرة

```typescript
// src/lib/code-cleanup.ts
export function startCodeCleanup() {
  // تنظيف كل 5 دقائق
  setInterval(() => {
    const now = Date.now()

    for (const [key, value] of verificationCodes.entries()) {
      if (now > value.expiresAt) {
        verificationCodes.delete(key)
        console.log(`[CLEANUP] Removed expired code for ${key}`)
      }
    }
  }, 5 * 60 * 1000)
}

// استدعِ في start of application
startCodeCleanup()
```

---

### Priority 3: Enhanced UX 🎨

#### 5. Resend Logic محسّن
**الهدف:** منع إعادة الإرسال السريع جداً

```typescript
const resendMap = new Map<string, { lastSent: number; count: number }>()

export async function canResendCode(identifier: string): Promise<{ allowed: boolean; waitTime?: number }> {
  const record = resendMap.get(identifier)

  if (!record) {
    resendMap.set(identifier, { lastSent: Date.now(), count: 1 })
    return { allowed: true }
  }

  const timeSinceLastSend = Date.now() - record.lastSent
  const minWaitTime = 60 * 1000 // دقيقة واحدة

  if (timeSinceLastSend < minWaitTime) {
    const waitTime = Math.ceil((minWaitTime - timeSinceLastSend) / 1000)
    return { allowed: false, waitTime }
  }

  if (record.count >= 3) {
    return { allowed: false, waitTime: 3600 } // ساعة
  }

  record.lastSent = Date.now()
  record.count++
  return { allowed: true }
}
```

**استخدام:**
```typescript
const { allowed, waitTime } = await canResendCode(email)

if (!allowed) {
  return NextResponse.json(
    { error: `انتظر ${waitTime} ثانية قبل إعادة الإرسال` },
    { status: 429 }
  )
}
```

---

#### 6. Timer في صفحة التحقق
**الهدف:** إظهار الوقت المتبقي لإعادة الإرسال

```typescript
const [timeLeft, setTimeLeft] = useState(0)

useEffect(() => {
  if (timeLeft > 0) {
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }
}, [timeLeft])

// في الـ UI:
<Button disabled={timeLeft > 0}>
  {timeLeft > 0 ? `انتظر ${timeLeft}s` : 'إعادة الإرسال'}
</Button>
```

---

### Priority 4: Monitoring & Analytics 📊

#### 7. Logging Structure محسّن
**الهدف:** تسجيل كافة الأحداث للمراقبة

```typescript
// src/lib/logger.ts
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'

interface LogEntry {
  timestamp: string
  level: LogLevel
  service: 'EMAIL' | 'SMS'
  action: string
  identifier: string
  metadata?: Record<string, any>
}

export function logEvent(entry: Omit<LogEntry, 'timestamp'>) {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  }

  const emoji = entry.level === 'SUCCESS' ? '✅' : entry.level === 'ERROR' ? '❌' : 'ℹ️'

  console.log(
    `[DEV][${entry.service}] ${emoji} ${entry.action} - ${entry.identifier}`,
    entry.metadata ? JSON.stringify(entry.metadata) : ''
  )

  // في Production: أرسل إلى خدمة مثل Sentry أو LogRocket
}
```

**استخدام:**
```typescript
logEvent({
  level: 'SUCCESS',
  service: 'SMS',
  action: 'Code sent',
  identifier: formattedPhone,
  metadata: { codeLength: 6, expiresIn: 600 }
})
```

---

### Priority 5: Advanced Security 🔒

#### 8. IP-based Blocking
**الهدف:** حظر IPs المشبوهة

```typescript
const blockedIPs = new Map<string, { blockedAt: number; reason: string }>()

export function isIPBlocked(ip: string): boolean {
  const blocked = blockedIPs.get(ip)
  if (!blocked) return false

  // حظر لمدة ساعة
  if (Date.now() - blocked.blockedAt > 3600000) {
    blockedIPs.delete(ip)
    return false
  }

  return true
}

export function blockIP(ip: string, reason: string) {
  blockedIPs.set(ip, { blockedAt: Date.now(), reason })
  console.log(`[SECURITY] Blocked IP: ${ip} - Reason: ${reason}`)
}
```

---

#### 9. Device Fingerprinting (اختياري)
**الهدف:** التتبع الدقيق للأجهزة

```typescript
import { FingerprintJs } from '@fingerprintjs/fingerprintjs'

export async function getDeviceId() {
  const fp = await FingerprintJs.load()
  const result = await fp.get()
  return result.visitorId
}
```

---

## 📋 الخطة المقترحة للتنفيذ

### Week 1: Security Foundation
1. ✅ Rate Limiting (Upstash Redis)
2. ✅ محاولة التحقق المحدودة
3. ✅ Code Cleanup Automation

### Week 2: Enhanced UX
4. ✅ Resend Logic محسّن
5. ✅ Timer في صفحة التحقق
6. ✅ رسائل خطأ واضحة

### Week 3: Monitoring
7. ✅ Logging Structure محسّن
8. ✅ Dashboard للإحصائيات
9. ✅ Alerts للأحداث المشبوهة

### Week 4: Advanced Security
10. ✅ IP-based Blocking
11. ✅ Security Review شامل
12. ✅ Penetration Testing

---

## 🔧 Dependencies المطلوبة

```bash
# Rate Limiting
bun add @upstash/ratelimit @upstash/redis

# Logging & Monitoring
bun add @sentry/nextjs

# Device Fingerprinting (اختياري)
bun add @fingerprintjs/fingerprintjs
```

---

## 📊 Metrics المقترحة للتتبع

- **成功率**: نسبة التحققات الناجحة
- **平均时间**: متوسط وقت التحقق
- **失败原因**: أكثر أسباب الفشل شيوعاً
- ** resend_rate**: نسبة إعادة الإرسال
- **rate_limit_hits**: عدد مرات الوصول للحد المسموح

---

## 🎯 Success Criteria

النظام يعتبر جاهزاً للإنتاج عندما:

- ✅ لا يمكن إرسال أكثر من 5 أكواد في 10 دقائق من نفس IP
- ✅ لا يمكن تجاوز 5 محاولات تحقق فاشلة في 15 دقيقة
- ✅ الأكواد المنتهية يتم تنظيفها تلقائياً
- ✅ جميع الأحداث مسجلة بوضوح
- ✅ IPs المشبوهة يتم حظرها تلقائياً
- ✅ المستخدم يتلقى رسائل خطأ واضحة

---

**آخر تحديث:** 2024
**الحالة:** جاهز للبدء ✅
