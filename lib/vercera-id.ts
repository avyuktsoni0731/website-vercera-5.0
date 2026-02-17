/**
 * Generates a unique Vercera ID in the format: V5_<alphanumeric>
 * Format: V5_ followed by 8 alphanumeric characters
 */
export function generateVerceraId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding confusing chars like 0, O, I, 1
  const randomPart = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `V5_${randomPart}`
}

/**
 * Validates if a string is a valid Vercera ID format
 */
export function isValidVerceraId(id: string): boolean {
  return /^V5_[A-Z2-9]{8}$/.test(id)
}
