import React, { useState, useEffect } from 'react';
import { MenuItem, Review, Order, Branch } from '../types';
import { BRANCHES } from '../initialData';
import InteractiveMap from './InteractiveMap';
// @ts-ignore
import heroBg from '../assets/images/mangkubumi_hero_bg_1781835054277.jpg';
import { 
  Star, 
  MapPin, 
  ChevronRight, 
  Download, 
  HelpCircle, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ShoppingCart, 
  Check, 
  CheckCircle,
  Menu,
  X,
  Sparkles,
  Utensils,
  Leaf,
  Banknote,
  Zap,
  MessageSquare
} from 'lucide-react';

interface CustomerPortalProps {
  menus: MenuItem[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
  onAddOrder: (order: Order) => void;
  onNavigateToAdmin: () => void;
}

export default function CustomerPortal({ 
  menus, 
  reviews, 
  onAddReview, 
  onAddOrder, 
  onNavigateToAdmin 
}: CustomerPortalProps) {
  // Mobile nav toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter for looking at full menus
  const [menuFilter, setMenuFilter] = useState('Semua');
  const [showFullMenu, setShowFullMenu] = useState(false);

  // Selected Branch for interactive map
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);

  // Review submission state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Order submission state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'Paket Ekonomi' | 'Paket Regular' | 'Paket Premium'>('Paket Regular');
  const [orderPax, setOrderPax] = useState(100);
  const [orderName, setOrderName] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrderDetails, setSubmittedOrderDetails] = useState<Order | null>(null);

  // Approved reviews list
  const approvedReviews = reviews.filter(r => r.status === 'Approved');
  
  // Calculate star ratings count
  const ratingsCount = approvedReviews.reduce((acc, curr) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalApproved = approvedReviews.length || 1;
  const averageRating = (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalApproved).toFixed(1);

  // Scrolling handler for simple single-page offsets
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewBody) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      nama: reviewName,
      rating: reviewRating,
      waktu: 'Baru saja',
      isi: reviewBody,
      status: 'Pending' // Requires admin approval to show up on the homepage!
    };

    onAddReview(newReview);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setReviewName('');
      setReviewRating(5);
      setReviewBody('');
    }, 2500);
  };

  const getPackagePrice = (name: string) => {
    if (name === 'Paket Ekonomi') return 25000;
    if (name === 'Paket Premium') return 65000;
    return 40000; // Paket Regular
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderPhone || !orderDate) return;

    const basePrice = getPackagePrice(selectedPackage);
    const total = basePrice * orderPax;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      namaPemesan: orderName,
      namaPaket: selectedPackage,
      pax: orderPax,
      hargaPerPax: basePrice,
      totalHarga: total,
      tanggalEvent: orderDate,
      telepon: orderPhone,
      status: 'Baru',
      tanggalDibuat: new Date().toISOString().split('T')[0]
    };

    onAddOrder(newOrder);
    setSubmittedOrderDetails(newOrder);
    setOrderSubmitted(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setOrderSubmitted(false);
    setOrderName('');
    setOrderEmail('');
    setOrderPhone('');
    setOrderDate('');
    setSubmittedOrderDetails(null);
  };

  const triggerSelectPackage = (packName: 'Paket Ekonomi' | 'Paket Regular' | 'Paket Premium') => {
    setSelectedPackage(packName);
    setOrderModalOpen(true);
  };

  const filteredMenus = menuFilter === 'Semua' 
    ? menus 
    : menus.filter(m => m.kategori === menuFilter);

  // Best selling products shown inside grid (matches image 2)
  const bestSellers = [
    {
      nama: 'Ayam Goreng Kremes',
      harga: 'Rp 22.000',
      deskripsi: 'Ayam kampung goreng gurih dengan kremesan renyah khas Mangkubumi.',
      img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
      tag: 'Khas Mangkubumi'
    },
    {
      nama: 'Rendang Sapi',
      harga: 'Rp 28.000',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    },
    {
      nama: 'Sayur Lodeh',
      harga: 'Rp 12.000',
      img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    },
    {
      nama: 'Nasi Putih',
      harga: 'Rp 6.000',
      img: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&q=80',
    },
    {
      nama: 'Sambal Dadak',
      harga: 'Rp 5.000',
      img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans" id="customer-portal">
      {/* Header & Logo */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          
          {/* Logo brand */}
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden" id="logo-home-btn">
            <div className="w-9 h-9 rounded-lg bg-[#005f27] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="block font-sans font-bold text-[14px] text-[#005f27] tracking-tight leading-none">Rumah Makan Alun-alun</span>
              <span className="text-[9px] text-[#b45309] font-black tracking-widest uppercase mt-0.5 leading-none">MANGKUBUMI</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-[12px] font-bold text-[#005f27] cursor-pointer tracking-wide relative pb-1 after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#005f27] after:rounded-full"
            >
              Beranda
            </button>
            <button 
              onClick={() => scrollToSection('menu-terlaris')} 
              className="text-[12px] font-medium text-gray-700 hover:text-[#005f27] hover:font-bold cursor-pointer tracking-wide transition-all"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection('paket-prasmanan')} 
              className="text-[12px] font-medium text-gray-700 hover:text-[#005f27] hover:font-bold cursor-pointer tracking-wide transition-all"
            >
              Paket Prasmanan
            </button>
            <button 
              onClick={() => scrollToSection('ulasan')} 
              className="text-[12px] font-medium text-gray-700 hover:text-[#005f27] hover:font-bold cursor-pointer tracking-wide transition-all"
            >
              Ulasan
            </button>
            <button 
              onClick={() => scrollToSection('cabang')} 
              className="text-[12px] font-medium text-gray-700 hover:text-[#005f27] hover:font-bold cursor-pointer tracking-wide transition-all"
            >
              Hubungi Kami
            </button>
            <button 
              onClick={onNavigateToAdmin} 
              className="text-[12px] font-medium text-gray-700 hover:text-[#005f27] hover:font-bold cursor-pointer tracking-wide transition-all"
            >
              Admin
            </button>
          </nav>

          {/* Action button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => triggerSelectPackage('Paket Regular')}
              className="bg-[#00531a] hover:bg-[#003d12] text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer hover:shadow-md"
              id="navbar-pesan-btn"
            >
              Pesan Sekarang
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-650"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-4 space-y-3 flex flex-col absolute w-full left-0 animate-in slide-in-from-top duration-200">
            <button onClick={() => scrollToSection('home')} className="text-left py-2 text-xs font-bold text-[#005f27]">Beranda</button>
            <button onClick={() => scrollToSection('menu-terlaris')} className="text-left py-2 text-xs font-medium text-gray-700 hover:text-[#005f27]">Menu</button>
            <button onClick={() => scrollToSection('paket-prasmanan')} className="text-left py-2 text-xs font-medium text-gray-700 hover:text-[#005f27]">Paket Prasmanan</button>
            <button onClick={() => scrollToSection('ulasan')} className="text-left py-2 text-xs font-medium text-gray-700 hover:text-[#005f27]">Ulasan</button>
            <button onClick={() => scrollToSection('cabang')} className="text-left py-2 text-xs font-medium text-gray-700 hover:text-[#005f27]">Hubungi Kami</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigateToAdmin(); }} className="text-left py-2 text-xs font-medium text-gray-700 hover:text-[#005f27]">Admin</button>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerSelectPackage('Paket Regular');
              }}
              className="bg-[#00531a] hover:bg-[#003d12] text-white text-center py-2.5 rounded-lg w-full font-bold text-xs uppercase"
              id="mobile-nav-pesan-btn"
            >
              Pesan Sekarang
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[460px] lg:h-[580px] bg-slate-900 overflow-hidden flex items-center">
        {/* Background photo of delicious buffet setting */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Alun-alun Mangkubumi Prasmanan" 
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full py-12 lg:py-0">
          <div className="max-w-xl text-left">
            <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-5xl text-white tracking-tight leading-[1.1] drop-shadow-md">
              Rumah Makan Alun-alun <br />
              Mangkubumi
            </h1>
            <p className="mt-4 text-[13px] sm:text-sm text-gray-200/90 leading-relaxed font-sans font-normal max-w-lg drop-shadow-xs">
              Nikmati hidangan prasmanan lezat dengan cita rasa rumahan autentik, bahan-bahan segar pilihan, dan harga yang ramah di kantong.
            </p>

            <div className="mt-8 flex flex-row items-center gap-4">
              <button
                onClick={() => scrollToSection('menu-terlaris')}
                className="bg-[#008a34] hover:bg-[#00732b] text-white px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wide shadow-md transition-all text-center cursor-pointer flex items-center justify-center h-10 shrink-0"
                id="hero-lihat-menu-btn"
              >
                Lihat Menu
              </button>
              
              <button
                onClick={() => {
                  const chatInput = document.getElementById('chat-toggle-btn');
                  if (chatInput) {
                    (chatInput as HTMLButtonElement).click();
                  } else {
                    alert('Layanan Chat dapat diakses di bagian pojok kanan bawah!');
                  }
                }}
                className="bg-black/30 hover:bg-black/45 backdrop-blur-xs border border-white/10 text-white rounded-lg px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer h-10 shrink-0"
                id="hero-chat-admin-btn"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Chat Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Selling Points */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-10 w-full pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-[#2e7d32]" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-gray-900 text-[15px] tracking-tight">Bahan Segar Setiap Hari</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Kami menjamin kualitas setiap hidangan dengan memilih bahan baku langsung dari pasar setiap pagi untuk kesegaran maksimal.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-[#2e7d32]" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-gray-900 text-[15px] tracking-tight">Harga Terjangkau</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Kualitas rasa bintang lima dengan harga kaki lima. Berbagai paket prasmanan fleksibel sesuai dengan anggaran Anda.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e8f5e9]/95 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#2e7d32]" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-gray-900 text-[15px] tracking-tight">Pelayanan Cepat</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Tim profesional kami siap melayani pesanan Anda dengan sigap, baik untuk makan di tempat maupun pesanan dalam jumlah besar.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Section Menu Terlaris */}
      <section id="menu-terlaris" className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-extrabold text-[#006e25] uppercase tracking-wider">Favorit Pelanggan</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">Menu Nilai Terbaik Terlaris</h2>
              <p className="text-sm text-gray-500 mt-1">Pilihan favorit para pencinta kuliner yang selalu habis diserbu setiap harinya.</p>
            </div>
            <button
              onClick={() => setShowFullMenu(!showFullMenu)}
              className="font-semibold text-xs text-[#006e25] hover:text-[#00531a] flex items-center gap-1 group self-start sm:self-center transition-colors cursor-pointer"
              id="toggle-full-menu-btn"
            >
              {showFullMenu ? 'Tutup Daftar Menu' : 'Lihat Semua Menu'} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive Toggleable Full Menu Box */}
          {showFullMenu ? (
            <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 transition-all animate-in fade-in duration-300">
              {/* Category selector tabs */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {['Semua', 'Makanan Utama', 'Lauk Pendamping', 'Minuman'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMenuFilter(tab)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      menuFilter === tab
                        ? 'bg-[#006e25] text-white border-[#006e25] shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Dynamic Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMenus.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-200/65 overflow-hidden flex flex-col group hover:shadow-xs transition-all">
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        item.status === 'Tersedia' 
                          ? 'bg-emerald-500/10 text-emerald-800' 
                          : 'bg-red-500/10 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.kategori}</span>
                        <h4 className="font-display font-bold text-gray-900 text-sm mt-0.5 line-clamp-1">{item.nama}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed h-8">{item.deskripsi}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-3.5 mt-3 shrink-0">
                        <span className="font-display font-extrabold text-sm text-[#006e25]">
                          Rp {item.harga.toLocaleString('id-ID')}
                        </span>
                        
                        <button 
                          onClick={() => triggerSelectPackage('Paket Regular')}
                          className="bg-[#28a745]/10 text-[#006e25] hover:bg-[#006e25] hover:text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Pesan Prasmanan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenus.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">Belum ada menu di kategori ini.</div>
              )}
            </div>
          ) : (
            /* Bento style bestseller layout matching screenshot 2 */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Highlight Big Left Card */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden relative min-h-[340px] group flex flex-col justify-end p-8 border border-slate-800 text-white">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={bestSellers[0].img} 
                    alt={bestSellers[0].nama} 
                    className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                </div>

                <div className="relative z-10 text-left">
                  <span className="bg-brand-gold text-slate-950 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3.5 inline-block">
                    {bestSellers[0].tag}
                  </span>
                  <h3 className="font-display font-black text-2xl tracking-tight leading-none">{bestSellers[0].nama}</h3>
                  <p className="text-sm text-slate-300 mt-2 font-light max-w-lg">{bestSellers[0].deskripsi}</p>
                  
                  <div className="flex items-center gap-4 mt-5">
                    <span className="font-display font-extrabold text-xl text-brand-gold">{bestSellers[0].harga}</span>
                    <button 
                      onClick={() => triggerSelectPackage('Paket Regular')}
                      className="bg-[#28a745] hover:bg-[#006e25] border-none text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side 4 small grid cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bestSellers.slice(1).map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-emerald-100 transition-all group">
                    <div className="h-28 overflow-hidden relative">
                      <img 
                        src={item.img} 
                        alt={item.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-3.5 text-left flex-1 flex flex-col justify-between">
                      <h4 className="font-display font-bold text-gray-900 text-sm">{item.nama}</h4>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 shrink-0">
                        <span className="font-display font-extrabold text-xs text-[#006e25]">{item.harga}</span>
                        <span className="text-[9px] text-gray-400 font-medium">Bestseller</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Section Paket Prasmanan */}
      <section id="paket-prasmanan" className="py-16 bg-[#eef5fc]/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#006e25] uppercase tracking-wider">Hajatan & Acara Tanpa Ribet</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">Paket Prasmanan Istimewa</h2>
            <p className="text-sm text-gray-500 mt-1.5">Solusi hemat dan praktis untuk berbagai acara Anda. Mulai dari syukuran, rapat kantor, hingga kumpul keluarga besar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Paket Ekonomi */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relativ text-left group">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-lg uppercase tracking-wide">Paket Ekonomi</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900">Rp 25.000</span>
                  <span className="text-xs text-gray-400 font-medium">/pax</span>
                </div>
                <div className="w-full h-px bg-gray-100 my-6" />

                <ul className="space-y-3.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Nasi Putih Pulen
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    1 Lauk Utama (Ayam Goreng/Panggang)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    1 Menu Sayuran (Tumis Kacang/Tauge)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Sambal Ulek & Lalapan Segar
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Air Mineral Gelas Higienis
                  </li>
                </ul>
              </div>

              <button
                onClick={() => triggerSelectPackage('Paket Ekonomi')}
                className="mt-8 bg-gray-50 hover:bg-slate-100 border border-slate-200 text-[#006e25] font-bold text-center py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Pilih Paket Ekonomi
              </button>
            </div>

            {/* Paket Regular - TERPOPULER */}
            <div className="bg-white rounded-3xl border-2 border-[#006e25] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative text-left group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006e25] text-white px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full">
                TERPOPULER
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-[#006e25] text-lg uppercase tracking-wide">Paket Regular</h3>
                  <span className="text-[10px] bg-[#28a745]/10 text-emerald-800 font-bold px-2 py-0.5 rounded-sm">Rekomendasi</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900">Rp 40.000</span>
                  <span className="text-xs text-gray-400 font-medium">/pax</span>
                </div>
                <div className="w-full h-px bg-emerald-100/50 my-6" />

                <ul className="space-y-3.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    <span className="font-medium">Nasi Putih / Nasi Kuning</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    <span className="font-medium">2 Lauk Utama</span> (Ayam Goreng & Ikan)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    2 Menu Sayuran Tradisional
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Sambal, Lalapan & Kerupuk Kaleng udang
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Es Teh Manis Selasih / Es Jeruk Peras
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Buah Iris Segar (Semangka, Melon)
                  </li>
                </ul>
              </div>

              <button
                onClick={() => triggerSelectPackage('Paket Regular')}
                className="mt-8 bg-[#006e25] hover:bg-[#00531a] text-white font-bold text-center py-3.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Pilih Paket Regular Ini
              </button>
            </div>

            {/* Paket Premium */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative text-left group">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-lg uppercase tracking-wide">Paket Premium</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900">Rp 65.000</span>
                  <span className="text-xs text-gray-400 font-medium">/pax</span>
                </div>
                <div className="w-full h-px bg-gray-100 my-6" />

                <ul className="space-y-3.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    <span className="font-semibold">Nasi Liwet / Tutug / Putih</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    <span className="font-semibold">3 Lauk Utama</span> (Empal Sapi, Ayam, Ikan)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    3 Menu Sayuran & Sup Tradisional
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Dessert Aneka Puding & Jajanan Pasar
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    Juice Jeruk / Melon & Infused Water
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-1 rounded-xs">Pelayanan Waiter Standby khusus</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => triggerSelectPackage('Paket Premium')}
                className="mt-8 bg-gray-50 hover:bg-slate-100 border border-slate-200 text-[#006e25] font-bold text-center py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Pilih Paket Premium
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Customer Review Section */}
      <section id="ulasan" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-left mb-10">
            <span className="text-xs font-extrabold text-[#006e25] uppercase tracking-wider">Ulasan Pelanggan</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">Kata Mereka Tentang Kami</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews left stats box */}
            <div className="lg:col-span-4 bg-gray-50 border border-gray-100 rounded-3xl p-6 text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-5xl text-gray-900">{averageRating}</span>
                <span className="text-sm font-semibold text-gray-400">/ 5.0</span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star 
                    key={num} 
                    className={`w-4 h-4 ${
                      num <= Math.round(Number(averageRating))
                        ? 'fill-brand-gold text-brand-gold' 
                        : 'text-gray-200'
                    }`} 
                  />
                ))}
                <span className="text-xs text-gray-500 font-medium ml-1">230+ Ulasan terverifikasi</span>
              </div>

              {/* Progress Bar Rows */}
              <div className="mt-6 space-y-2 text-xs text-gray-600">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingsCount[stars] || 0;
                  const pct = Math.round((count / totalApproved) * 100) || (stars === 5 ? 78 : stars === 4 ? 14 : 4);
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-3 font-semibold text-right">{stars}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className="w-8 text-gray-400 font-light text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="mt-8 bg-[#006e25] hover:bg-[#00531a] text-white font-bold text-center py-3 w-full rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                id="open-review-form-btn"
              >
                <span>Write a Review / Tulis Ulasan</span>
              </button>
            </div>

            {/* Approved Review List Rows */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                <span className="bg-[#28a745]/15 text-[#006e25] font-extrabold text-xs px-3 py-1 rounded-full">Terbaru</span>
                <span className="text-gray-400 text-xs font-semibold">Tampil dinamis terverifikasi</span>
              </div>

              {approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-white border hover:border-emerald-100 border-gray-100 rounded-2xl p-5 text-left transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#006e25]/15 font-bold text-[#006e25] text-xs flex items-center justify-center shrink-0">
                        {rev.nama.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-gray-900 text-sm leading-none">{rev.nama}</h4>
                        <span className="text-[10px] text-gray-400 font-medium mt-1 block">{rev.waktu}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Star 
                          key={num} 
                          className={`w-3.5 h-3.5 ${
                            num <= rev.rating ? 'fill-brand-gold text-brand-gold' : 'text-gray-100'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mt-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                    {rev.isi}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Section Lokasi Cabang & Peta */}
      <section id="cabang" className="bg-[#eef5fc]/50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-left mb-10">
            <span className="text-xs font-extrabold text-[#006e25] uppercase tracking-wider">Kunjungi Cabang Kedai Kami</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">Lokasi Kami Tasikmalaya</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Locations List selector */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {BRANCHES.map((branch, idx) => {
                const isActive = selectedBranch.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isActive 
                        ? 'bg-white border-[#006e25] ring-2 ring-emerald-50 shadow-xs' 
                        : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-emerald-100'
                    }`}
                    id={`branch-selector-${idx}`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isActive ? 'bg-[#006e25] text-white' : 'bg-emerald-50 text-[#006e25]'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-gray-900 text-sm leading-tight">{branch.nama}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-snug">{branch.alamat}</p>
                      
                      <div className="flex flex-wrap items-center gap-2.5 mt-2.5 pt-2 border-t border-gray-50">
                        <span className="text-[10px] bg-slate-50 text-gray-500 font-semibold px-2 py-0.5 rounded-sm">
                          {branch.jamBuka}
                        </span>
                        <span className="text-[10px] text-[#006e25] font-bold block">
                          Petunjuk Arah →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Custom Vector Map Component */}
            <div className="lg:col-span-8">
              <InteractiveMap 
                branches={BRANCHES} 
                selectedBranch={selectedBranch} 
                onSelectBranch={setSelectedBranch} 
              />
            </div>

          </div>

        </div>
      </section>

      {/* Promosi Event Section CTA */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative bg-[#006e25] text-white rounded-3xl overflow-hidden p-8 sm:p-12 text-center border-l-8 border-brand-gold shadow-md">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 -translate-y-6 translate-x-6" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-800 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-y-12 -translate-x-12" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <span className="bg-[#28a745]/30 text-brand-gold border border-brand-gold/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                Katering & Event Prasmanan Tasikmalaya
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-4 tracking-tight">Ingin Mengadakan Acara?</h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-light mt-3 leading-relaxed">
                Konsultasikan kebutuhan katering prasmanan pesta pernikahan, rapat koorporasi, syukuran keluarga Anda dengan tim kuliner kami sekarang. Dapatkan saran gratis penyesuaian menu kuliner terbaik.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => triggerSelectPackage('Paket Regular')}
                  className="bg-brand-gold text-slate-950 px-6 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
                  id="cta-sales-btn"
                >
                  Hubungi Account Sales Representative
                </button>
                
                <button
                  onClick={() => {
                    alert('PDF Food Menu berhasil diunduh ke perangkat Anda!');
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold text-xs tracking-wide transition-colors flex items-center gap-1 cursor-pointer"
                  id="cta-pdf-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Menu Terbaru</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Block */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
            
            {/* Left col brand details */}
            <div className="md:col-span-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#006e25] flex items-center justify-center text-white font-black text-sm">
                  M
                </div>
                <span className="font-display font-extrabold text-base text-white tracking-tight">RM Alun-alun Mangkubumi</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed max-w-sm">
                Pelopor hidangan prasmanan cita rasa rumahan terbaik di Tasikmalaya. Menjamin kesegaran cita rasa otentik setiap porsi yang ditonjolkan.
              </p>
            </div>

            {/* Middle col links */}
            <div>
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest">Tentang Kami</h4>
              <p className="text-[11px] mt-4 leading-relaxed text-slate-500">
                Kami melayani prasmanan harian langsung di kedai dan juga pengiriman katering kustom tumpeng untuk berbagai instansi maupun pribadi sejak bertahun-tahun.
              </p>
            </div>

            {/* Middle col menu list shortcuts */}
            <div>
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest">Syarat & Ketentuan</h4>
              <p className="text-[11px] mt-4 leading-relaxed text-slate-500">
                Layanan booking online diwajibkan melakukan konfirmasi selambat-lambatnya H-3 sebelum tanggal event berlangsung bersama account representative kami.
              </p>
            </div>

            {/* Contact quick notes */}
            <div>
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest">Alamat Tasikmalaya</h4>
              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                Jl. KHZ. Mustofa, Alun-alun, Tasikmalaya, Jawa Barat & Jl. Mangkubumi No. 120, Mangkubumi, Tasikmalaya
              </p>
              <span className="text-[11px] font-bold text-[#28a745] block mt-1">+62 812-3456-7890</span>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 font-light text-[10px]">
              &copy; 2026 Rumah Makan Alun-alun Mangkubumi. Selera Nusantara, Kualitas Terjaga.
            </span>

            <div className="flex items-center gap-6">
              <button onClick={onNavigateToAdmin} className="text-slate-600 hover:text-emerald-500 transition-colors text-[10px] tracking-wide uppercase font-bold">
                Admin Console Access Control
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Review Writing Form Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-emerald-500/10 shadow-2xl p-6 max-w-md w-full relative animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-gray-900 pr-8">Tulis Ulasan Anda</h3>
            <p className="text-xs text-gray-400 mt-1">Bagikan kesan tulus Anda makan bersama RM Mangkubumi.</p>

            {reviewSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                <CheckCircle className="w-16 h-16 text-[#28a745] animate-bounce" />
                <h4 className="font-bold text-[#006e25] text-base leading-none">Ulasan Berhasil Dikirim!</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Ulasan Anda telah tersimpan dan sedang menunggu persetujuan Admin agar tampil langsung di halaman utama. Terima kasih!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Bintang Desain</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="p-1 focus:outline-hidden cursor-pointer"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            num <= reviewRating ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'
                          } transition-all active:scale-90`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Komentar / Pengalaman Anda</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Tulis ulasan masakan, kebersihan, atau pelayanan kami..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#006e25] hover:bg-[#00531a] text-white py-3 rounded-lg text-xs font-bold transition-all shadow-xs uppercase tracking-wider cursor-pointer"
                  >
                    Kirim Ulasan & Pendapat
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

      {/* Package Customizable Customize Builder & Order Form Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-emerald-500/10 shadow-2xl p-6 max-w-lg w-full relative my-8 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            <button
              onClick={closeOrderModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full z-10"
              id="close-order-modal"
            >
              <X className="w-4 h-4" />
            </button>

            {orderSubmitted && submittedOrderDetails ? (
              /* Success detailed transaction confirmation */
              <div className="py-6 flex-1 overflow-y-auto text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#006e25] flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                
                <div>
                  <h4 className="font-display font-extrabold text-lg text-[#006e25] leading-none">Reservasi Berhasil Diajukan!</h4>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
                    Terima kasih telah memilih kami. Estimasi rincian pemesanan Anda telah terdaftar dalam sistem backend kami.
                  </p>
                </div>

                {/* Simulated Invoice Display */}
                <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4 w-full text-left text-xs space-y-2 mt-2 font-mono">
                  <div className="flex justify-between pb-2 border-b border-gray-100 text-gray-400 font-sans text-[10px] font-bold">
                    <span>KODE_RESERVASI: {submittedOrderDetails.id}</span>
                    <span>TANGGAL: {submittedOrderDetails.tanggalDibuat}</span>
                  </div>
                  
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Nama Pemesan:</span>
                    <span className="font-semibold text-gray-800">{submittedOrderDetails.namaPemesan}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Paket Terpilih:</span>
                    <span className="font-semibold text-gray-700">{submittedOrderDetails.namaPaket}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah Undangan:</span>
                    <span className="font-semibold text-gray-700">{submittedOrderDetails.pax} Pax</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Acara:</span>
                    <span className="font-semibold text-emerald-900">{submittedOrderDetails.tanggalEvent}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Telepon Kontak:</span>
                    <span className="font-semibold text-gray-700">{submittedOrderDetails.telepon}</span>
                  </div>

                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-3 text-sm font-sans">
                    <span className="font-extrabold text-[#006e25]">TOTAL ESTIMASI:</span>
                    <span className="font-black text-[#006e25] text-base">
                      Rp {submittedOrderDetails.totalHarga.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="text-blue-900 text-[10px] bg-blue-50 border border-blue-100 rounded-lg p-2.5 leading-relaxed text-left w-full flex items-start gap-2">
                  <span className="text-base select-none">💬</span>
                  <p>
                    <strong>Tindakan Selanjutnya:</strong> Account Sales Representative kami akan segera memanggil Anda ke nomor handphone <strong>{submittedOrderDetails.telepon}</strong> untuk mengonfirmasi rincian menu pilihan yang Anda sukai!
                  </p>
                </div>

                <button
                  onClick={closeOrderModal}
                  className="w-full bg-[#006e25] text-white py-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Selesai & Tutup
                </button>
              </div>
            ) : (
              /* Booking customize builder */
              <>
                <div className="shrink-0">
                  <h3 className="font-display font-extrabold text-xl text-gray-950 flex items-center gap-1.5">
                    <ShoppingCart className="w-5 h-5 text-[#006e25]" />
                    Formulir Booking Prasmanan
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Isi rincian event dan hitung estimasi total pengeluaran Anda.</p>
                </div>

                <form onSubmit={handleOrderSubmit} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
                  
                  {/* Package Selector */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase">Pilihan Tingkat Paket</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Paket Ekonomi', price: 25000 },
                        { name: 'Paket Regular', price: 40000 },
                        { name: 'Paket Premium', price: 65000 }
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedPackage(item.name as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedPackage === item.name
                              ? 'bg-emerald-50/70 border-[#006e25] text-[#006e25] font-bold shadow-2xs'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="block text-[10px] truncate">{item.name}</span>
                          <span className="block text-[9px] font-extrabold mt-0.5">Rp {item.price/1000}K/pax</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Undangan Pax Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-extrabold text-gray-700 uppercase">Jumlah Undangan (Pax)</label>
                      <span className="text-xs font-black text-[#006e25] bg-emerald-50 px-2 py-0.5 rounded-md">
                        {orderPax} Pax
                      </span>
                    </div>
                    {/* Range slider for easy interaction */}
                    <input
                      type="range"
                      min={50}
                      max={1000}
                      step={25}
                      value={orderPax}
                      onChange={(e) => setOrderPax(Number(e.target.value))}
                      className="w-full accent-[#006e25] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold px-0.5 mt-1">
                      <span>Min: 50 pax</span>
                      <span>500 pax</span>
                      <span>Max: 1000 pax</span>
                    </div>
                  </div>

                  {/* Customer Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nama Pemesan</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={orderName}
                          onChange={(e) => setOrderName(e.target.value)}
                          placeholder="Nama lengkap Anda..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nomor WhatsApp / Seluler</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={orderPhone}
                          onChange={(e) => setOrderPhone(e.target.value)}
                          placeholder="e.g. 081234567890"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={orderEmail}
                          onChange={(e) => setOrderEmail(e.target.value)}
                          placeholder="nama@alamat.com (opsional)"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Tanggal Acara dilangsungkan</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 animate-pulse" />
                        <input
                          type="date"
                          required
                          value={orderDate}
                          onChange={(e) => setOrderDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Realtime Live Quote Panel */}
                  <div className="bg-[#f6faff]/80 border-2 border-emerald-100 rounded-2xl p-4 shrink-0 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-gray-500 tracking-wider font-bold uppercase">Estimasi Biaya Acara</span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {orderPax} Pax x Rp {getPackagePrice(selectedPackage).toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <span className="block font-display font-black text-xl text-[#006e25]">
                        Rp {(getPackagePrice(selectedPackage) * orderPax).toLocaleString('id-ID')}
                      </span>
                      <span className="block text-[9px] text-emerald-800 font-bold bg-green-50 px-1.5 py-0.5 rounded-sm inline-block">
                        Sudah termasuk servis
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 shrink-0">
                    <button
                      type="submit"
                      className="w-full bg-[#006e25] hover:bg-[#00531a] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md uppercase tracking-wider cursor-pointer"
                    >
                      Kirim Ajukan Booking Sekarang
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                      *Dengan mengirim form ini, Anda menyetujui katering divalidasi oleh Sales lewat Kontak WhatsApp.
                    </p>
                  </div>

                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
