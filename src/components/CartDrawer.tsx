import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, Phone, User, FileText } from 'lucide-react';
import type { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (foodId: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: (details: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: 'ONLINE' | 'COD';
    notes?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  isSubmitting,
}) => {
  const [customerName, setCustomerName] = useState('Prudvi Raj');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Royal Palms, Indiranagar, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [notes, setNotes] = useState('Please bring extra mint chutney and cutlery.');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.food.price * curr.quantity, 0);
  const gstTax = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryFee = subtotal > 299 ? 0 : 40;
  const totalAmount = subtotal + gstTax + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Please fill in your delivery details.');
      return;
    }
    onCheckout({ customerName, customerPhone, deliveryAddress, paymentMethod, notes });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Your Food Basket</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                {items.length} {items.length === 1 ? 'dish' : 'dishes'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-300">Your basket is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our gourmet menu and add authentic Indian dishes to start your order.
                </p>
              </div>
            ) : (
              <>
                {/* Free delivery prompt */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between">
                  {subtotal >= 299 ? (
                    <span className="text-emerald-400 font-medium">
                      🎉 Free Delivery unlocked on your order!
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Add ₹{299 - subtotal} more for <strong className="text-white">FREE Delivery</strong>
                    </span>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map(({ food, quantity }) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3.5 h-3.5 border-2 flex items-center justify-center rounded-sm shrink-0 ${
                            food.isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 line-clamp-1">{food.name}</p>
                          <p className="text-xs font-semibold text-amber-400">₹{food.price * quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-700/80 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(food.id, quantity - 1)}
                          className="text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white min-w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(food.id, quantity + 1)}
                          className="text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Form */}
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Details</h3>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
                      <User className="w-3 h-3" /> <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
                      <Phone className="w-3 h-3" /> <span>Mobile Number</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
                      <MapPin className="w-3 h-3" /> <span>Delivery Address</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
                      <FileText className="w-3 h-3" /> <span>Cooking / Delivery Notes</span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Less spicy, call on arrival"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ONLINE')}
                        className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                          paymentMethod === 'ONLINE'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        💳 UPI / Cards
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                          paymentMethod === 'COD'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        💵 Cash on Delivery
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer & Checkout Total */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/95 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%)</span>
                  <span>₹{gstTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-amber-400 text-base">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Order...' : `Pay ₹${totalAmount.toFixed(2)}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
