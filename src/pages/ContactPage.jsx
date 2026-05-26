import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

const HQ_COORDS = { lat: 28.6129, lng: 77.2111 };
const HQ_ADDRESS = 'Rail Bhawan, Central Secretariat, New Delhi, India';
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${HQ_COORDS.lat},${HQ_COORDS.lng}&hl=en&z=16&output=embed`;
const GOOGLE_MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HQ_ADDRESS)}`;

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setSuccess('');

    setTimeout(() => {
      setLoading(false);
      setSuccess('Message sent successfully! Our technical team will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-12">
      
      {/* HEADER TITLE */}
      <section className="text-center flex flex-col gap-2 mt-4">
        <h2 className="text-3xl sm:text-5xl font-black text-rail-navy tracking-wide">Get In Touch</h2>
        <p className="text-rail-muted text-sm max-w-md mx-auto leading-relaxed">
          Need booking help, waiting list advice, or invoice refunds? Reach our rail help desk team.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* HELP DESK FORM */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6">
          <h3 className="font-extrabold text-lg text-rail-navy border-b border-slate-200 pb-3">Submit Public Inquiry</h3>
          
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <FaCheckCircle className="shrink-0 text-base" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-input text-xs !py-2.5 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input text-xs !py-2.5 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Message Description</label>
              <textarea
                placeholder="Describe your inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="glass-input text-xs w-full resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-btn-primary py-3.5 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaPaperPlane className="text-[10px]" />
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* HEADQUARTERS MAPS INFO */}
        <div className="flex flex-col gap-6 w-full">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 flex flex-col gap-5">
            <h3 className="font-extrabold text-lg text-rail-navy border-b border-slate-200 pb-3">Support Terminals</h3>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-400/5 border border-cyan-400/10 text-rail-orange shrink-0">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-black">Support Hotline</p>
                  <p className="text-rail-navy mt-0.5 leading-normal">+91 1800 242 0254 (Toll-Free)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-rail-blue shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-black">Mail Desk</p>
                  <p className="text-rail-navy mt-0.5 leading-normal lowercase font-mono">support@smartrailway.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-rail-success shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-black">Central Headquarters</p>
                  <p className="text-rail-navy mt-0.5 leading-normal normal-case">Rail Bhawan, Central Secretariat, New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* GOOGLE MAP — Rail Bhawan headquarters */}
          <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-white/40">
              <div className="flex items-center gap-2 min-w-0">
                <FaMapMarkerAlt className="text-rail-orange shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Headquarters Map</p>
                  <p className="text-[10px] text-rail-muted font-semibold truncate normal-case">
                    {HQ_COORDS.lat}° N, {HQ_COORDS.lng}° E
                  </p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[10px] font-bold text-rail-orange hover:text-rail-blue flex items-center gap-1.5 uppercase tracking-wider"
              >
                Open in Maps <FaExternalLinkAlt className="text-[8px]" />
              </a>
            </div>
            <div className="relative w-full aspect-[4/3] min-h-[240px] sm:min-h-[280px] bg-slate-100">
              <iframe
                title="Rail Bhawan headquarters — Google Maps"
                src={GOOGLE_MAPS_EMBED_URL}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default ContactPage;
