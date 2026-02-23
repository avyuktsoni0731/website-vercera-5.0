/** Format prize amount as ₹ with Indian number formatting (e.g. ₹10,000 or ₹2,00,000). */
export function formatPrizeAmount(amount: number): string {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}
