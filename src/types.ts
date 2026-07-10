export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  prepTime: string;
  calories: number;
  image: string;
  description: string;
  popular?: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export type OrderPhase = 'idle' | 'preparing' | 'dispatched' | 'delivered';

export interface OrderStatus {
  phase: OrderPhase;
  timeLeft: number; // in seconds
  address: string;
  customerName: string;
}
