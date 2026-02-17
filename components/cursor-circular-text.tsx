'use client'

import { useState, useCallback, useEffect } from 'react'
import { CircularTextJSCSS } from '@/components/CircularText-JS-CSS'

export function CursorCircularText() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition(null)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  if (position === null) return null

  return (
    <div
      className="pointer-events-none fixed z-[100]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularTextJSCSS
        text="VERCERA 5.0 "
        onHover="speedUp"
        spinDuration={20}
        variant="cursor"
        className="text-accent"
      />
    </div>
  )
}
