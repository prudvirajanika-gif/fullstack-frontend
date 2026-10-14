import React from 'react';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import type { Food } from '../types';

interface FoodCardProps {
  food: Food;
  quantityInCart: number;
  onAddToCart: (food: Food) => void;
  onUpdateQuantity: (foodId: string, quantity: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <div className="group bg-slate-800/60 rounded-2xl border border-slate-700/80 overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between">
      {/* Food Image & Dietary Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* FSSAI Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm p-1 rounded border border-slate-700">
          <div
            className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${
              food.isVeg ? 'border-emerald-500' : 'border-rose-500'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Rating & Prep Time Chips */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-400 text-xs font-semibold backdrop-blur-sm border border-slate-700">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{food.rating}</span>
          </div>
        </div>

        <div className="absolute bottom-2 left-3 flex items-center space-x-1 text-slate-300 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{food.preparationTimeMin} mins</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-100 text-base leading-snug group-hover:text-amber-400 transition-colors">
              {food.name}
            </h3>
          </div>
          <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold text-amber-400">₹{food.price}</span>
            <span className="text-[10px] text-slate-400">+5% GST</span>
          </div>

          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(food)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-semibold text-xs border border-amber-500/40 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-700/80 rounded-xl px-2 py-1 border border-slate-600">
              <button
                onClick={() => onUpdateQuantity(food.id, quantityInCart - 1)}
                className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white rounded hover:bg-slate-600 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-amber-400 min-w-4 text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(food.id, quantityInCart + 1)}
                className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white rounded hover:bg-slate-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
