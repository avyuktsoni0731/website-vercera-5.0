import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { generateVerceraTeamId } from '@/lib/vercera-team-id'

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
    const {
      orderId,
      paymentId,
      signature,
      eventId,
      eventName,
      amount,
      userId,
      team,
      // legacy / fallback fields
      teamName,
      memberEmails,
      additionalInfo,
    } = body as {
      orderId?: string
      paymentId?: string
      signature?: string
      eventId?: string
      eventName?: string
      amount?: number
      userId?: string
      team?: {
        isTeamEvent?: boolean
        teamName?: string
        teamSize?: number
        members?: {
          userId: string
          verceraId: string
          fullName: string
          email: string
          isLeader?: boolean
        }[]
      } | null
      teamName?: string
      memberEmails?: string | null
      additionalInfo?: string | null
    }

    if (!orderId || !paymentId || !signature || !eventId || !eventName || !amount || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const db = getVerceraFirestore()

    // Get leader's verceraId from profile
    let leaderVerceraId: string | null = null
    try {
      const userDoc = await db.collection('vercera_5_participants').doc(userId).get()
      if (userDoc.exists) {
        leaderVerceraId = (userDoc.data() as { verceraId?: string }).verceraId || null
      }
    } catch {
      // Continue without verceraId if profile fetch fails
    }

    const nowIso = new Date().toISOString()
    const registrationDate = nowIso.split('T')[0]

    const isTeamEvent = Boolean(team && team.isTeamEvent && team.members && team.members.length > 0)

    if (isTeamEvent && team && team.members) {
      const verceraTeamId = generateVerceraTeamId()
      const teamSize = team.teamSize ?? team.members.length

      const teamDoc = await db.collection('teams').add({
        verceraTeamId,
        eventId,
        eventName,
        teamName: team.teamName || null,
        leaderUserId: userId,
        leaderVerceraId,
        members: team.members,
        size: teamSize,
        isTeamEvent: true,
        amountPaid: Number(amount),
        paidByUserId: userId,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        createdAt: nowIso,
      })

      const teamDocId = teamDoc.id
      const perMemberAmount = teamSize > 0 ? Number(amount) / teamSize : Number(amount)

      const batch = db.batch()
      for (const member of team.members) {
        const regRef = db.collection('registrations').doc()
        batch.set(regRef, {
          userId: member.userId,
          verceraId: member.verceraId || null,
          eventId,
          eventName,
          amount: perMemberAmount,
          registrationDate,
          status: 'paid',
          attended: false,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          isTeamEvent: true,
          isTeamLeader: Boolean(member.isLeader),
          teamId: teamDocId,
          verceraTeamId,
          additionalInfo: additionalInfo || null,
          createdAt: nowIso,
        })
      }
      await batch.commit()
    } else {
      // Solo registration (backwards-compatible path)
      await db.collection('registrations').add({
        userId,
        verceraId: leaderVerceraId,
        eventId,
        eventName,
        amount: Number(amount),
        registrationDate,
        status: 'paid',
        attended: false,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        teamName: teamName || null,
        memberEmails: memberEmails || null,
        additionalInfo: additionalInfo || null,
        createdAt: nowIso,
      })
    }

    return NextResponse.json({ success: true, message: 'Payment verified and registration saved' })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
