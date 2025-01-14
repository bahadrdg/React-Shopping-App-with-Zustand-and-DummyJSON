import {create} from "zustand";

interface CartItem {
  id: number;
  title: string;
  thumbnail: string;
  quantity: number; 
  price: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  loadCartFromLocalStorage: () => void;
  getTotalPrice: () => number;
  removeAllCart:()=>void;

}

const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  loadCartFromLocalStorage: () => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      set({ cart: JSON.parse(cartData) });
    }
  },

  addToCart: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);

      if (existingItem) {
        const updatedCart = state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }

      const updatedCart = [...state.cart, { ...item }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeFromCart: (id: number) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  increaseQuantity: (id: number) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  decreaseQuantity: (id: number) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  getTotalPrice: () => {
    const state = get();
    return state.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  removeAllCart: () => {
    set({ cart: [] });
    localStorage.removeItem("cart");
  },
}));

export default useCartStore;