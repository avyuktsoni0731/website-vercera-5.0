import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getVerceraFirestore() {
  const appName = 'vercera-firestore'
  if (getApps().some((app) => app.name === appName)) {
    return getFirestore(getApps().find((a) => a.name === appName)!)
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  let serviceAccount: ServiceAccount
  if (path) {
    serviceAccount = require(path) as ServiceAccount
  } else if (json) {
    serviceAccount = JSON.parse(json) as ServiceAccount
  } else {
    throw new Error('FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH not configured')
  }

  initializeApp({ credential: cert(serviceAccount) }, appName)
  return getFirestore(getApps().find((a) => a.name === appName)!)
}

export async function POST(request: NextRequest) {
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
      attendanceMarkedBy: body.adminId || 'admin', // You can add admin authentication later
    })

    return NextResponse.json({ success: true, message: `Attendance ${attended ? 'marked' : 'unmarked'} successfully` })
  } catch (err) {
    console.error('Mark attendance error:', err)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
}
