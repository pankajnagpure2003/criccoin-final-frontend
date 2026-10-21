import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImg from '../../../assets/criccoin-logo-trans.png';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Token', href: '#token' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Roadmap', href: '#roadmap' },
];

export default function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
      const sections = ['home', 'about', 'how-it-works', 'token', 'ecosystem', 'roadmap'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAuthClick = (mode) => {
    setMobileOpen(false);
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      const el = document.getElementById('signup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050606]/95 backdrop-blur-xl border-b-2 border-[#D4AF37]/90 shadow-xl shadow-black/80 py-3'
          : 'bg-[#050606]/60 backdrop-blur-md border-b-2 border-[#D4AF37]/70 py-4'
      }`}
    >
      <div className="max-w-15xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-2.5 text-left group bg-transparent border-0 focus:outline-none"
            aria-label="CRICCOIN Home"
          >
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md group-hover:bg-[#FFD76A]/30 transition-colors" />
              <img
                src={logoImg}
                alt="CRICCOIN Logo"
                className="relative w-full h-full object-contain scale-200 filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-heading text-lg sm:text-xl font-black tracking-wider text-[#FFD76A] group-hover:text-[#FFF1B8] transition-colors">
                  CRICCOIN
                </span>
                {/* <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFD76A] border border-[#D4AF37]/40 tracking-wider">
                  OFFICIAL
                </span> */}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Capsule */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#17140B]/95 via-black/90 to-[#17140B]/95 backdrop-blur-md border-2 border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.18)]">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-transparent border-0 transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-[#C6C6C6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37]/25 to-[#FFD76A]/15 border border-[#FFD76A]/90"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleAuthClick('login')}
              className="btn-secondary !py-2 !px-5 !text-xs !font-semibold !border-2 !border-[#D4AF37] hover:!border-[#FFD76A]"
            >
              Login
            </button>
            <button
              onClick={() => handleAuthClick('signup')}
              className="btn-primary !py-2 !px-5 !text-xs !font-bold !border-2 !border-[#FFD76A] flex items-center gap-1.5"
            >
              {/* <Sparkles size={13} className="text-black" /> */}
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleAuthClick('signup')}
              className="btn-primary !py-1.5 !px-3.5 !text-xs !font-bold !border-2 !border-[#FFD76A]"
            >
              Sign Up
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A160B] to-[#080808] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFD76A] hover:border-[#FFD76A] hover:bg-[#D4AF37]/15 transition-colors focus:outline-none"
              aria-label={mobileOpen ? 'Close Navigation' : 'Open Navigation'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t-2 border-[#D4AF37]/80 bg-[#050606]/98 backdrop-blur-2xl px-5 pt-4 pb-6 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-left text-sm font-medium bg-transparent border-0 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1A160B] to-[#0A0907] text-[#FFD76A] border-2 border-[#FFD76A]/90 font-semibold'
                        : 'text-[#C6C6C6] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FFD76A]" />}
                  </button>
                );
              })}

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="btn-secondary !w-full !py-2.5 !text-xs !justify-center !border-2 !border-[#D4AF37]"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="btn-primary !w-full !py-2.5 !text-xs !justify-center !font-bold !border-2 !border-[#FFD76A]"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
