import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../services/api';

interface WishlistContextType {
    wishlist: string[]; // Product IDs
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [wishlistId, setWishlistId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setWishlistId(null);
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const response = await wishlistAPI.getByUser(user.id);
            const wishlists = response.data;
            if (wishlists.length > 0) {
                setWishlist(wishlists[0].products);
                setWishlistId(wishlists[0].id);
            } else {
                // Create new wishlist
                const response = await wishlistAPI.create({ userId: user.id, products: [] });
                setWishlistId(response.data.id);
                setWishlist([]);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!user || !wishlistId) return;

        let newWishlist;
        if (wishlist.includes(productId)) {
            newWishlist = wishlist.filter(id => id !== productId);
        } else {
            newWishlist = [...wishlist, productId];
        }

        setWishlist(newWishlist);
        try {
            await wishlistAPI.update(wishlistId, { products: newWishlist });
        } catch (error) {
            console.error('Error updating wishlist:', error);
            // Revert on error
            setWishlist(wishlist);
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
