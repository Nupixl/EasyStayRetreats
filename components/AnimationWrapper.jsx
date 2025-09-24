import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const AnimationWrapper = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  trigger = 'onScroll'
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    }
  }

  const selectedAnimation = animations[animation] || animations.fadeInUp

  if (trigger === 'onScroll') {
    return (
      <motion.div
        ref={ref}
        initial={selectedAnimation.initial}
        animate={isInView ? selectedAnimation.animate : selectedAnimation.initial}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

export default AnimationWrapper



