import nodemailer from 'nodemailer'

async function testGmailSMTP() {
  console.log('═══════════════════════════════════════')
  console.log('🧪 اختبار Gmail SMTP')
  console.log('═══════════════════════════════════════')

  try {
    console.log('\n[STEP 1] 🔌 إنشاء Gmail SMTP Transporter...')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    })

    console.log('✅ Transporter created successfully')

    console.log('\n[STEP 2] ✉️ اختبار إرسال إيميل...')

    const testEmail = 'mohamed7744650@gmail.com'
    const testCode = '123456'

    const info = await transporter.sendMail({
      from: `'🦷 سمايلي لطب الأسنان' <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 اختبار Gmail SMTP - كود التحقق',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .code-box {
              background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
              border: 2px dashed #10b981;
              border-radius: 10px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 48px;
              font-weight: bold;
              color: #059669;
              letter-spacing: 8px;
              margin: 0;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #6c757d;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🦷 سمايلي لطب الأسنان</h1>
            </div>

            <div class="content">
              <h2 style="color: #10b981; margin-top: 0;">🧪 اختبار Gmail SMTP</h2>

              <p>هذا إيميل اختبار للتأكد من أن Gmail SMTP يعمل بشكل صحيح.</p>
              <p>إذا وصل هذا الإيميل، فالنظام جاهز! 🎉</p>

              <div class="code-box">
                <p class="code">${testCode}</p>
              </div>

              <p><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-EG')}</p>
              <p><strong>معلومات الإرسال:</strong></p>
              <ul>
                <li>الخدمة: Gmail SMTP</li>
                <li>من: ${process.env.EMAIL_USER}</li>
                <li>إلى: ${testEmail}</li>
              </ul>
            </div>

            <div class="footer">
              <p>هذه رسالة اختبار من نظام سمايلي لطب الأسنان</p>
              <p>© 2026 سمايلي لطب الأسنان - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `🧪 اختبار Gmail SMTP\n\nكود التحقق: ${testCode}\n\nإذا وصل هذا الإيميل، فالنظام جاهز! 🎉`
    })

    console.log('✅ Email sent successfully!')
    console.log('📧 Message ID:', info.messageId)
    console.log('📬 To:', info.accepted.join(', '))
    console.log('📤 From:', info.envelope.from)

    console.log('\n═══════════════════════════════════════')
    console.log('✅✅✅ Gmail SMTP يعمل بنجاح!')
    console.log('═══════════════════════════════════════')

    console.log('\n📊 تفاصيل الإرسال:')
    console.log('   - الحالة: ✅ نجح')
    console.log('   - المرسل:', process.env.EMAIL_USER)
    console.log('   - المستقبل:', testEmail)
    console.log('   - الرسالة:', 'كود التحقق: ' + testCode)

    console.log('\n🎯 الخطوات القادمة:')
    console.log('   1. راجع صندوق الوارد (Inbox)')
    console.log('   2. تحقق من البريد المزعج (Spam/Junk) إذا لم تجد الإيميل')
    console.log('   3. تأكد من وصول الإيميل بالتصميم الصحيح')

  } catch (error) {
    console.error('\n❌ حدث خطأ أثناء الإرسال:')
    console.error(error)

    console.log('\n🔧 حلول محتملة:')
    console.log('   1. تأكد من أن App Password صحيح')
    console.log('   2. تأكد من تفعيل Two-Step Verification')
    console.log('   3. تأكد من إنشاء App Password صحيح')
    console.log('   4. تحقق من اتصال الإنترنت')

    process.exit(1)
  }
}

testGmailSMTP()
