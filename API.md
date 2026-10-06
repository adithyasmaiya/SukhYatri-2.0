# SukhYatri 2.0 — REST API Documentation

Official REST API documentation for SukhYatri travel booking platform.

- **Base URL (Development)**: `http://localhost:5000/api`
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer token in HTTP Header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

---

## 1. Response Envelope Format

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive status message",
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 36,
    "totalPages": 3
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Human-readable explanation of error",
  "code": "ERROR_CODE",
  "errors": ["Optional specific validation messages"]
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### Register New User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Ananya Sharma",
    "email": "ananya@example.com",
    "password": "Password123!",
    "phone": "+91 98200 11223"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6ac4f2b3e189b656e1d455ce",
        "name": "Ananya Sharma",
        "email": "ananya@example.com",
        "phone": "+91 98200 11223",
        "role": "user",
        "emailVerified": false,
        "tier": "Silver",
        "sukhCoins": 500
      },
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "requiresVerification": true
    },
    "message": "Registration successful. Please verify your email."
  }
  ```

### User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "ananya@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6ac4f2b3e189b656e1d455ce",
        "name": "Ananya Sharma",
        "email": "ananya@example.com",
        "role": "user",
        "tier": "Gold",
        "sukhCoins": 2450
      },
      "token": "eyJhbGciOiJIUzI1NiIs..."
    },
    "message": "Login successful"
  }
  ```

### Get Authenticated User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): Returns current user details.

### Verify Email
- **Method**: `POST`
- **Endpoint**: `/api/auth/verify-email`
- **Request Body**:
  ```json
  {
    "email": "ananya@example.com",
    "otp": "123456"
  }
  ```

### Forgot Password
- **Method**: `POST`
- **Endpoint**: `/api/auth/forgot-password`
- **Request Body**:
  ```json
  {
    "email": "ananya@example.com"
  }
  ```

### Reset Password
- **Method**: `POST`
- **Endpoint**: `/api/auth/reset-password`
- **Request Body**:
  ```json
  {
    "token": "32_byte_hex_token",
    "newPassword": "NewPassword123!"
  }
  ```

---

## 3. Destinations Endpoints (`/api/destinations`)

### List All Destinations
- **Method**: `GET`
- **Endpoint**: `/api/destinations`
- **Query Parameters**:
  - `search`: Filter by name, state, or description

### Get Destination Details
- **Method**: `GET`
- **Endpoint**: `/api/destinations/:slug`
- **Example**: `GET /api/destinations/kerala`

---

## 4. Trips / Packages Endpoints (`/api/trips`)

### Search & Filter Trips
- **Method**: `GET`
- **Endpoint**: `/api/trips`
- **Query Parameters**:
  - `search`: Full text keyword search
  - `destination`: Destination name (e.g. `Goa` or `Kerala,Rajasthan`)
  - `style`: Travel style (e.g. `Relaxation`, `Heritage`, `Romantic`)
  - `price_min`: Minimum price per person in INR
  - `price_max`: Maximum price per person in INR
  - `min_rating`: Minimum review rating (e.g. `4.5`)
  - `sort`: `price_low` | `price_high` | `rating` | `popular` | `newest`
  - `page`: Page index (default: `1`)
  - `limit`: Results per page (default: `12`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "6ac4f2b3e189b656e1d455e8",
        "title": "Kerala Slow Backwaters & Tea Trails",
        "slug": "kerala-slow-backwaters-tea-trails",
        "destinationName": "Kerala",
        "duration": "7 Days / 6 Nights",
        "days": 7,
        "nights": 6,
        "price": 48500,
        "rating": 4.9,
        "reviewCount": 842,
        "images": ["https://..."]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 12,
      "totalPages": 1
    }
  }
  ```

### Get Trip Details by Slug
- **Method**: `GET`
- **Endpoint**: `/api/trips/:slug`
- **Example**: `GET /api/trips/kerala-slow-backwaters-tea-trails`

---

## 5. Bookings Endpoints (`/api/bookings`)

### Create Booking
- **Method**: `POST`
- **Endpoint**: `/api/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "tripId": "kerala-slow-backwaters-tea-trails",
    "travelDate": "2026-11-15",
    "travellers": 2,
    "adults": 2,
    "children": 0,
    "rooms": 1,
    "roomCategory": "Heritage Boutique",
    "slot": "Morning departure (09:00 AM)",
    "primaryTraveller": {
      "name": "Ananya Sharma",
      "email": "ananya@example.com",
      "phone": "+91 98200 11223",
      "gender": "Female",
      "dob": "1995-05-15",
      "specialRequests": "Quiet high floor, Jain meals."
    },
    "additionalTravellers": [
      { "name": "Rohan Sharma", "age": 31, "gender": "Male" }
    ],
    "couponCode": "SUKH10",
    "paymentMethod": "upi"
  }
  ```
- **Authoritative Server Recalculation**:
  The backend recalculates `baseAmount`, validates the promo coupon, computes GST taxes (`5%` SAC 998555), derives the journey end date, and assigns a unique reference like `SKY-2026-8F42K`.

### Get Authenticated User Bookings
- **Method**: `GET`
- **Endpoint**: `/api/bookings/my`
- **Headers**: `Authorization: Bearer <token>`
- **Ownership Guarantee**: Returns only reservations created by the logged-in user.

### Get Booking Details by ID
- **Method**: `GET`
- **Endpoint**: `/api/bookings/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Security**: Returns `403 Forbidden` if an attempt is made to view another user's reservation.

