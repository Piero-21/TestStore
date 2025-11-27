import { Product, Category } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};