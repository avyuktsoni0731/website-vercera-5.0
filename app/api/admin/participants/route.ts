import { NextRequest, NextResponse } from 'next/server'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const uid = await verifyAdminToken(request)
  if (!uid) return unauthorizedResponse()
  try {
    const db = getVerceraFirestore()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 200, 500)

    const snapshot = await db
      .collection('vercera_5_participants')
      .limit(limit)
      .get()

    const participants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ participants })
  } catch (err) {
    console.error('Admin participants list error:', err)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}
