import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      
      addToCart: (item) =>
        set((state) => {
          const { id, name, price, image } = item;
          const existing = state.cartItems.find((i) => i.id === id);
          
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          
          return {
            cartItems: [
              ...state.cartItems,
              { id, name, price, image, quantity: 1 },
            ],
          };
        }),
      
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        })),
      
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
