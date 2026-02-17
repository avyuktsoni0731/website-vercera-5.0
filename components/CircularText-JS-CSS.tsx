'use client'

import { useEffect } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'
import './circular-text.css'

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0,
})

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
  },
})

export type CircularTextOnHover = 'speedUp' | 'slowDown' | 'pause' | 'goBonkers' | false

export interface CircularTextJSCSSProps {
  text?: string
  spinDuration?: number
  onHover?: CircularTextOnHover
  className?: string
  /** Smaller size for cursor-follow mode */
  variant?: 'default' | 'cursor'
}

export function CircularTextJSCSS({
  text = 'VERCERA 5.0 ',
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  variant = 'default',
}: CircularTextJSCSSProps) {
  const letters = Array.from(text)
  const controls = useAnimation()
  const rotation = useMotionValue(0)

  useEffect(() => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    })
  }, [spinDuration, text, controls, rotation])

  const handleHoverStart = () => {
    const start = rotation.get()
    if (!onHover) return

    let transitionConfig: ReturnType<typeof getTransition> & { rotate?: unknown; scale?: unknown }
    let scaleVal = 1

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start)
        break
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start)
        break
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring' as const, damping: 20, stiffness: 300 },
          scale: { type: 'spring' as const, damping: 20, stiffness: 300 },
        } as unknown as ReturnType<typeof getTransition>
        scaleVal = 1
        break
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start)
        scaleVal = 0.8
        break
      default:
        transitionConfig = getTransition(spinDuration, start)
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    })
  }

  const handleHoverEnd = () => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    })
  }

  const radius = variant === 'cursor' ? 55 : 90
  const isCursorVariant = variant === 'cursor'

  return (
    <motion.div
      className={`circular-text ${isCursorVariant ? 'circular-text--cursor' : ''} ${className}`.trim()}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const angle = (2 * Math.PI * i) / letters.length - Math.PI / 2
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        const rotationDeg = (360 / letters.length) * i
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`
        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        )
      })}
    </motion.div>
  )
}

export default CircularTextJSCSS
