import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  UserPlus,
  Package,
  Coins,
  LayoutDashboard,
  Network,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import {
  fadeUp,
} from '../utils/motion';

const steps = [
  {
    step: '1',
    title: 'Create Your Account',
    details: 'Register, complete your profile, and finish any required verification.',
    icon: UserPlus,
  },
  {
    step: '2',
    title: 'Choose Your Package',
    details: 'Explore the available participation packages and review the applicable terms.',
    icon: Package,
  },
  {
    step: '3',
    title: 'Receive CRIC Tokens',
    details: 'Token allocation is calculated using the approved CRICCOIN price at the time of the confirmed transaction.',
    icon: Coins,
  },
  {
    step: '4',
    title: 'Manage Your Tokens',
    details: 'View your available balance, token transactions, and optional 12-month holding status.',
    icon: LayoutDashboard,
  },
  {
    step: '5',
    title: 'Build Your Network',
    details: 'Access your referral dashboard and track eligible community activity across up to 10 levels.',
    icon: Network,
  },
  {
    step: '6',
    title: 'Explore the Ecosystem',
    details: 'Discover permitted cricket games, competitions, collectibles, merchandise, events, and community experiences.',
    icon: Globe2,
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = steps[activeStep];
  const SelectedIcon = selectedStep.icon;
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 45%'],
  });
  const timelineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="relative py-12 md:py-14 lg:py-16 bg-[#080808] overflow-hidden">
      {/* Background ambient gold flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-10xl mx-auto px-4 sm:px-10 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0, 15)} className="mb-3">
          <span className="section-label">
            HOW IT WORKS
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
          Your Journey with <span className="gold-gradient-text">CRICCOIN</span>
        </motion.h2>
        <motion.p {...fadeUp(0.16, 18)} className="text-sm sm:text-base text-[#C6C6C6] mb-12 max-w-2xl font-normal">
          A simple process to get started and explore the cricket ecosystem.
        </motion.p>

        {/* Scroll-reveal timeline */}
        <div ref={timelineRef} className="relative mt-8 space-y-5 md:space-y-6">
          <div className="pointer-events-none absolute inset-y-0 left-[15px] w-[2px] bg-[#D4AF37]/15 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[15px] z-[1] w-[2px] origin-top bg-gradient-to-b from-[#FFF1B8] via-[#FFD76A] to-[#D4AF37] shadow-[0_0_12px_rgba(255,215,106,0.75)] md:left-1/2 md:-translate-x-1/2"
            style={{ scaleY: timelineScale }}
          />

          {steps.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeStep === index;
            const appearsOnLeft = index % 2 === 0;

            return (
              <div
                key={item.step}
                className="grid grid-cols-[32px_minmax(0,1fr)] items-stretch gap-x-3 md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:gap-x-5"
              >
                <motion.button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveStep(index)}
                  initial={{ opacity: 0, x: appearsOnLeft ? -24 : 24, y: 12, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative col-start-2 row-start-1 flex min-h-[175px] w-full flex-col overflow-hidden rounded-2xl border-[3px] p-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD76A] sm:min-h-[185px] sm:p-5 md:max-w-[420px] ${
                    appearsOnLeft
                      ? 'md:col-start-1 md:justify-self-end'
                      : 'md:col-start-3 md:justify-self-start'
                  } ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#241D0D] via-[#15130C] to-[#090908] border-[#FFD76A] shadow-[0_10px_32px_rgba(212,175,55,0.24)]'
                      : 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[#A9812B]/70 hover:border-[#FFD76A]/90 hover:shadow-[0_8px_26px_rgba(212,175,55,0.14)]'
                  }`}
                >
                  <span className="pointer-events-none absolute -right-2 -top-7 font-heading text-[112px] font-black leading-none text-[#FFD76A]/[0.06]">
                    {item.step}
                  </span>

                  <span className="relative flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-[#FFD76A]/70 bg-[#D4AF37]/20 text-[#FFE89E]'
                        : 'border-[#A9812B]/50 bg-[#D4AF37]/10 text-[#FFD76A] group-hover:border-[#FFD76A]/70'
                    }`}>
                      <Icon size={19} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD76A]/80">
                      Step {item.step}
                    </span>
                  </span>

                  <span className="relative mt-3 block font-heading text-base font-bold leading-snug text-white">
                    {item.title}
                  </span>
                  <span className="relative mt-1.5 block text-sm leading-relaxed text-[#C6C6C6]/90">
                    {item.details}
                  </span>

                  <span className={`relative mt-auto flex items-center gap-1.5 pt-5 text-xs font-bold transition-colors ${
                    isSelected ? 'text-[#FFE89E]' : 'text-[#D4AF37] group-hover:text-[#FFD76A]'
                  }`}>
                    {isSelected ? 'Currently selected' : 'View step details'}
                    <ChevronRight size={14} />
                  </span>
                  {isSelected && (
                    <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#FFD76A] to-transparent" />
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0.35, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 0.3, delay: 0.08 }}
                  className="z-[2] col-start-1 row-start-1 flex items-center justify-center md:col-start-2"
                  aria-hidden="true"
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-extrabold shadow-[0_0_16px_rgba(212,175,55,0.25)] transition-colors ${
                    isSelected
                      ? 'border-[#FFF1B8] bg-gradient-to-br from-[#FFF1B8] to-[#D4AF37] text-[#090807]'
                      : 'border-[#D4AF37] bg-gradient-to-br from-[#201A0D] to-[#0B0A08] text-[#FFD76A]'
                  }`}>
                    {item.step}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Banner */}
        <motion.div key={selectedStep.step} {...fadeUp(0.2, 20)} className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1A160B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.14)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD76A] flex-shrink-0">
              <SelectedIcon size={24} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-[#D4AF37]">
                Step {selectedStep.step} Breakdown
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-white">
                {selectedStep.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#C6C6C6] mt-0.5">
                {selectedStep.details}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('signup');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary !text-xs !py-2 !px-5 whitespace-nowrap self-end sm:self-center"
          >
            Get Started Now
          </button>
        </motion.div>

      </div>
    </section>
  );
}
