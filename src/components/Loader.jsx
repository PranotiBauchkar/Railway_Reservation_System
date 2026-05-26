import React from 'react';
import { motion } from 'framer-motion';
import { FaTrain } from 'react-icons/fa';

export const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[250px] w-full gap-4">
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-full border-4 border-rail-blue/20 border-t-rail-orange"
      />
      <FaTrain className="absolute text-rail-blue text-lg" />
    </div>
    <p className="text-rail-muted font-semibold text-xs tracking-wider uppercase">
      Loading schedules...
    </p>
  </div>
);

export default Loader;
