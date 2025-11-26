import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    items: CartItem[];
    totalAmount: number;
    itemCount: number;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartId, setCartId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setItems([]);
            setCartId(null);
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await cartAPI.getCart(user.id);
            const carts = response.data;
            if (carts.length > 0) {
                const cart = carts[0];
                setItems(cart.items);
                setCartId(cart.id);
            } else {
                // Create a new cart for the user
                const newCart = { userId: user.id, items: [], totalAmount: 0 };
                const createResponse = await cartAPI.addToCart(newCart);
                setCartId(createResponse.data.id);
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const syncCart = async (newItems: CartItem[]) => {
        if (!user || !cartId) return;

        const totalAmount = newItems.reduce((sum, item) => {
            return sum + (item.product?.price || 0) * item.quantity;
        }, 0);

        try {
            await cartAPI.updateCart(cartId, { items: newItems, totalAmount });
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    const addToCart = async (product: Product, quantity = 1) => {
        const existingItemIndex = items.findIndex(item => item.productId === product.id);
        let newItems = [...items];

        if (existingItemIndex >= 0) {
            newItems[existingItemIndex].quantity += quantity;
        } else {
            newItems.push({ productId: product.id, quantity, product });
        }

        setItems(newItems);
        await syncCart(newItems);
    };

    const removeFromCart = async (productId: string) => {
        const newItems = items.filter(item => item.productId !== productId);
        setItems(newItems);
        await syncCart(newItems);
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        const newItems = items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        );
        setItems(newItems);
        await syncCart(newItems);
    };

    const clearCart = async () => {
        setItems([]);
        await syncCart([]);
    };

    const totalAmount = items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            totalAmount,
            itemCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
