import { motion } from 'framer-motion';

export default function GoldSeparator({ style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.9 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="gold-separator"
      style={{ margin: '0', ...style }}
      role="separator"
      aria-hidden="true"
    />
  );
}

