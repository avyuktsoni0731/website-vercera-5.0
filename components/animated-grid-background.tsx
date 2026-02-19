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
      
      {/* Animated grid pattern - more visible */}
      <motion.div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: 'linear-gradient(rgba(193, 231, 52, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(193, 231, 52, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '24px 24px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scan line effect - more visible */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(193, 231, 52, 0.15) 50%, transparent 100%)',
          width: '100%',
          height: '200px',
        }}
        animate={{
          y: ['-200px', 'calc(100% + 200px)'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating accent dots - more visible */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '6px',
            height: '6px',
            background: 'rgba(193, 231, 52, 0.7)',
            boxShadow: '0 0 8px rgba(193, 231, 52, 0.5)',
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}
