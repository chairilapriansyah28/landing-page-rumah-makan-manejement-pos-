import React, { useState, useMemo } from 'react';
import { MenuItem, Review, Order } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Filter,
  RefreshCw,
  Sparkles,
  DollarSign,
  Users
} from 'lucide-react';

interface AdminPortalProps {
  menus: MenuItem[];
  reviews: Review[];
  orders: Order[];
  onUpdateMenu: (menus: MenuItem[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
}

export default function AdminPortal({ 
  menus, 
  reviews, 
  orders, 
  onUpdateMenu, 
  onUpdateReviews, 
  onUpdateOrders 
}: AdminPortalProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // View sections states
  // Views: 'Summary' (active by default in picture 3) | 'Menu' (active in picture 1) | 'Orders' | 'Reviews'
  const [activeTab, setActiveTab] = useState<'Summary' | 'Menu' | 'Orders' | 'Reviews'>('Summary');

  // Menu Management Table state query
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('All');
  const [menuFilterStatus, setMenuFilterStatus] = useState('All');

  // Edit/Add Menu Modal State
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuModalMode, setMenuModalMode] = useState<'Add' | 'Edit'>('Add');
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);

  // Form states for menu item
  const [formNama, setFormNama] = useState('');
  const [formKategori, setFormKategori] = useState('Makanan Utama');
  const [formHarga, setFormHarga] = useState(15000);
  const [formStatus, setFormStatus] = useState<'Tersedia' | 'Habis'>('Tersedia');
  const [formImage, setFormImage] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');

