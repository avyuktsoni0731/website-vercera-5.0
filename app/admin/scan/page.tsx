'use client'

import { useState, useRef } from 'react'
import { QrCode, Search, CheckCircle, Users } from 'lucide-react'
import { useAdminFetch } from '@/hooks/use-admin-fetch'

interface Participant {
  verceraId: string
  fullName: string
  email: string
  whatsappNumber?: string
  collegeName?: string
}
interface Registration {
  id: string
  eventId: string
  eventName: string
  status: string
  amount: number
  attended?: boolean
}

type ScanResult =
  | { mode: 'participant'; participant: Participant; registrations: Registration[] }
  | {
      mode: 'team'
      team: {
        id: string
        verceraTeamId: string
        teamName: string | null
        eventId: string
        eventName: string
        members: Array<{ userId: string; verceraId: string; fullName: string; email: string; isLeader?: boolean }>
        size: number
      }
      registrations: Array<Registration & { verceraId?: string; isTeamLeader?: boolean }>
    }

const isTeamId = (id: string) => /^VT_/i.test(id.trim())

export default function AdminScanPage() {
  const fetchWithAuth = useAdminFetch()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = input.trim().toUpperCase()
    if (!id) {
      setError('Enter a Vercera ID or Team ID (e.g. VT_XXXXXXXX)')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      if (isTeamId(id)) {
        const res = await fetchWithAuth('/api/admin/scan-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verceraTeamId: id }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Team lookup failed')
          return
        }
        setResult({
          mode: 'team',
          team: data.team,
          registrations: data.registrations || [],
        })
      } else {
        const res = await fetchWithAuth('/api/admin/scan-participant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verceraId: id }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Scan failed')
          return
        }
        setResult({
          mode: 'participant',
          participant: data.participant,
          registrations: data.registrations || [],
        })
      }
      setInput('')
      inputRef.current?.focus()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (registrationId: string, eventId: string, attended: boolean) => {
    try {
      const res = await fetchWithAuth('/api/admin/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId,
          eventId,
          attended,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult((prev) =>
        prev
          ? {
              ...prev,
              registrations: prev.registrations.map((r) =>
                r.id === registrationId ? { ...r, attended } : r
              ),
            }
          : null
      )
    } catch (err) {
      alert((err as Error).message || 'Failed to update attendance')
    }
  }

  const markTeamAttendance = async (verceraTeamId: string) => {
    try {
      const res = await fetchWithAuth('/api/admin/mark-team-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verceraTeamId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult((prev) =>
        prev && prev.mode === 'team'
          ? {
              ...prev,
              registrations: prev.registrations.map((r) => ({ ...r, attended: true })),
            }
          : prev
      )
    } catch (err) {
      alert((err as Error).message || 'Failed to mark team attendance')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-7 w-7" />
          Ticket scanning
        </h1>
        <p className="text-foreground/60 mt-1">
          Enter or scan Vercera ID (participant) or Team ID (VT_…) to look up and mark attendance.
        </p>
      </div>

      <form onSubmit={handleScan} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Vercera ID (e.g. VEC00001) or Team ID (VT_XXXXXXXX)"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-foreground/40 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Looking up…' : 'Look up'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive text-sm">
          {error}
        </div>
      )}

      {result && result.mode === 'participant' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30">
            <h2 className="font-semibold text-foreground">{result.participant.fullName}</h2>
            <p className="text-sm text-foreground/70 mt-0.5">
              {result.participant.verceraId} · {result.participant.email}
            </p>
            {result.participant.collegeName && (
              <p className="text-xs text-foreground/50 mt-1">
                {result.participant.collegeName}
              </p>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground/80 mb-3">
              Registrations
            </h3>
            {result.registrations.length === 0 ? (
              <p className="text-foreground/50 text-sm">No registrations.</p>
            ) : (
              <ul className="space-y-2">
                {result.registrations.map((reg) => (
                  <li
                    key={reg.id}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {reg.eventName}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {reg.status} · ₹{reg.amount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reg.attended ? (
                        <span className="text-accent text-sm flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> Attended
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            markAttendance(reg.id, reg.eventId, true)
                          }
                          className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium hover:bg-accent/30 transition-colors"
                        >
                          Mark attended
                        </button>
                      )}
                      {reg.attended && (
                        <button
                          onClick={() =>
                            markAttendance(reg.id, reg.eventId, false)
                          }
                          className="text-foreground/50 hover:text-destructive text-xs"
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {result && result.mode === 'team' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                {result.team.teamName || 'Team'}
              </h2>
              <p className="text-sm text-foreground/70 mt-0.5 font-mono">
                {result.team.verceraTeamId} · {result.team.eventName}
              </p>
            </div>
            {result.registrations.some((r) => !r.attended) ? (
              <button
                onClick={() => markTeamAttendance(result.team.verceraTeamId)}
                className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
              >
                Mark whole team attended
              </button>
            ) : (
              <span className="text-accent text-sm flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> All attended
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground/80 mb-3">
              Team members ({result.team.size})
            </h3>
            <ul className="space-y-2">
              {result.registrations.map((reg) => (
                <li
                  key={reg.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {result.team.members.find((m) => m.verceraId === reg.verceraId)?.fullName ?? reg.verceraId ?? '—'}
                    </p>
                    <p className="text-xs text-foreground/50 font-mono">
                      {reg.verceraId} · {reg.status} · ₹{reg.amount?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  {reg.attended ? (
                    <span className="text-accent text-sm flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Attended
                    </span>
                  ) : (
                    <span className="text-foreground/50 text-sm">Not marked</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
