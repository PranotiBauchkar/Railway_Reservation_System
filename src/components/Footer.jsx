import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrain, FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaPaperPlane } from 'react-icons/fa';

export const Footer = () => (
  <footer className="w-full mt-16 bg-white border-t border-slate-200 pt-14 pb-8 px-4 md:px-8 shadow-[0_-4px_24px_rgba(12,45,87,0.06)]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-rail-blue to-rail-navy">
            <FaTrain className="text-white text-base" />
          </div>
          <span className="font-extrabold text-lg text-rail-navy">Indian Rail Connect</span>
        </div>
        <p className="text-rail-muted text-sm leading-relaxed">
          Book train tickets online with real-time availability, digital boarding passes, and instant refunds — your trusted railway reservation partner.
        </p>
        <div className="flex items-center gap-3 mt-2">
          {[FaFacebook, FaTwitter, FaLinkedin, FaGithub].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="p-2 rounded-lg bg-slate-100 text-rail-muted hover:text-rail-orange hover:bg-orange-50 transition-all"
            >
              <Icon className="text-sm" />
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-sm text-rail-navy tracking-widest uppercase">Quick Links</h4>
        <ul className="flex flex-col gap-2.5 text-sm">
          {[
            { name: 'Home', path: '/' },
            { name: 'Search Trains', path: '/search' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' },
          ].map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="text-rail-muted hover:text-rail-orange transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-sm text-rail-navy tracking-widest uppercase">Help & Policies</h4>
        <ul className="flex flex-col gap-2.5 text-sm text-rail-muted">
          {['Cancellation Rules', 'Waiting List', 'Refund Policy', 'Travel Guidelines'].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-rail-orange transition-colors">{item}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-sm text-rail-navy tracking-widest uppercase">Newsletter</h4>
        <p className="text-rail-muted text-sm">Get fare alerts and festival booking updates.</p>
        <div className="flex items-center gap-2">
          <input type="email" placeholder="Your email" className="glass-input !py-2.5 w-full text-sm" />
          <button className="p-3 rounded-xl neon-btn-primary cursor-pointer">
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>

    <hr className="border-slate-200 mb-8" />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-rail-muted">
      <p>© {new Date().getFullYear()} Indian Rail Connect — Indian Rail Connect Reservation System</p>
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-rail-orange">Privacy</a>
        <a href="#" className="hover:text-rail-orange">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;
