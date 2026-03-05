import { NextRequest, NextResponse } from 'next/server'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import { requireAdminLevel } from '@/lib/admin-auth'

const ALLOWED_LEVELS = ['owner', 'super_admin'] as const

export async function GET(request: NextRequest) {
  const auth = await requireAdminLevel(request, [...ALLOWED_LEVELS])
  if (auth instanceof NextResponse) return auth
  const uid = auth.uid
  try {
    const db = getVerceraFirestore()

    const [regsSnap, participantsSnap, teamsSnap, txSnap] = await Promise.all([
      db.collection('registrations').get(),
      db.collection('vercera_5_participants').get(),
      db.collection('teams').get(),
      db.collection('transactions').get(),
    ])

    const registrations = regsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{
      id: string
      status?: string
      eventId?: string
      attended?: boolean
      createdAt?: string
      userId?: string
      bundleId?: string
    }>

    const transactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{
      id: string
      type?: string
      amount?: number
      eventId?: string
      userId?: string
      bundleId?: string
      bundleName?: string
      createdAt?: string
    }>

    const totalRevenue = Math.round(
      transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) * 100
    ) / 100

    const totalRegistrations = registrations.length
    const paidCount = registrations.filter((r) => r.status === 'paid' || r.status === 'completed').length
    const attendedCount = registrations.filter((r) => r.attended === true).length

    const eventWise: Record<string, { count: number; revenue: number; attended: number }> = {}
    for (const r of registrations) {
      const eid = r.eventId || 'unknown'
      if (!eventWise[eid]) eventWise[eid] = { count: 0, revenue: 0, attended: 0 }
      eventWise[eid].count += 1
      if (r.attended) eventWise[eid].attended += 1
    }
    for (const t of transactions) {
      if (t.type === 'event' && t.eventId) {
        if (!eventWise[t.eventId]) eventWise[t.eventId] = { count: 0, revenue: 0, attended: 0 }
        eventWise[t.eventId].revenue += Number(t.amount) || 0
      }
    }

    const recentRegistrations = registrations
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 10)

    const eventsSnap = await db.collection('events').get()
    const eventNames: Record<string, string> = {}
    eventsSnap.docs.forEach((doc) => {
      const name = (doc.data() as { name?: string }).name
      eventNames[doc.id] = name ?? doc.id
    })

    const packTransactions = transactions.filter((t) => t.type === 'pack' && t.userId)
    const userIds = [...new Set(packTransactions.map((t) => t.userId).filter(Boolean))] as string[]
    const participantSnaps = await Promise.all(userIds.map((uid) => db.collection('vercera_5_participants').doc(uid).get()))
    const participantByUid: Record<string, { email?: string; fullName?: string }> = {}
    participantSnaps.forEach((snap, i) => {
      const uid = userIds[i]
      if (snap.exists && uid) {
        const d = snap.data() as { email?: string; fullName?: string }
        participantByUid[uid] = { email: d.email, fullName: d.fullName }
      }
    })
    const regsByUserBundle: Record<string, number> = {}
    for (const r of registrations) {
      const uid = r.userId
      const bundleId = r.bundleId
      if (uid && bundleId) {
        const key = `${uid}_${bundleId}`
        regsByUserBundle[key] = (regsByUserBundle[key] ?? 0) + 1
      }
    }
    const packPurchases = packTransactions.map((t) => {
      const profile = t.userId ? participantByUid[t.userId] : null
      const eventsAddedCount = t.userId && t.bundleId ? (regsByUserBundle[`${t.userId}_${t.bundleId}`] ?? 0) : 0
      return {
        userId: t.userId,
        userEmail: profile?.email ?? null,
        userName: profile?.fullName ?? null,
        bundleId: t.bundleId ?? null,
        bundleName: t.bundleName ?? null,
        amount: Number(t.amount) ?? 0,
        createdAt: t.createdAt ?? null,
        eventsAddedCount,
      }
    })
    packPurchases.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

    return NextResponse.json({
      totalParticipants: participantsSnap.size,
      totalTeams: teamsSnap.size,
      totalRegistrations,
      paidCount,
      attendedCount,
      totalRevenue,
      eventWise,
      eventNames,
      recentRegistrations,
      packPurchases,
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
