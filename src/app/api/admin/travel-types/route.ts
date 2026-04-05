import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all travel types
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const travelTypes = await db.travelType.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ travelTypes })
  } catch (error) {
    console.error('Error fetching travel types:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST new travel type
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const travelType = await db.travelType.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        description: body.description || '',
        descriptionAr: body.descriptionAr || '',
        image: body.image || null,
        icon: body.icon || null,
        isActive: body.isActive ?? true,
        order: body.order || 0,
      }
    })

    return NextResponse.json({ travelType })
  } catch (error) {
    console.error('Error creating travel type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
