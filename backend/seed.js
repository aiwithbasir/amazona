import admin from 'firebase-admin'; // Use default import for firebase-admin
import { getFirestore } from 'firebase-admin/firestore'; // Import Firestore from admin
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'clone-final-29f3b-firebase-adminsdk-fbsvc-6edff5612c.json'); // Adjust path
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore(); // Get Firestore from the Admin SDK instance

const dbPath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function seedDatabase() {
    console.log('Starting seed...');

    // Seed Users
    if (data.users) {
        console.log(`Seeding ${data.users.length} users...`);
        for (const user of data.users) {
            await db.collection('users').doc(user.id.toString()).set(user);
        }
    }

    // Seed Products
    if (data.products) {
        console.log(`Seeding ${data.products.length} products...`);
        for (const product of data.products) {
            await db.collection('products').doc(product.id.toString()).set(product);
        }
    }

    // Seed Categories
    if (data.categories) {
        console.log(`Seeding ${data.categories.length} categories...`);
        for (const category of data.categories) {
            await db.collection('categories').doc(category.id.toString()).set(category);
        }
    }

    // Seed Carts
    if (data.carts) {
        console.log(`Seeding ${data.carts.length} carts...`);
        for (const cart of data.carts) {
            await db.collection('carts').doc(cart.id.toString()).set(cart);
        }
    }

    // Seed Orders
    if (data.orders) {
        console.log(`Seeding ${data.orders.length} orders...`);
        for (const order of data.orders) {
            await db.collection('orders').doc(order.id.toString()).set(order);
        }
    }

    // Seed Reviews
    if (data.reviews) {
        console.log(`Seeding ${data.reviews.length} reviews...`);
        for (const review of data.reviews) {
            await db.collection('reviews').doc(review.id.toString()).set(review);
        }
    }

    // Seed Wishlist
    if (data.wishlist) {
        console.log(`Seeding ${data.wishlist.length} wishlists...`);
        for (const item of data.wishlist) {
            // Use userId as document ID for wishlist for easier lookup
            await db.collection('wishlist').doc(item.userId.toString()).set(item);
        }
    }

    // Seed Banners
    if (data.banners) {
        console.log(`Seeding ${data.banners.length} banners...`);
        for (const banner of data.banners) {
            await db.collection('banners').doc(banner.id.toString()).set(banner);
        }
    }

    console.log('Seed complete!');
}

seedDatabase().catch(console.error);
