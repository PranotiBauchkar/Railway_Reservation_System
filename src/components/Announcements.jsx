import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn } from 'react-icons/fa';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get('/api/announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error('Announcements fetch error:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-rail-navy via-rail-blue to-rail-navy border-b border-rail-orange/40 py-2.5 px-4 overflow-hidden flex items-center gap-4">
      <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wider uppercase shrink-0 bg-rail-saffron px-3 py-1 rounded-md shadow-sm">
        <FaBullhorn />
        Live Updates
      </div>
      <div className="relative w-full overflow-hidden h-5 flex items-center">
        <div className="absolute whitespace-nowrap animate-[marquee_30s_linear_infinite] flex items-center gap-24 text-xs md:text-sm text-white/90 font-medium">
          {announcements.map((a) => (
            <span key={a.id}>{a.text}</span>
          ))}
          {announcements.map((a) => (
            <span key={`dup-${a.id}`}>{a.text}</span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Announcements;
