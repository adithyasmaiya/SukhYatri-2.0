# SukhYatri 2.0 — Production Deployment & Operations Guide

This document provides complete instructions for deploying SukhYatri 2.0 to cloud production infrastructure.

---

## 1. Production Architecture Overview

```
                                    +-----------------------------------+
                                    |       End-User Browser            |
                                    +-----------------+-----------------+
                                                      |
                                                      | HTTPS (Port 443)
                                                      v
                                    +-----------------------------------+
                                    |    Cloud CDN / Edge Routing       |
                                    |   (Cloudflare / Vercel / Nginx)   |
                                    +--------+-----------------+--------+
                                             |                 |
                   Static Assets (SPA)       |                 | REST API Requests
             https://www.sukhyatri.com       |                 | https://api.sukhyatri.com/api
                                             v                 v
                    +-----------------------------+   +---------------------------------+
                    |     Production Frontend     |   |       Production Backend        |
                    |     (React 18 + Vite)       |   |       (Node.js + Express)       |
                    |     Hosted on Edge/S3/CDN   |   |    Container / Cloud VM / App   |
                    +-----------------------------+   +--------+----------------+-------+
                                                               |                |
                                     Mongoose (TLS)            |                | HTTPS Webhooks & API
                                     Port 27017                |                |
                                                               v                v
                                              +--------------------+   +--------------------+
                                              |   MongoDB Atlas    |   |  Razorpay Gateway  |
                                              | M10+ Dedicated     |   | Orders & Webhooks  |
                                              +--------------------+   +--------------------+
                                                                                |
                                                                                v
                                                                       +--------------------+
                                                                       | Transactional Mail |
                                                                       |  (Resend/SendGrid) |
                                                                       +--------------------+
```

---

## 2. Environment Variables Specification

### 2.1 Backend (`server/.env`)

| Variable | Type | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | String | `production` | Enables production security, strict error masks, and disables QA bypasses |
| `PORT` | Number | `5000` | Port for the Express server (set by host e.g. Render/Railway) |
| `MONGODB_URI` | String | `mongodb+srv://...` | Secure MongoDB Atlas connection string with TLS and replica set |
| `JWT_SECRET` | String | *(64-byte random)* | High-entropy secret for signing authentication JWT tokens |
| `JWT_EXPIRES_IN` | String | `7d` | Token validity period before re-authentication |
| `FRONTEND_URL` | String | `https://www.sukhyatri.com` | Primary origin allowed for Cross-Origin Resource Sharing (CORS) |
| `CORS_ORIGIN` | String | `https://www.sukhyatri.com` | Strict CORS allowlist entry |
| `API_URL` | String | `https://api.sukhyatri.com/api`| Fully qualified public API base URL |
| `ADMIN_NAME` | String | `SukhYatri Chief Concierge` | Default administrator display name |
| `ADMIN_EMAIL` | String | `admin@sukhyatri.com` | Designated primary administrative account |
| `ADMIN_PASSWORD` | String | *(Strong Password)* | Initial admin password (hashed via bcrypt, min 16 chars) |
| `RAZORPAY_KEY_ID` | String | `rzp_live_...` | Razorpay Live API Key ID (or `rzp_test_...` during staging) |
| `RAZORPAY_KEY_SECRET` | String | *(Secret)* | Razorpay Live API Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | String | *(Secret)* | Secret configured in Razorpay Dashboard for webhook signature verification |
| `EMAIL_PROVIDER` | String | `resend` | Active provider: `resend`, `sendgrid`, `smtp`, or `console` |
| `EMAIL_PROVIDER_API_KEY` | String | `re_...` | API key from email service provider |
| `EMAIL_FROM_ADDRESS` | String | `concierge@sukhyatri.com`| Verified SPF/DKIM sender email address |
| `EMAIL_FROM_NAME` | String | `SukhYatri Concierge` | Outbound sender display name |
| `APP_URL` | String | `https://www.sukhyatri.com` | Base frontend URL for email verification and password reset links |

### 2.2 Frontend (`.env` at repository root)

| Variable | Type | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | String | `https://api.sukhyatri.com/api` | Base URL used by `apiClient` for all HTTP requests |
| `VITE_RAZORPAY_KEY_ID` | String | `rzp_live_...` | Public Razorpay publishable Key ID loaded by Checkout SDK |

