'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768
const POST_PROCESSING_BREAKPOINT = 1024

/**
 * Returns true when we should use static CSS fallbacks instead of WebGL/Three.js
 * backgrounds (mobile, reduced motion, or coarse pointer). Keeps the site smooth
 * on phones and slower devices.
 */
export function usePreferLightBackgrounds(): boolean {
  // Default true so we don't mount heavy WebGL on mobile before the media query runs
  const [prefer, setPrefer] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')

    const update = () => {
      setPrefer(
        window.innerWidth < MOBILE_BREAKPOINT ||
          reducedMotion.matches ||
          (coarsePointer.matches && window.innerWidth < POST_PROCESSING_BREAKPOINT)
      )
    }

    update()
    mobile.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)
    coarsePointer.addEventListener('change', update)
    return () => {
      mobile.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
      coarsePointer.removeEventListener('change', update)
    }
  }, [])

  return prefer
}

/**
 * Returns { preferLightBackgrounds, enablePostProcessing }.
 * Use enablePostProcessing=false for GridScan on tablet/small desktop to avoid heavy bloom.
 */
export function useBackgroundQuality(): { preferLightBackgrounds: boolean; enablePostProcessing: boolean } {
  const preferLight = usePreferLightBackgrounds()
  const [wide, setWide] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(`(min-width: ${POST_PROCESSING_BREAKPOINT}px)`)
    const update = () => setWide(window.innerWidth >= POST_PROCESSING_BREAKPOINT)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return {
    preferLightBackgrounds: preferLight,
    enablePostProcessing: !preferLight && wide,
  }
}