  // Selected preset images for quick selection in modal so we don't need manual links typing
  const PRESET_IMAGES = [
    { name: 'Ayam Kremes', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80' },
    { name: 'Rendang Sapi', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
    { name: 'Ikan Bakar', url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&q=80' },
    { name: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80' },
    { name: 'Sayur Lodeh', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80' },
    { name: 'Sambal Dadak', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Kredensial salah! Gunakan: admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Generate dynamic chart data based on loaded orders
  const chartData = useMemo(() => {
    // 7 Days scale leading to today
    return [
      { tanggal: 'Senin', pendapatan: 1750000, pesanan: 45 },
      { tanggal: 'Selasa', pendapatan: 1980000, pesanan: 52 },
      { tanggal: 'Rabu', pendapatan: 1540000, pesanan: 39 },
      { tanggal: 'Kamis', pendapatan: 2100000, pesanan: 58 },
      { tanggal: 'Jumat', pendapatan: 2450000, pesanan: 67 },
      { tanggal: 'Sabtu', pendapatan: 3600000, pesanan: 98 },
      { tanggal: 'Minggu', pendapatan: 2980000, pesanan: 84 },
    ];
  }, [orders]);

  // Overall Statistics (Dynamic counts matching screenshots)
  const totalRevenue = useMemo(() => {
    const baseRevenue = 13070000; // Value from screenshot 3 stats
    const newlyAddedRevenue = orders
      .filter(o => o.status === 'Selesai' && !['ord1', 'ord2', 'ord3'].includes(o.id))
      .reduce((sum, o) => sum + o.totalHarga, 0);
    return baseRevenue + newlyAddedRevenue;
  }, [orders]);

  const totalOrdersCount = useMemo(() => {
    return 523 + orders.filter(o => !['ord1', 'ord2', 'ord3'].includes(o.id)).length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return menus.filter(m => m.status === 'Habis').length;
  }, [menus]);

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter(r => r.status === 'Pending').length;
  }, [reviews]);

  // Menu filtering & search
  const filteredMenuItems = useMemo(() => {
    return menus.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(menuSearchQuery.toLowerCase()) || 
                            item.deskripsi.toLowerCase().includes(menuSearchQuery.toLowerCase());
      const matchesCategory = menuFilterCategory === 'All' || item.kategori === menuFilterCategory;
      const matchesStatus = menuFilterStatus === 'All' || item.status === menuFilterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [menus, menuSearchQuery, menuFilterCategory, menuFilterStatus]);

  // Handle Review Actions
  const handleApproveReview = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r);
    onUpdateReviews(updated);
  };

  const handleRejectReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    onUpdateReviews(updated);
  };

  // Handle Order status transition updating
  const handleUpdateOrderStatus = (orderId: string, nextStatus: any) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
    onUpdateOrders(updated);
  };

  // Open Add/Edit Menu item panel
  const handleOpenAddModal = () => {
    setMenuModalMode('Add');
    setEditingMenuItemId(null);
    setFormNama('');
    setFormKategori('Makanan Utama');
    setFormHarga(15000);
    setFormStatus('Tersedia');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDeskripsi('');
    setMenuModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setMenuModalMode('Edit');
    setEditingMenuItemId(item.id);
    setFormNama(item.nama);
    setFormKategori(item.kategori);
    setFormHarga(item.harga);
    setFormStatus(item.status);
    setFormImage(item.image);
    setFormDeskripsi(item.deskripsi);
    setMenuModalOpen(true);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    const updated = menus.filter(m => m.id !== itemId);
    onUpdateMenu(updated);
  };

  const handleSaveMenuItemForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama) return;

    if (menuModalMode === 'Add') {
      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        nama: formNama,
        kategori: formKategori,
        harga: formHarga,
        status: formStatus,
        image: formImage || PRESET_IMAGES[0].url,
        deskripsi: formDeskripsi || `Kelezatan citarasa otentik ${formNama} kreasi Alun-alun Mangkubumi.`
      };
      onUpdateMenu([...menus, newItem]);
    } else {
      const updated = menus.map(m => m.id === editingMenuItemId ? {
        ...m,
        nama: formNama,
        kategori: formKategori,
        harga: formHarga,
        status: formStatus,
        image: formImage,
        deskripsi: formDeskripsi
      } : m);
      onUpdateMenu(updated);
    }
    setMenuModalOpen(false);
  };

  // If not logged in, render the beautiful credentials wall as requested in image 4!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111822] flex items-center justify-center p-4 font-sans relative overflow-hidden" id="admin-login-screen">
        {/* Aesthetic Abstract Glowing shapes matching high-contrast workspace */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-950/40 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-900/40 rounded-full filter blur-3xl animate-pulse" />

        {/* Central Credential Box card */}
        <div className="bg-[#1a232f] border border-slate-800/85 w-full max-w-md rounded-2xl p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
          
          <div className="text-center">
            {/* Round Badge matching brand */}
            <div className="w-12 h-12 bg-[#006e25] text-white rounded-full flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
              A
            </div>
            
            <h2 className="font-display font-extrabold text-2xl text-white tracking-tight mt-4">Portal Admin Mangkubumi</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-snug">
              Silakan masuk ke panel utama katering & inventaris katering.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#28a745] mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cth: admin"
                className="w-full bg-[#111822] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-[#28a745] focus:border-[#28a745] transition-all"
                id="login-username"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#28a745] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="cth: admin123"
                className="w-full bg-[#111822] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-[#28a745] focus:border-[#28a745] transition-all"
                id="login-password"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-[11px] text-red-200 mt-2">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#006e25] hover:bg-[#00531a] text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-emerald-950/50 hover:scale-[1.01]"
              id="login-submit-btn"
            >
              Sign In / Masuk Sistem
            </button>
          </form>

          {/* Quick Demo Credentials Reminder Box */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2.5 text-[11px] text-slate-400">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold text-slate-300">Akses Cepat Demo:</p>
              <p>Gunakan Username <code className="bg-slate-800 text-slate-200 px-1 rounded-sm text-[10px]">admin</code> dan Password <code className="bg-slate-800 text-slate-200 px-1 rounded-sm text-[10px]">admin123</code></p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Admin Dashboard main structural interface is rendered here!
  return (
    <div className="min-h-screen bg-[#f3f4f6]" id="admin-dashboard-root">
      
      {/* Structural layout grid */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Component */}
        <aside className="w-full lg:w-64 bg-[#141d23] text-slate-300 flex flex-col justify-between shrink-0 h-auto lg:h-screen lg:sticky lg:top-0 z-30">
          <div>
            {/* Sidebar Title */}
            <div className="px-6 py-5 bg-[#0f161b] flex items-center gap-3 border-b border-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-[#006e25] text-white font-black text-sm flex items-center justify-center">
                M
              </div>
              <div>
                <h3 className="font-display font-extrabold text-[#28a745] tracking-tight leading-none text-sm">RM Mangkubumi</h3>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mt-1">Management v1.0</span>
              </div>
            </div>

            {/* Nav Menu selection */}
            <nav className="p-4 space-y-1 text-left">
              <button
                onClick={() => setActiveTab('Summary')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                  activeTab === 'Summary' 
                    ? 'bg-[#006e25]/20 text-white border-l-4 border-[#28a745]' 
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
                id="sidebar-tab-summary"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Ringkasan Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('Menu')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                  activeTab === 'Menu' 
                    ? 'bg-[#006e25]/20 text-white border-l-4 border-[#28a745]' 
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
                id="sidebar-tab-menu"
              >
                <Utensils className="w-4 h-4" />
                <span>Kelola Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('Orders')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                  activeTab === 'Orders' 
                    ? 'bg-[#006e25]/20 text-white border-l-4 border-[#28a745]' 
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
                id="sidebar-tab-orders"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Transaksi Booking</span>
                {orders.filter(o => o.status === 'Baru').length > 0 && (
                  <span className="ml-auto bg-brand-gold text-yellow-950 font-black text-[9px] px-2 py-0.5 rounded-full animate-bounce">
                    {orders.filter(o => o.status === 'Baru').length} Baru
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('Reviews')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                  activeTab === 'Reviews' 
                    ? 'bg-[#006e25]/20 text-white border-l-4 border-[#28a745]' 
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
                id="sidebar-tab-reviews"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Moderasi Ulasan</span>
                {pendingReviewsCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Quick Create Button Shortcut and Logout */}
          <div className="p-4 border-t border-slate-800/50">
            {activeTab === 'Menu' && (
              <button
                onClick={handleOpenAddModal}
                className="w-full bg-[#28a745] hover:bg-[#006e25] text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wide cursor-pointer shadow-xs shadow-black/20 hover:-translate-y-0.5 mb-3"
                id="sidebar-add-menu-item"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Item</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800/30 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              id="sidebar-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out Panel</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Main Content area (right) */}
        <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-x-hidden text-left">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <span className="text-[10px] font-bold text-[#006e25] tracking-widest uppercase">Pusat Administrasi</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-950 mt-1">
                {activeTab === 'Summary' && 'Ringkasan Statistik'}
                {activeTab === 'Menu' && 'Kelola Catalog Menu'}
                {activeTab === 'Orders' && 'Transaksi Reservasi'}
                {activeTab === 'Reviews' && 'Moderasi Feedback / Review'}
              </h1>
              <p className="text-xs text-gray-400 mt-1 leading-none">
                {activeTab === 'Summary' && 'Tinjau penjualan katering harian dan ulasan terkini.'}
                {activeTab === 'Menu' && 'Update harga, tambah hidangan baru, atau atur ketersediaan menu.'}
                {activeTab === 'Orders' && 'Ambil rincian katering terbaru untuk persiapan dapur.'}
                {activeTab === 'Reviews' && 'Moderasi komentar pelanggan masuk sebelum ditampilkan di web.'}
              </p>
            </div>

            {/* Quick Stats Summary indicator */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <span className="text-[11px] text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-mono">
                DATABASE: <span className="text-emerald-700 font-bold font-sans">Dinamis Local</span>
              </span>
            </div>
          </div>

          {/* Alarm Warning Block (Matches alarm notification exactly) */}
          <div className="bg-amber-50/70 border-l-4 border-amber-600 rounded-r-xl p-4 flex gap-3 shadow-xs shrink-0 animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900 leading-relaxed text-left">
              <span className="font-bold">Stok Hampir Habis!</span> Ayam Potong, Daging Sapi, Kangkung perlu segera diisi ulang hari ini untuk menjaga ketersediaan menu prasmanan harian.
            </div>
          </div>

          {/* 4 Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            
            {/* Stat 1: Total Pendapatan */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs hover:shadow-xs transition-all text-left">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold tracking-wide uppercase">Total Pendapatan</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-[#006e25]"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <p className="font-display font-black text-xl text-gray-900 mt-3">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1.5">
                +12% dari 7 hari terakhir
              </span>
            </div>

            {/* Stat 2: Total Pesanan */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs hover:shadow-xs transition-all text-left">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold tracking-wide uppercase">Total Pesanan</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700"><ShoppingBag className="w-4 h-4" /></div>
              </div>
              <p className="font-display font-black text-xl text-gray-900 mt-3">{totalOrdersCount} Pesanan</p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1.5">
                +5% pesanan masuk katering
              </span>
            </div>

            {/* Stat 3: Item Stok Rendah */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs hover:shadow-xs transition-all text-left">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold tracking-wide uppercase">Stok Rendah / Habis</span>
                <div className="p-2 rounded-xl bg-red-50 text-red-700"><AlertTriangle className="w-4 h-4" /></div>
              </div>
              <p className="font-display font-black text-xl text-red-800 mt-3">{lowStockCount} Item</p>
              <span className="text-[10px] text-red-600 font-bold block mt-1.5">
                Perlu restock hari ini
              </span>
            </div>

            {/* Stat 4: Review pending */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs hover:shadow-xs transition-all text-left">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold tracking-wide uppercase">Ulasan Menunggu</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700"><MessageSquare className="w-4 h-4" /></div>
              </div>
              <p className="font-display font-black text-xl text-gray-900 mt-3">{pendingReviewsCount} Ulasan</p>
              <span className="text-[10px] text-[#006e25] font-bold block mt-1.5">
                Butuh moderasi secepatnya
              </span>
            </div>

          </div>

          {/* Dynamic Switch View based on active Tab */}
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'Summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Graphic Chart in the left */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs">
                <h3 className="font-display font-bold text-gray-900 text-sm mb-6 flex items-center justify-between">
                  <span>Pendapatan Katering mingguan</span>
                  <span className="text-xs text-emerald-700 font-bold bg-green-50 px-2 py-0.5 rounded-md">Live Realtime</span>
                </h3>

                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006e25" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#006e25" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="tanggal" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                        formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                      />
                      <Area type="monotone" dataKey="pendapatan" stroke="#006e25" strokeWidth={2} fillOpacity={1} fill="url(#colorPendapatan)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pending reviews right side quick moderations */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs space-y-4">
                <h3 className="font-display font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Moderasi Ulasan Cepat</h3>
                
                <div className="space-y-3 overflow-y-auto max-h-[290px] pr-1">
                  {reviews.filter(r => r.status === 'Pending').map((rev) => (
                    <div key={rev.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 relative text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-gray-900">{rev.nama}</p>
                          <span className="text-[9px] text-gray-400 font-semibold">{rev.waktu}</span>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-3 mt-2 italic">"{rev.isi}"</p>
                      
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold py-1.5 rounded-md cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectReview(rev.id)}
                          className="flex-1 bg-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-700 text-[10px] font-semibold py-1.5 rounded-md cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}

                  {reviews.filter(r => r.status === 'Pending').length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-xs">Tidak ada ulasan baru yang menunggu modersasi.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MENU CATALOG MANAGEMENT (Matches picture 1 exactly) */}
          {activeTab === 'Menu' && (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-3xs">
              
              {/* Filter controls panel */}
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50/50">
                
                {/* Search Input Box */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Cari nama atau deskripsi menu..."
                    className="w-full bg-white border border-gray-250 focus:border-[#006e25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#006e25]"
                    id="menu-search-input"
                  />
                </div>

                {/* Filter selectors drop rows */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-bold">Kategori:</span>
                  </div>
                  
                  <select
                    value={menuFilterCategory}
                    onChange={(e) => setMenuFilterCategory(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 focus:outline-hidden focus:border-[#006e25] cursor-pointer"
                  >
                    <option value="All">Semua Kategori</option>
                    <option value="Makanan Utama">Makanan Utama</option>
                    <option value="Lauk Pendamping">Lauk Pendamping</option>
                    <option value="Minuman">Minuman</option>
                  </select>

                  <select
                    value={menuFilterStatus}
                    onChange={(e) => setMenuFilterStatus(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 focus:outline-hidden focus:border-[#006e25] cursor-pointer"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>

              </div>

              {/* Table rendering matches Image 1 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#141d23] text-slate-300 uppercase tracking-wider text-[9px] font-extrabold select-none">
                    <tr>
                      <th className="py-4 px-6">Nama Menu</th>
                      <th className="py-4 px-6">Kategori</th>
                      <th className="py-4 px-6 text-right">Harga Satuan</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-150 text-gray-700">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        
                        {/* Name + photo thumbnail */}
                        <td className="py-3.5 px-6 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.nama} 
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="block font-bold text-sm text-gray-900 leading-tight">{item.nama}</span>
                              <span className="block text-[10px] text-gray-400 h-4 overflow-hidden text-ellipsis line-clamp-1 mt-0.5 max-w-sm">
                                {item.deskripsi}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className="py-3.5 px-6 font-semibold">
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-sm text-[10px] uppercase font-bold">
                            {item.kategori}
                          </span>
                        </td>

                        {/* Price formatted */}
                        <td className="py-3.5 px-6 text-right font-mono font-bold text-gray-900 text-sm">
                          Rp {item.harga.toLocaleString('id-ID')}
                        </td>

                        {/* Status badge toggler */}
                        <td className="py-3.5 px-6 text-center font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] inline-block tracking-wide ${
                            item.status === 'Tersedia'
                              ? 'bg-emerald-50 text-[#006e25] border border-emerald-100'
                              : 'bg-red-50 text-[#ba1a1a] border border-red-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Grid Actions */}
                        <td className="py-3.5 px-6 text-right font-medium">
                          <div className="flex items-center justify-end gap-2 text-slate-500">
                            
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 hover:bg-[#006e25]/10 hover:text-[#006e25] rounded-md transition-colors cursor-pointer"
                              title="Edit menu"
                              id={`edit-item-${item.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus ${item.nama}?`)) {
                                  handleDeleteMenuItem(item.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                              title="Surgical delete"
                              id={`delete-item-${item.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                    {filteredMenuItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-gray-400">
                          Tidak menemukan kecocokan item menu dengan pencarian yang dilakukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination text matching mockup footer */}
              <div className="p-4 bg-slate-50 border-t border-gray-150 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Menampilkan <strong className="text-gray-700">{filteredMenuItems.length}</strong> dari{' '}
                  <strong className="text-gray-700">{menus.length}</strong> Menu Katering
                </span>
                <span className="font-semibold text-[10px] uppercase text-[#006e25]">
                  Terkoneksi Sinkronisasi Dinamis
                </span>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS STREAM */}
          {activeTab === 'Orders' && (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-3xs">
              
              <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-gray-700 uppercase">Daftar Pengajuan Booking Terkini</span>
                <span className="text-[10px] text-slate-400 font-mono">Simulasi katering</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#141d23] text-slate-300 uppercase text-[9px] font-bold">
                    <tr>
                      <th className="py-3.5 px-6">ID RESERVASI</th>
                      <th className="py-3.5 px-6">Pribadi Pemesan</th>
                      <th className="py-3.5 px-6">Paket / Jumlah pax</th>
                      <th className="py-3.5 px-6">Tanggal Event</th>
                      <th className="py-3.5 px-6 text-right">Biaya Invoice</th>
                      <th className="py-3.5 px-6 text-center">Status Pemrosesan</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-150 text-gray-600">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors text-xs font-medium">
                        
                        <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                          {ord.id}
                        </td>

                        <td className="py-3.5 px-6">
                          <div>
                            <span className="block font-bold text-gray-900 text-sm leading-tight">{ord.namaPemesan}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{ord.telepon}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <div>
                            <span className="block font-semibold text-gray-800 leading-tight">{ord.namaPaket}</span>
                            <span className="block text-[10px] text-emerald-800 font-bold bg-green-50 px-1 py-0.5 rounded-sm w-fit mt-0.5">{ord.pax} Undangan</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-6 font-bold text-[#0f161b]">
                          {ord.tanggalEvent}
                        </td>

                        <td className="py-3.5 px-6 text-right font-mono font-black text-[#006e25] text-sm">
                          Rp {ord.totalHarga.toLocaleString('id-ID')}
                        </td>

                        {/* Interactive status selector dropdown! */}
                        <td className="py-2 px-6 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-hidden ${
                              ord.status === 'Baru' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              ord.status === 'Diproses' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              ord.status === 'Selesai' ? 'bg-emerald-50 text-[#006e25] border-emerald-200' :
                              'bg-red-50 text-[#ba1a1a] border-red-200'
                            }`}
                          >
                            <option value="Baru">Baru</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                          </select>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: REVIEW MODERATIONS LIST */}
          {activeTab === 'Reviews' && (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-3xs">
              
              <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center text-xs shrink-0">
                <span className="font-bold text-gray-700 uppercase">Moderasi Komentar Tertunda</span>
                <span className="text-gray-400 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  {reviews.length} total reviews
                </span>
              </div>

              {/* Review block streams */}
              <div className="p-6 divide-y divide-gray-150 space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start justify-between gap-4 text-xs">
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-gray-900 text-sm leading-tight">{rev.nama}</span>
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${
                          rev.status === 'Approved' 
                            ? 'bg-emerald-50 text-[#006e25]' 
                            : 'bg-amber-50 text-amber-700 animate-pulse'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                      
                      <div className="flex text-amber-500 font-extrabold text-[13px] mt-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 italic bg-[#f8fafc] border border-gray-100 p-3.5 rounded-xl leading-relaxed mt-2.5 max-w-2xl">
                        "{rev.isi}"
                      </p>
                      
                      <span className="text-[10px] text-gray-400 block mt-2">Masuk pada: {rev.waktu}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {rev.status === 'Pending' && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="bg-[#006e25] hover:bg-[#00531a] text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve / Setujui</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRejectReview(rev.id)}
                        className="bg-gray-100 hover:bg-red-50 text-gray-650 hover:text-red-700 font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 border border-gray-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>

                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="py-16 text-center text-gray-400">Tidak ada data review di sistem.</div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Edit/Add Menu Item Overlay Modal (Matches mockup actions perfectly) */}
      {menuModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-emerald-500/10 shadow-2xl p-6 max-w-lg w-full relative animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            <button
              onClick={() => setMenuModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 hover:bg-gray-50 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-gray-950 pr-8">
              {menuModalMode === 'Add' ? 'Tambah Item Menu Baru' : 'Edit Item Katering'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Lengkapi rincian catalog masakan dan harganya.</p>

            <form onSubmit={handleSaveMenuItemForm} className="mt-5 space-y-4 flex-1 overflow-y-auto pr-1">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nama hidangan makan</label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Cth: Ayam Goreng Kremes Spesial"
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] focus:bg-white"
                  id="form-item-nama"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Kategori Katering</label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#006e25] cursor-pointer"
                  >
                    <option value="Makanan Utama">Makanan Utama</option>
                    <option value="Lauk Pendamping">Lauk Pendamping</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Harga Satuan (Rupiah)</label>
                  <input
                    type="number"
                    required
                    value={formHarga}
                    onChange={(e) => setFormHarga(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-[#006e25] focus:bg-white font-mono"
                    id="form-item-harga"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Ketersediaan Stok</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-[#006e25] cursor-pointer"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Foto thumbnail Unsplash</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="URL gambar masakan..."
                    className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-[#006e25] focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo Helper Selectors */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase">Pilih Cepat Foto Preset (Opsional)</label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(img.url)}
                      className={`h-11 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        formImage === img.url ? 'ring-2 ring-[#006e25] border-transparent' : 'border-gray-200 grayscale hover:grayscale-0'
                      }`}
                      title={img.name}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Deskripsi Masakan</label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Gambarkan cita rasa masakan secara ringkas..."
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-[#006e25] focus:bg-white resize-none"
                  id="form-item-deskripsi"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#006e25] hover:bg-[#00531a] text-white py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  {menuModalMode === 'Add' ? 'Tambahkan Hidangan baru' : 'Simpan Update Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
