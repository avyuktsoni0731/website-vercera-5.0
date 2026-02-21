import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminWithLevel } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const result = await verifyAdminWithLevel(request)
    if (!result) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: true, uid: result.uid, level: result.level })
  } catch (err) {
    console.error('Admin check error:', err)
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
}