### Cancel Booking
- **Method**: `POST`
- **Endpoint**: `/api/bookings/:id/cancel`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "reason": "Change of plans",
    "customReason": "Office project schedule shifted"
  }
  ```
- **Refund Policy Tiering**:
  - $\ge 15$ days before travel: **95% refund** (5% handling)
  - 7–14 days before travel: **85% refund** (15% fee)
  - 3–6 days before travel: **50% refund** (50% fee)
  - $< 3$ days before travel: **20% refund** (80% retention)

---

## 6. Coupon Endpoints (`/api/coupons`)

### Validate Coupon Code
- **Method**: `POST`
- **Endpoint**: `/api/coupons/validate`
- **Request Body**:
  ```json
  {
    "code": "SUKH10",
    "amount": 97000
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "code": "SUKH10",
      "type": "percentage",
      "value": 10,
      "discountAmount": 9700
    },
    "message": "Coupon code applied successfully!"
  }
  ```

---

## 7. Review Endpoints (`/api/reviews`)

### Submit Review for Completed Journey
- **Method**: `POST`
- **Endpoint**: `/api/reviews`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "bookingId": "SKY-2026-1M72Q",
    "rating": 5,
    "title": "Unforgettable tea estate morning",
    "comment": "Waking up to birdsong and fresh arabica roast in the misty hills was pure magic."
  }
  ```
- **Eligibility**: Blocked for upcoming or cancelled trips; allowed only for completed reservations.

---

## 8. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-06T13:09:25.560Z",
    "uptime": 120.4,
    "environment": "development"
  }
  ```

---

## 9. Razorpay Payment Endpoints (`/api/payments`)

### Create Razorpay Order
- **Method**: `POST`
- **Endpoint**: `/api/payments/create-order`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "bookingId": "SKY-2026-CQZSD"
  }
  ```
- **Security**: The backend calculates the final payable amount authoritatively. Client-submitted amounts are never trusted. The Razorpay secret key is NEVER returned.
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "orderId": "order_test_1791296064442_7dnin",
      "amount": 10132500,
      "currency": "INR",
      "keyId": "rzp_test_sukhyatri_dev123",
      "bookingId": "SKY-2026-CQZSD",
      "amountInINR": 101325
    },
    "message": "Payment order created successfully"
  }
  ```

---

### Verify Payment Signature
- **Method**: `POST`
- **Endpoint**: `/api/payments/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "bookingId": "SKY-2026-CQZSD",
    "razorpay_order_id": "order_test_1791296064442_7dnin",
    "razorpay_payment_id": "pay_test_muwrfd8y",
    "razorpay_signature": "4a0815eb00c73e867455cbce65b533b664d6c29b20b22ae80a977de0db2bb66c"
  }
  ```
- **Security & Idempotency**:
  - The backend verifies HMAC SHA256 of `${order_id}|${payment_id}` using `RAZORPAY_KEY_SECRET`. Signature verification is never done on the frontend.
  - If the payment or booking is already marked as paid, the existing successful confirmation is returned without creating duplicate database records.
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "booking": {
        "bookingId": "SKY-2026-CQZSD",
        "bookingStatus": "confirmed",
        "paymentStatus": "paid",
        "paymentId": "PAY-2026-UBSQZZ",
        "amountPaid": 101325
      },
      "payment": {
        "paymentId": "PAY-2026-UBSQZZ",
        "razorpayOrderId": "order_test_1791296064442_7dnin",
        "razorpayPaymentId": "pay_test_muwrfd8y",
        "amount": 101325,
        "status": "paid"
      },
      "alreadyProcessed": false
    },
    "message": "Payment verified and booking confirmed successfully."
  }
  ```

