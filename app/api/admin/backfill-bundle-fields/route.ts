import { NextRequest, NextResponse } from 'next/server'
import { getVerceraFirestore } from '@/lib/firebase-admin'
import { requireAdminLevel } from '@/lib/admin-auth'
import type { DocumentSnapshot } from 'firebase-admin/firestore'

/**
 * POST /api/admin/backfill-bundle-fields
 * Backfills bundleType, bundleName, and hasAccommodation on registrations that have bundleId
 * but are missing these fields (e.g. created before we added them).
 * Owner and super_admin only.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminLevel(request, ['owner', 'super_admin'])
  if (auth instanceof NextResponse) return auth

  try {
    const db = getVerceraFirestore()

    // Get all bundle IDs so we only touch registrations that reference a bundle
    const bundlesSnap = await db.collection('bundles').get()
    const bundleIds = bundlesSnap.docs.map((d) => d.id)
    if (bundleIds.length === 0) {
      return NextResponse.json({ updated: 0, message: 'No bundles in database' })
    }

    const bundleMap = new Map<string, { type: string; name: string }>()
    for (const doc of bundlesSnap.docs) {
      const d = doc.data()
      bundleMap.set(doc.id, {
        type: (d.type as string) ?? 'all_events',
        name: (d.name as string) ?? '',
      })
    }

    let updated = 0
    const batchSize = 500

    for (const bundleId of bundleIds) {
      const bundleInfo = bundleMap.get(bundleId)
      const bundleType = bundleInfo?.type ?? 'all_events'
      const bundleName = bundleInfo?.name ?? null
      const hasAccommodation = bundleType === 'all_in_one'

      let lastDoc: DocumentSnapshot | null = null
      let hasMore = true

      while (hasMore) {
        let query = db
          .collection('registrations')
          .where('bundleId', '==', bundleId)
          .limit(batchSize)
        if (lastDoc) query = query.startAfter(lastDoc) as ReturnType<typeof query.startAfter>

        const snap = await query.get()
        if (snap.empty) {
          hasMore = false
          break
        }

        const batch = db.batch()
        let batchCount = 0

        for (const doc of snap.docs) {
          const data = doc.data()
          const needsUpdate =
            data.bundleType !== bundleType ||
            data.bundleName !== bundleName ||
            data.hasAccommodation !== hasAccommodation

          if (needsUpdate) {
            batch.update(doc.ref, {
              bundleType,
              bundleName: bundleName ?? null,
              hasAccommodation,
            })
            batchCount++
            updated++
          }
        }

        if (batchCount > 0) await batch.commit()
        hasMore = snap.docs.length === batchSize
        if (hasMore) lastDoc = snap.docs[snap.docs.length - 1]
      }
    }

    return NextResponse.json({
      updated,
      message: `Backfilled bundleType, bundleName, and hasAccommodation on ${updated} registration(s).`,
    })
  } catch (err) {
    console.error('Backfill bundle fields error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Backfill failed' },
      { status: 500 }
    )
  }
}
