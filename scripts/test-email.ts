import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_test_placeholder')

async function testEmail() {
  try {
    console.log('Testing email sending to: doommm2026@gmail.com')
    console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Found' : '❌ Not found')

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'doommm2026@gmail.com',
      subject: '🧪 اختبار إرسال الإيميل',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">🧪 اختبار إرسال الإيميل</h1>
          <p>هذا إيميل اختبار للتأكد من أن خدمة الإيميل تعمل بشكل صحيح.</p>
          <h2 style="color: #059669;">الكود: 332554</h2>
          <p>يرجى التحقق من صندوق الوارد (Inbox) والبريد المزعج (Spam/Junk).</p>
          <p><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-EG')}</p>
        </div>
      `,
      text: `اختبار إرسال الإيميل\nالكود: 332554\nيرجى التحقق من Inbox و Spam/Junk.`
    })

    console.log('\n✅ Email sent successfully!')
    console.log('Response data:', data)
    // console.log('Message ID:', data.id)
    // console.log('To:', data.to)
    // console.log('Status:', data.status || 'queued')

  } catch (error: any) {
    console.error('\n❌ Error sending email:')
    console.error('Message:', error.message)
    console.error('Details:', error)
  }
}

testEmail()
