'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'

type RegData = { eventId?: string; bundleId?: string }

/**
 * Returns the set of event IDs and bundle IDs the current user has paid for (status paid or completed).
 * Use to show "Registered" on event cards, "Already purchased" on packs, and hide checkout links.
 */
export function useMyRegistrations(): {
  registeredEventIds: Set<string>
  purchasedBundleIds: Set<string>
  loading: boolean
} {
  const { user } = useAuth()
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set())
  const [purchasedBundleIds, setPurchasedBundleIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setRegisteredEventIds(new Set())
      setPurchasedBundleIds(new Set())
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const fetchRegs = async () => {
      try {
        const regsRef = collection(db, 'registrations')
        const q = query(
          regsRef,
          where('userId', '==', user.uid),
          where('status', 'in', ['paid', 'completed'])
        )
        const snapshot = await getDocs(q)
        if (cancelled) return
        const eventIds = new Set<string>()
        const bundleIds = new Set<string>()
        snapshot.docs.forEach((docSnap) => {
          const d = docSnap.data() as RegData
          if (d.eventId) eventIds.add(d.eventId)
          if (d.bundleId) bundleIds.add(d.bundleId)
        })
        setRegisteredEventIds(eventIds)
        setPurchasedBundleIds(bundleIds)
      } catch {
        if (!cancelled) {
          setRegisteredEventIds(new Set())
          setPurchasedBundleIds(new Set())
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRegs()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  return { registeredEventIds, purchasedBundleIds, loading }
}
