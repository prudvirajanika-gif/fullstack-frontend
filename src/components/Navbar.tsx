import React from 'react';
import { ShoppingBag, UtensilsCrossed, ChefHat, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'menu' | 'tracker' | 'kitchen';
  setActiveTab: (tab: 'menu' | 'tracker' | 'kitchen') => void;
  cartCount: number;
  openCart: () => void;
  serverStatus: { status: string; db: string };
  onRunDemo: () => void;
  isDemoRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  serverStatus,
  onRunDemo,
  isDemoRunning,
}) => {
  const isOnline = serverStatus.status === 'ok';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white">CraveCraft</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Real-Time Food Delivery Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'menu'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tracker'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Live Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'kitchen'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen Hub</span>
            </button>
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Live Autopilot Demo Button */}
            <button
              onClick={onRunDemo}
              disabled={isDemoRunning}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                isDemoRunning
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isDemoRunning ? 'Simulating Demo...' : '1-Click Demo'}</span>
            </button>

            {/* Backend Connectivity Status */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-slate-300">{isOnline ? 'API Connected' : 'Mock/Offline'}</span>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow-md transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