---

### Get Payment Status
- **Method**: `GET`
- **Endpoint**: `/api/payments/:paymentId`
- **Headers**: `Authorization: Bearer <token>`
- **Access Control**: Authenticated owner or administrator only. Returns safe payment data without internal tokens or secret keys.

---

### Razorpay Webhook
- **Method**: `POST`
- **Endpoint**: `/api/payments/webhook`
- **Headers**: `x-razorpay-signature: <signature>`
- **Events Handled**: `order.paid`, `payment.captured`, `payment.failed`.
- **Security**: Verifies raw request body HMAC SHA256 against `RAZORPAY_WEBHOOK_SECRET`. Processing is strictly idempotent.

---

## 10. Razorpay Test Mode & Development Guide

### Environment Variables
**Backend (`server/.env`):**
```env
RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
RAZORPAY_KEY_SECRET=yourRazorpayKeySecretHere
RAZORPAY_WEBHOOK_SECRET=yourRazorpayWebhookSecretHere
```

**Frontend (`.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
```
*(Notice: `RAZORPAY_KEY_SECRET` is NEVER present in frontend variables)*

### Starting the Applications
1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   # Runs on http://localhost:5000
   ```
2. **Start Frontend**:
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

### How to Test in Razorpay Test Mode
1. **Selecting Test Credentials**:
   - In Razorpay Dashboard (Test Mode), generate API Keys under Settings -> API Keys.
   - Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `server/.env`, and `VITE_RAZORPAY_KEY_ID` in root `.env`.
2. **Testing Successful Payment**:
   - Select any trip and proceed to Step 4 (Payment).
   - Click **Pay & Secure Booking**. The official Razorpay Checkout modal opens.
   - Choose **Cards** and enter Razorpay Test Card: `4111 1111 1111 1111`, any future expiry date (e.g., `12/28`), and CVV `123`.
   - Complete OTP verification with `Success` or `123456`.
   - The browser automatically sends the response to `POST /api/payments/verify`, verifies signature, confirms booking, and redirects to `/booking/success/:bookingId`.
3. **Testing Failed Payment**:
   - In Razorpay modal, select **Card** and choose "Failure" on the mock bank OTP screen, or dismiss the checkout window by clicking the close (`×`) icon.
   - The frontend immediately displays the polished failure state: **Payment wasn't completed** with **"Your booking has not been charged."** and options to **Try Again** or **Back to Booking**.
4. **Testing Duplicate Verification**:
   - Re-submitting the same payment verification payload returns the existing confirmed booking safely with `alreadyProcessed: true`.

---

## Email Notification & PDF Invoice System

### 1. Invoice Download Endpoint
- **Route**: `GET /api/bookings/:bookingId/invoice`
- **Headers**: `Authorization: Bearer <token>`
- **Authorization**:
  - Allowed for booking owner (`userId` match).
  - Allowed for system administrators (`role === 'admin'`).
  - Blocked for unauthenticated visitors (401) and unauthorized users (403).
- **Response**: `application/pdf` binary stream with filename `SukhYatri_Invoice_<InvoiceNumber>.pdf`.
- **Unique Invoice Number**: Generated in format `SUKH-INV-<Year>-<5_Digit_Code>` (e.g. `SUKH-INV-2026-32277`).

### 2. Email Notification System
- **Provider Abstraction**: `server/src/services/emailService.ts` supports `'console'` (local dev/test simulation), `'resend'`, `'sendgrid'`, and `'smtp'`.
- **Branded Email Templates**:
  - `welcome`: Sent upon customer registration / email verification.
  - `verify-email`: Contains 6-digit verification code.
  - `password-reset`: 60-minute expiring secure reset link.
  - `booking-confirmation`: Booking summary card, trip specs, attached PDF invoice.
  - `payment-confirmation`: Transaction receipt, payment method, amount paid.
  - `cancellation`: Cancellation reason, policy tier, and refund eligibility.
  - `refund`: Refund initiation updates with 5–7 banking days transfer notice.
  - `payment-failed`: Safe failure notification with retry payment CTA.
- **Admin/Dev Email Testing Endpoint**:
  - `POST /api/email/test` or `POST /api/admin/email/test`
  - Body: `{ "template": "booking-confirmation", "to": "user@example.com", "data": { ... } }`
  - `GET /api/email/preview/:template` for browser HTML preview.


