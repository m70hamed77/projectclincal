import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all packages
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

    const packages = await db.travelPackage.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST new package
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

    const pkg = await db.travelPackage.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        description: body.description || '',
        descriptionAr: body.descriptionAr || '',
        travelTypeId: body.travelTypeId || null,
        destination: body.destination,
        destinationAr: body.destinationAr,
        duration: body.duration,
        maxPeople: body.maxPeople,
        price: body.price,
        discountPrice: body.discountPrice,
        images: body.images || [],
        features: body.features || [],
        featuresAr: body.featuresAr || [],
        includes: body.includes || [],
        includesAr: body.includesAr || [],
        excludes: body.excludes || [],
        excludesAr: body.excludesAr || [],
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        rating: 0,
        reviewCount: 0,
        order: body.order || 0,
      }
    })

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
