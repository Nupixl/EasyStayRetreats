import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '../devlink/NavBar'

const AnimatedNavBar = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <NavBar {...props} />
    </motion.div>
  )
}

// Enhanced mobile menu with animations
export const AnimatedMobileMenu = ({ isOpen, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated button with hover effects
export const AnimatedButton = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.button>
  )
}

// Animated menu item
export const AnimatedMenuItem = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ 
        x: 5,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedNavBar



