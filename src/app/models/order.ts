import { CartItem } from './cart-item';

export interface Order {
  id: number;
  userEmail: string;
  userName: string;
  date: string;
  items: CartItem[];
  note: string;
  total: number;
}
