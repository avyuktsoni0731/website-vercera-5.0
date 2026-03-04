import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getAuthenticatedUserId, unauthorizedResponse } from '@/lib/admin-auth'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import { sendMail } from '@/lib/mail'
import { registrationEmailHtml } from '@/lib/email-templates'

/**
 * POST /api/mail/send-registration-email
 * Sends the registration confirmation email (Vercera ID + QR code) to the authenticated user.
 * Call after signup or when a legacy user gets a Vercera ID.
 */
export async function POST(request: NextRequest) {
  const userId = await getAuthenticatedUserId(request)
  if (!userId) return unauthorizedResponse()

  try {
    const db = getVerceraFirestore()
    const profileSnap = await db.collection('vercera_5_participants').doc(userId).get()
    if (!profileSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const data = profileSnap.data() as { email?: string; fullName?: string; verceraId?: string }
    const email = data.email?.trim()
    const fullName = data.fullName?.trim() || 'Participant'
    const verceraId = data.verceraId

    if (!email) {
      return NextResponse.json({ error: 'No email on profile' }, { status: 400 })
    }
    if (!verceraId) {
      return NextResponse.json({ error: 'No Vercera ID on profile' }, { status: 400 })
    }

    const qrDataUrl = await QRCode.toDataURL(verceraId, { width: 256, margin: 1 })
    const html = registrationEmailHtml({ fullName, verceraId, qrDataUrl })

    const sent = await sendMail({
      to: email,
      subject: 'Your Vercera 5.0 Registration — Vercera ID & QR Code',
      html,
      text: `Welcome to Vercera 5.0. Your Vercera ID: ${verceraId}. Present this ID (or its QR code from your dashboard) at the venue for check-in.`,
    })

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Registration email sent' })
  } catch (err) {
    console.error('Send registration email error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Send failed' },
      { status: 500 }
    )
  }
}
