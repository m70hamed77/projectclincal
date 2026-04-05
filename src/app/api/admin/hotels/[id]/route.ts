import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update hotel
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const hotel = await db.hotel.update({
      where: { id: params.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        city: body.city,
        cityAr: body.cityAr,
        country: body.country,
        countryAr: body.countryAr,
        address: body.address,
        addressAr: body.addressAr,
        phone: body.phone,
        email: body.email,
        website: body.website,
        stars: body.stars,
        images: body.images,
        amenities: body.amenities,
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        roomTypes: body.roomTypes,
        priceRange: body.priceRange,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        order: body.order,
      }
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE hotel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await db.hotel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
