import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the types for cart items and state
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  estimated_time: number;
}

interface CartState {
  items: CartItem[];
}

interface CartContextProps extends CartState {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Initial state
const initialState: CartState = {
  items: [],
};

// Create context
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Reducer function to manage state
function cartReducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity / 2; // increment quantity
        return { items: updatedItems };
      }
      // Add new item to cart
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return { items: updatedItems };
    }
    case "CLEAR_CART": {
      return { items: [] };
    }
    default:
      return state;
  }
}

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    // Always add quantity as 1 when called from Menu component
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity: 1 } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
