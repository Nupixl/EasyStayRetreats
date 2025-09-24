# Animation Guide for Webflow DevLink Components

## 🎬 **Problem Solved**

Webflow DevLink exports show `<_Builtin.NotSupported _atom="Animation" />` because Webflow's animation system isn't compatible with React. This guide shows you how to add animations back to your components.

## 🛠️ **Solution Implemented**

### **1. Framer Motion Integration**
- ✅ Installed `framer-motion` for React animations
- ✅ Created reusable animation components
- ✅ Added scroll-triggered animations
- ✅ Implemented page transitions

### **2. Animation Components Created**

#### **AnimationWrapper.jsx**
```jsx
<AnimationWrapper animation="fadeInUp" delay={0.2} trigger="onScroll">
  <YourComponent />
</AnimationWrapper>
```

**Available Animations:**
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top  
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `scaleIn` - Scale in from center
- `slideUp` - Slide up from bottom

#### **AnimatedNavBar.jsx**
- Enhanced navigation with animations
- Mobile menu with smooth transitions
- Hover effects on buttons

#### **PageTransition.jsx**
- Smooth page transitions
- Scale and fade effects

### **3. CSS Animations**
Created `styles/animations.css` with:
- Keyframe animations
- Utility classes
- Hover effects
- Scroll-triggered animations

## 🚀 **Usage Examples**

### **Basic Animation**
```jsx
import AnimationWrapper from '../components/AnimationWrapper'

<AnimationWrapper animation="fadeInUp" delay={0.2}>
  <h1>Animated Title</h1>
</AnimationWrapper>
```

### **Scroll Animation**
```jsx
<AnimationWrapper animation="fadeInLeft" trigger="onScroll">
  <div>This animates when scrolled into view</div>
</AnimationWrapper>
```

### **Page Transitions**
```jsx
import PageTransition from '../components/PageTransition'

<PageTransition>
  <YourPageContent />
</PageTransition>
```

### **Hover Effects**
```jsx
<div className="hover-lift">
  <Card>Hover to lift</Card>
</div>
```

## 🎯 **Recreating Webflow Animations**

### **Common Webflow → Framer Motion Conversions**

| Webflow Animation | Framer Motion Equivalent |
|------------------|-------------------------|
| Fade In | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` |
| Slide Up | `initial={{ y: 30 }} animate={{ y: 0 }}` |
| Scale In | `initial={{ scale: 0.8 }} animate={{ scale: 1 }}` |
| Stagger | `transition={{ delay: index * 0.1 }}` |

### **Scroll Triggers**
```jsx
const { ref, inView } = useInView({ threshold: 0.1 })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

## 🔧 **Advanced Animations**

### **Staggered Animations**
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### **Complex Interactions**
```jsx
<motion.button
  whileHover={{ scale: 1.1, rotate: 5 }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Interactive Button
</motion.button>
```

## 📱 **Mobile Considerations**

- Use `useInView` for performance
- Prefer CSS transforms over layout changes
- Test on actual devices
- Consider reduced motion preferences

## 🎨 **Performance Tips**

1. **Use `transform` and `opacity`** - These are GPU accelerated
2. **Avoid animating layout properties** - Use `transform` instead
3. **Use `will-change` sparingly** - Only when needed
4. **Test on lower-end devices**

## 🔄 **Migration from Webflow**

1. **Identify missing animations** in DevLink exports
2. **Choose appropriate Framer Motion equivalent**
3. **Wrap components** with AnimationWrapper
4. **Test and refine** timing and easing
5. **Add scroll triggers** where needed

## 🎯 **Next Steps**

1. **Audit your Webflow project** for all animations
2. **Create a mapping** of Webflow → Framer Motion
3. **Implement systematically** section by section
4. **Test on multiple devices** and browsers
5. **Optimize performance** as needed

Your animations are now fully functional in React! 🎉

