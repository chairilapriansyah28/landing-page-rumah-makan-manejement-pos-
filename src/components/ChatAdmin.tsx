import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, User, Sparkles } from 'lucide-react';

interface ChatAdminProps {
  onClose?: () => void;
}

export default function ChatAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages from localStorage or set initial message
  useEffect(() => {
    const stored = localStorage.getItem('mangkubumi_chat');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const initial: ChatMessage[] = [
        {
          id: 'init-1',
          sender: 'admin',
          text: 'Halo! Selamat datang di Rumah Makan Alun-alun Mangkubumi. Ada yang bisa kami bantu hari ini? 🍲',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem('mangkubumi_chat', JSON.stringify(initial));
    }
  }, []);

  // Sync messages
  const saveMessages = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem('mangkubumi_chat', JSON.stringify(updated));
    // Trigger window event so admin panel can listen to updates in real-time if open
    window.dispatchEvent(new Event('mangkubumi_chat_updated'));
  };

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Listen to admin replies
  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem('mangkubumi_chat');
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    };
    window.addEventListener('mangkubumi_chat_updated', handleUpdate);
    return () => window.removeEventListener('mangkubumi_chat_updated', handleUpdate);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInputVal('');

    // Simulate smart restaurant agent responsive feedback after a short delay
    setTimeout(() => {
      let botResponse = 'Terima kasih telah menghubungi kami. Tim kami akan segera menanggapi pesan Anda atau hubungi WhatsApp kami langsung di +62 812-3456-7890 untuk fast-response.';
      
      const query = inputVal.toLowerCase();
      if (query.includes('alamat') || query.includes('cabang') || query.includes('lokasi')) {
        botResponse = 'Kami memiliki 2 cabang di Tasikmalaya: Cabang Pertama Alun-alun Tasikmalaya dan Cabang Kedua Mangkubumi Tasikmalaya. Anda bisa melihat letaknya di peta interaktif di bagian bawah halaman! 🗺️';
      } else if (query.includes('paket') || query.includes('prasmanan') || query.includes('harga')) {
        botResponse = 'Kami punya 3 Paket Prasmanan utama: Paket Ekonomi (Rp 25.000/pax), Paket Regular (Rp 40.000/pax), dan Paket Premium (Rp 65.000/pax). Semuanya lezat! Silakan pilih di menu "Paket Prasmanan" untuk langsung menghitung biaya acara Anda.';
      } else if (query.includes('ayam') || query.includes('kremes') || query.includes('rendang')) {
        botResponse = 'Wah, pilihan yang mantap! Ayam Goreng Kremes kami dibuat gurih renyah, dan Rendang Sapi kami sangat empuk dimasak pelan. Semuanya tersedia segar setiap hari!';
      } else if (query.includes('jam') || query.includes('buka')) {
        botResponse = 'Kedua cabang kami di Tasikmalaya buka pukul 08:00 - 21:00 WIB setiap hari. Ditunggu kedatangannya ya! 😊';
      }

      const adminMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'admin',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const nextUpdated = [...updated, adminMsg];
      saveMessages(nextUpdated);
    }, 1200);
  };

  const handleClearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: 'init-1',
        sender: 'admin',
        text: 'Halo! Selamat datang di Rumah Makan Alun-alun Mangkubumi. Ada yang bisa kami bantu hari ini? 🍲',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    saveMessages(initial);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="chat-admin-widget">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#006e25] hover:bg-[#00531a] text-white px-5 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-500/20"
          id="chat-toggle-btn"
        >
          <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-semibold text-sm">Chat Admin</span>
          {messages.length > 1 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-gray-900 border-2 border-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
              {messages.filter(m => m.sender === 'admin').length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-[#006e25] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-700 font-bold text-sm flex items-center justify-center text-white border border-emerald-400/30">
                RM
              </div>
              <div>
                <h4 className="font-semibold text-sm">Customer Relations</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online • Siap membantu
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
              id="close-chat-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Special Agent Tip */}
          <div className="bg-emerald-50/70 border-b border-emerald-100/50 px-3 py-1.5 text-[10px] text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#28a745]" />
              Tanya tentang cabang, menu, atau harga paket prasmanan
            </span>
            <button onClick={handleClearChat} className="text-gray-400 hover:text-red-700 font-medium">Reset</button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
            {messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} items-end gap-2`}
                >
                  {isAdmin && (
                    <div className="w-6 h-6 rounded-full bg-[#28a745]/10 text-[#006e25] flex items-center justify-center text-[10px] font-bold shrink-0">
                      RM
                    </div>
                  )}

                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs shadow-2xs ${
                    isAdmin
                      ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      : 'bg-[#006e25] text-white rounded-br-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${
                      isAdmin ? 'text-gray-400' : 'text-emerald-100'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAdmin && (
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center text-[10px] font-bold shrink-0 border border-emerald-100">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-1 focus:ring-[#006e25] focus:border-[#006e25] rounded-xl px-3 py-2 text-xs focus:outline-hidden text-gray-800"
              id="chat-input"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-[#006e25] disabled:bg-gray-300 text-white p-2 rounded-xl hover:bg-[#00531a] transition-all disabled:scale-100 hover:scale-105 active:scale-95 shrink-0"
              id="send-chat-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
