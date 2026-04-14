import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
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

    const pkg = await db.travelPackage.update({
      where: { id: resolvedParams.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        travelTypeId: body.travelTypeId,
        destination: body.destination,
        destinationAr: body.destinationAr,
        duration: body.duration,
        maxPeople: body.maxPeople,
        price: body.price,
        discountPrice: body.discountPrice,
        images: body.images,
        features: body.features,
        featuresAr: body.featuresAr,
        includes: body.includes,
        includesAr: body.includesAr,
        excludes: body.excludes,
        excludesAr: body.excludesAr,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        order: body.order,
      }
    })

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
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

    await db.travelPackage.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
