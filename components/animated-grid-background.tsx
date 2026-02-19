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
      
      {/* Animated grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(rgba(42, 61, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 61, 42, 0.3) 1px, transparent 1px)',
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

      {/* Subtle scan line effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(193, 231, 52, 0.05) 50%, transparent 100%)',
        }}
        animate={{
          y: ['-100%', '200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating accent dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '4px',
            height: '4px',
            background: 'rgba(193, 231, 52, 0.4)',
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
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
