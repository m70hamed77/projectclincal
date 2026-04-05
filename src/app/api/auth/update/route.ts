import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, contact, verificationCode } = body

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required to identify the account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'No account found with this email' },
        { status: 404 }
      )
    }

    // Update user data with the existing schema
    const updateData: any = {}

    if (firstName || lastName) {
      updateData.name = `${firstName || ''} ${lastName || ''}`.trim() || existingUser.name
    }

    if (contact) {
      updateData.phone = contact
    }

    if (password) {
      updateData.password = password // In production, hash this password!
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: updateData,
    })

    console.log('User updated:', { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name })

    return NextResponse.json({
      success: true,
      message: 'Account updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { message: 'Failed to update account' },
      { status: 500 }
    )
  }
}
