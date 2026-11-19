# SLAP IT — Poster Ecommerce Platform

A full-stack, database-driven poster e-commerce platform built according to the provided graphic design reference.

---

## 🎨 Visual Identity & Tech Stack

### Design Aesthetic
- **Palette**: Pale cyan/teal (`#5CE1E6`), black borders, off-white background (`#FAFAFA`), subtle gray grid-paper lines.
- **Brutalist Elements**: Hard drop shadows (`box-shadow: 4px 4px 0 #000`), bold sans & editorial display typography, asymmetric collage layouts, and tactile animations.

### Frontend
- **React 18** with **Vite** and **TypeScript**
- **Tailwind CSS v4** with custom brutalist utility classes
- **Framer Motion** for smooth drawer slide-ins, toasts, and ticker marquees
- **Zustand** for persistent shopping bag state (`localStorage`)
- **React Router v6** (data router layout)
- **Lucide React** for icons
- **Axios** with auth interceptors

### Backend
- **Node.js** & **Express** with **TypeScript**
- **MongoDB** & **Mongoose**
- **JWT** (JSON Web Tokens) & **bcryptjs** password hashing
- **Google OAuth** ID token verification for customer sign-in
- **Zod** for schema validation on all inputs
- **Multer** in-memory uploads stored as binary files in MongoDB GridFS (5 MB/file)

---

## 📂 Project Structure

```
/slapit-website
  ├── /client                 # React + Vite frontend
  │   ├── src
  │   │   ├── components
  │   │   │   ├── common      # Button, Badge, StatusBadge, QuantitySelector, SearchBar, Toast
  │   │   │   ├── layout      # Header, Footer, StoreLayout
  │   │   │   ├── store       # HeroSection, Ticker, FeaturedCollection, PosterGallery, BagDrawer...
  │   │   │   └── admin       # AdminSidebar, AdminLayout, ImageUploader...
  │   │   ├── pages
  │   │   │   ├── store       # HomePage, PostersPage, ProductPage, CheckoutPage
  │   │   │   └── admin       # LoginPage, DashboardPage, ProductsPage, ProductFormPage, OrdersPage...
  │   │   ├── services        # Axios API clients
  │   │   ├── store           # Zustand stores (bagStore, authStore)
  │   │   └── routes          # Protected routes & app router
  ├── /server                 # Express + Mongoose API
  │   ├── src
  │   │   ├── config          # MongoDB connection & environment vars
  │   │   ├── controllers     # productController, orderController, authController...
  │   │   ├── middleware      # Auth, in-memory Multer upload, Centralized error handler
  │   │   ├── models          # Product, Category, User, Order (Mongoose)
  │   │   ├── routes          # API routes
  │   │   ├── services        # Business logic & server-side price security
  │   │   ├── validators      # Zod validation schemas
  │   │   └── seed.ts         # Database seed script
  ├── TODO.md                 # Development task tracker
  ├── PROGRESS.md             # Development changelog
  └── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on default port `27017`

### 2. Backend Setup
```bash
cd server
npm install
npm run build
node dist/seed.js        # Seeds 12 poster artworks, 5 categories & admin credentials
node dist/index.js       # Starts Express API on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev              # Runs Vite frontend on http://localhost:5173
```

### Customer account setup
Set the same Google OAuth Web Client ID in `server/.env` (`GOOGLE_CLIENT_ID`) and
`client/.env.local` (`VITE_GOOGLE_CLIENT_ID`). Add your storefront origin (for local
development, `http://localhost:5173`) to the OAuth client’s authorized JavaScript origins.
Email/password customer registration works without Google configuration.
The same Google button is available at the admin login URL; it only signs in an existing admin
whose account email matches the verified Google email, and never creates an admin account.

### Product image storage
New admin uploads are stored as binary files in MongoDB GridFS; product documents keep image URLs.
After deploying the GridFS support, run `cd server && npm run migrate:product-images` to preview
existing Base64 product images. Run `npm run migrate:product-images -- --apply` to migrate them.
Both commands use the `MONGODB_URI` in `server/.env`.

### Search engine optimization
The storefront sets page titles, descriptions, canonical URLs, social sharing metadata, and product
structured data. `client/vercel.json` routes `/sitemap.xml` to the API-generated sitemap, and
`client/public/robots.txt` identifies public and private routes. The canonical storefront domain is
`https://slapitposters.itsmevishal.in`; set `VITE_SITE_URL` in Vercel and `SITE_URL` in the API
environment to this origin if overriding the defaults.

---

## 🔐 Admin Portal Credentials

- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@slapit.com`
- **Password**: `admin123`

---

## 🛒 Key User Journeys

1. **Browse Posters**: Filter by Category (*Art, Movies, Music, Sports, Typography*), search live by keyword, and sort by price/popularity.
2. **Product Page**: Frame gallery preview, select size (*A4, A3, A2*), and click **Add to Bag** to trigger the animated "Slapped!" toast.
3. **Bag Drawer**: Slide-over drawer with item previews, instant quantity increment/decrement, and subtotal calculation.
4. **Customer Account**: Register or sign in with email/password or Google, view orders placed while signed in at `/account/orders`, and open each order for item, delivery, price, payment, and fulfillment details.
5. **Checkout**: Enter customer details & delivery address. Orders are verified and created on the backend with server-side price security; signed-in orders are linked to that customer account. Guest checkout remains available.
6. **Admin CMS**: Real-time dashboard KPI cards, per-size inventory counts with extra print needs calculated from PLACED orders after already printed and on-hand stock, grouped print jobs by poster and size with editable completed-copy counts and retained progress, live order status progression (*PLACED → PAID → PRINTING → PACKED → SHIPPED → DELIVERED*), and complete product CRUD with image uploads.
# Slapit-website
