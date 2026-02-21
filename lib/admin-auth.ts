import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getAdminUids } from '@/lib/firebase-admin'

function getFirebaseAdminAuth() {
  const appName = 'vercera-admin-auth'
  if (getApps().some((app) => app.name === appName)) {
    return getAuth(getApps().find((a) => a.name === appName)!)
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
  return getAuth(getApps().find((a) => a.name === appName)!)
}

/** Returns decoded uid if request has valid admin token; otherwise returns null. */
export async function verifyAdminToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return null
    const auth = getFirebaseAdminAuth()
    const decoded = await auth.verifyIdToken(token)
    const uids = getAdminUids()
    if (!uids.length || !uids.includes(decoded.uid)) return null
    return decoded.uid
  } catch {
    return null
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbiddenResponse() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
