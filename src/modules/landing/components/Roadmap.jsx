import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Trophy } from 'lucide-react';
import roadmapTrophyImg from '../../../assets/roadmap-gold-trophy.jpg';
import {
  fadeUp,
  slideInRight,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

const phases = [
  {
    phase: 'Phase 1',
    name: 'Foundation',
    status: 'In Progress',
    badge: 'Q1-Q2',
    items: [
      'Account registration',
      'User profiles',
      'Participation packages',
      'Payment records',
      // 'Platform administration',
    ],
  },
  {
    phase: 'Phase 2',
    name: 'Token & Holding',
    status: 'Upcoming',
    badge: 'Q3',
    items: [
      'Token balance tracking',
      'Transaction records',
      'Optional 12-month holding',
      'Maturity management',
    ],
  },
  {
    phase: 'Phase 3',
    name: 'Referral & Leadership',
    status: 'Upcoming',
    badge: 'Q4',
    items: [
      'Referral network tracking',
      'Approved compensation rules',
      'Leadership qualification',
      'Reporting tools',
    ],
  },
  {
    phase: 'Phase 4',
    name: 'Ecosystem Expansion',
    status: 'Planned',
    badge: 'Q1 Next',
    items: [
      'Approved cricket experiences',
      'Community features',
      'Notifications',
      'Operational support',
    ],
  },
  {
    phase: 'Phase 5',
    name: 'Launch Readiness',
    status: 'Planned',
    badge: 'Final',
    items: [
      'Security testing',
      'Legal & compliance reviews',
      'System validation',
      'Operational preparation',
    ],
  },
];

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState(0);

  return (
    <section id="roadmap" className="relative py-12 md:py-14 lg:py-16 bg-[#050606] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0, 15)} className="mb-3">
          <span className="section-label">
            ROADMAP
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
          The <span className="gold-gradient-text">CRICCOIN</span> Journey
        </motion.h2>
        <motion.p {...fadeUp(0.16, 18)} className="text-sm sm:text-base text-[#C6C6C6] mb-12 max-w-2xl font-normal">
          A proposed implementation sequence to build a strong and sustainable ecosystem.
        </motion.p>

        {/* Top/Side Visual + Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left/Center Timeline Pipeline (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            
            {/* Interactive Phase Selector Pills (Horizontal on Desktop) */}
            <motion.div
              variants={staggerContainerVariants(0.04, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8"
            >
              {phases.map((p, idx) => {
                const isSelected = selectedPhase === idx;

                return (
                  <motion.button
                    key={p.phase}
                    variants={staggerItemVariants(14)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPhase(idx)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#201A0D] via-[#14120C] to-[#090908] border-[3px] border-[#FFD76A] shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
                        : 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#FFD76A] uppercase tracking-wider">
                        {p.phase}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-[#C6C6C6]">
                        {p.badge}
                      </span>
                    </div>
                    <span className="font-heading text-xs sm:text-sm font-bold text-white truncate">
                      {p.name}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Selected Phase Spotlight Card */}
            <motion.div
              {...fadeUp(0.15, 20)}
              key={selectedPhase}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#FFD76A]/90 shadow-[0_0_24px_rgba(212,175,55,0.18)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#FFD76A] tracking-wider uppercase">
                      {phases[selectedPhase].phase} Milestone
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#FFD76A] font-medium border border-[#D4AF37]/30">
                      {phases[selectedPhase].status}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    {phases[selectedPhase].name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#C6C6C6]">
                  <Clock size={14} className="text-[#D4AF37]" />
                  <span>Target Window: {phases[selectedPhase].badge}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {phases[selectedPhase].items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37]/90 hover:border-[#FFD76A] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD76A] flex-shrink-0">
                      <CheckCircle2 size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#C6C6C6]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
  
          </div>

          {/* Right Column: Golden Trophy Artwork (4 cols) */}
          <motion.div {...slideInRight(0.2, 25)} className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden border-[3px] border-[#FFD76A]/90 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.3)] group aspect-[4/3] sm:aspect-square lg:aspect-[4/5]">
              <img
                src={roadmapTrophyImg}
                alt="CRICCOIN Cricket Championship Gold Trophy"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050606] via-[#050606]/30 to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 border border-[#D4AF37]/40 backdrop-blur-md text-[10px] font-bold text-[#FFD76A] uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={12} />
                Championship Vision
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 border border-[#D4AF37]/30 backdrop-blur-md">
                <h4 className="font-heading text-sm font-bold text-white mb-0.5">
                  Cricket Championship Ecosystem
                </h4>
                <p className="text-[11px] text-[#C6C6C6]/85">
                  Aiming to elevate community participation to global sports technology excellence.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 5-Phase Full Overview Grid (All phases visible simultaneously for complete transparency) */}
        <motion.div
          variants={staggerContainerVariants(0.06, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={DEFAULT_VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10"
        >
          {phases.map((p, idx) => (
            <motion.div
              key={p.phase}
              variants={staggerItemVariants(18)}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                selectedPhase === idx
                  ? 'bg-gradient-to-br from-[#201A0D] via-[#14120C] to-[#090908] border-[3px] border-[#FFD76A] shadow-md'
                  : 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A]'
              }`}
            >
              <div className="mb-3">
                <span className="text-[10px] font-bold text-[#FFD76A] uppercase tracking-wider block mb-1">
                  {p.phase}
                </span>
                <h4 className="font-heading text-sm font-bold text-white mb-2">
                  {p.name}
                </h4>
                <ul className="space-y-1.5 text-sm text-[#C6C6C6]/90">
                  {p.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#D4AF37] mt-0.5 font-bold">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-white/5 text-[10px] text-[#FFD76A] font-semibold">
                Status: {p.status}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Legal Disclaimer Note */}
        <motion.div {...fadeUp(0.2, 15)} className="p-3.5 rounded-xl bg-gradient-to-br from-[#17140B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37]/90 text-center">
          <p className="text-xs text-[#C6C6C6]/70 leading-relaxed">
            This roadmap represents a proposed implementation sequence. Features and launch dates remain subject to approval and development readiness.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
