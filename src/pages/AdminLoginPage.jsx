import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaShieldAlt, FaTrain } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { IconInput } from '../components/IconInput';

export const AdminLoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartrail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        setError('This account is not an administrator. Use user login for passengers.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 shadow-card"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-rail-navy to-rail-blue mb-4">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-rail-navy">Admin Control Portal</h1>
          <p className="text-rail-muted text-sm mt-2">
            Authorized staff only — manage trains, bookings & complaints
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <IconInput
            icon={FaEnvelope}
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@smartrail.com"
            required
            inputClassName="text-sm"
          />
          <IconInput
            icon={FaLock}
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            inputClassName="text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="neon-btn-primary w-full py-3.5 text-sm font-bold uppercase tracking-wide btn-with-icon"
          >
            <FaTrain />
            {loading ? 'Verifying...' : 'Enter Admin Panel'}
          </button>
        </form>

        <p className="text-center text-xs text-rail-muted mt-6">
          Demo: <span className="font-mono font-bold">admin@smartrail.com</span> /{' '}
          <span className="font-mono font-bold">adminpassword</span>
        </p>
        <p className="text-center mt-3">
          <Link to="/" className="text-sm text-rail-blue hover:text-rail-orange font-semibold">
            ← Back to passenger site
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
