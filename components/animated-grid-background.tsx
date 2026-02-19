'use client'

import { motion } from 'framer-motion'

/**
 * Lightweight animated grid background for events section
 * Inspired by Zenith's minimalist design - uses CSS gradients and Framer Motion
 * instead of heavy Three.js/WebGL
 */
export function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 w-full h-full min-h-[600px] overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-secondary/30 to-accent/5" />
      
      {/* Animated grid pattern - optimized */}
      <motion.div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: 'linear-gradient(rgba(193, 231, 52, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(193, 231, 52, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          willChange: 'background-position',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '24px 24px'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scan line effect - optimized */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(193, 231, 52, 0.12) 50%, transparent 100%)',
          width: '100%',
          height: '150px',
          willChange: 'transform',
        }}
        animate={{
          y: ['-150px', 'calc(100% + 150px)'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating accent dots - reduced for performance */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '5px',
            height: '5px',
            background: 'rgba(193, 231, 52, 0.6)',
            boxShadow: '0 0 6px rgba(193, 231, 52, 0.4)',
            left: `${15 + i * 30}%`,
            top: `${25 + (i % 2) * 50}%`,
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}
