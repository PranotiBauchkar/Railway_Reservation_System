import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrain, FaBars, FaTimes, FaSignOutAlt, FaChartLine, FaHistory } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Trains', path: '/search' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rail-blue to-rail-navy shadow-md group-hover:shadow-lg transition-all">
            <FaTrain className="text-white text-xl" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="brand-title">Indian Rail Connect</span>
            <span className="brand-subtitle">Official Booking Portal</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative font-semibold text-sm transition-colors hover:text-rail-orange ${
                isActive(link.path) ? 'text-rail-orange' : 'text-slate-600'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-rail-orange rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rail-navy text-white hover:bg-rail-blue transition-all text-sm font-semibold btn-with-icon"
                >
                  <FaChartLine className="shrink-0" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rail-blue/10 border border-rail-blue/30 text-rail-blue hover:bg-rail-blue/20 transition-all text-sm font-semibold"
                >
                  <FaHistory />
                  My Bookings
                </Link>
              )}

              <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200">
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border-2 border-rail-blue/30 object-cover"
                />
                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-sm" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="neon-btn-secondary text-sm !py-2 px-5">
                Login
              </Link>
              <Link to="/register" className="neon-btn-primary text-sm !py-2 px-5">
                Register
              </Link>
              <Link
                to="/admin/login"
                className="text-xs font-bold text-rail-navy border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Admin
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-rail-navy cursor-pointer"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-4 p-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-base font-semibold py-1 ${
                    isActive(link.path) ? 'text-rail-orange' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-200" />
              {user ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleLogout}
                    className="py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl border-2 border-rail-blue text-rail-blue font-semibold text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl neon-btn-primary text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
