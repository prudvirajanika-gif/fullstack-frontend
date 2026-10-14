import React from 'react';
import { ChefHat, CheckCircle2, Clock, Bike, Check, RefreshCw } from 'lucide-react';
import type { Order, OrderStatus } from '../types';

interface KitchenHubProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onRefresh: () => void;
  isLoading: boolean;
}

export const KitchenHub: React.FC<KitchenHubProps> = ({
  orders,
  onUpdateStatus,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kitchen Operations Hub</h1>
            <p className="text-xs text-slate-400">
              Live Order Queue & Kitchen Workflow Pipeline ({orders.length} active orders)
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Kitchen queue is clear</h3>
          <p className="text-xs text-slate-500">Incoming customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-600 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : order.status === 'PREPARING'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse'
                          : order.status === 'READY'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : order.status === 'OUT_FOR_DELIVERY'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-300">
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-slate-400 text-[11px]">{order.customerPhone}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{order.deliveryAddress}</p>
                  </div>

                  {order.notes && (
                    <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 italic">
                      "{order.notes}"
                    </div>
                  )}

                  {/* Items Ordered List */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-1.5 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>
                          <strong className="text-white">{i.quantity}x</strong> {i.name}
                        </span>
                        <span>₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                    <span className="font-mono text-amber-400">OTP: {order.otp}</span>
                  </div>

                  {!isDelivered ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                          className="col-span-2 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'READY')}
                          className="col-span-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Food Ready</span>
                        </button>
                      )}

                      {order.status === 'READY' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                          className="col-span-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Dispatch Rider</span>
                        </button>
                      )}

                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                          className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify OTP & Deliver</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      ✓ Completed & Delivered
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
