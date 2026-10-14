import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, Shield, Bike, ChefHat, Check } from 'lucide-react';
import type { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  order: Order | null;
  allOrders: Order[];
  onSelectOrder: (order: Order) => void;
}

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Order Confirmed', desc: 'Received by kitchen' },
  { status: 'PREPARING', label: 'Preparing Food', desc: 'Chef cooking with fresh ingredients' },
  { status: 'READY', label: 'Order Packed', desc: 'Awaiting delivery partner pickup' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider en route to your location' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Handshake completed with OTP' },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, allOrders, onSelectOrder }) => {
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Order Selected</h2>
        <p className="text-sm text-slate-400">
          Place an order from the menu or select one of your previous orders below.
        </p>
        {allOrders.length > 0 && (
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {allOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => onSelectOrder(o)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 border border-slate-700 font-semibold"
              >
                {o.id} ({o.status})
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Order Tracking</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
              #{order.id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            {order.status === 'DELIVERED'
              ? 'Order Delivered Successfully!'
              : 'Your delicious meal is on the way!'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Est. Delivery in 25-35 mins
          </p>
        </div>

        {/* 4-Digit Handshake OTP Card */}
        <div className="flex items-center space-x-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5">
          <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delivery OTP</p>
            <p className="text-xl font-black tracking-widest text-amber-400 font-mono">{order.otp}</p>
          </div>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 shadow-md">
        <div className="relative">
          {/* Progress Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-700 -z-0 hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.status} className="flex md:flex-col items-center md:text-center space-x-3 md:space-x-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                        : isCurrent
                        ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold animate-pulse'
                        : 'bg-slate-800 border-slate-600 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="md:mt-2">
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-400 hidden md:block leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delivery Map & Driver Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Animated Map Simulation */}
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bike className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live GPS Route</span>
            </div>
            <span className="text-xs text-emerald-400 font-medium">● GPS Signal Active</span>
          </div>

          {/* SVG Map Graphic */}
          <div className="relative h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {/* SVG Roads Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#475569" strokeWidth="6" />
              <line x1="90%" y1="20%" x2="90%" y2="80%" stroke="#475569" strokeWidth="6" />
              <line x1="10%" y1="20%" x2="10%" y2="80%" stroke="#475569" strokeWidth="6" />
              <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#475569" strokeWidth="6" />
              <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#475569" strokeWidth="4" strokeDasharray="6" />
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#475569" strokeWidth="4" strokeDasharray="6" />
            </svg>

            {/* Restaurant Pin */}
            <div className="absolute top-[20%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded mt-1 border border-slate-700">
                Kitchen Hub
              </span>
            </div>

            {/* Customer Pin */}
            <div className="absolute top-[75%] right-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded mt-1 border border-slate-700">
                Your Address
              </span>
            </div>

            {/* Moving Scooter Partner Pin */}
            <div
              className="absolute flex flex-col items-center transition-all duration-1000"
              style={{
                top: order.status === 'OUT_FOR_DELIVERY' ? '50%' : order.status === 'DELIVERED' ? '75%' : '20%',
                left: order.status === 'OUT_FOR_DELIVERY' ? '50%' : order.status === 'DELIVERED' ? '82%' : '18%',
              }}
            >
              <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-4 ring-amber-500/20">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-full mt-1">
                🛵 Ramesh
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Destination: {order.deliveryAddress}</span>
            <span className="text-amber-400 font-semibold">ETA: ~18 mins</span>
          </div>
        </div>

        {/* Assigned Delivery Partner Card & Order Summary */}
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Delivery Partner</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-base text-amber-400 border border-slate-600">
                RK
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Ramesh Kumar</h4>
                  <span className="text-xs font-bold text-amber-400">★ 4.9</span>
                </div>
                <p className="text-[11px] text-slate-400">Hero Splendor • KA-01-EQ-4921</p>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Vaccinated & Temperature Checked</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling delivery partner Ramesh Kumar (${order.customerPhone})...`)}
              className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Delivery Partner</span>
            </button>
          </div>

          {/* Items Summary in this Order */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order Items</h3>
            <div className="divide-y divide-slate-700/60">
              {order.items.map((i, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-slate-300">
                  <span>
                    {i.quantity}x {i.name}
                  </span>
                  <span className="font-semibold text-white">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-amber-400">
              <span>Paid via {order.paymentMethod}</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
