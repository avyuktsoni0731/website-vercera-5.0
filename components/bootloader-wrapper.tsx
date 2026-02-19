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
    // Mark as seen (optional)
    // sessionStorage.setItem('hasSeenBootloader', 'true')
  }

  return (
    <>
      {showBootloader && <Bootloader onComplete={handleBootloaderComplete} />}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isContentReady && !showBootloader ? 1 : 0,
          scale: isContentReady && !showBootloader ? 1 : 0.95
        }}
        transition={{ 
          duration: 1,
          ease: [0.16, 1, 0.3, 1] // Custom easing for smooth reveal
        }}
        className={showBootloader ? 'pointer-events-none' : ''}
      >
        {children}
      </motion.div>
    </>
  )
}
