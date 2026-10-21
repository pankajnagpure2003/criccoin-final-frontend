import { motion, useSpring } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Coins, Lock, Users, Gamepad2 } from 'lucide-react';
import heroPlayerCoinImg from '../../../assets/hero-player-coin.jpg';
import heroDesktopVideo from '../../../assets/hero-desktop-criccoin.mp4';
import stadiumAerialImg from '../../../assets/stadium-aerial.jpg';
import {
  fadeUp,
  scaleIn,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

const quickFeatures = [
  { icon: Coins, label: 'CRICCOIN Token' },
  { icon: Lock, label: '12-Month Holding Program' },
  { icon: Users, label: '10-Level Referral Network' },
  { icon: Gamepad2, label: 'Cricket & Digital Experiences' },
];

export default function Hero({ onExplore }) {
  const cursorX = useSpring(0, { stiffness: 90, damping: 22, mass: 0.8 });
  const cursorY = useSpring(0, { stiffness: 90, damping: 22, mass: 0.8 });
  const trailX = useSpring(cursorX, { stiffness: 32, damping: 24, mass: 1.2 });
  const trailY = useSpring(cursorY, { stiffness: 32, damping: 24, mass: 1.2 });
  const [cursorActive, setCursorActive] = useState(false);

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - bounds.left);
    cursorY.set(event.clientY - bounds.top);
    setCursorActive(true);
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursorActive(false)}
    >
      {/* Background Stadium Backdrop with Gold Floodlights */}
      <div className="absolute inset-0 z-0">
        <img
          src={stadiumAerialImg}
          alt="Cricket stadium night floodlights"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 md:hidden"
        />
        {/* <img
          src={heroDesktopImg}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
        /> */}
        <video
          src={heroDesktopVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center md:object-[60%_55%]"
        />
        {/* Dark Obsidian & Gold Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050606] via-[#050606]/92 to-[#050606]/75 md:from-[#050606]/70 md:via-[#050606]/25 md:to-[#050606]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050606] via-transparent to-[#050606]/85 md:from-[#050606]/65 md:to-[#050606]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_35%,rgba(212,175,55,0.18),transparent)]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] hidden h-[36rem] w-[36rem] rounded-full md:block"
        style={{
          x: trailX,
          y: trailY,
          marginLeft: '-18rem',
          marginTop: '-18rem',
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 42%, transparent 72%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: cursorActive ? 0.9 : 0, scale: cursorActive ? 1 : 0.8 }}
        transition={{ opacity: { duration: 0.35 }, scale: { duration: 0.45 } }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] hidden h-[28rem] w-[28rem] rounded-full md:block"
        style={{
          x: cursorX,
          y: cursorY,
          marginLeft: '-14rem',
          marginTop: '-14rem',
          background: 'radial-gradient(circle, rgba(255,215,106,0.2) 0%, rgba(212,175,55,0.1) 35%, transparent 72%)',
          filter: 'blur(18px)',
        }}
        animate={
          cursorActive
            ? { opacity: 1, scale: [1, 1.08, 1] }
            : { opacity: 0, scale: 0.85 }
        }
        transition={
          cursorActive
            ? {
                opacity: { duration: 0.2 },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }
            : { duration: 0.25 }
        }
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[2] hidden h-12 w-12 rounded-full border border-[#FFD76A]/50 md:block"
        style={{
            x: cursorX,
            y: cursorY,
            marginLeft: '-1.5rem',
            marginTop: '-1.5rem',
            boxShadow: '0 0 18px rgba(255,215,106,0.35), inset 0 0 12px rgba(212,175,55,0.15)',
        }}
        animate={{
            opacity: cursorActive ? 0.9 : 0,
            scale: cursorActive ? [0.85, 1.08, 0.95] : 0.7,
        }}
        transition={{
            opacity: { duration: 0.15 },
            scale: cursorActive
              ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 },
        }}
      />

      <div className="relative z-10 max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center -translate-y-3 md:translate-y-2">
        
        {/* Top Grid: Left Hero Content (7 cols) + Right Player & Coin Artwork (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-10">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
            
            {/* Tagline Badge */}
            <motion.div {...fadeUp(0.05, 18)} className="mb-4 inline-flex items-center">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#FFD76A] text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                {/* <Sparkles size={13} className="text-[#FFD76A]" /> */}
                Play. Participate. Build the Cricket Community.
              </span>
            </motion.div>

           
            <motion.h1 {...fadeUp(0.15, 22)} className="font-heading text-4xl sm:text-5xl lg:text-[3.8rem] font-extrabold text-white tracking-tight leading-[1.08] mb-5">
              Where Cricket Meets{' '}
              <span className="hero-heading-mobile-motion block mt-1 gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]">
                Digital Innovation.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p {...fadeUp(0.25, 20)} className="mx-auto mb-7 max-w-[34rem] text-pretty text-xs font-normal leading-5 text-[#D0D0D0] sm:mb-8 sm:text-lg sm:leading-relaxed lg:mx-0 lg:text-left">
              <span className="block sm:hidden">Discover CRICCOIN, a cricket-focused digital ecosystem designed</span>
              <span className="block sm:hidden">to bring together token participation, community building,</span>
              <span className="block sm:hidden">referral connections, and digital cricket experiences.</span>
              <span className="hidden sm:inline">
                Discover CRICCOIN, a cricket-focused digital ecosystem designed to bring
                together token participation, community building, referral connections,
                and digital cricket experiences.
              </span>
            </motion.p>

            {/* Action Buttons */}
            <motion.div {...fadeUp(0.35, 20)} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
              <button
                onClick={onExplore}
                className="btn-primary group"
              >
                <span>Explore the Ecosystem</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              <a href="#join" className="btn-secondary">
                Join the Community
              </a>
            </motion.div>

          </div>

          {/* Right Column: Golden Batsman & Gleaming 3D Coin (5 cols) */}
          <motion.div {...scaleIn(0.2, 0.95)} className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Script Text directly above player */}
            {/* <div className="w-full text-center lg:text-right mb-2 pr-2 z-20">
              <span className="font-cursive text-2xl sm:text-3xl text-[#FFD76A] tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.7)]">
                Play. Participate. Build the Cricket Community.
              </span>
            </div> */}

            {/* Clean Authentic Mockup Artwork */}
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-[3px] border-[#FFD76A]/90 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.35)] group md:hidden">
              <picture>
                <img
                  src={heroPlayerCoinImg}
                  alt="CRICCOIN cricket player and gold coin in a stadium"
                  className="w-full h-auto object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
              </picture>

              {/* Floating Live Verification Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-[#D4AF37]/40 backdrop-blur-md text-[10px] font-semibold text-[#FFD76A] shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Verified Token Ecosystem</span>
              </div>

              {/* Floating Token Allocation Badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#D4AF37]/50 backdrop-blur-md text-[10px] font-bold text-white shadow-xl">
                <Coins size={13} className="text-[#FFD76A]" />
                <span>CRIC Token Allocation</span>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Bottom Feature Badges: 4-Item Horizontal Row Matching Mockup */}
        <motion.div
          variants={staggerContainerVariants(0.08, 0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={DEFAULT_VIEWPORT}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl"
        >
          {quickFeatures.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={staggerItemVariants(16)}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-br from-[#1A160B]/95 via-[#100F0B]/95 to-[#080808]/95 border-[3px] border-[#D4AF37] backdrop-blur-md shadow-md hover:border-[#FFD76A] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center flex-shrink-0 text-[#FFD76A]">
                <Icon size={16} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white/95">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050606] to-transparent pointer-events-none z-10" />
    </section>
  );
}
