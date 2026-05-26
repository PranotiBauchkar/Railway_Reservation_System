import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 flex flex-col items-center gap-6"
      >
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-3xl animate-bounce">
          <FaExclamationTriangle />
        </div>
        
        <div>
          <h2 className="text-6xl font-black text-rail-navy leading-none">404</h2>
          <p className="text-rail-orange font-extrabold text-xs tracking-wider uppercase mt-2">
            Train Off Track!
          </p>
        </div>

        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
          The terminal page you are attempting to board does not exist or has departed permanently. Let's redirect you back to the main station.
        </p>

        <Link
          to="/"
          className="neon-btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          Return to Main Station <FaArrowRight />
        </Link>
      </motion.div>
    </div>
  );
};
export default NotFoundPage;
