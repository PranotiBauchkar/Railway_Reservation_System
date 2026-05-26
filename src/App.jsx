import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { Announcements } from './components/Announcements';
import { PageBackground } from './components/PageBackground';

import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { TrainDetailsPage } from './pages/TrainDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { TicketPage } from './pages/TicketPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Login, Register, ForgotPassword, ResetPassword } from './pages/AuthPages';
import { AdminLoginPage } from './pages/AdminLoginPage';

function getPageVariant(pathname) {
  if (pathname === '/') return 'hero';
  if (['/login', '/register', '/forgot-password', '/reset-password', '/admin/login'].includes(pathname)) {
    return 'auth';
  }
  return 'trains';
}

function AppContent() {
  const { pathname } = useLocation();
  const variant = getPageVariant(pathname);
  const isAuthPage = variant === 'auth';
  const hideChrome = isAuthPage || pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen ${isAuthPage ? 'page-background--auth' : ''}`}>
      {!hideChrome && <Announcements />}
      {!hideChrome && <Navbar />}

      <PageBackground variant={variant} className="flex-1 w-full">
        <main className="flex-1 w-full pb-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/train/:id" element={<TrainDetailsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/pnr/:pnr" element={<TicketPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </PageBackground>

      {!hideChrome && <Footer />}
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
