/** Shared event type for Firestore and API. */
export interface EventRecord {
  id: string
  name: string
  category: 'technical' | 'non-technical'
  description: string
  longDescription: string
  image: string
  date: string
  time: string
  venue: string
  registrationFee: number
  prizePool: number
  maxParticipants: number
  registeredCount?: number // computed when serving, not stored in Firestore
  rules: string[]
  prizes: { position: string; amount: number }[]
  isTeamEvent?: boolean
  teamSizeMin?: number
  teamSizeMax?: number
  /** Optional rulebook URL (e.g. PDF). If set, event page shows a rulebook section. */
  rulebookUrl?: string
  /** Display order (lower first). */
  order?: number
  createdAt?: string
  updatedAt?: string
}
