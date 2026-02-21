'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ExternalLink } from 'lucide-react'
import { events } from '@/lib/events'
import { useAdminFetch } from '@/hooks/use-admin-fetch'

interface EventStats {
  count: number
  revenue: number
  attended: number
}

export default function AdminEventsPage() {
  const fetchWithAuth = useAdminFetch()
  const [eventWise, setEventWise] = useState<Record<string, EventStats>>({})

  useEffect(() => {
    fetchWithAuth('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setEventWise(data.eventWise || {})
      })
      .catch(() => setEventWise({}))
  }, [fetchWithAuth])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
          Events
        </h1>
        <p className="text-foreground/60 mt-1 text-sm">
          Event list with registration and revenue stats (from Firestore).
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {events.map((event) => {
          const stats = eventWise[event.id] || {
            count: 0,
            revenue: 0,
            attended: 0,
          }
          return (
            <div
              key={event.id}
              className="rounded-xl border border-border bg-card p-3 sm:p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3"
            >
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground text-sm sm:text-base">{event.name}</h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
                  {event.category} · Max {event.maxParticipants} · Fee ₹{event.registrationFee}
                </p>
              </div>
              <div className="flex gap-4 sm:gap-6 text-sm flex-wrap">
                <div>
                  <p className="text-foreground/50 text-xs">Registrations</p>
                  <p className="font-semibold text-foreground">{stats.count}</p>
                </div>
                <div>
                  <p className="text-foreground/50 text-xs">Revenue</p>
                  <p className="font-semibold text-accent">
                    ₹{stats.revenue.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-foreground/50 text-xs">Attended</p>
                  <p className="font-semibold text-foreground">{stats.attended}</p>
                </div>
              </div>
              <Link
                href={`/admin/registrations?eventId=${event.id}`}
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline min-h-[44px] items-center touch-manipulation"
              >
                View registrations <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
