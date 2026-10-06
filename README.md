# SukhYatri-2.0

> **SukhYatri 2.0 — Travel in Comfort. Arrive in Joy.**  
> A full-stack, luxury experiential travel booking platform featuring curated Indian journeys, dynamic Razorpay payments, transactional Resend email dispatch, in-memory PDF tax invoices, and an enterprise administration CMS.

---

## 🌟 Key Features

### 🧳 Customer Experience
- **Curated Journeys**: Handcrafted experiential itineraries across heritage, wildlife, mountains, and coastal escapes.
- **Dynamic Pricing & Coupon Engine**: Instant promo code validation, seasonal discounts, and transparent GST breakdowns.
- **Seamless Checkout**: Razorpay test/live gateway integration with instant signature verification.
- **Automated Invoicing & Emails**: In-memory PDF tax invoice generation delivered via official Resend API.
- **Self-Service Trips & Cancellation**: View bookings, download GST invoices, and cancel with automated tier-based refund calculations.

### 🛡️ Admin & Operational Suite
- **Analytics & Revenue Dashboard**: Real-time Gross Merchandise Value (GMV), booking trends, cancellation rates, and occupancy stats.
- **Packages & Destinations CMS**: Rich visual editor, tag system, difficulty rating, and image media library.
- **Bookings Management**: Filter by status, inspect customer payment details, and process admin-level cancellations.
- **Customer CRM**: Manage user tiers (Silver, Gold, Platinum), SukhCoins loyalty balances, and account status.
- **Review Moderation**: Approve or feature verified traveller reviews.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router 6.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT authentication, Helmet, Express Rate Limit.
- **Database**: MongoDB Atlas (with automatic fallback to in-memory MongoDB for local offline development).
- **Payment Gateway**: Razorpay (Orders, Webhooks, Signature verification).
- **Email Gateway**: Resend official SDK (HTML templates, PDF attachments).
- **PDF Engine**: PDFKit (in-memory stream generation).

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables
Copy the example environments:
```bash
cp .env.example .env
cp server/.env.example server/.env
```
Fill in your credentials in `server/.env` (MongoDB Atlas URI, Razorpay Keys, Resend API Key).

### 3. Run Development Servers
```bash
# Terminal 1: Run Backend API (Port 5000)
npm run server

# Terminal 2: Run Frontend (Port 5173)
npm run dev
```

---

## 🧪 Production Build & Verification

```bash
# Build Frontend
npm run build

# Build Backend
npm run server:build

# Test Resend Email Dispatch
cd server && npm run email:test
```

---

## 📄 License
MIT © [Adithya S Maiya](https://github.com/adithyasmaiya)
