const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkPhotos() {
  try {
    console.log('=== Checking Case Photos ===\n')

    // Get all photos
    const photos = await prisma.casePhoto.findMany({
      include: {
        case_: {
          include: {
            application: {
              include: {
                post: true,
                student: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    })

    console.log(`Total photos: ${photos.length}\n`)

    if (photos.length === 0) {
      console.log('No photos found')
      return
    }

    photos.forEach((photo, i) => {
      console.log(`Photo ${i + 1}:`)
      console.log(`  ID: ${photo.id}`)
      console.log(`  Type: ${photo.photoType}`)
      console.log(`  Is Public: ${photo.isPublic}`)
      console.log(`  Case ID: ${photo.caseId}`)
      console.log(`  Student: ${photo.case_.application.student.user.name}`)
      console.log(`  Post: ${photo.case_.application.post.title}`)
      console.log(`  Case Completed: ${photo.case_.isCompleted}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPhotos()
