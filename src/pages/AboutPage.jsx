import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaRocket, FaClock, FaCheckCircle, FaTrain } from 'react-icons/fa';

export const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-16">
      
      {/* 1. HERO DESCRIPTION */}
      <section className="text-center flex flex-col items-center gap-5 mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-full bg-rail-orange/10 border border-rail-orange/20 text-rail-orange flex items-center justify-center shadow-lg"
        >
          <FaTrain className="text-2xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black text-rail-navy tracking-wide"
        >
          Reinventing High-Speed Rail
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rail-muted text-sm sm:text-base max-w-2xl leading-relaxed"
        >
          Indian Rail Connect is a futuristic full-stack travel reservation terminal designed to handle multi-tier schedules, visual seating grids, and high-frequency bullet transit bookings.
        </motion.p>
      </section>

      {/* 2. STATS SECTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { metric: '250+', label: 'Active Daily Transits' },
          { metric: '99.9%', label: 'Punctuality Ratio' },
          { metric: '2h 30m', label: 'Hyperloop SBC-MMCT Speed' },
          { metric: '₹0', label: 'Hidden Convenience Fees' },
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-200 text-center flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-black text-rail-orange">{item.metric}</span>
            <span className="text-[10px] text-rail-muted font-bold uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </section>

      {/* 3. CORE VALUES GRID */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-1">
          <h3 className="font-extrabold text-2xl text-rail-navy tracking-wide">Our Platform Values</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">How we configure next-generation journeys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-cyan-400/5 border border-cyan-400/10 text-rail-orange self-start">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">Uncompromising Security</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Every booking transaction is captured in secured MongoDB collections, employing JWT auth headers, bcrypt encryptions, and cookie tracking.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-rail-blue self-start">
              <FaRocket className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">Futuristic Innovation</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Simulating high-speed Hyperloop pods alongside standard Express and Rajdhani links, introducing active seat matrix controls.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-rail-success self-start">
              <FaClock className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">Punctual Schedules</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Our timetables synchronize directly with platform alerts and real-time announcements, ensuring passengers are active on every depart.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
export default AboutPage;
