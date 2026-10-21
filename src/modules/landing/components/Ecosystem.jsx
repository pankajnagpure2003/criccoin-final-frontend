import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Shirt, Share2, Crown, Users2, ArrowUpRight } from 'lucide-react';
import ecoGamingImg from '../../../assets/eco-gaming.jpg';
import ecoTrophyImg from '../../../assets/eco-trophy.jpg';
import ecoJerseyImg from '../../../assets/eco-jersey.jpg';
import ecoNetworkImg from '../../../assets/eco-network.jpg';
import ecoCrownImg from '../../../assets/eco-crown.jpg';
import ecoCommunityImg from '../../../assets/eco-community.jpg';
import {
  fadeUp,
  staggerContainerVariants,
  staggerItemVariants,
  DEFAULT_VIEWPORT,
} from '../utils/motion';

const ecosystemCards = [
  {
    title: 'Cricket & Digital Gaming',
    desc: 'Discover approved online cricket games and sports entertainment experiences where legally permitted.',
    icon: Gamepad2,
    image: ecoGamingImg,
    tag: 'Sports Entertainment',
  },
  {
    title: 'Competitions & Fan Engagement',
    desc: 'Participate in eligible community competitions, fan activities, and cricket-focused events.',
    icon: Trophy,
    image: ecoTrophyImg,
    tag: 'Community Events',
  },
  {
    title: 'Digital Collectibles & Merchandise',
    desc: 'Explore potential digital collectibles, cricket merchandise, and community offerings.',
    icon: Shirt,
    image: ecoJerseyImg,
    tag: 'Exclusive Gear',
  },
  {
    title: 'Referral Network',
    desc: 'Connect with others, share your referral link, and track your eligible network activity.',
    icon: Share2,
    image: ecoNetworkImg,
    tag: '10-Level System',
  },
  {
    title: 'Leadership & Recognition',
    desc: 'Explore leadership development, qualification tracking, and approved recognition opportunities.',
    icon: Crown,
    image: ecoCrownImg,
    tag: 'Elite Status',
  },
  {
    title: 'Community Programs',
    desc: 'Stay connected through regional initiatives, events, and community-building activities.',
    icon: Users2,
    image: ecoCommunityImg,
    tag: 'Global Fans',
  },
];

export default function Ecosystem() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="ecosystem" className="relative py-12 md:py-14 lg:py-16 bg-[#080808] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0, 15)} className="mb-3">
          <span className="section-label">
            ECOSYSTEM
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08, 20)} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
          One Ecosystem. A Shared{' '}
          <span className="gold-gradient-text">Passion for Cricket.</span>
        </motion.h2>
        <motion.p {...fadeUp(0.16, 18)} className="text-sm sm:text-base text-[#C6C6C6] mb-12 max-w-2xl font-normal">
          Explore digital experiences designed to bring cricket communities closer together.
        </motion.p>

        {/* 6 Visual Glass Cards Grid */}
        <motion.div
          variants={staggerContainerVariants(0.08, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={DEFAULT_VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ecosystemCards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredIdx === index;

            return (
              <motion.div
                key={card.title}
                variants={staggerItemVariants(22)}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.985 }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative rounded-2xl overflow-hidden p-6 transition-colors duration-300 flex flex-col justify-between ${
                  isHovered
                    ? 'bg-gradient-to-br from-[#201A0D] via-[#14120C] to-[#090908] border-[3px] border-[#FFD76A] shadow-[0_12px_35px_rgba(212,175,55,0.3)]'
                    : 'bg-gradient-to-br from-[#19150B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37] hover:border-[#FFD76A]'
                }`}
              >
                {/* Visual Thumbnail from mockup */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-5 bg-[#050606] border-[3px] border-[#D4AF37]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10100E] via-[#10100E]/40 to-transparent" />
                  
                  {/* Floating Icon Circle */}
                  <div className="absolute bottom-2.5 left-3 w-10 h-10 rounded-xl bg-black/80 border border-[#D4AF37]/40 backdrop-blur-md flex items-center justify-center text-[#FFD76A] shadow-md">
                    <Icon size={19} />
                  </div>

                  {/* Category Pill */}
                  <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded-full bg-black/70 border border-[#D4AF37]/30 backdrop-blur-md text-[10px] font-semibold text-[#FFD76A]">
                    {card.tag}
                  </span>
                </div>

                {/* Card Title & Desc */}
                <div className="flex-grow">
                  <h3 className="font-heading text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#FFD76A] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C6C6C6]/85 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#FFD76A]">
                  <span className="flex items-center gap-1">
                    {/* <Sparkles size={12} /> */}
                    Explore Feature
                  </span>
                  <div className={`w-6 h-6 rounded-full bg-[#D4AF37]/15 flex items-center justify-center transition-transform ${isHovered ? 'translate-x-0.5 -translate-y-0.5 text-white' : ''}`}>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legal Disclaimer Note */}
        <motion.div {...fadeUp(0.2, 15)} className="mt-10 p-3.5 rounded-xl bg-gradient-to-br from-[#17140B] via-[#100F0B] to-[#080808] border-[3px] border-[#D4AF37]/90 text-center">
          <p className="text-xs text-[#C6C6C6]/70 leading-relaxed">
            Ecosystem features depend on availability, eligibility, and applicable local laws.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
