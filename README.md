# AffinityAIIMS '26 – Annual Inter-Collegiate Cultural Festival Management Platform

A modern, production-ready college festival and cultural society management platform for **AffinityAIIMS '26** (Annual Cultural Fest of AIIMS Raebareli, organized by SWAR – Student Welfare Association Raebareli).

---

## 🏛️ Platform Highlights & Architecture

- **Visual Identity & Design System**:
  - Royal Awadhi and collegiate festival aesthetics with Deep Burgundy (`#681F38`), Royal Plum (`#402044`), Sunset Orange (`#E87545`), Antique Gold (`#D4AD63`), and Midnight Charcoal (`#191820`).
  - Dark mode by default with responsive mobile layout and smooth interactive custom cursor.
- **Manual Paytm UPI QR Verification (No Gateway Required)**:
  - Organizer-managed single festival UPI QR code and beneficiary details configured in Admin Settings.
  - Compulsory payment proof screenshot upload via Cloudinary CDN or image URL.
  - Strict 12-digit UTR deduplication to block duplicate submissions.
  - Finance approval queue with high-res screenshot inspector and 1-click Approve / Request Resubmit / Reject with feedback.
- **Turnstile Digital QR Passes**:
  - Live cryptographic SVG/canvas QR generation with ticket download (`.png`) and batch print capabilities.
- **Streamlined 5-Workflow Admin Experience**:
  1. *Competitions & Events*: Multi-image Cloudinary upload, rules, registration status toggles.
  2. *Festival Gallery Media*: Full CRUD for photo archives and editions.
  3. *Organizer Paytm QR Settings*: Live beneficiary account configuration with student checkout preview.
  4. *Filtered Registrations*: Event-wise filtering, search by attendee/college/email, squad roster inspection, CSV export.
  5. *Payment Approval Queue*: Dedicated verification workspace with instant ticket issuance on approval.
- **Gmail SMTP Transactional Notification Engine**:
  - Zero-cost transactional email delivery via Nodemailer Gmail SMTP.
  - Automatic Google App Password whitespace sanitization (`abcd efgh ijkl mnop` -> `abcdefghijklmnop`).
  - Native Gmail service socket negotiation with port 465 SSL and port 587 STARTTLS support.
  - Luxury responsive HTML email templates with 9 automated triggers.
  - Admin live SMTP diagnostics: connection handshake test, test email dispatcher, and dispatch audit logs.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` or `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Database: MongoDB Atlas (Optional, fallback in-memory store active out-of-the-box)
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/affinity_fest_db?retryWrites=true&w=majority"
MONGODB_DB_NAME="affinity_fest_db"

# Image Storage: Cloudinary (Optional, local data URL fallback active)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Auth: NextAuth.js
NEXTAUTH_SECRET="your_nextauth_32_character_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP via Nodemailer
SMTP_SERVICE="gmail"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_16_character_google_app_password"
EMAIL_FROM="\"AffinityAIIMS '26\" <your_email@gmail.com>"
```

### 3. Google App Password Setup
1. Enable **2-Step Verification** on your Google Account ([myaccount.google.com/security](https://myaccount.google.com/security)).
2. Visit **App Passwords** ([myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
3. Generate a password for "AffinityAIIMS".
4. Copy the 16-character key into `SMTP_PASS` in your `.env` (spaces between words are handled automatically).
5. Set `SMTP_USER` to your Gmail address.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Testing Personas

| Role | Email | Password | Portal Route |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@aiimsraebareli.edu.in` | `Admin@1234` | `/admin` |
| **Super Admin (Legacy)** | `admin@rangmanchfest.in` | `Admin@1234` | `/admin` |
| **Student Participant** | `student@example.com` | `Student@1234` | `/dashboard` |

---

## 🧪 Automated Testing & Production Build

Run the Vitest test suite (9 test suites, 53 tests):
```bash
npm test
```

Perform production Next.js compilation:
```bash
npm run build
```
