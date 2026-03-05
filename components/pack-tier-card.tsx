'use client'

import Link from 'next/link'
import { Package, Check, BadgeCheck } from 'lucide-react'

export type PackTierBundle = {
  id: string
  name: string
  price: number
  originalPrice?: number
  description?: string
  perks?: string[]
  highlight?: boolean
}

interface PackTierCardProps {
  bundle: PackTierBundle
  purchased?: boolean
  href?: string
  onSelect?: () => void
}

const CARD_MIN_HEIGHT = 380

export function PackTierCard({ bundle, purchased, href, onSelect }: PackTierCardProps) {
  const isHighlight = Boolean(bundle.highlight)
  const perks = bundle.perks ?? []

  return (
    <div
      className={`
        relative flex flex-col h-full w-full rounded-2xl border overflow-hidden
        transition-all duration-300 bg-card
        ${isHighlight
          ? 'border-accent shadow-xl shadow-accent/20 scale-[1.02] z-10'
          : 'border-border hover:border-foreground/20 hover:shadow-lg'
        }
      `}
      style={{ minHeight: CARD_MIN_HEIGHT }}
    >
      {/* Header strip for highlighted (like "MOST POPULAR") */}
      {isHighlight && (
        <div className="flex-shrink-0 py-2 px-4 bg-foreground text-background text-center">
          <span className="text-xs font-bold tracking-wider uppercase">Most Popular</span>
        </div>
      )}

      <div className={`flex flex-col flex-1 p-6 ${isHighlight ? 'bg-accent/5' : ''}`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Package className="h-7 w-7 text-accent" />
          </div>
        </div>

        {/* Tier name - uppercase */}
        <h3 className="font-display font-bold text-foreground text-center text-sm uppercase tracking-wider mb-1">
          {bundle.name}
        </h3>

        {/* Tagline */}
        {bundle.description && (
          <p className="text-foreground/70 text-xs text-center mb-4 line-clamp-2">
            {bundle.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-center gap-2 mb-5">
          <span className="font-bold text-accent text-2xl">
            ₹{bundle.price.toLocaleString('en-IN')}
          </span>
          {bundle.originalPrice != null && bundle.originalPrice > bundle.price && (
            <span className="text-foreground/50 line-through text-sm">
              ₹{bundle.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Perks with checkmarks */}
        {perks.length > 0 && (
          <ul className="space-y-2.5 mb-6 flex-1 min-h-0">
            {perks.slice(0, 5).map((perk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 space-y-2">
          {purchased ? (
            <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-accent/20 text-accent font-semibold text-sm">
              <BadgeCheck className="h-4 w-4" /> Purchased
            </span>
          ) : href ? (
            <Link
              href={href}
              className={`
                block w-full text-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors
                ${isHighlight
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-background border-2 border-foreground/20 text-foreground hover:border-accent/50 hover:bg-accent/10'
                }
              `}
            >
              View pack & events →
            </Link>
          ) : onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className={`
                w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors
                ${isHighlight
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-background border-2 border-foreground/20 text-foreground hover:border-accent/50 hover:bg-accent/10'
                }
              `}
            >
              View pack & events →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
