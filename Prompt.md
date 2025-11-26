# Amazon Clone Mobile App - Build Prompt

## Tech Stack
• React Native 0.82.1, Expo 54.0.25, expo-router 6.0.15
• gluestack-ui 3.0.10, lucide-react-native 0.554.0
• expo-image-picker 17.0.8, react-native-maps 1.26.18
• json-server 0.17.4 (backend)

## Backend (json-server only)
• Create `/backend/db.json` with collections:
• **users**: id, email, password, name, phone, addresses[]
• **products**: id, name, price, originalPrice, categoryId, images[], inStock, stockQuantity, rating, brand, isDeal, isBestseller
• **categories**: id, name, image, order
• **carts**: id, userId, items[], totalAmount
• **orders**: id, orderNumber, userId, items[], totalAmount, shippingAddress, status, statusHistory[], paymentStatus
• **reviews**: id, productId, userId, userName, rating, comment
• **wishlist**: id, userId, products[]
• **banners**: id, image, title, link
• Seed: 10 categories, 100 products, demo user (demo@example.com/password123), 30 reviews, 10 orders
• Run: `json-server --watch db.json --port 3000`

## Frontend Structure
• **/app (expo-router)**: (auth)/login,register | (tabs)/index,categories,cart,profile | product/[id] | search | checkout | orders/index,[id] | wishlist | addresses/index,add | reviews/[productId],add
• **/components**: ProductCard, CartItem, OrderCard, Header, SearchBar, EmptyState, FilterModal, CategoryList, BannerCarousel
• **/context**: AuthContext, CartContext, WishlistContext
• **/services**: api.ts (axios), storage.ts (AsyncStorage)
• **/hooks**: useProducts, useCart, useDebounce

## Key Screens
• **Home**: Header (logo, search, cart badge) | Banner carousel | Category scroll | Deals & bestsellers sections
• **Product Detail**: Image carousel | Price | Rating | Add to Cart/Buy Now | Wishlist heart | Reviews
• **Cart**: Items list (qty +/-, remove) | Price summary | Checkout button
• **Search**: Debounced input | Filter/Sort modals | Product grid | Pagination
• **Checkout**: Address selection | Items | Payment method | Place Order
• **Orders**: List with status filters | Detail screen with timeline
• **Profile**: Avatar | Menu: Orders, Addresses, Wishlist, Logout
• **Auth**: Login, Register, Forgot Password

## Contexts & API
• **AuthContext**: user, isAuthenticated | login(), register(), logout() | Store in AsyncStorage
• **CartContext**: items[], totalAmount, itemCount | addToCart(), updateQuantity(), removeFromCart()
• **API Service**: Axios with interceptors | productAPI, cartAPI, orderAPI, reviewAPI, wishlistAPI
• **Endpoints**: GET /products?categoryId=x&q=search&_sort=price | GET /orders?userId=x | POST /carts

## Core Features
• **Search**: Debounce 500ms | Save recent searches (max 10)
• **Filter/Sort**: Price range, category, rating (5★,4+), in-stock | Sort by price, rating, newest
• **Cart**: Badge count | Calculate shipping (free >$50), tax 8% | Sync with backend
• **Checkout**: Validate address/payment | Generate order number (AMZ-YYYYMMDD-XXXX) | Clear cart
• **Orders**: Filter by status | Track shipped | Cancel pending | Reorder
• **Wishlist**: Toggle heart icon | Sync backend
• **Reviews**: Rating distribution | Filter/sort | Write if purchased

## UI/UX
• gluestack-ui components | Bottom tabs: Home, Categories, Cart (badge), Profile
• Loading: Spinner, skeleton, button disabled | Error: Retry, field errors
• FlatList optimization | Pagination 20/page | Pull-to-refresh
• Responsive: Portrait/landscape, safe areas
• Colors: Primary blue, secondary orange, success green, error red

## Key Components
• **ProductCard**: Image, name, price, discount badge, rating, Add to Cart button, wishlist heart
• **CartItem**: Image, name, price, qty controls (+/-), remove button
• **OrderCard**: Order number, date, status badge (color-coded), total, image
• **Header**: Logo, search bar, cart icon with badge (sticky)
• **EmptyState**: Icon, message, action button

## Build Steps
1. Setup Expo + TypeScript + expo-router
2. Install dependencies + configure gluestack-ui
3. Create folder structure
4. Define TypeScript interfaces
5. Setup API service with axios interceptors
6. Implement contexts (Auth, Cart, Wishlist)
7. Build reusable components
8. Implement screens: Auth → Home → Product → Cart → Checkout → Orders
9. Add navigation and features
10. Test on iOS & Android

Build a production-ready Amazon clone mobile app demonstrating React Native best practices.