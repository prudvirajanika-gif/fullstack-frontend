import type { Category, Food, Order, OrderStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Initial Mock Seed Data for Instant Fallback
const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Biryani & Rice', description: 'Aromatic Dum Biryanis and specialty rice bowls' },
  { id: 'cat-2', name: 'Curries & Gravies', description: 'Rich North & South Indian regional curries' },
  { id: 'cat-3', name: 'Tandoor & Starters', description: 'Clay-oven roasted kebabs and crisp appetizers' },
  { id: 'cat-4', name: 'Breads & Accompaniments', description: 'Fresh Naan, Roti, and Parathas' },
  { id: 'cat-5', name: 'Desserts & Beverages', description: 'Authentic Indian sweets and refreshing drinks' },
];

const MOCK_FOODS: Food[] = [
  {
    id: 'f-1',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Fragrant basmati rice layered with spiced marinated chicken, saffron milk, and fried onions.',
    price: 349,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    categoryId: 'cat-1',
    categoryName: 'Biryani & Rice',
    available: true,
    isVeg: false,
    rating: 4.8,
    preparationTimeMin: 25,
  },
  {
    id: 'f-2',
    name: 'Paneer Butter Masala',
    description: 'Fresh cottage cheese cubes simmered in a creamy, buttery tomato-cashew gravy.',
    price: 289,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop',
    categoryId: 'cat-2',
    categoryName: 'Curries & Gravies',
    available: true,
    isVeg: true,
    rating: 4.7,
    preparationTimeMin: 20,
  },
  {
    id: 'f-3',
    name: 'Tandoori Murgh (Half)',
    description: 'Tender chicken marinated in Kashmiri chili, hung curd, and stone-ground spices roasted in tandoor.',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop',
    categoryId: 'cat-3',
    categoryName: 'Tandoor & Starters',
    available: true,
    isVeg: false,
    rating: 4.9,
    preparationTimeMin: 30,
  },
  {
    id: 'f-4',
    name: 'Dal Makhani Heritage',
    description: 'Slow-cooked whole black lentils simmered overnight with cream, butter, and mild spices.',
    price: 239,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
    categoryId: 'cat-2',
    categoryName: 'Curries & Gravies',
    available: true,
    isVeg: true,
    rating: 4.6,
    preparationTimeMin: 15,
  },
  {
    id: 'f-5',
    name: 'Butter Garlic Naan (2 pcs)',
    description: 'Soft leavened tandoori flatbread brushed with garlic butter and fresh coriander.',
    price: 99,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    categoryId: 'cat-4',
    categoryName: 'Breads & Accompaniments',
    available: true,
    isVeg: true,
    rating: 4.8,
    preparationTimeMin: 10,
  },
  {
    id: 'f-6',
    name: 'Gulab Jamun with Rabri (2 pcs)',
    description: 'Deep-fried milk dumplings soaked in cardamom saffron syrup served over chilled thick rabri.',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop',
    categoryId: 'cat-5',
    categoryName: 'Desserts & Beverages',
    available: true,
    isVeg: true,
    rating: 4.9,
    preparationTimeMin: 10,
  },
];

let localOrders: Order[] = [
  {
    id: 'ORD-7821',
    customerName: 'Prudvi Raj',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Flat 402, Royal Palms, Indiranagar, Bengaluru, 560038',
    items: [
      { foodId: 'f-1', name: 'Hyderabadi Chicken Dum Biryani', price: 349, quantity: 2 },
      { foodId: 'f-5', name: 'Butter Garlic Naan (2 pcs)', price: 99, quantity: 1 },
    ],
    subtotal: 797,
    gstTax: 39.85,
    deliveryFee: 0,
    totalAmount: 836.85,
    status: 'PREPARING',
    paymentMethod: 'ONLINE',
    otp: '4921',
    createdAt: new Date().toISOString(),
    notes: 'Please provide extra mint chutney and lemon wedges.',
  },
];

export const api = {
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  async getHealth(): Promise<{ status: string; uptime: number; db: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'mock-offline-mode', uptime: 0, db: 'in-memory-fallback' };
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.data || data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  async getFoods(categoryId?: string, search?: string): Promise<Food[]> {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);

      const url = `${API_BASE_URL}/foods${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch foods');
      const data = await res.json();
      return data.data || data;
    } catch {
      let filtered = [...MOCK_FOODS];
      if (categoryId) {
        filtered = filtered.filter((f) => f.categoryId === categoryId);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
        );
      }
      return filtered;
    }
  },

  async createOrder(orderPayload: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: { foodId: string; quantity: number }[];
    paymentMethod: 'ONLINE' | 'COD';
    notes?: string;
  }): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error('Failed to create order on server');
      const data = await res.json();
      return data.data || data;
    } catch {
      // Local fallback simulation
      const orderItems = orderPayload.items.map((i) => {
        const food = MOCK_FOODS.find((f) => f.id === i.foodId) || {
          name: 'Custom Dish',
          price: 250,
        };
        return {
          foodId: i.foodId,
          name: food.name,
          price: food.price,
          quantity: i.quantity,
        };
      });

      const subtotal = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      const gstTax = Math.round(subtotal * 0.05 * 100) / 100;
      const deliveryFee = subtotal > 299 ? 0 : 40;
      const totalAmount = subtotal + gstTax + deliveryFee;

      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: orderPayload.customerName,
        customerPhone: orderPayload.customerPhone,
        deliveryAddress: orderPayload.deliveryAddress,
        items: orderItems,
        subtotal,
        gstTax,
        deliveryFee,
        totalAmount,
        status: 'PENDING',
        paymentMethod: orderPayload.paymentMethod,
        otp: `${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        notes: orderPayload.notes,
      };

      localOrders.unshift(newOrder);
      return newOrder;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.data || data;
    } catch {
      return localOrders;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      const data = await res.json();
      return data.data || data;
    } catch {
      const order = localOrders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
      return order!;
    }
  },
};
