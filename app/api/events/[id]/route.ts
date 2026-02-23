import { NextRequest, NextResponse } from 'next/server'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import type { EventRecord } from '@/lib/events-types'

export const dynamic = 'force-dynamic'

/** GET: Single event by id. Public. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

    const db = getVerceraFirestore()
    const doc = await db.collection('events').doc(id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const regsSnap = await db.collection('registrations').where('eventId', '==', id).get()
    const d = doc.data()!

    const event: EventRecord = {
      id: doc.id,
      name: d.name ?? '',
      category: (d.category as EventRecord['category']) ?? 'technical',
      description: d.description ?? '',
      longDescription: d.longDescription ?? '',
      image: d.image ?? '',
      date: d.date ?? '',
      time: d.time ?? '',
      venue: d.venue ?? '',
      registrationFee: Number(d.registrationFee) ?? 0,
      prizePool: Number(d.prizePool) ?? 0,
      maxParticipants: Number(d.maxParticipants) ?? 0,
      registeredCount: regsSnap.size,
      rules: Array.isArray(d.rules) ? d.rules : [],
      prizes: Array.isArray(d.prizes) ? d.prizes : [],
      isTeamEvent: Boolean(d.isTeamEvent),
      teamSizeMin: d.teamSizeMin != null ? Number(d.teamSizeMin) : undefined,
      teamSizeMax: d.teamSizeMax != null ? Number(d.teamSizeMax) : undefined,
      rulebookUrl: typeof d.rulebookUrl === 'string' ? d.rulebookUrl : undefined,
      order: d.order != null ? Number(d.order) : undefined,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }

    return NextResponse.json(event)
  } catch (err) {
    console.error('Event get error:', err)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
