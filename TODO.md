# SLAP IT — Development TODO

## Project Setup
- [x] Initialize React + Vite + TypeScript (client)
- [x] Configure Tailwind CSS
- [x] Install frontend dependencies (React Router, Framer Motion, Zustand, Lucide, Zod, Axios)
- [x] Create frontend folder structure
- [x] Initialize Node.js + Express + TypeScript (server)
- [x] Install backend dependencies (Mongoose, JWT, bcryptjs, Zod, Multer)
- [x] Create backend folder structure
- [x] Configure MongoDB connection
- [x] Configure environment variables (.env / .env.example)
- [x] Configure TypeScript and build pipeline

## Backend — Models
- [x] Product model with auto-slug and search indices
- [x] Category model
- [x] User model with bcrypt password hashing
- [x] Order model with immutable price snapshots & auto order numbering

## Backend — API
- [x] Centralized error handling middleware
- [x] Auth middleware (JWT + admin role check)
- [x] Product routes + controller + service
- [x] Category routes + controller + service
- [x] Auth routes + controller + service
- [x] Order routes + controller + service (server-side price calculation)
- [x] Admin order routes & dashboard stats
- [x] Image upload abstraction with multipart storage
- [x] Zod validators for inputs

## Backend — Seed
- [x] Seed script (5 categories + 12 products + admin user) executed and verified in MongoDB

## Storefront — Layout
- [x] Header component with "Slap it." typography logo & persistent bag counter
- [x] Footer component with "Slapit India" branding & multi-column navigation
- [x] StoreLayout wrapper

## Storefront — Homepage
- [x] Hero section with editorial collage & bold typography
- [x] Ticker marquee strip ("★ PRINTS ON DEMAND ★ PREMIUM QUALITY...")
- [x] Featured collection section (3 curated products from MongoDB)
- [x] "Good walls deserve good prints" section with playful aesthetic
- [x] Benefits section (Prints on Demand, Premium Quality, India-Wide Shipping)
- [x] CTA section ("Find your next wall hero")
- [x] Database-driven featured products loading

## Storefront — Poster Browsing
- [x] Posters page layout matching Panel 02
- [x] ProductCard component with hover zoom, heart icon, and Quick Add
- [x] ProductGrid component with responsive 4/3/2 column layout
- [x] CategoryFilter component (All, Art, Movies, Music, Sports, Typography)
- [x] SearchBar component with instant search
- [x] Sort dropdown (Latest, Price Low-High, Price High-Low, Featured)
- [x] Connected to backend API

## Storefront — Product Page
- [x] Product page layout matching Panel 03
- [x] PosterGallery component with framed preview & thumbnail selection
- [x] SizeSelector component (A4, A3, A2)
- [x] QuantitySelector component
- [x] Benefits value prop badges
- [x] RelatedProducts section
- [x] Dynamic backend slug loading

## Shopping Bag
- [x] Zustand bag store (`useBagStore`) with localStorage persistence
- [x] BagDrawer component matching Panel 04
- [x] Add to bag with tactile animation ("Slapped!")
- [x] Remove from bag & quantity adjustments
- [x] Dynamic subtotal & item count calculations

## Checkout
- [x] Checkout page layout
- [x] Customer & Shipping address forms
- [x] Zod validation
- [x] Real order creation through backend (server-side pricing enforcement)
- [x] Order confirmation view with generated #SLP order ID

## Admin — Auth & Portal
- [x] Admin login page (/admin/login)
- [x] JWT authentication flow & ProtectedRoute guard
- [x] AdminSidebar matching Panel 05
- [x] Dashboard metrics (Revenue, Orders, Products, Customers)
- [x] Recent orders table
- [x] Product status breakdown & Top categories

## Admin — Product CMS & Orders
- [x] Product catalog list with status toggle, edit & delete
- [x] Product creation and edit form (/admin/products/new, /admin/products/:id)
- [x] Image upload integration
- [x] Order management list (/admin/orders)
- [x] Order detail page with status progression (/admin/orders/:id)

## Testing & Quality Assurance
- [x] Product creation, editing, and status toggles verified
- [x] Storefront poster search and filtering verified
- [x] Shopping bag persistence verified
- [x] Order creation with server-side price security verified
- [x] Zero TypeScript compilation errors
