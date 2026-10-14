import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FoodCard } from './components/FoodCard';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { KitchenHub } from './components/KitchenHub';
import { api } from './services/api';
import type { Category, Food, CartItem, Order, OrderStatus } from './types';
import { Search, Flame, Filter } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'tracker' | 'kitchen'>('menu');
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegFilterOnly, setVegFilterOnly] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [serverStatus, setServerStatus] = useState<{ status: string; db: string }>({ status: 'checking', db: '' });
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial Data Fetch
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [health, fetchedCategories, fetchedFoods, fetchedOrders] = await Promise.all([
          api.getHealth(),
          api.getCategories(),
          api.getFoods(),
          api.getOrders(),
        ]);

        setServerStatus({ status: health.status, db: health.db });
        setCategories(fetchedCategories);
        setFoods(fetchedFoods);
        setOrders(fetchedOrders);
        if (fetchedOrders.length > 0) {
          setActiveOrder(fetchedOrders[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Filter Foods
  const filteredFoods = foods.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.categoryId === selectedCategory;
    const matchesVeg = !vegFilterOnly || f.isVeg;
    const matchesSearch =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  // Cart operations
  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.food.id === food.id);
      if (existing) {
        return prev.map((i) => (i.food.id === food.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.food.id !== foodId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.food.id === foodId ? { ...i, quantity } : i))
      );
    }
  };

  const handleCheckout = async (details: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: 'ONLINE' | 'COD';
    notes?: string;
  }) => {
    setIsSubmittingOrder(true);
    try {
      const newOrder = await api.createOrder({
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        deliveryAddress: details.deliveryAddress,
        paymentMethod: details.paymentMethod,
        notes: details.notes,
        items: cartItems.map((i) => ({ foodId: i.food.id, quantity: i.quantity })),
      });

      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrder(newOrder);
      setCartItems([]);
      setIsCartOpen(false);
      setActiveTab('tracker');
    } catch (err) {
      alert('Order placement encountered an issue. Please try again.');
      console.error(err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status } : updated));
    }
  };

  const refreshOrders = async () => {
    const updated = await api.getOrders();
    setOrders(updated);
  };

  // 1-Click Autonomous Demo
  const runAutoPilotDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);

    // 1. Pick 2 dishes and place order
    const sampleItems = foods.slice(0, 2).map((f) => ({ foodId: f.id, quantity: 1 }));
    const demoOrder = await api.createOrder({
      customerName: 'Demo Customer (Viva / Evaluation)',
      customerPhone: '+91 99887 76655',
      deliveryAddress: 'Campus Auditorium, Tech Block 3, Bengaluru, 560001',
      paymentMethod: 'ONLINE',
      notes: 'Autonomous Live Demo Simulation Mode',
      items: sampleItems.length > 0 ? sampleItems : [{ foodId: 'f-1', quantity: 2 }],
    });

    setOrders((prev) => [demoOrder, ...prev]);
    setActiveOrder(demoOrder);
    setActiveTab('tracker');

    // 2. Progression simulation
    const stages: OrderStatus[] = ['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    for (let i = 0; i < stages.length; i++) {
      await new Promise((res) => setTimeout(res, 3000));
      await handleUpdateOrderStatus(demoOrder.id, stages[i]);
    }

    setIsDemoRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        serverStatus={serverStatus}
        onRunDemo={runAutoPilotDemo}
        isDemoRunning={isDemoRunning}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'menu' && (
          <div>
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Indian Rupee (₹) Pricing • 5% GST • Real-Time Order Dispatch</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  Authentic Cravings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">Delivered Hot</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Experience seamless food delivery engineered with modern React, Vite, TypeScript, and Express.
                </p>

                {/* Search Bar & Veg Filter */}
                <div className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Biryani, Paneer, Naan, Desserts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Veg Only Toggle */}
                  <button
                    onClick={() => setVegFilterOnly((v) => !v)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shrink-0 w-full sm:w-auto justify-center ${
                      vegFilterOnly
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center rounded-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span>Pure Veg Only</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Navigation Bar */}
            <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  All Specialties ({foods.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Foods Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-64 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800" />
                  ))}
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <Filter className="w-8 h-8 text-slate-600 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-300">No matching dishes found</h3>
                  <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFoods.map((food) => {
                    const inCart = cartItems.find((i) => i.food.id === food.id)?.quantity || 0;
                    return (
                      <FoodCard
                        key={food.id}
                        food={food}
                        quantityInCart={inCart}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Order Tracker View */}
        {activeTab === 'tracker' && (
          <OrderTracker
            order={activeOrder}
            allOrders={orders}
            onSelectOrder={(selected) => setActiveOrder(selected)}
          />
        )}

        {/* Kitchen Hub View */}
        {activeTab === 'kitchen' && (
          <KitchenHub
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onRefresh={refreshOrders}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCartItems([])}
        onCheckout={handleCheckout}
        isSubmitting={isSubmittingOrder}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center space-x-2 text-slate-400 font-semibold">
          <span>CraveCraft Fullstack Platform</span>
          <span>•</span>
          <span>Dual Repository Architecture</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Frontend: React 19 + TypeScript + Vite + Tailwind CSS • Backend: Node.js + Express + TypeScript + MongoDB
        </p>
      </footer>
    </div>
  );
}

export default App;
