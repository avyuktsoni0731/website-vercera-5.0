'use client'

import { useEffect, useState } from 'react'
import { Users, Search } from 'lucide-react'
import { useAdminFetch } from '@/hooks/use-admin-fetch'

interface Participant {
  id: string
  verceraId?: string
  fullName?: string
  email?: string
  collegeName?: string
  courseOfStudy?: string
  department?: string
  yearOfStudy?: string
}

export default function AdminParticipantsPage() {
  const fetchWithAuth = useAdminFetch()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchWithAuth('/api/admin/participants?limit=300')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setParticipants(data.participants || [])
      })
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false))
  }, [fetchWithAuth])

  const filtered = participants.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.verceraId || '').toLowerCase().includes(q) ||
      (p.collegeName || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-7 w-7" />
          Participants
        </h1>
        <p className="text-foreground/60 mt-1">
          All registered participants (vercera_5_participants).
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
        <input
          type="text"
          placeholder="Search name, email, Vercera ID, college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-foreground/60">Loading...</div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">
                    Vercera ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">
                    College
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/80">
                    Course / Dept
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-foreground/50">
                      No participants found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-accent">
                        {p.verceraId || '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {p.fullName || '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground/80">
                        {p.email || '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground/70">
                        {p.collegeName || '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground/60 text-xs">
                        {[p.courseOfStudy, p.department].filter(Boolean).join(' · ') || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
