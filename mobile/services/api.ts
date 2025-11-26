import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { Product, Category, Cart, Order, Wishlist, Banner } from '../types';

// Helper to simulate Axios response structure
const response = <T>(data: T) => ({ data });

export const productAPI = {
    getAll: async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return response(products);
    },
    getById: async (id: number | string) => {
        const docRef = doc(db, 'products', id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return response({ id: docSnap.id, ...docSnap.data() } as Product);
        }
        throw new Error('Product not found');
    },
    getCategories: async () => {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        // Sort by order
        categories.sort((a, b) => a.order - b.order);
        return response(categories);
    },
    getBanners: async () => {
        const querySnapshot = await getDocs(collection(db, 'banners'));
        const banners = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
        return response(banners);
    },
};

export const cartAPI = {
    getCart: async (userId: string) => {
        const q = query(collection(db, 'carts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const carts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cart));
        return response(carts);
    },
    addToCart: async (cartData: any) => {
        const docRef = await addDoc(collection(db, 'carts'), cartData);
        return response({ id: docRef.id, ...cartData });
    },
    updateCart: async (id: string, data: any) => {
        const docRef = doc(db, 'carts', id);
        await updateDoc(docRef, data);
        return response(data);
    },
};

export const orderAPI = {
    create: async (orderData: any) => {
        const docRef = await addDoc(collection(db, 'orders'), orderData);
        return response({ id: docRef.id, ...orderData });
    },
    getByUser: async (userId: string) => {
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        return response(orders);
    },
    getById: async (id: number | string) => {
        const docRef = doc(db, 'orders', id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return response({ id: docSnap.id, ...docSnap.data() } as Order);
        }
        throw new Error('Order not found');
    },
};

export const wishlistAPI = {
    getByUser: async (userId: string) => {
        const q = query(collection(db, 'wishlist'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const wishlists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wishlist));
        return response(wishlists);
    },
    create: async (data: any) => {
        const docRef = await addDoc(collection(db, 'wishlist'), data);
        return response({ id: docRef.id, ...data });
    },
    update: async (id: string, data: any) => {
        const docRef = doc(db, 'wishlist', id);
        await updateDoc(docRef, data);
        return response(data);
    }
};

// Export a default object for backward compatibility if needed, 
// but preferably use named exports.
const api = {
    get: async (url: string) => {
        // Basic implementation for banners if needed
        if (url === '/banners') {
            const querySnapshot = await getDocs(collection(db, 'banners'));
            const banners = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return response(banners);
        }
        throw new Error(`GET ${url} not implemented in Firestore adapter`);
    },
    post: async (url: string, data: any) => {
        throw new Error(`POST ${url} not implemented in Firestore adapter`);
    },
    patch: async (url: string, data: any) => {
        throw new Error(`PATCH ${url} not implemented in Firestore adapter`);
    }
};

export default api;
