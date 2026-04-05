import { NextRequest, NextResponse } from 'next/server'
import { verificationCodes } from '../send/route'

export async function POST(request: NextRequest) {
  try {
    const { contact, code } = await request.json()

    if (!contact || !code) {
      return NextResponse.json(
        { message: 'Contact and code are required' },
        { status: 400 }
      )
    }

    const storedData = verificationCodes.get(contact)

    if (!storedData) {
      return NextResponse.json(
        { message: 'No verification code found for this contact. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check if code has expired
    if (storedData.expiresAt < Date.now()) {
      verificationCodes.delete(contact)
      return NextResponse.json(
        { message: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      )
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Code is valid - remove it to prevent reuse
    verificationCodes.delete(contact)

    return NextResponse.json({
      success: true,
      message: 'Verification successful',
    })
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json(
      { message: 'Failed to verify code' },
      { status: 500 }
    )
  }
}
