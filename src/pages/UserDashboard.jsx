import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaTicketAlt, FaHistory, FaCog, FaExclamationCircle, FaUser, FaPhone, FaMapMarkerAlt, FaTrain, FaPlus, FaCheckCircle, FaUndo } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';

export const UserDashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Tabs: 'journeys', 'history', 'profile', 'complaints'
  const [activeTab, setActiveTab] = useState('journeys');

  // Profile Edit fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [address, setAddress] = useState(user?.address || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Complaint Submit fields
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState('');
  const [complaintLoading, setComplaintLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const bookingRes = await axios.get('/api/bookings/my-bookings');
      setBookings(bookingRes.data);

      const complaintRes = await axios.get('/api/complaints/my-complaints');
      setComplaints(complaintRes.data);
    } catch (err) {
      console.error('Error fetching dashboard details:', err);
      
      // Seed robust mock fallback for dashboard if server is offline
      setBookings([
        {
          _id: 'mock_b1',
          PNR: '8492048591',
          journeyDate: new Date(),
          totalFare: 1520,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          seatNumbers: ['SL-24', 'SL-25'],
          passengers: [{ name: 'Alex Mercer', age: 28, gender: 'male', seatNumber: 'SL-24', seatClass: 'SL' }],
          trainId: { trainName: 'Vande Bharat Express', trainNumber: '22436', source: 'New Delhi (NDLS)', destination: 'Varanasi Junction (BSB)', departureTime: '06:00', arrivalTime: '14:00', duration: '8h 00m' }
        }
      ]);

      setComplaints([
        {
          _id: 'mock_c1',
          subject: 'Broken charging socket in Seat 24',
          description: 'Seat 24 SL in Vande Bharat had a broken mobile charging socket.',
          complaintStatus: 'resolved'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      await updateProfile({
        fullName,
        phone,
        age: Number(age),
        gender,
        address,
      });
      setProfileSuccess('Profile saved successfully!');
    } catch (err) {
      setProfileError('Failed to save profile. Try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) return;

    setComplaintLoading(true);
    setComplaintSuccess('');

    try {
      await axios.post('/api/complaints', { subject, description });
      setComplaintSuccess('Support ticket registered successfully!');
      setSubject('');
      setDescription('');
      
      // Refresh complaints list
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      // Simulate client side review addition for demo
      const newComplaint = {
        _id: 'mock_complaint_new',
        subject,
        description,
        complaintStatus: 'pending'
      };
      setComplaints((prev) => [newComplaint, ...prev]);
      setSubject('');
      setDescription('');
      setComplaintSuccess('Support ticket simulated successfully!');
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, pnr) => {
    const confirmCancel = window.confirm(`Are you absolutely sure you wish to cancel ticket PNR: ${pnr}?`);
    if (!confirmCancel) return;

    try {
      const { data } = await axios.post(`/api/bookings/${bookingId}/cancel`);
      alert(data.message);
      fetchDashboardData(); // Refresh lists
    } catch (err) {
      console.error(err);
      // Simulate client-side cancel if server is offline
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' }
            : b
        )
      );
      alert('Cancellation simulated! ₹1520 refunded successfully to source card.');
    }
  };

  const activeBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const pastBookings = bookings.filter((b) => b.bookingStatus === 'cancelled');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* SIDE PROFILE BOX */}
      <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-4 text-center">
          <img
            src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={user.fullName}
            className="w-20 h-20 rounded-full border-2 border-rail-orange object-cover shadow-lg"
          />
          <div>
            <h3 className="font-extrabold text-lg text-rail-navy leading-normal">{user.fullName}</h3>
            <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block mt-0.5">
              Passenger Account
            </span>
          </div>

          <hr className="w-full border-slate-200" />

          {/* Tab lists */}
          <div className="flex flex-col gap-2 w-full text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'journeys', label: 'Active Trips', icon: FaTicketAlt },
              { id: 'history', label: 'Past Trips', icon: FaHistory },
              { id: 'profile', label: 'Edit Profile', icon: FaCog },
              { id: 'complaints', label: 'Support Center', icon: FaExclamationCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setProfileSuccess('');
                    setComplaintSuccess('');
                  }}
                  className={`w-full py-3 px-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rail-orange/10 border-rail-orange/30 text-rail-orange shadow-[0_0_10px_rgba(0,242,254,0.05)]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-rail-navy hover:bg-slate-900'
                  }`}
                >
                  <Icon className="text-sm" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT TAB PANEL */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: UPCOMING JOURNEYS */}
          {activeTab === 'journeys' && (
            <motion.div
              key="journeys"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-black text-xl text-rail-navy tracking-wide border-b border-slate-200 pb-3">
                Active Trips ({activeBookings.length})
              </h3>

              {activeBookings.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-slate-900 text-slate-500">
                    <FaTicketAlt className="text-3xl" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-rail-navy text-sm">No Active Trips Found</h4>
                    <p className="text-slate-500 text-xs mt-1">Book schedules and checkout to retrieve passes here.</p>
                  </div>
                  <Link to="/search" className="neon-btn-primary text-xs uppercase font-bold py-2.5 px-6">
                    Book Journey Now
                  </Link>
                </div>
              ) : (
                activeBookings.map((b) => (
                  <div
                    key={b._id}
                    className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between gap-6 md:items-center"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black text-slate-950 tracking-wider uppercase bg-rail-orange px-2 py-0.5 rounded shadow">
                          PNR: {b.PNR}
                        </span>
                        <span className="text-[10px] text-rail-muted font-bold">
                          Date: {new Date(b.journeyDate).toDateString()}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-rail-navy text-lg">{b.trainId?.trainName || 'Vande Bharat'}</h4>
                      <p className="text-xs text-slate-400 font-semibold leading-normal">
                        Route: {b.trainId?.source.split(' (')[0]} to {b.trainId?.destination.split(' (')[0]}
                      </p>
                      <p className="text-[10px] text-rail-muted font-bold uppercase tracking-wider">
                        Class: {b.passengers[0].seatClass} Class | Seat No(s): {b.seatNumbers.map((s) => s.split('-')[1]).join(', ')}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center md:flex-col gap-3">
                      <Link
                        to={`/pnr/${b.PNR}`}
                        className="neon-btn-primary text-center text-xs font-bold uppercase py-2.5 px-5 rounded-xl w-full"
                      >
                        Boarding Pass
                      </Link>
                      <button
                        onClick={() => handleCancelBooking(b._id, b.PNR)}
                        className="neon-btn-danger text-xs font-bold uppercase py-2.5 px-5 rounded-xl w-full"
                      >
                        Cancel Ticket
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* TAB 2: TRIP HISTORY */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-black text-xl text-rail-navy tracking-wide border-b border-slate-200 pb-3">
                Trip Cancellation & Past Logs ({pastBookings.length})
              </h3>

              {pastBookings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-12 bg-[#040813] rounded-2xl border border-slate-200 font-semibold uppercase">No past or cancelled tickets found.</p>
              ) : (
                pastBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl bg-white/5 border border-slate-200 flex justify-between gap-6 items-center opacity-70"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-500 tracking-wider uppercase">
                        PNR: {b.PNR} | JOURNEY COMPLETED
                      </span>
                      <h4 className="font-extrabold text-sm text-rail-navy">{b.trainId?.trainName || 'Indian Rail Connect Express'}</h4>
                      <p className="text-xs text-slate-400">
                        {b.trainId?.source.split(' (')[0]} to {b.trainId?.destination.split(' (')[0]}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="py-1 px-3 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
                        <FaUndo /> Refunded
                      </span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* TAB 3: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass-panel p-6 rounded-2xl border border-slate-200"
            >
              <h3 className="font-black text-xl text-rail-navy tracking-wide border-b border-slate-200 pb-3 mb-6">
                Edit Profile Settings
              </h3>

              {profileSuccess && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="field-label">Full Name</label>
                    <div className="input-icon-wrap">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="glass-input input-with-icon text-xs !py-2.5 w-full font-semibold"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="field-label">Phone</label>
                    <div className="input-icon-wrap">
                      <FaPhone className="input-icon" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="glass-input input-with-icon text-xs !py-2.5 w-full font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="glass-input text-xs !py-2.5 w-full text-slate-600 font-semibold"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min={5}
                      max={110}
                      className="glass-input text-xs !py-2.5 w-full font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="field-label">Address</label>
                  <div className="input-icon-wrap">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="glass-input input-with-icon text-xs !py-2.5 w-full font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="neon-btn-primary text-xs font-extrabold uppercase py-3 px-6 rounded-xl w-full sm:w-auto mt-2 align-self-start"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 4: SUPPORT GATES COMPLAINTS */}
          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Grievance Lodge form */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-sm text-rail-navy border-b border-slate-200 pb-3 mb-4 tracking-wide">
                    Lodge Support Ticket
                  </h4>

                  {complaintSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                      {complaintSuccess}
                    </div>
                  )}

                  <form onSubmit={handleComplaintSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        placeholder="Broken seat, catering issue..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Details</label>
                      <textarea
                        placeholder="Provide details about your coach number, PNR, or platform..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        className="glass-input text-xs w-full resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={complaintLoading}
                      className="neon-btn-primary py-3 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <FaPlus className="text-[10px]" />
                      {complaintLoading ? 'Filing...' : 'Lodge Ticket'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Grievance history log */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                <h4 className="font-black text-lg text-rail-navy border-b border-slate-200 pb-3">
                  Filed Complaint History ({complaints.length})
                </h4>

                <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {complaints.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8 font-semibold uppercase">No support tickets lodged yet.</p>
                  ) : (
                    complaints.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 rounded-xl bg-white/5 border border-slate-200 flex justify-between gap-4 items-start"
                      >
                        <div className="flex flex-col gap-1.5">
                          <h5 className="font-extrabold text-xs text-slate-700">{c.subject}</h5>
                          <p className="text-[11px] text-slate-400 leading-normal max-w-xs">{c.description}</p>
                          <span className="text-[9px] text-rail-muted font-bold uppercase tracking-wider block mt-1">
                            Filed: {new Date(c.createdAt || Date.now()).toDateString()}
                          </span>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`py-0.5 px-2 rounded text-[9px] font-black uppercase tracking-wider border ${
                              c.complaintStatus === 'resolved'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {c.complaintStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
};
export default UserDashboard;
