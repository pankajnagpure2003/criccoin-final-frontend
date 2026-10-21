import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import logoImg from '../../../assets/criccoin-logo-trans.png';
import { fadeUp } from '../utils/motion';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Token', href: '#token' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Login', href: '#signup' },
  { label: 'Sign Up', href: '#signup' },
];

const legalItems = [
  { label: 'Terms & Conditions', type: 'terms' },
  { label: 'Privacy Policy', type: 'privacy' },
  { label: 'Risk Disclosure', type: 'risk' },
  { label: 'Compliance', type: 'compliance' },
];

const currentYear = new Date().getFullYear();

export default function Footer({ onOpenLegal, onScrollTo }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href) => {
    const id = href.replace('#', '');
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="relative bg-[#050606] border-t-[3px] border-[#FFD76A] pt-16 pb-12 overflow-hidden">
      {/* Ambient background gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b-2 border-[#D4AF37]/70">
          
          {/* Brand & Slogan Column (5 cols) */}
          <motion.div {...fadeUp(0, 20)} className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md" />
                  <img
                    src={logoImg}
                    alt="CRICCOIN Logo"
                    className="relative w-full h-full object-contain scale-200 filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-heading text-lg sm:text-xl font-black tracking-wider text-[#FFD76A]">
                    CRICCOIN
                  </h3>
                  <span className="text-[10px] text-white font-medium tracking-wide">
                    CRICKET COIN ECOSYSTEM
                  </span>
                </div>
              </div>

              <p className="font-heading text-sm font-semibold text-[#FFD76A] mb-3">
                Play. Participate. Build the Cricket Community.
              </p>

              <p className="text-xs sm:text-sm text-[#C6C6C6] max-w-sm leading-relaxed mb-6 font-normal">
                Explore a cricket-focused digital ecosystem built around token participation,
                community engagement, and digital experiences.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                {
                  name: 'X / Twitter',
                  color: '#FFFFFF',
                  icon: (
                    <path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9ZM17.6 20.6h2L6.5 3.3H4.4l13.2 17.3Z" />
                  ),
                },
                {
                  name: 'Telegram',
                  color: '#2AABEE',
                  icon: (
                    <path d="M21.9 4.2 18.7 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.5l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 3c.9-.3 1.7.2 1.3 1.2Z" />
                  ),
                },
                {
                  name: 'Discord',
                  color: '#5865F2',
                  icon: (
                    <path d="M19.7 5.1a18.4 18.4 0 0 0-4.5-1.4l-.6 1.2a17 17 0 0 0-5.1 0l-.6-1.2a18.4 18.4 0 0 0-4.5 1.4C1.6 9.3.8 13.4 1.2 17.5a18.2 18.2 0 0 0 5.5 2.8l1.2-2a11.8 11.8 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11 0l.5.4a11.8 11.8 0 0 1-1.9.9l1.2 2a18.2 18.2 0 0 0 5.5-2.8c.5-4.8-.8-8.8-3.1-12.4ZM8.8 14.9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm6.4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
                  ),
                },
                {
                  name: 'Instagram',
                  color: '#E4405F',
                  icon: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.3" />
                      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.3" />
                      <circle cx="17.7" cy="6.5" r="1.3" />
                    </>
                  ),
                },
                {
                  name: 'YouTube',
                  color: '#FF0033',
                  icon: (
                    <>
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z" />
                      <path d="m9.6 15.6 6.2-3.6-6.2-3.6v7.2Z" fill="#fff" />
                    </>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  title={social.name}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`${social.name} community channel launching soon.`);
                  }}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4AF37]/80 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD76A] hover:bg-white/[0.08] hover:shadow-[0_0_18px_currentColor]"
                  style={{ color: social.color }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="19"
                    height="19"
                    fill="currentColor"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Column (3 cols) */}
          <motion.div {...fadeUp(0.1, 20)} className="lg:col-span-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-[#FFD76A] mb-4 flex items-center gap-2">
              {/* <Sparkles size={13} className="text-[#D4AF37]" /> */}
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="border-0 bg-transparent text-left text-[#C6C6C6] hover:text-[#FFD76A] py-1 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Legal Column (4 cols) */}
          <motion.div {...fadeUp(0.18, 20)} className="lg:col-span-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-[#FFD76A] mb-4">
              Legal & Disclosures
            </h4>
            <div className="space-y-2 mb-6">
              {legalItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onOpenLegal?.(item.type)}
                  className="block border-0 bg-transparent p-0 text-left text-xs text-[#C6C6C6] hover:text-[#FFD76A] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-[#17140B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] text-[11px] text-[#C6C6C6]/80 leading-relaxed">
              Official launch parameters, KYC verification standards, and approved local permissions apply.
            </div>
          </motion.div>

        </div>

        {/* Full Legal Disclaimer Box */}
        <motion.div {...fadeUp(0.2, 16)} className="my-8 p-4 rounded-xl bg-gradient-to-br from-[#17140B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.14)]">
          <p className="text-xs text-[#C6C6C6]/85 leading-relaxed text-center sm:text-left">
            <strong className="text-[#FFD76A] font-semibold">Disclaimer: </strong>
            CRICCOIN is a proposed digital ecosystem. Token prices may fluctuate, and token ownership
            does not guarantee profits, fixed returns, gaming winnings, or cash-out availability.
            Features and participation are subject to approved terms, eligibility, and applicable laws.
          </p>
        </motion.div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <motion.div {...fadeUp(0.25, 12)} className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C6C6C6]/60">
          <div className="flex items-center gap-2">
            <span>© {currentYear} CRICCOIN Ecosystem. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Play · Participate · Build</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-[#1A160B] to-[#080808] border-2 border-[#FFD76A] text-[#FFD76A] hover:bg-[#D4AF37]/20 transition-all text-[11px] font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
