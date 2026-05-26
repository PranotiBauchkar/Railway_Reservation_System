import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowLeft, FaMars, FaVenus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { IconInput } from '../components/IconInput';

// ============================================
// 1. LOGIN COMPONENT
// ============================================
export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200"
      >
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <h2 className="text-3xl font-black text-rail-navy tracking-wide">Welcome Back</h2>
          <p className="text-rail-muted text-sm">Enter details to board your terminal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <IconInput
            icon={FaEnvelope}
            label="Email Address"
            type="email"
            placeholder="e.g. user@smartrail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputClassName="text-sm"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="field-label">Password</span>
              <Link to="/forgot-password" className="text-xs font-semibold text-rail-orange hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input input-with-icon pr-11 text-sm w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rail-navy cursor-pointer z-10"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="neon-btn-primary w-full py-3.5 font-bold uppercase text-sm mt-2">
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have a passenger account?{' '}
          <Link to="/register" className="font-extrabold text-rail-orange hover:underline">
            Register Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// 2. REGISTER COMPONENT
// ============================================
export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone || !age) return;

    setLoading(true);
    setError('');

    try {
      await register({
        fullName,
        email,
        password,
        phone,
        gender,
        age: Number(age),
        address,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-slate-200"
      >
        <div className="text-center mb-6 flex flex-col gap-1">
          <h2 className="text-3xl font-black text-rail-navy tracking-wide">Register Account</h2>
          <p className="text-rail-muted text-sm">Create credentials for smart boarding passes</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconInput
              icon={FaUser}
              label="Full Name"
              type="text"
              placeholder="Alex Mercer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              inputClassName="text-sm"
            />
            <IconInput
              icon={FaEnvelope}
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              inputClassName="text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconInput
              icon={FaLock}
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputClassName="text-sm"
            />
            <IconInput
              icon={FaPhone}
              label="Phone Number"
              type="text"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              inputClassName="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="glass-input text-sm w-full text-slate-600"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-2">
              <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">Age (in years)</label>
              <input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge}
                onChange={(e) => setAge(e.target.value)}
                required
                min={5}
                max={110}
                className="glass-input text-sm w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">Mailing Address</label>
            <input
              type="text"
              placeholder="123 Sky Tower, Sector 4, Mumbai"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="glass-input text-sm w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neon-btn-primary w-full py-3.5 font-bold uppercase tracking-wider text-xs md:text-sm mt-3"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have a passenger account?{' '}
          <Link to="/login" className="font-extrabold text-rail-orange hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// 3. FORGOT PASSWORD COMPONENT
// ============================================
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      setMessage(data.message);
      
      // Auto redirect to reset page with pre-filled email
      setTimeout(() => {
        navigate(`/reset-password?email=${email}&otp=${data.otp || ''}`);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'No profile found with this email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200"
      >
        <Link to="/login" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rail-navy mb-6 uppercase tracking-wider">
          <FaArrowLeft /> Back to login
        </Link>

        <div className="text-center mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-black text-rail-navy tracking-wide">Recover Password</h2>
          <p className="text-slate-400 text-xs">A simulated 6-digit OTP verification code will be compiled</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <IconInput
            icon={FaEnvelope}
            label="Email Address"
            type="email"
            placeholder="Enter email to get OTP"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputClassName="text-sm"
          />
          <button type="submit" disabled={loading} className="neon-btn-primary w-full py-3.5 font-bold uppercase text-sm mt-2">
            {loading ? 'Transmitting Code...' : 'Transmit OTP Code'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ============================================
// 4. RESET PASSWORD COMPONENT
// ============================================
export const ResetPassword = () => {
  const navigate = useNavigate();
  // Read params if pre-filled
  const query = new URLSearchParams(window.location.search);
  const initialEmail = query.get('email') || '';
  const initialOtp = query.get('otp') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !password) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await axios.post('/api/auth/reset-password', { email, otp, password });
      setSuccess('Credentials reset successfully! Redirecting to login terminal...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failure or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200"
      >
        <div className="text-center mb-6 flex flex-col gap-1.5">
          <h2 className="text-2xl font-black text-rail-navy tracking-wide">Enter Verification</h2>
          <p className="text-slate-400 text-xs">Complete OTP verification to configure a new password</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input text-sm w-full"
            />
          </div>

          {/* OTP */}
          <div className="flex flex-col gap-2">
            <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">Verification OTP (6-digits)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="e.g. 583492"
              className="glass-input text-sm text-center tracking-widest font-black w-full"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-rail-muted font-bold text-xs uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="Create new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input text-sm w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neon-btn-primary w-full py-3.5 font-bold uppercase tracking-wider text-xs md:text-sm mt-2"
          >
            {loading ? 'Configuring credentials...' : 'Update & Verify Credentials'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
