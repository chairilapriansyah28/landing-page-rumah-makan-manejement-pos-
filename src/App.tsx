import { useState, useEffect } from 'react';
import CustomerPortal from './components/CustomerPortal';
import AdminPortal from './components/AdminPortal';
import ChatAdmin from './components/ChatAdmin';
import { MenuItem, Review, Order } from './types';
import { INITIAL_MENUS, INITIAL_REVIEWS, INITIAL_ORDERS } from './initialData';

export default function App() {
  // Simple state-based routing: 'customer' | 'admin'
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');

  // Core synchronized datasets
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Defer dataset pre-population with LocalStorage logic binding
  useEffect(() => {
    // 1. Menus
    const cachedMenus = localStorage.getItem('mangkubumi_menus');
    if (cachedMenus) {
      setMenus(JSON.parse(cachedMenus));
    } else {
      setMenus(INITIAL_MENUS);
      localStorage.setItem('mangkubumi_menus', JSON.stringify(INITIAL_MENUS));
    }

    // 2. Reviews
    const cachedReviews = localStorage.getItem('mangkubumi_reviews');
    if (cachedReviews) {
      setReviews(JSON.parse(cachedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('mangkubumi_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    // 3. Orders / Bookings
    const cachedOrders = localStorage.getItem('mangkubumi_orders');
    if (cachedOrders) {
      setOrders(JSON.parse(cachedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('mangkubumi_orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  // Sync methods to maintain storage accuracy
  const updateMenusState = (updatedMenus: MenuItem[]) => {
    setMenus(updatedMenus);
    localStorage.setItem('mangkubumi_menus', JSON.stringify(updatedMenus));
  };

  const updateReviewsState = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('mangkubumi_reviews', JSON.stringify(updatedReviews));
  };

  const updateOrdersState = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('mangkubumi_orders', JSON.stringify(updatedOrders));
  };

  // Callback methods triggered by users
  const handleAddReview = (newReview: Review) => {
    const list = [newReview, ...reviews];
    updateReviewsState(list);
  };

  const handleAddOrder = (newOrder: Order) => {
    const list = [newOrder, ...orders];
    updateOrdersState(list);
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Route Views switcher */}
      {currentView === 'customer' ? (
        <>
          <CustomerPortal 
            menus={menus}
            reviews={reviews}
            onAddReview={handleAddReview}
            onAddOrder={handleAddOrder}
            onNavigateToAdmin={() => setCurrentView('admin')}
          />
          {/* Floating live customer relations agent chat */}
          <ChatAdmin />
        </>
      ) : (
        <AdminPortal 
          menus={menus}
          reviews={reviews}
          orders={orders}
          onUpdateMenu={updateMenusState}
          onUpdateReviews={updateReviewsState}
          onUpdateOrders={updateOrdersState}
        />
      )}

      {/* Floating navigation shortcut to switch views easily */}
      <div 
        className="fixed bottom-6 left-6 z-40" 
        id="portal-view-toggler"
      >
        <button
          onClick={() => setCurrentView(currentView === 'customer' ? 'admin' : 'customer')}
          className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-850 text-white text-[11px] font-bold tracking-wide uppercase px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all opacity-95 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-slate-700/80"
          id="btn-portal-switch"
        >
          <span>{currentView === 'customer' ? 'PORTAL ADMIN 💻' : 'LIHAT LANDING PAGE 🍲'}</span>
        </button>
      </div>
    </div>
  );
}

