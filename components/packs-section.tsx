'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMyRegistrations } from '@/hooks/use-my-registrations'
import { PackTierCard, type PackTierBundle } from '@/components/pack-tier-card'

export function PacksSection() {
  const [bundles, setBundles] = useState<PackTierBundle[]>([])
  const { purchasedBundleIds } = useMyRegistrations()

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
          className="flex flex-nowrap gap-6 justify-center overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {bundles.map((b) => (
            <div
              key={b.id}
              className="flex-shrink-0"
              style={{ scrollSnapAlign: 'center' }}
            >
              <PackTierCard
                bundle={b}
                purchased={purchasedBundleIds.has(b.id)}
                href="/events"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
