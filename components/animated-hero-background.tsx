'use client'

import { motion } from 'framer-motion'

/**
 * Lightweight animated background for hero section
 * Inspired by Zenith's minimalist design - uses CSS gradients and Framer Motion
 * instead of heavy WebGL shaders
 */
export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/8" />
      
      {/* Animated radial gradient glow - more visible */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.25) 0%, rgba(193, 231, 52, 0.1) 30%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.15) 0%, rgba(193, 231, 52, 0.05) 30%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.25) 0%, rgba(193, 231, 52, 0.1) 30%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated grid pattern - optimized */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(rgba(193, 231, 52, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(193, 231, 52, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          willChange: 'background-position',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '40px 40px'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating orbs - reduced for performance */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            background: `radial-gradient(circle, rgba(193, 231, 52, ${0.12 - i * 0.02}) 0%, rgba(193, 231, 52, ${0.04 - i * 0.01}) 50%, transparent 70%)`,
            filter: 'blur(40px)',
            willChange: 'transform',
          }}
          animate={{
            x: [
              `${20 + i * 30}%`,
              `${24 + i * 30}%`,
              `${20 + i * 30}%`,
            ],
            y: [
              `${30 + i * 20}%`,
              `${33 + i * 20}%`,
              `${30 + i * 20}%`,
            ],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  )
}
