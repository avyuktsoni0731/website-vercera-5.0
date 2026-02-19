'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { CircularTextJSCSS } from '@/components/CircularText-JS-CSS'

export function CursorCircularText() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [hasFinePointer, setHasFinePointer] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    setHasFinePointer(media.matches)
    const listener = () => setHasFinePointer(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isScrollingRef.current) {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition(null)
    setIsVisible(false)
  }, [])

  const handleScroll = useCallback(() => {
    setIsVisible(false)
    isScrollingRef.current = true
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 150)
  }, [])

  useEffect(() => {
    if (!hasFinePointer) return
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [hasFinePointer, handleMouseMove, handleMouseLeave, handleScroll])

  if (!hasFinePointer || position === null || !isVisible) return null

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
