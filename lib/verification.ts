import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export interface MemberVerificationResult {
  verified: boolean
  error?: string
}

/**
 * Verifies AMURoboclub membership by checking members_2025 collection.
 * Matches: enrollmentNumber, facultyNumber, mobile, email
 * Requires: paymentStatus === true
 */
export async function verifyAMURoboclubMember(data: {
  enrollmentNumber: string
  facultyNumber: string
  mobile: string
  email: string
}): Promise<MemberVerificationResult> {
  try {
    const membersRef = collection(db, 'members_2025')

    const q = query(
      membersRef,
      where('enrollmentNumber', '==', data.enrollmentNumber.trim()),
      where('facultyNumber', '==', data.facultyNumber.trim()),
      where('mobile', '==', data.mobile.trim()),
      where('email', '==', data.email.trim().toLowerCase())
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return { verified: false, error: 'No matching membership found. Please ensure you entered the same details used for membership purchase.' }
    }

    const doc = snapshot.docs[0]
    const memberData = doc.data()
    const paymentStatus = memberData.paymentStatus

    if (!paymentStatus) {
      return { verified: false, error: 'Membership payment is not complete. Please complete your membership payment first.' }
    }

    return { verified: true }
  } catch (err) {
    console.error('Member verification error:', err)
    return { verified: false, error: 'Verification failed. Please try again.' }
  }
}
