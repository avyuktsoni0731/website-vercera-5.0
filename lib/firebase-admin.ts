import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const APP_NAME = 'vercera-firestore'

export function getVerceraFirestore() {
  if (getApps().some((app) => app.name === APP_NAME)) {
    return getFirestore(getApps().find((a) => a.name === APP_NAME)!)
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

  initializeApp({ credential: cert(serviceAccount) }, APP_NAME)
  return getFirestore(getApps().find((a) => a.name === APP_NAME)!)
}

/** Single owner UID from env. Only this user can manage super-admins. */
export function getOwnerUid(): string | null {
  const uid = process.env.OWNER_UID?.trim()
  return uid || null
}
