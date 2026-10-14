export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
  available: boolean;
  isVeg: boolean;
  rating: number;
  preparationTimeMin: number;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  gstTax: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentMethod: 'ONLINE' | 'COD';
  otp: string;
  createdAt: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
