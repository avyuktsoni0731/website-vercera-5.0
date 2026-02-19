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

      {/* Animated grid pattern - more visible */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(rgba(193, 231, 52, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(193, 231, 52, 0.3) 1px, transparent 1px)',
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

      {/* Floating orbs - more visible */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${250 + i * 120}px`,
            height: `${250 + i * 120}px`,
            background: `radial-gradient(circle, rgba(193, 231, 52, ${0.15 - i * 0.03}) 0%, rgba(193, 231, 52, ${0.05 - i * 0.01}) 50%, transparent 70%)`,
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
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}
