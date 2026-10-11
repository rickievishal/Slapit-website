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
- **Zod** for schema validation on all inputs
- **Multer** with pluggable image storage abstraction

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
  │   │   ├── middleware      # Auth, Multer upload, Centralized error handler
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
4. **Checkout**: Enter customer details & delivery address. Orders are verified and created on the backend with server-side price security.
5. **Admin CMS**: Real-time dashboard KPI cards, live order status progression (*PLACED → PAID → PRINTING → PACKED → SHIPPED → DELIVERED*), and complete product CRUD with image uploads.
# Slapit-website
