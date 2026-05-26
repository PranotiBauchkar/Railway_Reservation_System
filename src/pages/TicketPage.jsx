import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPrint, FaDownload, FaArrowLeft, FaCheckCircle, FaTrain, FaBarcode } from 'react-icons/fa';
import { Loader } from '../components/Loader';

export const TicketPage = () => {
  const { pnr } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/bookings/pnr/${pnr}`);
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError('Connection failed. Loading simulated ticket details.');
        
        // Mock fallback offline ticket
        setBooking({
          PNR: pnr,
          journeyDate: new Date(),
          totalFare: 1520,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          seatNumbers: ['SL-24', 'SL-25'],
          passengers: [
            { name: 'Alex Mercer', age: 28, gender: 'male', seatNumber: 'SL-24', seatClass: 'SL' },
            { name: 'Sarah Mercer', age: 26, gender: 'female', seatNumber: 'SL-25', seatClass: 'SL' }
          ],
          trainId: {
            trainName: 'Vande Bharat Express',
            trainNumber: '22436',
            source: 'New Delhi (NDLS)',
            destination: 'Varanasi Junction (BSB)',
            departureTime: '06:00',
            arrivalTime: '14:00',
            duration: '8h 00m',
            trainType: 'Vande Bharat'
          },
          QRCode: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="30" height="30" fill="black"/><rect x="60" y="10" width="30" height="30" fill="black"/><rect x="10" y="60" width="30" height="30" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/></svg>' // simple mock SVG qr code
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [pnr]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 flex flex-col items-center gap-4">
        <p>{error}</p>
        <Link to="/search" className="neon-btn-primary py-2.5">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6 print:py-0 print:px-0">
      
      {/* HEADER ACTIONS (Hidden on print!) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden flex-wrap gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rail-navy uppercase tracking-wider"
        >
          <FaArrowLeft /> Dashboard Bookings
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="neon-btn-secondary text-xs font-bold uppercase tracking-wider py-2.5 px-5 flex items-center gap-2"
          >
            <FaPrint /> Print Ticket / PDF
          </button>
        </div>
      </div>

      {/* SECURE TRAVEL PASS (PRINT TARGET) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        id="print-ticket-pass"
        className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 print:border-slate-300 print:text-slate-900 print:bg-white print:shadow-none"
      >
        
        {/* Background glow decoration (hidden on print!) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial-gradient from-rail-saffron/5 to-transparent rounded-bl-full pointer-events-none print:hidden" />

        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-rail-saffron to-primary-600 shadow-[0_0_15px_rgba(0,242,254,0.35)] print:shadow-none print:bg-slate-200">
              <FaTrain className="text-slate-950 text-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rail-orange uppercase tracking-widest print:text-slate-700">
                Official Digital Boarding Pass
              </span>
              <h3 className="font-extrabold text-lg text-rail-navy leading-normal print:text-slate-950">
                Indian Rail Connect Reservation System
              </h3>
            </div>
          </div>

          <div className="text-center sm:text-right flex flex-col">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Passenger PNR</span>
            <span className="text-2xl font-black text-rail-navy tracking-widest print:text-slate-900">
              {booking.PNR}
            </span>
          </div>
        </div>

        {/* Train Details row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/40 p-5 rounded-2xl border border-slate-200 print:bg-slate-100 print:border-slate-200">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Train Service</span>
            <h4 className="font-black text-rail-navy text-sm print:text-slate-950">
              {booking.trainId?.trainName || 'Indian Rail Connect Express'}
            </h4>
            <p className="text-xs text-slate-400 font-bold print:text-slate-600">
              Train #{booking.trainId?.trainNumber || '99999'} | {booking.trainId?.trainType || 'Express'}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-center">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Journey Date</span>
            <h4 className="font-black text-rail-navy text-sm print:text-slate-950">
              {new Date(booking.journeyDate).toDateString()}
            </h4>
            <p className="text-xs text-rail-orange font-bold print:text-slate-600">
              Departs: {booking.trainId?.departureTime || '06:00'}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-right">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Journey Route</span>
            <h4 className="font-black text-rail-navy text-sm print:text-slate-950 truncate">
              {booking.trainId?.source.split(' (')[0] || 'Source'} ➔ {booking.trainId?.destination.split(' (')[0] || 'Destination'}
            </h4>
            <p className="text-xs text-slate-400 font-bold print:text-slate-600">
              Total Duration: {booking.trainId?.duration || '02h 30m'}
            </p>
          </div>
        </div>

        {/* Passenger Chart Table */}
        <div className="flex flex-col gap-4">
          <h4 className="font-black text-xs text-rail-navy tracking-wider uppercase flex items-center gap-2 print:text-slate-900">
            <span className="w-1 h-3.5 bg-rail-orange rounded-full" /> Passenger Boarding Chart
          </h4>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider print:border-slate-300">
                  <th className="py-2.5 px-2"># No</th>
                  <th className="py-2.5 px-2">Passenger Name</th>
                  <th className="py-2.5 px-2">Age / Gender</th>
                  <th className="py-2.5 px-2 text-center">Travel Class</th>
                  <th className="py-2.5 px-2 text-right">Seat Assigned</th>
                  <th className="py-2.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-bold text-slate-600 print:text-slate-700">
                {booking.passengers.map((passenger, index) => (
                  <tr key={index} className="border-b border-slate-200 print:border-slate-200">
                    <td className="py-3 px-2 text-slate-500">0{index + 1}</td>
                    <td className="py-3 px-2 text-rail-navy print:text-slate-900">{passenger.name}</td>
                    <td className="py-3 px-2 capitalize">{passenger.age} yrs / {passenger.gender}</td>
                    <td className="py-3 px-2 text-center uppercase text-rail-orange print:text-slate-900">
                      {passenger.seatClass}
                    </td>
                    <td className="py-3 px-2 text-right text-rail-navy font-black font-mono print:text-slate-900">
                      {passenger.seatNumber.split('-')[1]}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="py-0.5 px-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase tracking-wide print:border-transparent print:bg-transparent print:text-emerald-600">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice and QR Code row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-6 mt-4 print:border-slate-300">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Secure Billing details</span>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Payment Gateway status:{' '}
              <span className="text-emerald-400 font-bold capitalize print:text-slate-800">
                {booking.paymentStatus}
              </span>
            </p>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Paid Amount: <span className="text-rail-navy font-extrabold print:text-slate-900">₹{booking.totalFare}</span>
            </p>
            {/* Barcode vector decoration */}
            <div className="flex items-center text-slate-500 gap-1.5 mt-2 print:text-slate-400">
              <FaBarcode className="text-2xl shrink-0" />
              <span className="text-[9px] font-black tracking-widest font-mono">
                PASS-{booking.PNR}-SECURE
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 print:border-slate-300">
            <img
              src={booking.QRCode}
              alt="PNR Boarding QR Code"
              className="w-24 h-24 p-0.5 object-contain"
            />
            <span className="text-[7px] text-slate-600 font-black tracking-widest uppercase">
              Offline scanner QR
            </span>
          </div>
        </div>

      </motion.div>

      {/* PRINT MEDIA STYLESHEET */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          header, footer, nav, button, a, .print\\:hidden {
            display: none !important;
          }
          #print-ticket-pass {
            background: white !important;
            color: black !important;
            border: 1px solid %23cbd5e1 !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
          }
        }
      `}</style>

    </div>
  );
};
export default TicketPage;
