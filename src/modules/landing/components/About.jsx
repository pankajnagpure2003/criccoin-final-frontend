import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import stadiumPitchVideo from '../../../assets/stadium-aerial.mp4';
import {
  fadeUp,
  slideInRight,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

export default function About() {
  return (
    <section id="about" className="relative py-12 md:py-14 lg:py-16 bg-[#050606] overflow-hidden">
      {/* Subtle background ambient halo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Tag */}
        <motion.div {...fadeUp(0, 15)} className="mb-3">
          <span className="section-label">
            ABOUT CRICCOIN
          </span>
        </motion.div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Vision & Pillars (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              Building the Future of{' '}
              <span className="gold-gradient-text">Cricket Communities</span>
            </motion.h2>

            <motion.p {...fadeUp(0.16, 18)} className="text-justify text-base sm:text-lg text-[#C6C6C6] leading-relaxed mb-5">
              CRICCOIN aims to connect cricket enthusiasts through a digital ecosystem
              combining token management, community participation, referral networking,
              leadership development, and cricket-focused experiences.
            </motion.p>

            <motion.p {...fadeUp(0.24, 18)} className="text-justify text-sm sm:text-base text-[#C6C6C6]/90 leading-relaxed mb-8">
              Our vision is to create an accessible and transparent platform where users
              can explore digital participation while staying connected to the global
              cricket community.
            </motion.p>

            {/* 3 Core Value Pillars */}
            <motion.div
              variants={staggerContainerVariants(0.1, 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2"
            >
              <motion.div
                variants={staggerItemVariants(18)}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="p-4 rounded-xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A] shadow-[0_0_18px_rgba(212,175,55,0.12)] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FFD76A] mb-3">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="font-heading text-sm font-semibold text-white mb-1">
                  Transparent Tracking
                </h4>
                <p className="text-sm text-[#C6C6C6]/75 leading-relaxed">
                  Clear, auditable records of token balances and transaction status.
                </p>
              </motion.div>

              <motion.div
                variants={staggerItemVariants(18)}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="p-4 rounded-xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A] shadow-[0_0_18px_rgba(212,175,55,0.12)] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FFD76A] mb-3">
                  <Globe2 size={18} />
                </div>
                <h4 className="font-heading text-sm font-semibold text-white mb-1">
                  Global Cricket Fans
                </h4>
                <p className="text-sm text-[#C6C6C6]/75 leading-relaxed">
                  Connecting passionate supporters from grassroots to international stadiums.
                </p>
              </motion.div>

              <motion.div
                variants={staggerItemVariants(18)}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="p-4 rounded-xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A] shadow-[0_0_18px_rgba(212,175,55,0.12)] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FFD76A] mb-3">
                  <Zap size={18} />
                </div>
                <h4 className="font-heading text-sm font-semibold text-white mb-1">
                  Digital Innovation
                </h4>
                <p className="text-sm text-[#C6C6C6]/75 leading-relaxed">
                  Modern technology infrastructure built for sports entertainment.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Mission Card with Stadium Pitch Backdrop (5 cols) */}
          <motion.div {...slideInRight(0.15, 28)} className="lg:col-span-5 flex items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border-[3px] border-[#FFD76A]/90 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.3)] group">
              
              {/* Stadium Background Photo covering the card */}
              <div className="absolute inset-0 z-0">
               <video
  src={stadiumPitchVideo}
  autoPlay
  muted
  loop
  playsInline
  aria-label="Cricket stadium under floodlights"
  className="w-full h-full object-cover object-bottom transform transition-transform duration-700 group-hover:scale-105"
/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B]/85 via-[#0D0D0B]/35 to-[#0D0D0B]/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.15),transparent_70%)]" />
              </div>

              {/* Mission Content overlay */}
              
<div className="relative z-10 p-5 sm:p-7 flex flex-col justify-end min-h-[480px] sm:min-h-[540px]">

  <div>
    {/* Compact Top Badge */}
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD76A]">
        <Target size={20} />
      </div>

      <span className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black/50 border border-[#D4AF37]/30 text-[#FFD76A]">
        Our Mission
      </span>
    </div>

    {/* Short Heading */}
    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
      Our Mission
    </h3>

    {/* Short Description */}
    <p className="text-sm text-white/85 leading-relaxed mb-4 max-w-md">
      Building a technology-driven cricket ecosystem with community engagement,
      transparent token tracking, and innovative digital experiences.
    </p>
  </div>

  {/* Bottom Divider */}
  <div>
    <div className="w-full h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD76A]/70 to-transparent rounded-full mb-3" />

    <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/80 font-medium">
      <span className="text-[#FFD76A]">Technology-Driven</span>
      <span>Transparent Tracking</span>
    </div>
  </div>

</div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
