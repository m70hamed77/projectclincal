import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all hotels
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

    const hotels = await db.hotel.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ hotels })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST new hotel
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

    const hotel = await db.hotel.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        description: body.description || '',
        descriptionAr: body.descriptionAr || '',
        city: body.city,
        cityAr: body.cityAr,
        country: body.country,
        countryAr: body.countryAr,
        address: body.address || '',
        addressAr: body.addressAr || '',
        phone: body.phone || '',
        email: body.email || '',
        website: body.website || '',
        stars: body.stars,
        images: body.images || [],
        amenities: body.amenities || [],
        checkInTime: body.checkInTime || '14:00',
        checkOutTime: body.checkOutTime || '12:00',
        roomTypes: body.roomTypes || [],
        priceRange: body.priceRange || '',
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        rating: 0,
        reviewCount: 0,
        order: body.order || 0,
      }
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
