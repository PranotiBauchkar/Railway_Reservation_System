import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaChevronDown, FaShieldAlt, FaTicketAlt, FaUndo, FaSearchMinus, FaTimes, FaTrain } from 'react-icons/fa';
import axios from 'axios';
import { MH_STATIONS, STATION_DATALIST_ID } from '../constants/stations';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [journeyDate, setJourneyDate] = useState('');

  // PNR Search States
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState(null);
  const [pnrLoading, setPnrLoading] = useState(false);
  const [pnrError, setPnrError] = useState('');

  // Accordion FAQ Active index
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!source || !destination) return;
    navigate(`/search?source=${source}&destination=${destination}&date=${journeyDate}`);
  };

  const handlePopularRouteClick = (src, dest) => {
    navigate(`/search?source=${src}&destination=${dest}&date=`);
  };

  const handlePnrCheck = async (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setPnrLoading(true);
    setPnrError('');
    setPnrResult(null);

    try {
      const { data } = await axios.get(`/api/bookings/pnr/${pnrInput.trim()}`);
      setPnrResult(data);
    } catch (err) {
      setPnrError(err.response?.data?.message || 'No ticket found with this PNR number');
    } finally {
      setPnrLoading(false);
    }
  };

  const popularRoutes = [
    { src: 'Kolhapur (KOP)', dest: 'Mumbai CSMT (CSMT)', tag: 'Koyna Express', price: '₹420' },
    { src: 'Kolhapur (KOP)', dest: 'Pune Junction (PUNE)', tag: 'Kolhapur Pune SF', price: '₹220' },
    { src: 'Mumbai CSMT (CSMT)', dest: 'Kolhapur (KOP)', tag: 'Mahalaxmi Exp', price: '₹450' },
    { src: 'Pune Junction (PUNE)', dest: 'Kolhapur (KOP)', tag: 'Pune Kolhapur', price: '₹180' },
    { src: 'Mumbai CSMT (CSMT)', dest: 'Nagpur Junction (NGP)', tag: 'Vidarbha Exp', price: '₹520' },
    { src: 'Solapur (SUR)', dest: 'Kolhapur (KOP)', tag: 'Solapur Route', price: '₹200' },
  ];

  const faqs = [
    { q: 'How does the waiting list and seat locking system work?', a: 'When you proceed to book a ticket, seats are checked in real-time. If you initiate checkout, the seats are locked temporarily. If availability drops below 1, passengers are placed on a waitlist.' },
    { q: 'What is the refund policy upon booking cancellations?', a: 'Indian Rail Connect initiates a 100% immediate refund to your payment source when a ticket is cancelled, with zero cancellation convenience penalty.' },
    { q: 'Are QR codes on tickets valid for platform boarding?', a: 'Yes! Every ticket generates a secure 10-digit PNR alongside an offline-valid Base64 QR code. Scanning the QR code displays the passenger chart instantly.' },
    { q: 'Can I add multiple passengers to a single PNR?', a: 'Absolutely! You can book up to 6 passengers on a single ticket journey, select seat preferences for each, and get adjacent allocations.' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      <section className="hero-photo relative w-full min-h-[480px] md:min-h-[520px] flex flex-col items-center justify-center px-4 overflow-hidden py-16 md:py-20">
        <div className="max-w-4xl text-center z-10 flex flex-col items-center gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="badge-rail">
            <FaTrain /> Official Online Reservation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-hero leading-tight drop-shadow-lg"
          >
            Book Your Train Journey
            <br className="hidden sm:block" />
            <span className="text-rail-saffron">Across India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-on-hero-muted text-sm sm:text-lg max-w-2xl leading-relaxed drop-shadow"
          >
            Search live schedules, choose seats, pay securely, and get your e-ticket with PNR and QR code.
          </motion.p>
        </div>
      </section>

      {/* 2. DYNAMIC QUICK SEARCH PANEL */}
      <section className="relative w-full max-w-5xl px-4 z-20 -mt-10">
        <datalist id={STATION_DATALIST_ID}>
          {MH_STATIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <form
          onSubmit={handleSearchSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6 shadow-card"
        >
          <p className="text-xs text-rail-muted font-semibold">
            Maharashtra routes — Kolhapur, Pune, Mumbai, Nagpur, Sangli & more
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="field-label">
                <FaMapMarkerAlt className="text-rail-orange shrink-0" /> From Station
              </label>
              <input
                type="text"
                list={STATION_DATALIST_ID}
                placeholder="e.g. Kolhapur (KOP)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                className="glass-input text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="field-label">
                <FaMapMarkerAlt className="text-rail-blue shrink-0" /> To Station
              </label>
              <input
                type="text"
                list={STATION_DATALIST_ID}
                placeholder="e.g. Mumbai CSMT (CSMT)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="glass-input text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="field-label">
                <FaCalendarAlt className="text-rail-success shrink-0" /> Journey Date
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="glass-input text-sm w-full cursor-pointer"
              />
            </div>
          </div>
          <button type="submit" className="neon-btn-primary w-full py-4 text-sm font-bold uppercase btn-with-icon">
            <FaSearch /> Search Schedules & Rates
          </button>
        </form>
      </section>

      {/* 3. POPULAR ROUTE CARDS */}
      <section className="w-full max-w-5xl px-4 mt-24">
        <div className="text-center md:text-left mb-10 flex flex-col gap-1">
          <h3 className="section-heading">Popular Journeys</h3>
          <p className="text-rail-muted text-sm font-medium">Pre-fill details instantly for key routes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handlePopularRouteClick(route.src, route.dest)}
              className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-rail-orange/30 cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[150px] relative overflow-hidden group"
            >
              {/* Glowing hover card corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rail-saffron/5 to-transparent rounded-bl-full group-hover:from-rail-saffron/15 transition-all" />
              
              <div>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block mb-2">
                  {route.tag}
                </span>
                <h4 className="font-extrabold text-rail-navy text-sm truncate">{route.src.split(' (')[0]}</h4>
                <p className="text-[10px] text-rail-muted font-bold my-1">to</p>
                <h4 className="font-extrabold text-rail-navy text-sm truncate">{route.dest.split(' (')[0]}</h4>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-4">
                <span className="text-[10px] text-slate-400 font-medium">Starting Fare</span>
                <span className="text-xs font-black text-rail-orange">{route.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="w-full max-w-5xl px-4 mt-28">
        <div className="text-center mb-12 flex flex-col gap-1">
          <h3 className="section-heading">Why Book With Us</h3>
          <p className="section-subtext">Trusted features for everyday railway travellers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-[#e67e22]/5 border border-[#e67e22]/10 text-rail-orange shrink-0">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">Secure JWT Authentication</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Your credentials are encrypted using bcryptjs, with role authorization protecting administration routes.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-rail-blue shrink-0">
              <FaTicketAlt className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">PNR Ticket Visualizer</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Download high-quality digital travel boarding passes containing offline QR codes generated directly by the server.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-rail-success shrink-0">
              <FaUndo className="text-xl" />
            </div>
            <div>
              <h4 className="font-extrabold text-rail-navy text-base mb-1.5">Instant Refund Cancellations</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cancel booked reservations directly on your dashboard. Automatic seat restorations and refund captures simulated instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUICK PNR CHECK WIDGET */}
      <section className="w-full max-w-3xl px-4 mt-28">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rail-saffron to-primary-600" />
          
          <div className="flex flex-col gap-4 text-center items-center">
            <h3 className="font-black text-xl md:text-2xl text-rail-navy tracking-wide">Quick PNR Ticket Checker</h3>
            <p className="text-slate-400 text-xs max-w-md">
              Enter your 10-digit PNR number below to fetch your booking status, passenger charts, and QR code tickets instantly.
            </p>
          </div>

          <form onSubmit={handlePnrCheck} className="flex flex-col sm:flex-row gap-3 mt-6">
            <input
              type="text"
              placeholder="Enter 10 digit PNR number..."
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              maxLength={10}
              className="glass-input text-sm w-full text-center tracking-widest font-black"
            />
            <button
              type="submit"
              disabled={pnrLoading}
              className="neon-btn-primary shrink-0 text-xs font-extrabold uppercase py-3.5 px-6 tracking-wider flex items-center justify-center gap-2"
            >
              {pnrLoading ? 'Verifying...' : 'Check Status'}
            </button>
          </form>

          {/* PNR Search Results Area */}
          <AnimatePresence>
            {pnrError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center"
              >
                {pnrError}
              </motion.div>
            )}

            {pnrResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-6 p-4 rounded-2xl bg-white/60 border border-slate-200 flex flex-col sm:flex-row items-center gap-5 justify-between"
              >
                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block">
                    Confirmed Ticket
                  </span>
                  <h4 className="font-extrabold text-sm text-rail-navy">
                    {pnrResult.trainId?.trainName || 'Indian Rail Connect Express'} ({pnrResult.trainId?.trainNumber || '99999'})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Route: <span className="font-bold text-slate-600">{pnrResult.trainId?.source.split(' (')[0]}</span> to <span className="font-bold text-slate-600">{pnrResult.trainId?.destination.split(' (')[0]}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Journey Date: <span className="text-rail-orange font-bold">{new Date(pnrResult.journeyDate).toDateString()}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Passengers: <span className="text-rail-navy font-bold">{pnrResult.passengers.length} passengers</span>
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2">
                  <img
                    src={pnrResult.QRCode}
                    alt="PNR Code"
                    className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-200"
                  />
                  <Link
                    to={`/pnr/${pnrResult.PNR}`}
                    className="text-[10px] font-bold text-rail-orange hover:underline hover:text-cyan-300"
                  >
                    View & Print Ticket
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="w-full max-w-3xl px-4 mt-28">
        <div className="text-center mb-10 flex flex-col gap-1">
          <h3 className="section-heading">Frequently Asked Questions</h3>
          <p className="text-rail-muted text-sm font-medium">Quick explanations on platform inquiries</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpened = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpened ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-rail-navy hover:text-rail-orange cursor-pointer select-none"
                >
                  {faq.q}
                  <FaChevronDown
                    className={`text-xs text-slate-500 transition-transform duration-300 ${
                      isOpened ? 'rotate-180 text-rail-orange' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {isOpened && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-200 text-slate-400 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
export default LandingPage;
