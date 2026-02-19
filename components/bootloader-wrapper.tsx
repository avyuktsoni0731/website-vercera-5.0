'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bootloader } from './bootloader'

interface BootloaderWrapperProps {
  children: React.ReactNode
}

export function BootloaderWrapper({ children }: BootloaderWrapperProps) {
  const [showBootloader, setShowBootloader] = useState(true)
  const [isContentReady, setIsContentReady] = useState(false)

  useEffect(() => {
    // Check if bootloader was already shown (optional - remove if you want it every time)
    // const hasSeenBootloader = sessionStorage.getItem('hasSeenBootloader')
    // if (hasSeenBootloader) {
    //   setShowBootloader(false)
    //   setIsContentReady(true)
    //   return
    // }

    // For now, show bootloader every time
    setIsContentReady(true)
  }, [])

  const handleBootloaderComplete = () => {
    setShowBootloader(false)
    // Ensure page stays at top and prevent scroll jump
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      // Small delay to ensure smooth transition
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    }
    // Mark as seen (optional)
    // sessionStorage.setItem('hasSeenBootloader', 'true')
  }

  return (
    <>
      {showBootloader && <Bootloader onComplete={handleBootloaderComplete} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: isContentReady && !showBootloader ? 1 : 0,
          scale: isContentReady && !showBootloader ? 1 : 0.98
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // Custom easing for smooth reveal
          delay: showBootloader ? 0 : 0.2
        }}
        className={showBootloader ? 'pointer-events-none overflow-hidden' : ''}
        style={{
          filter: showBootloader ? 'blur(8px)' : 'blur(0px)',
          willChange: showBootloader ? 'filter, opacity, transform' : 'auto',
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
