# SukhYatri 2.0 — Production Launch & Smoke Test Checklist

Execute this checklist before directing live customer traffic to the production environment.

---

## 1. Infrastructure
- [ ] **Frontend Deployed:** Single Page Application bundled with `npm run build` and served via CDN/Vercel/Netlify.
- [ ] **Backend Deployed:** Node.js/Express service running with `NODE_ENV=production` and `npm run start`.
- [ ] **MongoDB Connected:** TLS connection active to MongoDB Atlas replica set; verified via `/api/health`.
- [ ] **Database Initialized:** Run `npm run db:init:prod` on the backend (indexes synced, admin account provisioned, zero fake users).
- [ ] **Domain & Routing Configured:**
  - `www.sukhyatri.com` ➔ frontend CDN.
  - `api.sukhyatri.com` ➔ backend load balancer / container.
  - SPA fallback active (`_redirects` / `vercel.json` / Nginx `try_files` to `/index.html`).
- [ ] **HTTPS Enforced:** TLS 1.3 certificates active on all domains with automatic HTTP ➔ HTTPS redirection.

---

## 2. Authentication
- [ ] **Customer Signup (`/signup`):**
  - Register a new account with valid name, email, phone, and password (≥8 chars).
  - Verify email confirmation OTP receives code and activates user.
  - Duplicate email returns `409 Conflict` (`USER_EXISTS`).
- [ ] **Customer Login (`/login`):**
  - Sign in with verified credentials ➔ JWT token stored in client storage.
  - Incorrect password returns `401 Unauthorized`.
  - Rate limiting triggers `429 Too Many Requests` after excessive failed attempts.
- [ ] **Password Reset (`/forgot-password`):**
  - Request password reset email ➔ link received with valid secure token.
  - Non-existent email returns generic success to prevent account enumeration.
- [ ] **Role Isolation:** Registered users are assigned `role: 'user'` by default; role escalation attempts are strictly blocked.

---

## 3. Booking
- [ ] **Trip Discovery (`/explore`):**
  - Multi-filter combinations (destination + style + price range) return accurate curated packages.
  - Query parameters sync with URL state and survive browser refreshes.
- [ ] **Trip Details (`/trip/:slug`):**
  - Verified itinerary, room tiers, inclusions, exclusions, and FAQs render without console errors.
- [ ] **Reservation Flow (`/booking/:tripId`):**
  - Select dates, adults, children, and room preferences.
  - Input primary traveller and additional guests.
  - Server-side authoritative pricing calculates subtotal, 5% SAC 998555 GST, and total.
  - Client-side price tampering (e.g. sending total = ₹1) is safely ignored by the backend.
- [ ] **Promotional Coupons:**
  - Apply valid coupon (e.g. `SUKH10`) ➔ discount deducted authoritatively.
  - Apply coupon below minimum booking threshold ➔ clear error displayed.

---

## 4. Payments
- [ ] **Razorpay Order Creation:** Backend creates order with authoritative paise amount (`totalAmount * 100`).
- [ ] **Razorpay Checkout Modal:** Opens with SukhYatri brand styling (`#1E3D34` theme).
- [ ] **Signature Verification:** Valid HMAC SHA-256 signature confirms booking; forged signature is rejected with `400 Bad Request`.
- [ ] **Idempotency:** Re-submitting payment verification returns the existing confirmed booking without duplicate charges.
- [ ] **Webhook Handling:**
  - Endpoint `https://api.sukhyatri.com/api/payments/webhook` active with configured secret.
  - Events `order.paid`, `payment.captured`, and `payment.failed` handled asynchronously.
- [ ] **Payment Status Reflection:** Confirmed payments immediately update booking status to `confirmed` and payment status to `paid`.

---

## 5. Communication
- [ ] **Transactional Emails:**
  - Welcome email dispatched on verification.
  - Booking confirmation dispatched with booking ID and summary.
  - Payment receipt email dispatched with payment reference ID.
  - Booking cancellation and refund emails dispatched when appropriate.
- [ ] **No Localhost Links:** All email action buttons and links point to `https://www.sukhyatri.com` (using `ENV.APP_URL`).
- [ ] **Deliverability:** Emails land in primary inbox (SPF, DKIM, and DMARC aligned).
- [ ] **PDF Tax Invoice:**
  - Unique invoice number generated (e.g. `SUKH-INV-2026-XXXXX`).
  - Owner can view and download official `%PDF-` document from `/my-trips`.
  - Strangers and unauthorized users blocked from downloading invoice with `403 Forbidden`.

---

## 6. Admin Portal
- [ ] **Admin Authentication (`/admin`):**
  - Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
  - Normal customer accounts blocked from admin routes and APIs with `403 Forbidden`.
- [ ] **Dashboard (`/admin`):** Real metrics loaded from MongoDB (revenue, bookings, customers).
- [ ] **Package Management (`/admin/packages`):**
  - Create package with multi-day itinerary and photos.
  - Toggle published state ➔ package immediately appears/disappears on customer `/explore`.
- [ ] **Destination Management (`/admin/destinations`):** Edit destination content and highlights.
- [ ] **Bookings & Payments (`/admin/bookings`, `/admin/payments`):** Audit customer reservations and Razorpay transactions with CSV export capability.
- [ ] **Coupon Management (`/admin/coupons`):** Create and manage promo voucher usage limits and expiration dates.
- [ ] **Reviews & Content (`/admin/reviews`):** Moderate customer reviews.

---

## 7. Security
- [ ] **Secrets Protection:** Zero database passwords, JWT secrets, Razorpay secrets, or email API keys exposed in frontend bundles or public repositories.
- [ ] **CORS Policy:** Strict allowlist matching `FRONTEND_URL`; wildcard `*` disabled for authenticated APIs.
- [ ] **Rate Limiting Active:** Rate limiters active on auth (`25/15m`), coupons (`50/15m`), payments (`100/15m`), and general API (`1000/15m`).
- [ ] **QA Bypass Disabled:** `isQABypass` strictly returns `false` in `NODE_ENV=production`.
- [ ] **Security Headers:** Helmet headers active (`nosniff`, `strict-origin-when-cross-origin`, X-Frame-Options clickjacking protection).
- [ ] **Input Sanitization:** HTML tags and scripts stripped from traveller names, inquiries, and reviews.

---

## 8. Monitoring & Resiliency
- [ ] **Health Check Endpoints:**
  - `GET /health` ➔ `200 OK` (`{"status":"healthy","database":"connected"}`)
  - `GET /api/health` ➔ `200 OK` (`{"status":"healthy","database":"connected"}`)
  - Database disconnected ➔ `503 Service Unavailable` (`{"status":"degraded","database":"disconnected"}`)
- [ ] **Production Logging:** `morgan('combined')` active; passwords, tokens, cards, and OTPs never logged.
- [ ] **Error Monitoring Hook:** `unhandledRejection` and `uncaughtException` process listeners configured for APM integration.
- [ ] **Graceful Termination:** `SIGTERM` and `SIGINT` signals cleanly close HTTP listeners and MongoDB connections without dropping active requests.
