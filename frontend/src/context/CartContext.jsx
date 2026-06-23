import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState('0.00');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartTotal('0.00');
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCartItems(res.data.cart);
      setCartTotal(res.data.total);
      setCartCount(res.data.itemCount);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.add({ product_id: productId, quantity });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity <= 0) {
        await cartAPI.remove(cartItemId);
      } else {
        await cartAPI.update(cartItemId, { quantity });
      }
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartAPI.remove(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
      setCartTotal('0.00');
      setCartCount(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
