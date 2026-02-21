import { NextRequest, NextResponse } from 'next/server'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const uid = await verifyAdminToken(request)
  if (!uid) return unauthorizedResponse()
  try {
    const body = await request.json()
    const { registrationId, eventId, attended } = body

    if (!registrationId || eventId === undefined || attended === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getVerceraFirestore()

    await db.collection('registrations').doc(registrationId).update({
      attended: Boolean(attended),
      attendanceMarkedAt: new Date().toISOString(),
      attendanceMarkedBy: body.adminId || uid,
    })

    return NextResponse.json({ success: true, message: `Attendance ${attended ? 'marked' : 'unmarked'} successfully` })
  } catch (err) {
    console.error('Mark attendance error:', err)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
}
