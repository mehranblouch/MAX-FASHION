export interface Product {
  id: string;
  name: string;
  pieces: number;
  color: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
}

export interface Order {
  id: string;
  fullName: string;
  email: string;
  city: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
  productId: string;
  productName?: string;
  status_dispatched: number;
  status_delivered: number;
  status_payment_received: number;
  createdAt: string;
}

export interface Settings {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
}
