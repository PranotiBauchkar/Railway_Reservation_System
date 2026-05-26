import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaTrain,
  FaListAlt,
  FaDollarSign,
  FaChartBar,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendarCheck,
  FaEdit,
  FaSignOutAlt,
  FaTicketAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import { MH_STATIONS, STATION_DATALIST_ID } from '../constants/stations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';

export const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [trains, setTrains] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrain, setEditingTrain] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

  // Add Train form states
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [totalSeats, setTotalSeats] = useState(120);
  const [trainType, setTrainType] = useState('Express');
  const [runningDays, setRunningDays] = useState(['Mon', 'Wed', 'Fri']);
  
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const analyticRes = await axios.get('/api/admin/analytics');
      setAnalytics(analyticRes.data);

      const trainRes = await axios.get('/api/trains');
      setTrains(trainRes.data);

      const userRes = await axios.get('/api/admin/users');
      setUsersList(userRes.data);

      const complaintRes = await axios.get('/api/admin/complaints');
      setComplaints(complaintRes.data);

      const bookingRes = await axios.get('/api/admin/bookings');
      setBookings(bookingRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard details:', err);
      
      // Seed robust mock fallback for admin dashboard if offline
      setAnalytics({
        totalUsers: 1,
        totalTrains: 5,
        totalBookings: 12,
        totalRevenue: 18500,
        monthlyRevenue: [
          { name: 'Jan', revenue: 4500 },
          { name: 'Feb', revenue: 5200 },
          { name: 'Mar', revenue: 6800 },
          { name: 'Apr', revenue: 9400 },
          { name: 'May', revenue: 18500 },
        ],
        trainBookingStats: [
          { name: 'Vande', bookings: 25 },
          { name: 'Rajdhani', bookings: 32 },
          { name: 'Shatabdi', bookings: 14 },
          { name: 'Bullet', bookings: 58 },
          { name: 'Duronto', bookings: 8 }
        ]
      });

      setTrains([
        { _id: 't1', trainNumber: '22436', trainName: 'Vande Bharat Express', source: 'New Delhi (NDLS)', destination: 'Varanasi Junction (BSB)', departureTime: '06:00', arrivalTime: '14:00', duration: '8h 00m', trainType: 'Vande Bharat', runningDays: ['Mon', 'Fri'] }
      ]);

      setUsersList([
        { _id: 'u1', fullName: 'Alex Mercer', email: 'user@smartrail.com', phone: '9123456789', age: 28, gender: 'male', role: 'user' }
      ]);

      setComplaints([
        { _id: 'c1', userId: { fullName: 'Alex Mercer', email: 'user@smartrail.com' }, subject: 'Broken charging socket in Seat 24', description: 'Seat 24 SL in Vande Bharat had a broken mobile charging socket.', complaintStatus: 'pending' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const handleAddTrainSubmit = async (e) => {
    e.preventDefault();
    if (!trainNumber || !trainName || !source || !destination) return;

    setFormLoading(true);
    setFormSuccess('');

    try {
      await axios.post('/api/trains', {
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        totalSeats: Number(totalSeats),
        trainType,
        runningDays,
      });

      setFormSuccess('Train added successfully!');
      
      // Reset fields
      setTrainNumber('');
      setTrainName('');
      setSource('');
      setDestination('');
      setDepartureTime('');
      setArrivalTime('');
      setDuration('');

      // Refresh trains
      fetchAdminData();
    } catch (err) {
      console.error(err);
      // Simulate client side creation for demo UX
      const newTrain = {
        _id: 'mock_t_new',
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        trainType,
        runningDays,
      };
      setTrains((prev) => [newTrain, ...prev]);
      setFormSuccess('Train simulated successfully!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTrain = async (e) => {
    e.preventDefault();
    if (!editingTrain) return;
    try {
      await axios.put(`/api/trains/${editingTrain._id}`, editingTrain);
      setFormSuccess('Train schedule updated!');
      setEditingTrain(null);
      fetchAdminData();
    } catch (err) {
      setFormSuccess('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTrain = async (trainId, trainNo) => {
    const confirmDelete = window.confirm(`Are you sure you wish to delete Train #${trainNo} from the scheduled listings?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/trains/${trainId}`);
      alert('Train removed from active schedule.');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      // Simulate removal for offline demo
      setTrains((prev) => prev.filter((t) => t._id !== trainId));
      alert('Train simulated delete completed.');
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/resolve`);
      alert('Support grievance resolved.');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      // Simulate resolution offline
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, complaintStatus: 'resolved' } : c))
      );
      alert('Grievance simulated resolve completed.');
    }
  };

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'trains', label: 'Trains', icon: FaTrain },
    { id: 'bookings', label: 'Bookings', icon: FaTicketAlt },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'complaints', label: 'Complaints', icon: FaListAlt },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-rail-navy to-rail-blue text-white px-4 md:px-8 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-2xl shrink-0" />
            <div>
              <h1 className="text-xl font-black">Indian Rail Connect — Admin</h1>
              <p className="text-xs text-white/80">Logged in as {user?.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-bold px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25">
              View Site
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-rail-orange hover:opacity-90 btn-with-icon cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      <datalist id={STATION_DATALIST_ID}>
        {MH_STATIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <section className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-rail-navy">Control Panel</h2>
        <div className="flex flex-wrap gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setFormSuccess('');
                }}
                className={`py-2.5 px-4 rounded-lg btn-with-icon text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-rail-blue text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* METRIC TILES (Overview and Overview tab) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Passengers', value: analytics.totalUsers, color: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/10', icon: FaUsers },
          { label: 'Active Trains', value: analytics.totalTrains, color: 'text-purple-400 bg-purple-400/5 border-purple-400/10', icon: FaTrain },
          { label: 'Tickets Booked', value: analytics.totalBookings, color: 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10', icon: FaCalendarCheck },
          { label: 'Cumulative Revenue', value: `₹${analytics.totalRevenue}`, color: 'text-amber-400 bg-amber-400/5 border-amber-400/10', icon: FaDollarSign },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl border flex items-center justify-between gap-4 ${metric.color}`}
            >
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                  {metric.label}
                </span>
                <span className="text-2xl sm:text-3xl font-black mt-1 block">{metric.value}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/60 text-lg">
                <Icon />
              </div>
            </div>
          );
        })}
      </section>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW CHARTS */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Area Chart Monthly Revenue */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 h-[350px]">
              <h3 className="font-extrabold text-sm text-rail-navy uppercase tracking-wider">
                Monthly Income Index
              </h3>
              <div className="w-full h-full text-xs">
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={analytics.monthlyRevenue} margin={{ left: -15 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e67e22" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#e67e22' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#e67e22" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart Ticket distribution */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 h-[350px]">
              <h3 className="font-extrabold text-sm text-rail-navy uppercase tracking-wider">
                Route Passenger Ratios
              </h3>
              <div className="w-full h-full text-xs">
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={analytics.trainBookingStats} margin={{ left: -20 }}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#1a4480' }} />
                    <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                      {analytics.trainBookingStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#e67e22', '#1a4480', '#05c46b', '#f59e0b', '#ef4444'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: TRAIN MANAGEMENT */}
        {activeTab === 'trains' && (
          <motion.div
            key="trains"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Create Train form */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-sm text-rail-navy border-b border-slate-200 pb-3 mb-4 tracking-wide flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-purple-500 rounded-full" /> Scheduled Train Creator
                </h4>

                {formSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                    {formSuccess}
                  </div>
                )}

                <form onSubmit={handleAddTrainSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 12952"
                        value={trainNumber}
                        onChange={(e) => setTrainNumber(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full font-mono font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Category</label>
                      <select
                        value={trainType}
                        onChange={(e) => setTrainType(e.target.value)}
                        className="glass-input text-xs !py-2.5 w-full text-slate-600 font-bold"
                      >
                        <option value="Express">Express</option>
                        <option value="Superfast">Superfast</option>
                        <option value="Rajdhani">Rajdhani</option>
                        <option value="Shatabdi">Shatabdi</option>
                        <option value="Vande Bharat">Vande Bharat</option>
                        <option value="Bullet">Apex Bullet</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Train Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai Rajdhani"
                      value={trainName}
                      onChange={(e) => setTrainName(e.target.value)}
                      required
                      className="glass-input text-xs !py-2.5 w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Source</label>
                      <input
                        type="text"
                        list={STATION_DATALIST_ID}
                        placeholder="e.g. Kolhapur (KOP)"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Destination</label>
                      <input
                        type="text"
                        list={STATION_DATALIST_ID}
                        placeholder="e.g. Mumbai CSMT (CSMT)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Departure</label>
                      <input
                        type="text"
                        placeholder="16:55"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Arrival</label>
                      <input
                        type="text"
                        placeholder="08:35"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Duration</label>
                      <input
                        type="text"
                        placeholder="15h 40m"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        className="glass-input text-xs !py-2.5 w-full text-center"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Capacity (Seats)</label>
                    <input
                      type="number"
                      value={totalSeats}
                      onChange={(e) => setTotalSeats(e.target.value)}
                      required
                      className="glass-input text-xs !py-2.5 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="neon-btn-primary py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <FaPlus className="text-[10px]" />
                    {formLoading ? 'Registering...' : 'Complete Register Schedule'}
                  </button>
                </form>
              </div>
            </div>

            {/* Trains List table */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <h4 className="font-black text-lg text-rail-navy border-b border-slate-200 pb-3">
                Active Train Schedules ({trains.length})
              </h4>
              
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {trains.map((t) => (
                  <div
                    key={t._id}
                    className="p-4 rounded-xl bg-white/5 border border-slate-200 flex justify-between gap-4 items-center"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-purple-400 border border-purple-500/20 bg-purple-500/5 px-1.5 py-0.5 rounded uppercase">
                          {t.trainType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">#{t.trainNumber}</span>
                      </div>
                      <h5 className="font-extrabold text-sm text-rail-navy mt-1">{t.trainName}</h5>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Route: <span className="text-rail-navy font-bold">{t.source.split(' (')[0]}</span> ➔ <span className="text-rail-navy font-bold">{t.destination.split(' (')[0]}</span>
                      </p>
                      <p className="text-[10px] text-rail-muted font-bold uppercase tracking-wider">
                        Departs: {t.departureTime} | Duration: {t.duration}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingTrain({ ...t })}
                        className="p-3 rounded-xl bg-rail-blue/10 border border-rail-blue/30 text-rail-blue hover:bg-rail-blue/20 cursor-pointer"
                        title="Edit train"
                      >
                        <FaEdit className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrain(t._id, t.trainNumber)}
                        className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                        title="Delete train"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 rounded-2xl border border-slate-200"
          >
            <h3 className="font-black text-lg text-rail-navy border-b border-slate-200 pb-4 mb-4">
              All Bookings ({bookings.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-rail-muted font-bold uppercase">
                    <th className="py-2 px-2">PNR</th>
                    <th className="py-2 px-2">Passenger</th>
                    <th className="py-2 px-2">Train</th>
                    <th className="py-2 px-2">Route</th>
                    <th className="py-2 px-2">Fare</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-rail-muted">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-2 font-mono font-bold text-rail-navy">{b.PNR}</td>
                        <td className="py-3 px-2">{b.userId?.fullName || '—'}</td>
                        <td className="py-3 px-2">
                          {b.trainId?.trainName || '—'} ({b.trainId?.trainNumber || '—'})
                        </td>
                        <td className="py-3 px-2 text-rail-muted">
                          {b.trainId?.source?.split(' (')[0]} → {b.trainId?.destination?.split(' (')[0]}
                        </td>
                        <td className="py-3 px-2 font-bold">₹{b.totalFare}</td>
                        <td className="py-3 px-2 capitalize">{b.bookingStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: USER REGISTER DATABASE */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel p-5 rounded-2xl border border-slate-200"
          >
            <h3 className="font-black text-lg text-rail-navy border-b border-slate-200 pb-4 mb-4">
              Registered Passenger Directory
            </h3>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider">
                    <th className="py-2.5 px-3">Passenger</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3 text-center">Age / Gender</th>
                    <th className="py-2.5 px-3 text-center">Role</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-slate-600">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="border-b border-slate-200 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-rail-navy">{usr.fullName}</td>
                      <td className="py-3 px-3 text-slate-400 font-medium">{usr.email}</td>
                      <td className="py-3 px-3 font-mono font-medium">{usr.phone}</td>
                      <td className="py-3 px-3 text-center capitalize">{usr.age} yrs / {usr.gender}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`py-0.5 px-2 rounded-md text-[9px] uppercase tracking-wide border ${
                            usr.role === 'admin'
                              ? 'bg-purple-600/10 border-purple-500/20 text-purple-400'
                              : 'bg-white/5 border-slate-200 text-slate-400'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 4: COMPLAINT RESOLUTION */}
        {activeTab === 'complaints' && (
          <motion.div
            key="complaints"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-5"
          >
            <h3 className="font-black text-lg text-rail-navy border-b border-slate-200 pb-3">
              Passenger Grievances Inbox ({complaints.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {complaints.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 font-semibold uppercase">Inbox empty! No unresolved support grievances.</p>
              ) : (
                complaints.map((c) => {
                  const isResolved = c.complaintStatus === 'resolved';
                  return (
                    <div
                      key={c._id}
                      className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 justify-between"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <h4 className="font-extrabold text-sm text-rail-navy leading-normal truncate max-w-[200px]" title={c.subject}>
                            {c.subject}
                          </h4>
                          <span
                            className={`py-0.5 px-2 rounded text-[9px] font-black uppercase tracking-wider border ${
                              isResolved
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {c.complaintStatus}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{c.description}</p>
                        
                        <hr className="border-slate-200 my-2" />

                        <div className="flex flex-col gap-0.5 text-[10px] text-rail-muted font-bold leading-normal">
                          <p>Passenger: <span className="text-slate-600">{c.userId?.fullName || 'Alex Mercer'}</span></p>
                          <p>Email: <span className="text-slate-600 font-mono">{c.userId?.email || 'user@smartrail.com'}</span></p>
                        </div>
                      </div>

                      {!isResolved && (
                        <button
                          onClick={() => handleResolveComplaint(c._id)}
                          className="neon-btn-primary !py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 self-start mt-2"
                        >
                          <FaCheck className="text-[8px]" /> Mark Resolved
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {editingTrain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-rail-navy mb-4 flex items-center justify-between">
              Edit Train #{editingTrain.trainNumber}
              <button type="button" onClick={() => setEditingTrain(null)} className="cursor-pointer text-slate-500">
                <FaTimes />
              </button>
            </h3>
            <form onSubmit={handleUpdateTrain} className="flex flex-col gap-3">
              <input
                className="glass-input text-sm"
                value={editingTrain.trainName}
                onChange={(e) => setEditingTrain({ ...editingTrain, trainName: e.target.value })}
                placeholder="Train name"
              />
              <input
                className="glass-input text-sm"
                list={STATION_DATALIST_ID}
                value={editingTrain.source}
                onChange={(e) => setEditingTrain({ ...editingTrain, source: e.target.value })}
                placeholder="Source"
              />
              <input
                className="glass-input text-sm"
                list={STATION_DATALIST_ID}
                value={editingTrain.destination}
                onChange={(e) => setEditingTrain({ ...editingTrain, destination: e.target.value })}
                placeholder="Destination"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  className="glass-input text-sm"
                  value={editingTrain.departureTime}
                  onChange={(e) => setEditingTrain({ ...editingTrain, departureTime: e.target.value })}
                  placeholder="Departure"
                />
                <input
                  className="glass-input text-sm"
                  value={editingTrain.arrivalTime}
                  onChange={(e) => setEditingTrain({ ...editingTrain, arrivalTime: e.target.value })}
                  placeholder="Arrival"
                />
                <input
                  className="glass-input text-sm"
                  value={editingTrain.duration}
                  onChange={(e) => setEditingTrain({ ...editingTrain, duration: e.target.value })}
                  placeholder="Duration"
                />
              </div>
              <button type="submit" className="neon-btn-primary py-2.5 text-sm font-bold">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};
export default AdminDashboard;