> **Security Warning:** Never expose `JWT_SECRET`, `MONGODB_URI`, `RAZORPAY_KEY_SECRET`, or `EMAIL_PROVIDER_API_KEY` in frontend configuration or repository commits.

---

## 3. Database Setup (MongoDB Atlas)

### 3.1 Provisioning
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a dedicated project and deploy a Production Cluster (M10 or higher recommended for automatic backups and 99.95% SLA).
3. Under **Database Access**, create a dedicated database user (e.g. `sukhyatri_app`) with `readWrite` permissions on the `sukhyatri` database.
4. Under **Network Access**, whitelist your production backend application IP addresses (or `0.0.0.0/0` with secure SCRAM-SHA-256 authentication if using dynamic cloud providers like Render/AWS Fargate).

### 3.2 Safe Initialization (Non-Destructive)
In production, **never run `npm run seed`**, as it wipes database collections.
Instead, execute the safe production initializer:
```bash
cd server
npm run build
npm run db:init:prod
```
**What `npm run db:init:prod` does:**
- Verifies and compiles all database collection indexes (`email_1`, `bookingId_1`, `paymentId_1`, etc.).
- Safely provisions the administrator account (`ADMIN_EMAIL`) if it does not yet exist.
- Populates the official launch destinations and curated trips if the collections are empty.
- Creates launch coupons (`SUKH10`, `WELCOME500`) with zero initial used count.
- **Zero destructive deletes, zero fake test bookings, zero mock users.**

### 3.3 Backup & Disaster Recovery Strategy
- **Continuous Cloud Backups:** Enable MongoDB Atlas Cloud Backups with point-in-time recovery (PITR) up to 7 days.
- **Daily Snapshots:** Schedule automated snapshots retained for 30 days.
- **Monthly Snapshots:** Retained for 12 months for compliance and auditing.
- **Restore Testing:** Conduct quarterly staging restore tests to ensure recovery point objective (RPO < 5 mins) and recovery time objective (RTO < 30 mins).

---

## 4. Backend Deployment (Node.js / Express)

### 4.1 Deployment Commands
```bash
# 1. Install dependencies
cd server
npm ci --omit=dev

# 2. Build TypeScript project
npm run build

# 3. Safe database initialization (run once during first deployment)
npm run db:init:prod

# 4. Start production server
npm run start
```

### 4.2 Health Check Probes
Configure container orchestrators or load balancers with:
- **Liveness Probe:** `GET /health` (Port 5000, 200 OK expected)
- **Readiness Probe:** `GET /api/health` (Port 5000, 200 OK expected)
- **Timeout:** 5 seconds | **Interval:** 15 seconds

### 4.3 Process Management (PM2 Configuration)
If deploying on a virtual machine (EC2 / DigitalOcean Droplet):
```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'sukhyatri-api',
      script: 'dist/server.js',
      cwd: './server',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
```

---

## 5. Frontend Deployment (React / Vite)

### 5.1 Build Command
```bash
# At repository root:
npm ci
npm run build
```
This produces the minified production assets in the `dist/` directory.

### 5.2 SPA Routing & Fallbacks
SukhYatri uses client-side routing. Direct access to `/explore`, `/destinations`, `/my-trips`, `/admin`, etc. requires the server to serve `index.html`.

- **Netlify / Cloudflare Pages:** Covered via `public/_redirects`:
  ```
  /*    /index.html   200
  ```
