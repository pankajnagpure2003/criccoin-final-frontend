import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import tokenPedestalImg from '../../../assets/token-pedestal-display.jpg';
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

const packages = [
  {
    name: 'Starter',
    amount: '$100',
    tier: 'Tier 1',
    highlight: false,
    perks: ['Account Access', 'Standard Token Allocation', 'Community Access'],
  },
  {
    name: 'Bronze',
    amount: '$250',
    tier: 'Tier 2',
    highlight: false,
    perks: ['Bronze Badge', 'Multi-Level Tracking', 'Holding Eligibility'],
  },
  {
    name: 'Silver',
    amount: '$500',
    tier: 'Tier 3',
    highlight: false,
    perks: ['Silver Status', 'Ecosystem Access', 'Priority Support'],
  },
  {
    name: 'Gold',
    amount: '$1,000',
    tier: 'Tier 4',
    // badge: 'Popular',
    highlight: true,
    perks: ['Gold Community Tier', 'Full Ecosystem Features', 'Enhanced Rewards Tracking'],
  },
  {
    name: 'Platinum',
    amount: '$2,500',
    tier: 'Tier 5',
    highlight: false,
    perks: ['Platinum Status', 'VIP Cricket Gaming', 'Leadership Qualification'],
  },
  {
    name: 'Diamond',
    amount: '$5,000',
    tier: 'Tier 6',
    // badge: 'VIP Elite',
    highlight: false,
    perks: ['Diamond Tier Benefits', 'Maximum Allocation', 'Direct Platform Support'],
  },
];

export default function TokenPackages({ onExplore }) {
  const [selectedPkg, setSelectedPkg] = useState('Gold');

  const handleSelectPackage = (name) => {
    setSelectedPkg(name);
  };

  const handleExploreHolding = () => {
    if (onExplore) {
      onExplore();
    } else {
      const el = document.getElementById('signup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="token" className="relative py-12 md:py-14 lg:py-16 bg-[#050606] overflow-hidden">
      {/* Ambient background gold glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0, 15)} className="mb-3">
          <span className="section-label">
            TOKEN
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
          Discover the <span className="gold-gradient-text">CRICCOIN Token</span>
        </motion.h2>
        <motion.p {...fadeUp(0.16, 18)} className="text-justify text-sm sm:text-base text-[#C6C6C6] mb-12 max-w-3xl leading-relaxed">
          A digital token at the heart of a connected cricket ecosystem. Designed to support
          digital participation, token balance tracking, and approved ecosystem experiences.
          The platform provides transparent records of token allocations, transactions, and holding positions.
        </motion.p>

        {/* 3-Column Layout Matching Reference Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Column 1: 3D Gold Coin on Pedestal with Red Cricket Ball (3.5 cols) */}
          <motion.div {...slideInLeft(0.1, 24)} className="lg:col-span-4 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border-[3px] border-[#FFD76A]/90 bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.25)] group h-full flex flex-col">
              
              <div className="relative flex-grow min-h-[260px] overflow-hidden">
                <img
                  src={tokenPedestalImg}
                  alt="CRICCOIN 3D Gold Coin on Pedestal with Red Cricket Ball"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 border border-[#D4AF37]/40 backdrop-blur-md text-[10px] font-bold text-[#FFD76A] tracking-wider uppercase">
                  Digital Asset
                </div>
              </div>

              <div className="p-5 border-t border-[#D4AF37]/20 bg-gradient-to-b from-[#0D0D0B] to-[#12110E]">
                <h4 className="font-heading text-base font-bold text-white mb-1 flex items-center justify-between">
                  <span>CRICCOIN (CRIC)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFD76A] border border-[#D4AF37]/30">
                    BEP-20 / Native
                  </span>
                </h4>
                <p className="text-xs text-[#C6C6C6]/80 leading-relaxed mb-3">
                  Token allocation is calculated using the approved CRICCOIN price at the time of confirmed transaction.
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#FFD76A] font-semibold pt-2 border-t border-white/5">
                  <span>100% Transparent Records</span>
                  <span>Audited System</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Column 2: Participation Packages 2x3 Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div {...fadeUp(0.12, 16)} className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-lg font-bold text-white">
                Participation Packages
              </h3>
              <span className="text-xs text-[#C6C6C6]">Choose your tier</span>
            </motion.div>

            <motion.div
              variants={staggerContainerVariants(0.05, 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              className="grid grid-cols-2 sm:grid-cols-2 gap-3.5 flex-grow"
            >
              {packages.map((pkg) => {
                const isSelected = selectedPkg === pkg.name;

                return (
                  <motion.div
                    key={pkg.name}
                    variants={staggerItemVariants(16)}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPackage(pkg.name)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#201A0D] via-[#14120C] to-[#090908] border-[3px] border-[#FFD76A] shadow-[0_4px_25px_rgba(212,175,55,0.3)] -translate-y-0.5'
                        : pkg.highlight
                        ? 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A]'
                        : 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A]'
                    }`}
                  >
                    {/* Badge if present */}
                    {pkg.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD76A] to-[#D4AF37] text-black text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs uppercase font-semibold text-[#C6C6C6] tracking-wider">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#FFD76A] text-black flex items-center justify-center">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div className="font-heading text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFD76A] to-[#D4AF37]">
                        {pkg.amount}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C6C6C6]/80">
                      <span>{pkg.tier}</span>
                      <span className={`font-semibold ${isSelected ? 'text-[#FFD76A]' : 'text-white/60'}`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Column 3: 12-Month Holding Program (3 cols) */}
          <motion.div {...slideInRight(0.15, 24)} className="lg:col-span-3 flex flex-col justify-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,0.16)] flex flex-col justify-between h-full">
              
              <div>
                {/* Lock Icon Emblem */}
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD76A] mb-4 shadow-md">
                  <Lock size={22} />
                </div>

                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  12-Month Holding Program
                </h3>

                <p className="text-xs sm:text-sm text-[#C6C6C6] leading-relaxed mb-6">
                  Eligible participants can review the terms and optionally lock their tokens for a 12-month period.
                  Locked tokens remain unavailable for normal withdrawal until they become eligible for release under the applicable terms.
                </p>

                {/* Key feature bullets */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-[#FFD76A]">
                    <ShieldCheck size={14} className="text-[#FFD76A] flex-shrink-0" />
                    <span>Optional Participation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#FFD76A]">
                    <ShieldCheck size={14} className="text-[#FFD76A] flex-shrink-0" />
                    <span>Scheduled Maturity Cycle</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#FFD76A]">
                    <ShieldCheck size={14} className="text-[#FFD76A] flex-shrink-0" />
                    <span>Transparent Holding Ledger</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleExploreHolding}
                  className="btn-primary w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Token Participation</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Bottom Mandatory Disclaimer Box */}
        {/* <div className="p-4 rounded-xl bg-white/[0.02] border border-[#D4AF37]/20 flex items-start gap-3">
          <Info size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#C6C6C6]/80 leading-relaxed">
            The official token price, staking rewards (if approved), fees, and final participation terms must be confirmed before launch.
            No fixed returns or token price appreciation are guaranteed.
          </p>
        </div> */}

      </div>
    </section>
  );
}
