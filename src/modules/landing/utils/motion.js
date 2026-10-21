/**
 * CRICCOIN — Premium Motion & Scroll Animation Configurations
 * Built using Framer Motion with Apple-inspired cubic-bezier easing,
 * staggered card reveals, subtle directional slides, and reduced motion safety.
 */

// Premium easing curves
export const EASING = {
  // Smooth deceleration curve for premium UI feel
  apple: [0.22, 1, 0.36, 1],
  smooth: [0.25, 0.1, 0.25, 1],
  gentle: [0.16, 1, 0.3, 1],
};

// Reusable viewport trigger configuration
// Triggers once, slightly before the element fully enters viewport to prevent awkward gaps
export const DEFAULT_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -40px 0px',
};

/**
 * Standard subtle fade-up animation props
 */
export const fadeUp = (delay = 0, distance = 24, duration = 0.65) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: DEFAULT_VIEWPORT,
  transition: {
    duration,
    delay,
    ease: EASING.apple,
  },
});

/**
 * Subtle directional slide-in from left
 */
export const slideInLeft = (delay = 0, distance = 30, duration = 0.7) => ({
  initial: { opacity: 0, x: -distance },
  whileInView: { opacity: 1, x: 0 },
  viewport: DEFAULT_VIEWPORT,
  transition: {
    duration,
    delay,
    ease: EASING.apple,
  },
});

/**
 * Subtle directional slide-in from right
 */
export const slideInRight = (delay = 0, distance = 30, duration = 0.7) => ({
  initial: { opacity: 0, x: distance },
  whileInView: { opacity: 1, x: 0 },
  viewport: DEFAULT_VIEWPORT,
  transition: {
    duration,
    delay,
    ease: EASING.apple,
  },
});

/**
 * Subtle scale-in with fade
 */
export const scaleIn = (delay = 0, initialScale = 0.95, duration = 0.65) => ({
  initial: { opacity: 0, scale: initialScale },
  whileInView: { opacity: 1, scale: 1 },
  viewport: DEFAULT_VIEWPORT,
  transition: {
    duration,
    delay,
    ease: EASING.apple,
  },
});

/**
 * Pure fade-in
 */
export const fadeIn = (delay = 0, duration = 0.6) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: DEFAULT_VIEWPORT,
  transition: {
    duration,
    delay,
    ease: EASING.smooth,
  },
});

/**
 * Stagger Container Variants for parent elements
 */
export const staggerContainerVariants = (staggerChildren = 0.08, delayChildren = 0.05) => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Stagger Child Item Variants
 */
export const staggerItemVariants = (distance = 20, duration = 0.55) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: EASING.apple,
    },
  },
});

/**
 * Stagger Child Item with Scale
 */
export const staggerScaleItemVariants = (duration = 0.55) => ({
  hidden: { opacity: 0, scale: 0.94, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration,
      ease: EASING.apple,
    },
  },
});

/**
 * Micro-hover & tap animation props for cards and buttons
 */
export const cardHoverProps = {
  whileHover: {
    y: -4,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.985,
    transition: { duration: 0.15 },
  },
};

export const subtleHoverProps = {
  whileHover: {
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.99,
  },
};