- **Vercel:** Covered via `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Nginx Web Server:**
  ```nginx
  server {
      listen 443 ssl http2;
      server_name www.sukhyatri.com;

      root /var/www/sukhyatri/dist;
      index index.html;

      location / {
          try_files $uri $uri/ /index.html;
      }

      location /api/ {
          proxy_pass http://localhost:5000/api/;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```

---

## 6. Razorpay Payment Gateway Live Setup

### 6.1 Transitioning from Test to Live Mode
1. Complete KYC verification on the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch dashboard toggle from **Test Mode** to **Live Mode**.
3. Navigate to **Settings ➔ API Keys** and generate a new Live Key.
4. Save the **Key ID** (`rzp_live_...`) and **Key Secret**.
5. Update backend environment: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
6. Update frontend environment: `VITE_RAZORPAY_KEY_ID`.

### 6.2 Razorpay Webhook Configuration
1. Go to **Settings ➔ Webhooks ➔ Add New Webhook**.
2. **Webhook URL:** `https://api.sukhyatri.com/api/payments/webhook`
3. **Secret:** Set a secure random string and assign it to `RAZORPAY_WEBHOOK_SECRET` in backend `.env`.
4. **Active Events:**
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
5. Save webhook.

---

## 7. Transactional Email Provider Setup

### 7.1 Domain Verification (Resend / SendGrid / SES)
1. Add your sending domain (e.g. `sukhyatri.com`) in your email provider dashboard.
2. Configure required DNS records in your domain registrar:
   - **SPF:** `TXT @ "v=spf1 include:... ~all"`
   - **DKIM:** `CNAME` records provided by email service
   - **DMARC:** `TXT _dmarc.sukhyatri.com "v=DMARC1; p=reject; rua=mailto:dmarc@sukhyatri.com"`
3. Set `EMAIL_PROVIDER=resend` (or `sendgrid`) and supply `EMAIL_PROVIDER_API_KEY`.
4. Set `EMAIL_FROM_ADDRESS=concierge@sukhyatri.com`.

---

## 8. Domain, DNS & SSL Configuration

| Hostname | Type | Target | Purpose |
| :--- | :---: | :--- | :--- |
| `sukhyatri.com` | A / ALIAS | CDN Edge IP / Vercel CNAME | Apex domain with 301 redirect to www |
| `www.sukhyatri.com` | CNAME | `cname.vercel-dns.com` / Cloudflare | Production Customer & Admin Portal |
| `api.sukhyatri.com` | CNAME / A | Backend Cloud IP / Load Balancer | Production Backend REST API |

- **SSL/TLS Certificates:** Mandatory TLS 1.3 encryption for both apex and API domains (provisioned via Let's Encrypt or Cloudflare Edge SSL).
- **HSTS:** Enabled via Helmet headers (`Strict-Transport-Security: max-age=31536000; includeSubDomains`).

---

## 9. Live Razorpay Payment Verification & Reconciliation

Before opening the platform to general customer traffic:
1. **Low-Value Test Transaction:**
   - Create a temporary promotional coupon or test package valued at ₹10 – ₹50.
   - Complete checkout using a real UPI ID or debit card.
   - Verify:
     - Payment reflects as **Captured** in the Razorpay Live Dashboard.
     - Booking transitions to `confirmed` and `paid` in MongoDB.
     - PDF tax invoice generates with a unique invoice number.
     - Booking and Payment confirmation emails arrive in the customer's inbox.
2. **Reconciliation:**
   - Immediately issue a test refund from the Admin Portal or Razorpay Dashboard to ensure webhook event `refund.processed` is acknowledged.

---

## 10. Production Email & Delivery Verification

1. **Link Verification:** Ensure all links in dispatched transactional emails resolve to the production domain (`https://www.sukhyatri.com/...`) and contain **zero localhost references**.
2. **Deliverability Check:**
   - Send verification emails to test accounts on major providers (Gmail, Microsoft Outlook, Apple Mail).
   - Verify that DKIM, SPF, and DMARC alignments achieve a 10/10 deliverability score on tools such as `mail-tester.com`.
   - Confirm emails land in the primary inbox, not the spam/junk folder.

---

## 11. Database Backup & Disaster Recovery Runbook

1. **Atlas Automated Backups:**
   - Retain hourly continuous backups for 24 hours.
   - Daily snapshots retained for 30 days.
2. **Manual Pre-Migration Backup:**
   ```bash
   mongodump --uri="mongodb+srv://<user>:<pass>@<cluster>/sukhyatri" --out=./backups/$(date +%Y%m%d_%H%M%S)
   ```
3. **Disaster Recovery Restore Procedure:**
   ```bash
   mongorestore --uri="mongodb+srv://<user>:<pass>@<cluster>/sukhyatri" --drop ./backups/<backup_folder>/sukhyatri
   ```
   *Note: Never execute `--drop` in active production unless performing a full disaster recovery restoration authorized by the lead infrastructure engineer.*
