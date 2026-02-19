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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      
      {/* Animated radial gradient glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.12) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(193, 231, 52, 0.12) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(193, 231, 52, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(193, 231, 52, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            background: `radial-gradient(circle, rgba(193, 231, 52, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
          }}
          animate={{
            x: [
              `${20 + i * 30}%`,
              `${25 + i * 30}%`,
              `${20 + i * 30}%`,
            ],
            y: [
              `${30 + i * 20}%`,
              `${35 + i * 20}%`,
              `${30 + i * 20}%`,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}
