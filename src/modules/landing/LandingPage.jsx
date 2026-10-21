import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUp, Sparkles, X } from "lucide-react";
import About from "./components/About.jsx";
import Ecosystem from "./components/Ecosystem.jsx";
import Footer from "./components/Footer.jsx";
import GoldSeparator from "./components/GoldSeparator.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import JoinCommunity from "./components/JoinCommunity.jsx";
import LegalModal from "./components/LegalModal.jsx";
import Navbar from "./components/Navbar.jsx";
import Roadmap from "./components/Roadmap.jsx";
import TokenPackages from "./components/TokenPackages.jsx";
import "./landing.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: null });
  const [showTopAnnouncement, setShowTopAnnouncement] = useState(true);
  const [showFloatingTop, setShowFloatingTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloatingTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openAuth = (mode) => {
    navigate(mode === "login" ? "/login" : "/signup");
  };

  const openLegal = (type) => setLegalModal({ isOpen: true, type });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050606] text-white flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
        <AnimatePresence>
          {showTopAnnouncement && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-50 bg-gradient-to-r from-[#171510] via-[#2A2312] to-[#171510] border-b border-[#D4AF37]/30 py-2 px-4 text-center text-[11px] sm:text-xs font-medium text-[#FFD76A] flex items-center justify-center gap-2 overflow-hidden"
            >
              <Sparkles size={13} className="text-[#FFD76A] flex-shrink-0" />
              <span>
                <strong>CRICCOIN Ecosystem Architecture:</strong> 12-Month
                Holding, 10-Level Referral Network &amp; Digital Cricket
                Innovation.
              </span>
              <button
                onClick={() => setShowTopAnnouncement(false)}
                className="ml-2 text-white/50 hover:text-white transition-colors"
                aria-label="Dismiss Announcement"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Navbar onOpenAuth={openAuth} />

        <main className="flex-grow">
          <Hero onExplore={() => scrollToId("ecosystem")} />
          <GoldSeparator />
          <About />
          <GoldSeparator />
          <HowItWorks />
          <GoldSeparator />
          <TokenPackages onExplore={() => openAuth("signup")} />
          <GoldSeparator />
          <Ecosystem />
          <GoldSeparator />
          <Roadmap />
          <GoldSeparator />
          <JoinCommunity
            onLogin={() => openAuth("login")}
            onSignup={() => openAuth("signup")}
          />
        </main>

        <GoldSeparator />
        <Footer
          onOpenLegal={openLegal}
          onOpenAuth={openAuth}
          onScrollTo={scrollToId}
        />
        <LegalModal
          isOpen={legalModal.isOpen}
          type={legalModal.type}
          onClose={() => setLegalModal({ isOpen: false, type: null })}
        />

        <AnimatePresence>
          {showFloatingTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#12110E]/90 border border-[#D4AF37]/50 text-[#FFD76A] backdrop-blur-md shadow-2xl flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all focus:outline-none"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
