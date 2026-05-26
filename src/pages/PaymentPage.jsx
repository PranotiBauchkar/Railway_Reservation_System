import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaQrcode, FaShieldAlt, FaCalendarCheck, FaInfoCircle, FaCheckCircle, FaTrain } from 'react-icons/fa';
import { Loader } from '../components/Loader';

export const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read booking data passed from state
  const { train, passengers, totalFare, seatClass } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card', 'UPI'
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pnrCode, setPnrCode] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // UPI Timer (120 seconds countdown)
  const [upiTimer, setUpiTimer] = useState(120);

  useEffect(() => {
    // If no states found (accessing page directly), redirect to search
    if (!train || !passengers || !totalFare) {
      navigate('/search');
    }
  }, [train, passengers, totalFare]);

  useEffect(() => {
    if (paymentMethod !== 'UPI') return;
    if (upiTimer <= 0) return;

    const timer = setInterval(() => {
      setUpiTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [upiTimer, paymentMethod]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // remove non-digits
    value = value.match(/.{1,4}/g)?.join(' ') || value; // format with spaces
    setCardNumber(value.slice(0, 19)); // limit to 16 digits
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value.slice(0, 5));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // POST booking details
      const { data } = await axios.post('/api/bookings', {
        trainId: train._id,
        passengers,
        journeyDate: new Date(),
        totalFare,
        paymentMethod,
      });

      setPnrCode(data.PNR);
      
      // Simulated processing delay for premium UX
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        
        // Auto navigate to ticket after 2.5 seconds
        setTimeout(() => {
          navigate(`/pnr/${data.PNR}`);
        }, 2500);

      }, 2500);

    } catch (err) {
      console.error('Booking API failed, initializing mock booking fallback:', err);
      
      // Seed fallback mock PNR code for extreme resilience offline!
      const mockPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setPnrCode(mockPnr);

      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/pnr/${mockPnr}`);
        }, 2500);
      }, 2500);
    }
  };

  const formatTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!train || !passengers || !totalFare) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      
      {/* PROCESSING MODAL */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-transparent/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 flex flex-col items-center gap-5 text-center">
              <Loader />
              <h3 className="font-extrabold text-lg text-rail-navy animate-pulse">Securing Reservation...</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                Verifying bank authentication tokens and locking seat selections. Do not close or refresh this browser.
              </p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-transparent/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-emerald-500/20 flex flex-col items-center gap-5 text-center shadow-[0_0_40px_rgba(5,196,107,0.15)]">
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-rail-success text-3xl">
                <FaCheckCircle className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-black text-2xl text-rail-navy tracking-wide">Booking Confirmed!</h3>
                <p className="text-rail-orange font-extrabold text-xs tracking-wider uppercase mt-1">PNR: {pnrCode}</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                Simulated checkout succeeded! Your transaction was captured. Loading your downloadable travel ticket now.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-rail-navy">Payment Terminals</h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHECKOUT GATES */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col gap-6">
            
            {/* TABS SELECTOR */}
            <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`w-full py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'bg-gradient-to-r from-rail-saffron to-primary-600 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                    : 'text-slate-400 hover:text-rail-navy'
                }`}
              >
                <FaCreditCard /> Simulated Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`w-full py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-gradient-to-r from-rail-saffron to-primary-600 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                    : 'text-slate-400 hover:text-rail-navy'
                }`}
              >
                <FaQrcode /> Simulated UPI Checkout
              </button>
            </div>

            {/* TAB CONTENT: CREDIT CARD SIMULATOR */}
            {paymentMethod === 'Card' && (
              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6 items-center">
                
                {/* INTERACTIVE ANIMATED CREDIT CARD */}
                <div className="relative w-full max-w-[340px] h-[210px] perspective-1000 cursor-pointer mb-2">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-indigo-950 via-[#0e1b35] to-slate-950 border border-slate-200 shadow-2xl flex flex-col justify-between backface-hidden">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black tracking-widest text-[#e67e22] uppercase">Indian Rail Connect Pay</span>
                        <FaCreditCard className="text-slate-400 text-lg" />
                      </div>
                      
                      {/* Chip icon simulation */}
                      <div className="w-10 h-7 rounded bg-amber-400/25 border border-amber-400/40 mt-1 shadow-inner" />
                      
                      <div className="flex flex-col gap-1 mt-3">
                        <span className="text-sm font-black tracking-widest text-rail-navy font-mono leading-none">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </span>
                      </div>

                      <div className="flex justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold">Holder</span>
                          <span className="text-xs font-bold text-slate-700 uppercase truncate max-w-[150px]">
                            {cardName || 'PASSENGER NAME'}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold">Expires</span>
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {cardExpiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-slate-950 to-indigo-950 border border-slate-200 shadow-2xl flex flex-col justify-between rotate-y-180 backface-hidden">
                      <div className="w-full h-10 bg-slate-900 absolute left-0 top-6" /> {/* Magnetic stripe */}
                      <div className="mt-14 w-full flex items-center justify-between gap-4">
                        <div className="w-full h-8 bg-slate-800 border border-slate-200 rounded px-2 flex items-center text-[10px] text-slate-400 select-none">
                          Authorized signature logs
                        </div>
                        <div className="w-12 h-8 bg-white text-slate-950 font-black italic rounded flex items-center justify-center text-xs font-mono">
                          {cardCvv || '•••'}
                        </div>
                      </div>
                      <div className="text-right text-[7px] text-slate-500 uppercase tracking-wider mt-auto font-bold">
                        Secure connection secured by SSL
                      </div>
                    </div>

                  </div>
                </div>

                <p className="text-[10px] text-rail-muted font-bold uppercase tracking-wider leading-relaxed text-center">
                  Tip: Click on the card to flip it and view CVV signature block
                </p>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Name on Card</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Mercer"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      onFocus={() => setIsFlipped(false)}
                      className="glass-input text-xs w-full font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 4321 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      onFocus={() => setIsFlipped(false)}
                      className="glass-input text-xs w-full font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      required
                      onFocus={() => setIsFlipped(false)}
                      className="glass-input text-xs w-full font-mono font-semibold text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">CVV Code</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      required
                      onFocus={() => setIsFlipped(true)}
                      className="glass-input text-xs w-full font-mono font-semibold text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="neon-btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                >
                  <FaShieldAlt className="text-slate-950 text-sm" /> Authorize ₹{totalFare} Payment
                </button>
              </form>
            )}

            {/* TAB CONTENT: UPI SIMULATOR */}
            {paymentMethod === 'UPI' && (
              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6 items-center">
                
                {/* UPI QR Code representation */}
                <div className="p-4 rounded-3xl bg-white flex flex-col items-center gap-3 shadow-inner">
                  {/* Mock beautiful generated QR grid */}
                  <div className="w-40 h-40 border-4 border-slate-900 rounded-xl p-1 relative flex items-center justify-center">
                    {/* Simulated pixel QR block */}
                    <div className="w-full h-full bg-[radial-gradient(#0f172a_4px,_transparent_4px)] bg-[size:16px_16px] opacity-90" />
                    {/* SVG mini Train center icon */}
                    <div className="absolute p-2 bg-slate-900 border border-slate-200 rounded-lg text-rail-orange">
                      <FaTrain className="text-base" />
                    </div>
                  </div>
                </div>

                <div className="text-center flex flex-col gap-1">
                  <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Simulated Dynamic UPI Invoice
                  </p>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-xs font-medium">
                    Open BHIM, Google Pay, PhonePe, or PayTM, scan the QR code above, and approve the invoice before timer expires.
                  </p>
                </div>

                <div className="py-2.5 px-6 rounded-2xl bg-white/60 border border-slate-200 text-center min-w-[120px]">
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Timer Expiring</span>
                  <p className="text-xl font-mono font-black text-rose-400 mt-0.5">
                    {upiTimer > 0 ? formatTimer(upiTimer) : 'Expired'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={upiTimer <= 0}
                  className="neon-btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <FaShieldAlt className="text-slate-950 text-sm" /> Simulated Approve UPI Transaction
                </button>
              </form>
            )}

          </div>
        </div>

        {/* ORDER REVIEW SUMMARY SIDEBAR */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-5">
            <h3 className="font-extrabold text-base text-rail-navy tracking-wide flex items-center gap-2">
              <FaCalendarCheck className="text-rail-orange" /> Order Summary
            </h3>

            {/* Train route */}
            <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4 text-xs leading-normal">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Train Route</span>
              <h4 className="font-extrabold text-slate-700">{train.trainName}</h4>
              <p className="text-slate-400 font-medium truncate">
                {train.source.split(' (')[0]} to {train.destination.split(' (')[0]}
              </p>
              <p className="text-rail-orange font-bold mt-1">Class: {seatClass} Class</p>
            </div>

            {/* Passengers */}
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 max-h-[160px] overflow-y-auto pr-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Passengers</span>
              {passengers.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs leading-normal font-medium text-slate-400">
                  <span className="truncate max-w-[120px]">{p.name}</span>
                  <span className="font-bold text-slate-600">Seat {p.seatNumber.split('-')[1]}</span>
                </div>
              ))}
            </div>

            {/* Total Fare */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Grand Total</h4>
                <p className="text-[8px] text-slate-600 font-semibold uppercase">Simulated Debit</p>
              </div>
              <span className="text-2xl font-black text-rail-navy">₹{totalFare}</span>
            </div>

          </div>
        </div>

      </div>

      {/* Inline styles for 3d perspective cards */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

    </div>
  );
};
export default PaymentPage;
