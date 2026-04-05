import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: number; expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const { contact } = await request.json()

    if (!contact) {
      return NextResponse.json(
        { message: 'Contact information is required' },
        { status: 400 }
      )
    }

    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000)
    
    // Store code with 10 minute expiration
    verificationCodes.set(contact, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    })

    // Log the code to console (FREE method for development/testing)
    console.log('='.repeat(50))
    console.log('🔐 VERIFICATION CODE SENT')
    console.log('='.repeat(50))
    console.log(`Contact: ${contact}`)
    console.log(`Code: ${code}`)
    console.log(`Expires: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString('ar-EG')}`)
    console.log('='.repeat(50))

    // Clean up expired codes
    const now = Date.now()
    for (const [key, value] of verificationCodes.entries()) {
      if (value.expiresAt < now) {
        verificationCodes.delete(key)
      }
    }

    return NextResponse.json({
      success: true,
      code,
      message: 'Verification code sent successfully',
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { message: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}

// Export for use in verify route
export { verificationCodes }
