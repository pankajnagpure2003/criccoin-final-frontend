import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import crowdImg from '../../../assets/community-crowd-hd.jpg';
import {
  fadeUp,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

export default function JoinCommunity({ onLogin, onSignup }) {
  return (
    <section id="join" className="relative py-12 md:py-14 lg:py-16 overflow-hidden">
      {/* Background Crowd Celebration Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={crowdImg}
          alt="Cheering cricket stadium fans celebrating in golden stadium glow"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125"
        />
        {/* Obsidian dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050606] via-[#050606]/85 to-[#050606]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050606] via-transparent to-[#050606]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Tag */}
        <motion.div {...fadeUp(0, 15)} className="mb-4 inline-flex items-center">
          <span className="section-label">
            JOIN NOW
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Join the <span className="gold-gradient-text">CRICCOIN Community</span>
        </motion.h2>

        <motion.p {...fadeUp(0.16, 18)} className="text-base sm:text-lg text-[#C6C6C6] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Create your account to explore the CRICCOIN platform, manage your token activity,
          and connect with the cricket community.
        </motion.p>

        {/* Action Buttons */}
        <motion.div {...fadeUp(0.24, 18)} className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onLogin}
            className="btn-secondary !py-3 !px-7 flex items-center gap-2"
          >
            <LogIn size={16} />
            <span>Login to Account</span>
          </button>
          <button
            onClick={onSignup}
            className="btn-primary !py-3 !px-8 flex items-center gap-2"
          >
            <UserPlus size={16} />
            <span>Join Now — Create Account</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Dashboard Access Highlights */}
        <motion.div
          variants={staggerContainerVariants(0.08, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={DEFAULT_VIEWPORT}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8"
        >
          <motion.div
            variants={staggerItemVariants(16)}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-3 rounded-xl bg-gradient-to-br from-[#1A160B]/95 via-[#100F0B]/95 to-[#080808]/95 border-[3px] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.14)] backdrop-blur-md"
          >
            <p className="text-xs text-[#FFD76A] font-bold">Token Dashboard</p>
            <p className="text-[11px] text-[#C6C6C6]">Real-time balances</p>
          </motion.div>
          <motion.div
            variants={staggerItemVariants(16)}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-3 rounded-xl bg-gradient-to-br from-[#1A160B]/95 via-[#100F0B]/95 to-[#080808]/95 border-[3px] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.14)] backdrop-blur-md"
          >
            <p className="text-xs text-[#FFD76A] font-bold">Holding Status</p>
            <p className="text-[11px] text-[#C6C6C6]">12-Month maturity</p>
          </motion.div>
          <motion.div
            variants={staggerItemVariants(16)}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-3 rounded-xl bg-gradient-to-br from-[#1A160B]/95 via-[#100F0B]/95 to-[#080808]/95 border-[3px] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.14)] backdrop-blur-md"
          >
            <p className="text-xs text-[#FFD76A] font-bold">10-Level Referral</p>
            <p className="text-[11px] text-[#C6C6C6]">Network tracking</p>
          </motion.div>
          <motion.div
            variants={staggerItemVariants(16)}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-3 rounded-xl bg-gradient-to-br from-[#1A160B]/95 via-[#100F0B]/95 to-[#080808]/95 border-[3px] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.14)] backdrop-blur-md"
          >
            <p className="text-xs text-[#FFD76A] font-bold">Ecosystem Access</p>
            <p className="text-[11px] text-[#C6C6C6]">Cricket experiences</p>
          </motion.div>
        </motion.div>

        {/* Security Note */}
        <motion.p {...fadeUp(0.3, 12)} className="text-xs text-[#C6C6C6]/70 max-w-xl mx-auto leading-relaxed flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#D4AF37] flex-shrink-0" />
          <span>
            Account Security: Your account access and eligible features are subject to verification, security checks, and applicable platform terms.
          </span>
        </motion.p>

      </div>
    </section>
  );
}
