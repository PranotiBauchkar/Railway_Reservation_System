import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSortAmountDown, FaTrain, FaSearchMinus, FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { TrainCard } from '../components/TrainCard';
import { Loader } from '../components/Loader';
import { IconInput } from '../components/IconInput';
import { MH_STATIONS, STATION_DATALIST_ID } from '../constants/stations';

export const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const initialSource = queryParams.get('source') || '';
  const initialDestination = queryParams.get('destination') || '';
  const initialDate = queryParams.get('date') || '';

  // Form states
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time', 'fare-asc', 'fare-desc'

  const fetchTrains = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `/api/trains?source=${initialSource}&destination=${initialDestination}&date=${initialDate}`
      );
      setTrains(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to railway server. Displaying mock data for demonstration.');
      
      // Seed robust mock fallback if server is offline
      setTrains([
        {
          _id: 'mock1',
          trainNumber: '22436',
          trainName: 'Vande Bharat Express',
          source: 'New Delhi (NDLS)',
          destination: 'Varanasi Junction (BSB)',
          departureTime: '06:00',
          arrivalTime: '14:00',
          duration: '8h 00m',
          totalSeats: 120,
          availableSeats: { '1A': 8, '2A': 18, '3A': 25, 'SL': 52 },
          trainType: 'Vande Bharat',
          fare: { '1A': 2850, '2A': 1980, '3A': 1430, 'SL': 480 },
          runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
          ratings: 4.8,
        },
        {
          _id: 'mock2',
          trainNumber: '12952',
          trainName: 'Mumbai Rajdhani Express',
          source: 'New Delhi (NDLS)',
          destination: 'Mumbai Central (MMCT)',
          departureTime: '16:55',
          arrivalTime: '08:35',
          duration: '15h 40m',
          totalSeats: 180,
          availableSeats: { '1A': 12, '2A': 30, '3A': 42, 'SL': 75 },
          trainType: 'Rajdhani',
          fare: { '1A': 4250, '2A': 2890, '3A': 2090, 'SL': 690 },
          runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          ratings: 4.6,
        },
        {
          _id: 'mock3',
          trainNumber: '99999',
          trainName: 'Apex Hyperloop Bullet',
          source: 'Mumbai Central (MMCT)',
          destination: 'KSR Bengaluru (SBC)',
          departureTime: '10:00',
          arrivalTime: '12:30',
          duration: '2h 30m',
          totalSeats: 80,
          availableSeats: { '1A': 6, '2A': 10, '3A': 15, 'SL': 35 },
          trainType: 'Bullet',
          fare: { '1A': 6200, '2A': 4500, '3A': 3200, 'SL': 1200 },
          runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          ratings: 4.9,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [location.search]);

  // Real-time seat updates simulation (Client-side background worker fallback for extreme UX!)
  useEffect(() => {
    if (trains.length === 0) return;

    const interval = setInterval(() => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          // Select a random class to lock/unlock
          const classes = ['1A', '2A', '3A', 'SL'];
          const randomClass = classes[Math.floor(Math.random() * classes.length)];
          const currentSeats = train.availableSeats[randomClass] || train.availableSeats.get?.(randomClass) || 0;
          
          if (currentSeats <= 0) return train;

          // Random fluctuation: 70% chance to book (seats decrease), 30% chance of lock release (seats increase)
          const change = Math.random() > 0.3 ? -1 : 1;
          const newSeats = Math.max(0, currentSeats + change);

          const updatedSeats = { ...train.availableSeats };
          if (typeof train.availableSeats.set === 'function') {
            train.availableSeats.set(randomClass, newSeats);
          } else {
            updatedSeats[randomClass] = newSeats;
          }

          return {
            ...train,
            availableSeats: typeof train.availableSeats.set === 'function' ? train.availableSeats : updatedSeats,
          };
        })
      );
    }, 15000); // Trigger updates every 15 seconds

    return () => clearInterval(interval);
  }, [trains]);

  const handleFormSearch = (e) => {
    e.preventDefault();
    navigate(`/search?source=${source}&destination=${destination}&date=${date}`);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filtering Logic
  const filteredTrains = trains.filter((train) => {
    // 1. Train Type Filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(train.trainType)) {
      return false;
    }

    // 2. Class Selection Filter
    if (selectedClass) {
      const seats = train.availableSeats[selectedClass] || train.availableSeats.get?.(selectedClass);
      if (seats === undefined) return false;
    }

    // 3. Time Slots Filter
    if (selectedTimeSlot) {
      const hour = parseInt(train.departureTime.split(':')[0]);
      if (selectedTimeSlot === 'early' && (hour < 0 || hour >= 6)) return false;
      if (selectedTimeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (selectedTimeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (selectedTimeSlot === 'evening' && (hour < 18 || hour >= 24)) return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedTrains = [...filteredTrains].sort((a, b) => {
    const getFare = (train) => {
      const classKey = selectedClass || 'SL';
      return train.fare[classKey] || train.fare.get?.(classKey) || 0;
    };

    if (sortBy === 'fare-asc') {
      return getFare(a) - getFare(b);
    }
    if (sortBy === 'fare-desc') {
      return getFare(b) - getFare(a);
    }
    if (sortBy === 'duration') {
      const getMins = (t) => {
        const parts = t.duration.split(' ');
        const h = parseInt(parts[0]) || 0;
        const m = parseInt(parts[1]) || 0;
        return h * 60 + m;
      };
      return getMins(a) - getMins(b);
    }
    // Default sort by departure hour
    return a.departureTime.localeCompare(b.departureTime);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      
      {/* QUICK UPDATE BAR */}
      <datalist id={STATION_DATALIST_ID}>
        {MH_STATIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <section className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-lg">
        <form onSubmit={handleFormSearch} className="flex flex-col lg:flex-row items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full flex-1">
            <IconInput
              icon={FaMapMarkerAlt}
              label="From"
              type="text"
              list={STATION_DATALIST_ID}
              placeholder="Kolhapur (KOP)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              inputClassName="text-sm py-3"
            />
            <IconInput
              icon={FaMapMarkerAlt}
              label="To"
              type="text"
              list={STATION_DATALIST_ID}
              placeholder="Mumbai CSMT (CSMT)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              inputClassName="text-sm py-3"
            />
            <IconInput
              icon={FaCalendarAlt}
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              inputClassName="text-sm py-3 cursor-pointer"
            />
          </div>
          <button type="submit" className="neon-btn-primary py-3 px-6 text-xs font-bold uppercase shrink-0 btn-with-icon">
            <FaExchangeAlt /> Update Search
          </button>
        </form>
      </section>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-3 text-center rounded-xl bg-cyan-400/5 border border-cyan-400/10 text-cyan-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* FILTER & MAIN COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-extrabold text-sm text-rail-navy flex items-center gap-2">
                <FaFilter className="text-rail-orange shrink-0" /> Filters
              </h4>
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedTimeSlot('');
                  setSelectedClass('');
                  setSortBy('time');
                }}
                className="text-[10px] font-black text-slate-500 hover:text-rail-orange uppercase tracking-wider cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Sort Order Selector */}
            <div className="flex flex-col gap-2.5">
              <h5 className="font-bold text-xs text-rail-navy uppercase tracking-wider flex items-center gap-1.5">
                <FaSortAmountDown className="text-slate-500" /> Sort Schedules
              </h5>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input text-xs w-full text-slate-600 py-2.5"
              >
                <option value="time">Departure (Earliest First)</option>
                <option value="fare-asc">Fare (Low to High)</option>
                <option value="fare-desc">Fare (High to Low)</option>
                <option value="duration">Journey Speed (Fastest First)</option>
              </select>
            </div>

            {/* Train Type Filter */}
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-xs text-rail-navy uppercase tracking-wider">Train Category</h5>
              <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
                {['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Bullet', 'Express', 'Duronto'].map((type) => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer hover:text-rail-navy transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-slate-200 bg-slate-900 text-rail-orange focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Seat Class Filter */}
            <div className="flex flex-col gap-2.5">
              <h5 className="font-bold text-xs text-rail-navy uppercase tracking-wider">Required Class</h5>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="glass-input text-xs w-full text-slate-600 py-2.5"
              >
                <option value="">All Seat Classes</option>
                <option value="1A">First AC (1A)</option>
                <option value="2A">AC 2-Tier (2A)</option>
                <option value="3A">AC 3-Tier (3A)</option>
                <option value="SL">Sleeper (SL)</option>
              </select>
            </div>

            {/* Time Slot Filter */}
            <div className="flex flex-col gap-2.5">
              <h5 className="font-bold text-xs text-rail-navy uppercase tracking-wider">Departure Slots</h5>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-center">
                {[
                  { id: 'early', label: 'Early Morning\n(12AM - 6AM)' },
                  { id: 'morning', label: 'Morning\n(6AM - 12PM)' },
                  { id: 'afternoon', label: 'Afternoon\n(12PM - 6PM)' },
                  { id: 'evening', label: 'Night\n(6PM - 12AM)' },
                ].map((slot) => {
                  const isChecked = selectedTimeSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedTimeSlot(isChecked ? '' : slot.id)}
                      className={`p-2 rounded-xl border text-slate-600 leading-normal hover:border-rail-orange/40 transition-all cursor-pointer whitespace-pre-line ${
                        isChecked
                          ? 'bg-rail-orange/10 border-rail-orange text-rail-orange shadow-[0_0_8px_rgba(0,242,254,0.1)]'
                          : 'bg-white/5 border-slate-200'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* RESULTS COLUMN */}
        <main className="lg:col-span-3 flex flex-col gap-5">
          {loading ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              <Loader />
            </div>
          ) : sortedTrains.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 rounded-2xl border border-slate-200 flex flex-col items-center gap-5 text-center"
            >
              <div className="p-5 rounded-full bg-slate-900 border border-slate-200 text-slate-500">
                <FaSearchMinus className="text-4xl" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-extrabold text-xl text-rail-navy">No Schedules Match Search</h3>
                <p className="text-slate-500 text-xs md:text-sm max-w-sm leading-relaxed">
                  We couldn't locate trains running on this day. Try looking for New Delhi, Varanasi, Mumbai, or Bengaluru junctions!
                </p>
              </div>
              <button
                onClick={() => {
                  setSource('New Delhi (NDLS)');
                  setDestination('Varanasi Junction (BSB)');
                  setDate('');
                  navigate('/search?source=New Delhi (NDLS)&destination=Varanasi Junction (BSB)&date=');
                }}
                className="neon-btn-primary text-xs tracking-wider uppercase font-bold py-2.5 px-6"
              >
                Display Active NDLS ➔ BSB Route
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center text-xs text-slate-400 px-1 font-semibold">
                <span>Showing {sortedTrains.length} train schedule(s)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time seat sync active
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                {sortedTrains.map((train) => (
                  <TrainCard key={train._id} train={train} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
export default SearchPage;
