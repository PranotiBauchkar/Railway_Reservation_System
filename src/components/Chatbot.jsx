import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your Railway Assistant. Ask about bookings, refunds, seat classes, or PNR status.',
      time: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      let botResponseText =
        "Ask me about 'refund', 'cancellation', 'seat classes', 'Vande Bharat', or 'PNR check'.";
      const cleanInput = inputText.toLowerCase();

      if (cleanInput.includes('hello') || cleanInput.includes('hi')) {
        botResponseText = 'Hello! How can I help with your train journey today?';
      } else if (cleanInput.includes('refund') || cleanInput.includes('cancel')) {
        botResponseText =
          'Cancellations get a full refund to your original payment method. Use My Bookings on your dashboard.';
      } else if (cleanInput.includes('seat') || cleanInput.includes('class')) {
        botResponseText =
          'Classes: 1A (First AC), 2A (Two Tier AC), 3A (Three Tier AC), SL (Sleeper).';
      } else if (cleanInput.includes('pnr') || cleanInput.includes('ticket')) {
        botResponseText = 'Enter your 10-digit PNR on the home page or open your ticket from My Bookings.';
      }

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'bot', text: botResponseText, time: new Date() },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-[320px] sm:w-[360px] h-[450px] mb-4 rounded-2xl overflow-hidden glass-panel shadow-card flex flex-col"
          >
            <div className="bg-gradient-to-r from-rail-navy to-rail-blue py-4 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/15">
                  <FaRobot className="text-white text-base" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase">Rail Assistant</h4>
                  <span className="text-[9px] font-bold text-green-300">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3 text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-rail-orange text-white font-medium rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about refunds, PNR..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="glass-input !py-2 text-xs w-full"
              />
              <button type="submit" className="p-2.5 rounded-xl neon-btn-primary cursor-pointer shrink-0">
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full neon-btn-primary shadow-lg cursor-pointer z-50"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-xl" />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
