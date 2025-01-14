import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAllProducts } from '@/lib/fetchData';

interface Product {
  thumbnail: string | undefined;
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  images: string[];
  warrantyInformation: string;
  brand: string;
}

interface ProductsStore {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  fetchProducts: () => Promise<void>;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchAllProducts();
          set({ products: data, isLoading: false });
          console.log("kullanıldı");
          
        } catch (error) {
          set({ error: error as Error, isLoading: false });
        }
      },
      updateProduct: (updatedProduct: Product) => {
        const products = get().products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        set({ products });
      },
      deleteProduct: (id: number) => {
        const products = get().products.filter(product => product.id !== id);
        set({ products });
      }
    }),
    {
      name: 'products-storage',
      partialize: (state) => ({ products: state.products }),
    }
  )
);

export default useProductsStore;