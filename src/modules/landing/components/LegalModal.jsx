import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const legalData = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Platform Participation Terms & Rules',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By accessing or participating in the CRICCOIN ecosystem, you agree to comply with and be bound by these Terms and Conditions. Features and participation packages are subject to region-specific regulations and eligibility requirements.',
      },
      {
        heading: '2. Account Registration & Verification',
        text: 'Users must provide accurate, verified identification details. The platform reserves the right to conduct Know-Your-Customer (KYC) and Anti-Money Laundering (AML) checks before token allocation or transaction approval.',
      },
      {
        heading: '3. Token Participation Packages',
        text: 'Participation packages (Starter $100 to Diamond $5,000) are designed for platform access and community utility. Token allocation is calculated based on the approved CRICCOIN price at transaction confirmation.',
      },
      {
        heading: '4. Holding Program Rules',
        text: 'Voluntary participation in the 12-month holding program locks tokens for the designated duration. Locked tokens cannot be withdrawn or transferred until the maturity date.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Data Protection & Security Commitments',
    sections: [
      {
        heading: '1. Data Collection',
        text: 'We collect your full legal name, email address, mobile number, and country of residence solely for account security, OTP verification, and compliance purposes.',
      },
      {
        heading: '2. Information Security',
        text: 'Your sensitive data and credentials are encrypted using industry-standard protocols. We do not sell or lease personal data to external advertisers.',
      },
      {
        heading: '3. Compliance Records',
        text: 'Transaction hashes, token allocations, and holding records are maintained transparently within the ecosystem ledger for auditability.',
      },
    ],
  },
  risk: {
    title: 'Risk Disclosure',
    subtitle: 'Important Disclaimers & Token Volatility Notice',
    sections: [
      {
        heading: 'No Guaranteed Returns',
        text: 'CRICCOIN is a digital utility and community token. Token ownership does not guarantee profits, capital appreciation, fixed returns, or cash-out availability.',
      },
      {
        heading: 'Market Volatility',
        text: 'Cryptocurrency and digital token markets are subject to high volatility and liquidity shifts. Participants should only allocate capital they can afford to lock or lose.',
      },
      {
        heading: 'Regulatory Considerations',
        text: 'Legal status for digital gaming, sports collectibles, and tokens varies by country. Users are responsible for confirming local legality in their jurisdiction.',
      },
    ],
  },
  compliance: {
    title: 'Regulatory Compliance',
    subtitle: 'Standards, Governance & Community Safety',
    sections: [
      {
        heading: 'Jurisdictional Eligibility',
        text: 'Access to token packages and gaming features is restricted in jurisdictions where sports-related tokens or utility rewards are prohibited by law.',
      },
      {
        heading: 'Anti-Fraud & Fair Play',
        text: 'Referral tracking across up to 10 levels is strictly monitored against sybil activity, self-referrals, and artificial account generation.',
      },
      {
        heading: 'Audit & Transparency',
        text: 'All ecosystem allocations and roadmap milestones are subject to third-party security audits and regulatory review prior to general public release.',
      },
    ],
  },
};

export default function LegalModal({ isOpen, type, onClose }) {
  if (!isOpen || !type || !legalData[type]) return null;

  const content = legalData[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl bg-[#0D0D0B] border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#14130F] to-[#0A0A09]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                {type === 'risk' ? (
                  <ShieldAlert className="w-5 h-5 text-[#FFD76A]" />
                ) : (
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                )}
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">{content.title}</h3>
                <p className="text-xs text-[#C6C6C6]/70">{content.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#C6C6C6] leading-relaxed">
            {content.sections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-[#D4AF37]/15">
                <h4 className="font-heading text-sm font-semibold text-[#FFD76A] mb-2 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#D4AF37] flex-shrink-0" />
                  {sec.heading}
                </h4>
                <p className="text-xs sm:text-sm text-[#C6C6C6]/90">{sec.text}</p>
              </div>
            ))}

            <div className="p-3.5 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-xs text-[#C6C6C6]/80 text-center">
              CRICCOIN platform terms and disclosures are updated periodically in accordance with regulatory guidance.
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#D4AF37]/15 bg-[#0A0A09] flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-6"
            >
              I Understand & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
