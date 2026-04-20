import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.hash(password, 10)
}

export async function POST(request: NextRequest) {
  try {
    console.log('[SEED DATA] Starting data seeding...')

    // Check if already seeded
    const existingUsers = await db.user.count()
    if (existingUsers > 10) {
      return NextResponse.json({
        success: false,
        message: 'Database already has data'
      })
    }

    // Create Students
    const studentData = [
      { name: 'أحمد محمد', email: 'ahmed1@student.com', phone: '01012345678', city: 'القاهرة', academicYear: 4 },
      { name: 'سارة علي', email: 'sara2@student.com', phone: '01012345679', city: 'القاهرة', academicYear: 5 },
      { name: 'محمد خالد', email: 'mohamed3@student.com', phone: '01012345680', city: 'الإسكندرية', academicYear: 3 },
      { name: 'نورا سعيد', email: 'noura4@student.com', phone: '01012345681', city: 'الجيزة', academicYear: 4 },
      { name: 'كريم حسن', email: 'kareem5@student.com', phone: '01012345682', city: 'القاهرة', academicYear: 5 },
      { name: 'منى أحمد', email: 'mona6@student.com', phone: '01012345683', city: 'المنصورة', academicYear: 4 },
      { name: 'عمر فاروق', email: 'omar7@student.com', phone: '01012345684', city: 'القاهرة', academicYear: 3 },
      { name: 'فاطمة زكي', email: 'fatma8@student.com', phone: '01012345685', city: 'الفيوم', academicYear: 5 },
      { name: 'ياسر محمود', email: 'yasser9@student.com', phone: '01012345686', city: 'القاهرة', academicYear: 4 },
      { name: 'رنا عبد الله', email: 'rana10@student.com', phone: '01012345687', city: 'الغربية', academicYear: 5 },
    ]

    const students: any[] = []
    for (const student of studentData) {
      const password = await hashPassword('password123')
      const user = await db.user.create({
        data: {
          email: student.email,
          password,
          name: student.name,
          phone: student.phone,
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      })

      const createdStudent = await db.student.create({
        data: {
          userId: user.id,
          isVerified: true,
          verificationStatus: 'APPROVED',
          universityEmail: student.email,
          universityName: 'جامعة القاهرة - كلية طب الأسنان',
          studentIdNumber: `2023${Math.floor(Math.random() * 100000)}`,
          academicYear: student.academicYear,
          city: student.city,
          completedCases: Math.floor(Math.random() * 30) + 10,
          activeCases: Math.floor(Math.random() * 10) + 2,
        }
      })
      students.push(createdStudent)
    }

    console.log(`[SEED DATA] Created ${students.length} students`)

    // Create Patients
    const patientData = [
      { name: 'عمر حسن', email: 'patient1@test.com', phone: '01122334455', city: 'القاهرة' },
      { name: 'خديجة محمد', email: 'patient2@test.com', phone: '01122334456', city: 'الجيزة' },
      { name: 'أمير أحمد', email: 'patient3@test.com', phone: '01122334457', city: 'الإسكندرية' },
      { name: 'سما حسن', email: 'patient4@test.com', phone: '01122334458', city: 'القاهرة' },
      { name: 'يوسف علي', email: 'patient5@test.com', phone: '01122334459', city: 'المنصورة' },
      { name: 'نور الهدى', email: 'patient6@test.com', phone: '01122334460', city: 'الفيوم' },
      { name: 'ريم محمود', email: 'patient7@test.com', phone: '01122334461', city: 'القاهرة' },
      { name: 'عمر خالد', email: 'patient8@test.com', phone: '01122334462', city: 'الغربية' },
      { name: 'منى سعيد', email: 'patient9@test.com', phone: '01122334463', city: 'القاهرة' },
      { name: 'كريم أحمد', email: 'patient10@test.com', phone: '01122334464', city: 'الجيزة' },
      { name: 'فاطمة علي', email: 'patient11@test.com', phone: '01122334465', city: 'الإسكندرية' },
      { name: 'ياسر محمد', email: 'patient12@test.com', phone: '01122334466', city: 'القاهرة' },
      { name: 'رنا حسن', email: 'patient13@test.com', phone: '01122334467', city: 'المنصورة' },
      { name: 'أمير محمود', email: 'patient14@test.com', phone: '01122334468', city: 'الفيوم' },
      { name: 'نور الدين', email: 'patient15@test.com', phone: '01122334469', city: 'القاهرة' },
    ]

    const patients: any[] = []
    for (const patient of patientData) {
      const password = await hashPassword('password123')
      const user = await db.user.create({
        data: {
          email: patient.email,
          password,
          name: patient.name,
          phone: patient.phone,
          role: 'PATIENT',
          status: 'ACTIVE'
        }
      })

      const createdPatient = await db.patient.create({
        data: {
          userId: user.id,
          governorate: patient.city,
          age: Math.floor(Math.random() * 40) + 18,
          gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
        }
      })
      patients.push(createdPatient)
    }

    console.log(`[SEED DATA] Created ${patients.length} patients`)

    // Treatment types
    const treatmentTypes = ['FILLING', 'EXTRACTION', 'CLEANING', 'ROOT_CANAL', 'PROSTHETICS', 'ORTHODONTICS', 'SURGERY', 'PERIODONTAL', 'WHITENING', 'X_RAY']
    const cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'الفيوم', 'الغربية']
    const priorities = ['URGENT', 'MEDIUM', 'NORMAL']

    // Create Posts
    const posts: any[] = []
    for (const student of students) {
      const numPosts = Math.floor(Math.random() * 4) + 2 // 2-5 posts per student
      for (let i = 0; i < numPosts; i++) {
        const post = await db.post.create({
          data: {
            studentId: student.id,
            title: `حاجة ${treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)]} - ${i + 1}`,
            treatmentType: treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)] as any,
            priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
            city: cities[Math.floor(Math.random() * cities.length)],
            address: `${Math.floor(Math.random() * 100)} شارع الرئيسي`,
            requiredCount: Math.floor(Math.random() * 3) + 1,
            status: 'ACTIVE'
          }
        })
        posts.push(post)
      }
    }

    console.log(`[SEED DATA] Created ${posts.length} posts`)

    // Create Applications
    const applications: any[] = []
    for (const post of posts) {
      const numApplications = Math.floor(Math.random() * 4) + 1
      const usedPatients = new Set()

      for (let i = 0; i < numApplications; i++) {
        let patient = patients[Math.floor(Math.random() * patients.length)]
        let attempts = 0
        while (usedPatients.has(patient.id) && attempts < 10) {
          patient = patients[Math.floor(Math.random() * patients.length)]
          attempts++
        }
        usedPatients.add(patient.id)

        const app = await db.application.create({
          data: {
            postId: post.id,
            patientId: patient.id,
            studentId: post.studentId,
            status: Math.random() > 0.3 ? 'ACCEPTED' : 'PENDING' as any,
            medicalSnapshot: '',
          }
        })
        applications.push(app)
      }
    }

    console.log(`[SEED DATA] Created ${applications.length} applications`)

    // Create Cases and Ratings
    const completedApplications = applications.filter(a => a.status === 'ACCEPTED')
    const cases: any[] = []
    const ratings: any[] = []

    for (const app of completedApplications) {
      const case_ = await db.case.create({
        data: {
          applicationId: app.id,
          isCompleted: Math.random() > 0.3,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: Math.random() > 0.5 ? new Date() : null,
        }
      })
      cases.push(case_)

      if (case_.isCompleted) {
        const rating = await db.rating.create({
          data: {
            caseId: case_.id,
            patientId: app.patientId,
            studentId: app.studentId,
            overallRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            qualityRating: Math.floor(Math.random() * 2) + 3,
            professionalRating: Math.floor(Math.random() * 2) + 3,
            punctualityRating: Math.floor(Math.random() * 2) + 3,
            cleanlinessRating: Math.floor(Math.random() * 2) + 3,
            explanationRating: Math.floor(Math.random() * 2) + 3,
            reviewText: 'تجربة رائعة، شكراً جزيلاً!',
            isVisible: Math.random() > 0.2,
          }
        })
        ratings.push(rating)

        // Update student stats
        await db.student.update({
          where: { id: app.studentId },
          data: {
            completedCases: { increment: 1 }
          }
        })
      }
    }

    console.log(`[SEED DATA] Created ${cases.length} cases`)
    console.log(`[SEED DATA] Created ${ratings.length} ratings`)

    // Calculate final stats
    const activeStudentsCount = await db.student.count({
      where: {
        isVerified: true,
        user: { status: 'ACTIVE' }
      }
    })

    const activePatientsCount = await db.patient.count({
      where: {
        user: { status: 'ACTIVE' }
      }
    })

    const completedCasesCount = await db.case.count({
      where: { isCompleted: true }
    })

    // Calculate average rating
    const allRatings = await db.rating.findMany()
    const avgRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length).toFixed(1)
      : '0.0'

    console.log(`[SEED DATA] Final stats:`)
    console.log(`  - Active Students: ${activeStudentsCount}`)
    console.log(`  - Active Patients: ${activePatientsCount}`)
    console.log(`  - Completed Cases: ${completedCasesCount}`)
    console.log(`  - Average Rating: ${avgRating}`)

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully',
      stats: {
        activeStudents: activeStudentsCount,
        activePatients: activePatientsCount,
        completedCases: completedCasesCount,
        averageRating: parseFloat(avgRating)
      }
    })

  } catch (error: any) {
    console.error('[SEED DATA] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed data' },
      { status: 500 }
    )
  }
}
