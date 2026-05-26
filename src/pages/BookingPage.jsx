import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaChevronRight, FaTicketAlt, FaChair, FaTrain } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';

export const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const seatClass = queryParams.get('class') || 'SL';

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Seats Selection
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  
  // Passenger Form States: Array of { name, age, gender, seatNumber, seatClass }
  const [passengerDetails, setPassengerDetails] = useState([]);

  const fetchTrain = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`/api/trains/${id}`);
      setTrain(data);
      
      // Generate some realistic occupied seats based on train ID and class
      const occupied = [];
      const totalGridSeats = 60;
      // Seed a pseudo-random generator with train number to keep occupied seats consistent per load
      const trainSeed = parseInt(data.trainNumber) || 12345;
      for (let i = 1; i <= totalGridSeats; i++) {
        const isOccupied = ((i * trainSeed) % 100) < 45; // ~45% occupied seats
        if (isOccupied) {
          occupied.push(`${seatClass}-${i}`);
        }
      }
      setOccupiedSeats(occupied);

    } catch (err) {
      console.error(err);
      setError('Connection refused. Loading mock train booking schema.');
      
      // Mock Fallback
      setTrain({
        _id: id,
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
        stations: []
      });

      // Simple occupied list for mock
      const occupied = [];
      for (let i = 1; i <= 60; i++) {
        if (i % 3 === 0 || i % 7 === 0) {
          occupied.push(`${seatClass}-${i}`);
        }
      }
      setOccupiedSeats(occupied);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTrain();
  }, [id, seatClass, user]);

  const handleSeatClick = (seatCode) => {
    if (occupiedSeats.includes(seatCode)) return; // Occupied

    let updatedSeats = [];
    if (selectedSeats.includes(seatCode)) {
      // De-select
      updatedSeats = selectedSeats.filter((s) => s !== seatCode);
    } else {
      // Limit to max 6 seats per PNR
      if (selectedSeats.length >= 6) {
        alert('Maximum of 6 seats can be booked in a single PNR ticket!');
        return;
      }
      updatedSeats = [...selectedSeats, seatCode];
    }
    setSelectedSeats(updatedSeats);

    // Sync Passenger details input list dynamically!
    const newPassengerDetails = updatedSeats.map((seat, index) => {
      // Keep existing data if present to avoid overwriting typed fields
      const existing = passengerDetails.find((p) => p.seatNumber === seat);
      return (
        existing || {
          name: '',
          age: '',
          gender: 'male',
          seatNumber: seat,
          seatClass: seatClass,
        }
      );
    });
    setPassengerDetails(newPassengerDetails);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const getSafeMapValue = (map, key) => {
    if (!map) return 0;
    if (typeof map.get === 'function') {
      return map.get(key) || 0;
    }
    return map[key] || 0;
  };

  // Fare calculations
  const baseFare = train ? getSafeMapValue(train.fare, seatClass) : 0;
  const numPassengers = selectedSeats.length;
  const subtotal = baseFare * numPassengers;
  const gstTax = Math.floor(subtotal * 0.05); // 5% GST
  const totalFare = subtotal + gstTax;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (numPassengers === 0) return;

    // Validate details
    const isValid = passengerDetails.every((p) => p.name.trim() && p.age);
    if (!isValid) {
      alert('Please fill out all passenger names and ages!');
      return;
    }

    // Direct redirection carrying parameters in router states
    navigate('/payment', {
      state: {
        train,
        passengers: passengerDetails,
        totalFare,
        seatClass,
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error && !train) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      
      {/* HEADER CRUMB */}
      <section className="flex flex-col gap-1 border-b border-slate-200 pb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          Train Booking <FaChevronRight className="text-[8px]" /> {train.trainName}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-rail-navy">Visual Passenger Allocation</h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SEAT GRID COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 flex-wrap gap-3">
              <h3 className="font-extrabold text-base text-rail-navy tracking-wide flex items-center gap-2">
                <span className="w-1 h-5 bg-rail-orange rounded-full" /> Click Seats to Book
              </h3>

              {/* Legends */}
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#060c18] border border-slate-200" /> Free
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-rail-orange shadow-[0_0_8px_rgba(0,242,254,0.4)]" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-white opacity-40 border border-transparent" /> Occupied
                </span>
              </div>
            </div>

            {/* Coach layout visualizer */}
            <div className="w-full bg-[#040915] p-5 rounded-2xl border border-slate-200 flex flex-col items-center gap-4 mb-4">
              <div className="w-full text-center py-1 bg-white/5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Engine / Front direction ➔
              </div>

              {/* 60 Seats grid: 5 columns per row, 12 rows */}
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-3 max-w-[500px]">
                {Array.from({ length: 60 }).map((_, idx) => {
                  const seatNo = idx + 1;
                  const seatCode = `${seatClass}-${seatNo}`;
                  const isOccupied = occupiedSeats.includes(seatCode);
                  const isSelected = selectedSeats.includes(seatCode);

                  return (
                    <button
                      key={seatNo}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => handleSeatClick(seatCode)}
                      title={`Seat #${seatNo} (${isOccupied ? 'Occupied' : 'Available'})`}
                      className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center text-[10px] font-black tracking-tighter transition-all duration-200 select-none cursor-pointer ${
                        isOccupied
                          ? 'bg-white border-transparent opacity-20 cursor-not-allowed text-slate-700'
                          : isSelected
                          ? 'bg-rail-orange border-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)] scale-105'
                          : 'bg-[#060c18] border-slate-200 text-slate-400 hover:border-slate-500 hover:text-rail-navy'
                      }`}
                    >
                      <FaChair className="text-[10px] opacity-75" />
                      {seatNo}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC PASSENGER FORM PANEL */}
          <AnimatePresence>
            {numPassengers > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="glass-panel p-6 rounded-2xl border border-slate-200"
              >
                <h3 className="font-extrabold text-base text-rail-navy border-b border-slate-200 pb-4 mb-5 tracking-wide">
                  Passenger Booking Information ({numPassengers})
                </h3>

                <form onSubmit={handleProceedToPayment} className="flex flex-col gap-6">
                  {passengerDetails.map((passenger, index) => (
                    <div
                      key={passenger.seatNumber}
                      className="p-5 rounded-2xl bg-white/5 border border-slate-200 flex flex-col gap-4 relative"
                    >
                      <span className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-gradient-to-r from-rail-saffron to-primary-600 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                        Seat {passenger.seatNumber.split('-')[1]}
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Passenger name"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            required
                            className="glass-input text-xs !py-2.5 w-full font-semibold"
                          />
                        </div>

                        {/* Age */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                            Age (in years)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 24"
                            value={passenger.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            required
                            min={2}
                            max={110}
                            className="glass-input text-xs !py-2.5 w-full font-semibold"
                          />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                            Gender
                          </label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            className="glass-input text-xs !py-2.5 w-full text-slate-600 font-semibold"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="neon-btn-primary py-4 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Proceed to Simulated Payment Gateway <FaChevronRight className="text-[10px]" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FARES AND INVOICE SIDEBAR */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-5">
            <h3 className="font-extrabold text-base text-rail-navy tracking-wide flex items-center gap-2">
              <FaTicketAlt className="text-rail-orange" /> Fare Breakdown
            </h3>

            <div className="flex flex-col gap-3 text-xs border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Base Fare ({seatClass} Class)</span>
                <span className="font-bold text-slate-600">₹{baseFare} per ticket</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Selected Passenger(s)</span>
                <span className="font-bold text-slate-600">{numPassengers} seat(s)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Convenience Charges</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <s>₹60</s> Free (Festival)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Rail Tax (GST 5%)</span>
                <span className="font-bold text-slate-600">₹{gstTax}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Total Fare</h4>
                <p className="text-[9px] text-slate-600 font-medium">Inclusive of all taxes</p>
              </div>
              <span className="text-3xl font-black text-rail-navy">₹{totalFare}</span>
            </div>

            {numPassengers === 0 && (
              <p className="text-[10px] text-slate-500 text-center py-4 bg-white/40 rounded-xl border border-dashed border-slate-200 leading-relaxed font-bold uppercase">
                Select passenger seats from the coach grid to calculate fare invoice
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default BookingPage;
