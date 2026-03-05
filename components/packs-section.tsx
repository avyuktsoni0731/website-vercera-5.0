'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMyRegistrations } from '@/hooks/use-my-registrations'
import { PackTierCard, type PackTierBundle } from '@/components/pack-tier-card'

function useColumns(n: number) {
  const [cols, setCols] = useState(n)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setCols(mq.matches ? n : Math.min(2, n))
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [n])
  return cols
}

export function PacksSection() {
  const [bundles, setBundles] = useState<PackTierBundle[]>([])
  const { purchasedBundleIds } = useMyRegistrations()
  const cols = useColumns(bundles.length)

  useEffect(() => {
    fetch('/api/bundles')
      .then((r) => r.json())
      .then((d) => {
        if (d.bundles && Array.isArray(d.bundles)) {
          setBundles(d.bundles.map((b: PackTierBundle) => ({
            id: b.id,
            name: b.name,
            price: b.price,
            originalPrice: b.originalPrice,
            description: b.description,
            perks: b.perks,
            highlight: b.highlight,
          })))
        }
      })
      .catch(() => setBundles([]))
  }, [])

  if (bundles.length === 0) return null

  const highlighted = bundles.find((b) => b.highlight)
  const rest = bundles.filter((b) => !b.highlight)
  const mid = Math.ceil(rest.length / 2)
  const ordered = [...rest.slice(0, mid), ...(highlighted ? [highlighted] : []), ...rest.slice(mid)]

  return (
    <section id="packs" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Packs &amp; <span className="text-accent">Bundles</span>
          </h2>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Save more when you buy a pack. Get access to multiple events at a better price.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid gap-4 items-stretch w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {ordered.map((b) => (
            <div key={b.id} className="min-w-0 flex">
              <PackTierCard
                bundle={b}
                purchased={purchasedBundleIds.has(b.id)}
                href="/events"
              />
            </div>
          ))}
        </motion.div>
        <p className="text-center text-foreground/50 text-sm mt-6 max-w-xl mx-auto">
          Pay once. Add events from your dashboard anytime. We don&apos;t store or sell your data.
        </p>
      </div>
    </section>
  )
}
