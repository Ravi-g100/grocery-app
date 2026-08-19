import { Product } from './models/product';


// ==========================================
// ORDER
// ==========================================

export interface Order {

  id: number;

  user_id: number;

  date: string;

  items: OrderItem[];

  total: number;

  payment: string;

  status:
    | 'Order Placed'
    | 'Pending'
    | 'Confirmed'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';

  fullname: string;

  mobile: string;

  email: string;

  address: string;

  city: string;

  pincode: string;

}


// ==========================================
// ORDER ITEM
// ==========================================

export interface OrderItem {

  // Frontend product information
  product: Product;

  // MySQL order_items fields
  product_id: number;

  quantity: number;

  price: number;

}