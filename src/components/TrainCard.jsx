import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaStar, FaExchangeAlt } from 'react-icons/fa';

export const TrainCard = ({ train }) => {
  const classes = ['1A', '2A', '3A', 'SL'];

  const getMapValue = (map, key) => {
    if (!map) return undefined;
    if (typeof map.get === 'function') return map.get(key);
    return map[key];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel glass-panel-hover p-5 md:p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center gap-6 justify-between"
    >
      <div className="flex flex-col gap-3 lg:max-w-md w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-rail-navy tracking-wider uppercase bg-rail-blue px-2 py-0.5 rounded-md">
            {train.trainType}
          </span>
          <span className="text-rail-muted font-bold text-xs">Train #{train.trainNumber}</span>
          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <FaStar />
            {train.ratings}
          </div>
        </div>

        <h3 className="font-extrabold text-lg md:text-xl text-rail-navy">{train.trainName}</h3>

        <div className="flex items-center gap-3 md:gap-5 text-sm mt-1">
          <div>
            <p className="text-rail-muted text-[10px] uppercase font-semibold">From</p>
            <p className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[120px]">
              {train.source.split(' (')[0]}
            </p>
            <p className="text-rail-orange text-base md:text-lg font-extrabold">{train.departureTime}</p>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0 mt-3">
            <span className="text-[10px] text-rail-muted font-bold">{train.duration}</span>
            <FaExchangeAlt className="text-rail-blue text-xs" />
          </div>
          <div>
            <p className="text-rail-muted text-[10px] uppercase font-semibold">To</p>
            <p className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[120px]">
              {train.destination.split(' (')[0]}
            </p>
            <p className="text-rail-orange text-base md:text-lg font-extrabold">{train.arrivalTime}</p>
          </div>
          <div className="ml-auto text-right border-l border-slate-200 pl-4 hidden md:block">
            <p className="text-rail-muted text-[10px] uppercase font-semibold flex items-center gap-1 justify-end">
              <FaClock /> Runs on
            </p>
            <p className="text-xs text-slate-600 font-bold mt-1 max-w-[90px] truncate">
              {train.runningDays.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
        {classes.map((cls) => {
          const fare = getMapValue(train.fare, cls);
          const seats = getMapValue(train.availableSeats, cls);
          if (fare === undefined) return null;
          const isAvailable = seats > 0;

          return (
            <div
              key={cls}
              className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[75px]"
            >
              <span className="text-[9px] font-bold text-rail-muted uppercase">{cls}</span>
              <span className="text-sm font-extrabold text-rail-navy">₹{fare}</span>
              <span
                className={`text-[9px] font-bold py-0.5 px-1 rounded-md mt-1 ${
                  isAvailable
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {isAvailable ? `${seats} seats` : 'Waitlist'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 flex items-center w-full lg:w-auto mt-2 lg:mt-0">
        <Link
          to={`/train/${train._id}`}
          className="neon-btn-primary text-center text-xs font-bold tracking-widest uppercase py-3 px-5 rounded-xl w-full"
        >
          View & Book
        </Link>
      </div>
    </motion.div>
  );
};

export default TrainCard;
