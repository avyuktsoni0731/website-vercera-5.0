'use client'

import { useState, useRef } from 'react'
import { QrCode, Search, CheckCircle } from 'lucide-react'
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

export default function AdminScanPage() {
  const fetchWithAuth = useAdminFetch()
  const [verceraId, setVerceraId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    participant: Participant
    registrations: Registration[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = verceraId.trim().toUpperCase()
    if (!id) {
      setError('Enter a Vercera ID')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
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
        participant: data.participant,
        registrations: data.registrations || [],
      })
      setVerceraId('')
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-7 w-7" />
          Ticket scanning
        </h1>
        <p className="text-foreground/60 mt-1">
          Enter or scan Vercera ID to look up participant and mark attendance.
        </p>
      </div>

      <form onSubmit={handleScan} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Vercera ID (e.g. VEC00001)"
            value={verceraId}
            onChange={(e) => setVerceraId(e.target.value.toUpperCase())}
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

      {result && (
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
    </div>
  )
}
