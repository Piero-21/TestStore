export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = string;

export enum SortOption {
  DEFAULT = 'default',
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
}