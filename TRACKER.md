# Uttar Pradesh Culture & Heritage College Fest Platform - Project Tracker

## Project Overview
- **Platform**: "रंगमंच UP 2026" (Parampara Cultural Fest) — A production-ready Uttar Pradesh Culture & Heritage College Fest Management Platform.
- **Inspiration**: Quality and polish of Pyrexia AIIMS, infused with the royal architectural language, Awadhi refinement, Varanasi sacred ghats, Banarasi craftsmanship, and Mughal jaali aesthetics of Uttar Pradesh.
- **Dual Themes**:
  - *Light Theme*: Heritage Ivory (`#F5EEDC`), Warm White (`#FAF6EE`), Royal Maroon (`#702B32`), Antique Gold (`#C5A15A`), Sandstone (`#D7BE96`).
  - *Dark Theme*: Deep Charcoal (`#252321`), Dark Maroon (`#3E181D`), Antique Gold (`#C5A15A`), Warm Ivory text (`#F5EEDC`).
- **Core Technology**:
  - Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React, shadcn/ui design conventions.
  - Neon PostgreSQL + Drizzle ORM (with seamless fallback / in-memory layer for immediate local testability).
  - NextAuth / Auth.js with role-based access control (Super Admin, Event Admin, Finance Admin, Sports Admin, Gallery Admin, Event Coordinator, Scanner Staff, Participant).
  - Manual Paytm QR Payment Verification (No payment gateway; admin-configured UPI QR, transaction UTR verification, screenshot upload, audit trail).
  - QR Ticket Generation & Live Camera Entry Scanner (`html5-qrcode` + atomic double-entry prevention).
  - Sports Tournament Module (Football knockout/league/group fixtures, live scoring, standings, cards, goals).
  - Cultural Heritage Collections & Previous Editions CMS.
  - Nodemailer Gmail SMTP notifications with UP Heritage email templates.
  - Vitest test suite with 100% test pass rate.

---

## Architecture Decisions & Approach Justification Log

### Phase 0: Project Initialization & Schema Alignment
- **Status**: Completed
- **Why**: Establish solid project foundations with exact schema modeling matching the prompt specification (including all 34 required entities, enums, relations, and audit logging).
- **Approach Justification**:
  - Leveraged Drizzle ORM for type-safe database schemas with direct PostgreSQL compatibility (Neon serverless).
  - Preserved and enhanced existing schema to incorporate `cultural_collections`, `roles`, `permissions`, `user_roles`, `payment_proofs` and ensure strict constraints (e.g. UTR uniqueness, ticket QR tokens, attendance check-in atomicity).
  - Configured Next.js 14 App Router, TypeScript, Tailwind CSS with the royal UP Heritage palette, and PostCSS.
  - Dependencies successfully installed.

---

### Phase 1: Heritage Design System, Homepage, Public Pages & Responsive Navigation
- **Status**: Completed
- **Why**: Establish the authentic Uttar Pradesh Culture & Heritage visual identity (Awadhi elegance, Varanasi ghats, Mughal jaali motifs, Banarasi craftsmanship, dual light/dark themes) and complete all public-facing pages before implementing authentication and backend persistence.
- **Approach Justification**:
  - Implemented persistent dual-theme provider (`ThemeProvider` with localStorage and system preference detection).
  - Built UP Heritage color palette in Tailwind CSS (`#F5EEDC` Ivory, `#702B32` Royal Maroon, `#C5A15A` Antique Gold, `#D7BE96` Sandstone, `#252321` Charcoal).
  - Built interactive Navbar with mobile drawer, theme switcher, and role-aware navigation.
  - Built cinematic Hero section with golden-hour architectural background, Devanagari cultural callouts, live countdown timer, and quick stats.
  - Implemented complete public pages: Homepage, About (`/about`), Heritage Collections (`/heritage`), Events Catalog (`/events`), Dynamic Event Details (`/events/[slug]`), Festival Schedule (`/schedule`), Sports Arena (`/sports`), Visual Gallery (`/gallery`), Past Editions (`/previous-editions`), Sponsors (`/sponsors`), FAQs (`/faq`), Contact Helpdesk (`/contact`), Privacy Policy (`/privacy`), Terms & Conditions (`/terms`).
  - Verified with `tsc --noEmit`: 0 TypeScript errors.

---

### Phase 2: Database, Authentication & Participant Dashboard
- **Status**: Completed
- **Why**: Provide secure authentication, role-based authorization (Super Admin down to Participant), password hashing, user session handling, and participant self-service dashboard for profile management, registration tracking, and ticket downloads.
- **Approach Justification**:
  - Implemented NextAuth credentials provider with bcryptjs password hashing and JWT role callbacks.
  - Built data repository and in-memory fallback store (`dataStore`) seeded with 4 key testing personas (Super Admin, Finance Admin, Scanner Staff, Student Participant) to enable immediate interactive testing.
  - Built participant authentication routes (`/api/auth/register`, `/api/auth/[...nextauth]`, `/api/user/profile`).
  - Created auth views: `/login`, `/register`, `/forgot-password`.
  - Built complete participant dashboard: Overview (`/dashboard`), My Registrations (`/dashboard/registrations`), Digital QR Tickets with live SVG/canvas QR generation (`/dashboard/tickets`), Payment Proof Submissions & Review feedback (`/dashboard/payments`), and Profile Management (`/dashboard/profile`).
  - Validated with `npx tsc --noEmit`: 0 TypeScript errors.

---

### Phase 3 & 4: Event Registration System & Manual Paytm QR Payment Verification
- **Status**: Completed
- **Why**: Implement dynamic event registration (individual/team, roster entries, capacity limits) and manual Paytm QR verification (NO payment gateway). Provide finance administration workflows (approve, reject, request resubmission, UTR deduplication, screenshot previews).
- **Approach Justification**:
  - Built interactive registration flow at `/events/[slug]/register` supporting captain details, team member rosters, fee calculation, and direct redirect to payment proof submission.
  - Implemented `/api/events/register` with validation for duplicate registrations, capacity limits, and unique registration ID generation.
  - Implemented `/api/admin/payments` and `/admin/payments/page.tsx` for Finance Admins to audit payment submissions against actual Paytm records, view screenshots in an inspection modal, enforce UTR uniqueness, and approve/reject/resubmit.
  - Approving a payment automatically triggers digital ticket generation and changes status to confirmed.

---

### Phase 5: Digital Tickets & Turnstile QR Entry Scanner
- **Status**: Completed
- **Why**: Secure gate entry checking with live camera QR scanning, preventing duplicate entry and validating attendee credentials atomically.
- **Approach Justification**:
  - Generated unpredictable QR tokens (e.g. `RNG-TKT-778899-KATHAK`) tied to each registration.
  - Built `/admin/scanner` using `html5-qrcode` live camera viewport and manual lookup fallback with immediate audio/visual feedback (emerald green for verified, red bounce for duplicate pass).
  - Atomic database check-in prevented double scans and recorded timestamp and staff ID.
  - Built `/admin/attendance` with real-time logs, search by attendee/ticket/college, and printable roster export.

---

### Phase 6: Sports & Football Tournament Management
- **Status**: Completed
- **Why**: Comprehensive tournament management for college sports (Football 11-a-side, Cricket, Basketball, Volleyball).
- **Approach Justification**:
  - Built public tournament hub (`/sports`) showcasing live fixtures, knockout bracket trees, and group standings with points calculation.
  - Built sports admin control (`/admin/sports`) allowing fixture creation, live score tracking, goalscorer minute recording, and disciplinary card issuance (yellow/red).

---

### Phase 7: Heritage Galleries, Cultural Collections & Content Management (CMS)
- **Status**: Completed
- **Why**: Enable administrators to update festival content dynamically without modifying code, ensuring reusability across future festival editions.
- **Approach Justification**:
  - Built Executive Admin Dashboard (`/admin`) with real-time KPIs (Participants, Registrations, Verified Revenue, Gate Check-Ins).
  - Built `/admin/events` for creating/editing competitions and managing registration windows.
  - Built `/admin/cultural` for curating Uttar Pradesh regional heritage items (Monuments, Crafts, Music, Sacred traditions).
  - Built `/admin/schedule`, `/admin/gallery`, `/admin/sponsors`, `/admin/announcements`, `/admin/settings` (Paytm QR image and UPI ID updates).

---

### Phase 8: Nodemailer Gmail SMTP & Email Notifications
- **Status**: Completed
- **Why**: Reliable, zero-cost transactional email notifications using Gmail SMTP without paid third-party APIs (Resend/Sendgrid).
- **Approach Justification**:
  - Built `src/lib/email/index.ts` with on-demand transporter creation to prevent serverless connection leaks.
  - Designed responsive UP Heritage HTML templates (Royal Maroon header, Ivory background, Antique Gold accents) for Welcome, Registration, Payment Approval, and Payment Rejection.
  - Created Super Admin diagnostics at `/admin/email` with one-click test email dispatcher and dispatch audit logs.
  - Gracefully simulated email dispatch in development/preview when Google App Passwords are not yet configured.

---

### Phase 9: Testing & Security Validation
- **Status**: Completed
- **Why**: Rigorous automated verification ensuring all business logic, authorization rules, UTR deduplication, and scanning integrity function correctly.
- **Approach Justification**:
  - Authored 5 comprehensive Vitest test suites:
    1. `auth-and-permissions.test.ts` (bcrypt password verification, role permission checks)
    2. `event-registration.test.ts` (individual and team registration with roster)
    3. `paytm-qr-payment.test.ts` (UTR uniqueness, finance review actions, automatic ticket issuance)
    4. `qr-tickets-and-scanning.test.ts` (atomic check-in, duplicate scan blocking, token verification)
    5. `sports-tournaments.test.ts` (group standings calculation, bracket progression)
  - Result: 100% tests passed (12/12 passing).

---

### Phase 10: Vercel Production Build & Deployment Validation
- **Status**: Completed
- **Why**: Ensure clean, error-free production build matching all Next.js App Router and Vercel standards.
- **Approach Justification**:
  - Resolved build-time font fetch requirements by loading Google Fonts dynamically via CSS `@import`, enabling 100% offline compilation.
  - Extracted separate `viewport` export from `metadata` in `layout.tsx`.
  - Wrapped search params in `<Suspense>` on `/login`.
  - Configured `vercel.json` with strict security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
  - Built native SEO routes: `src/app/sitemap.ts` and `src/app/robots.ts`.
  - Created secure Super Admin bootstrap procedure at `/api/admin/bootstrap`.
  - Production build completed successfully across all 48 routes (`next build` exit code 0).

---

### Phase 11: Creative Experience Enhancement & Full Redesign
- **Status**: Completed
- **Why**: Elevate the visual identity from a formal/corporate college layout into an energetic, modern, visually immersive, and highly interactive cultural festival experience inspired by top-tier creative agency & festival platforms while preserving all 100% of underlying backend capabilities.
- **Approach Justification & Implementation Details**:
  - **Sophisticated Color Palette**:
    - Deep Burgundy: `#681F38`
    - Royal Plum: `#402044`
    - Sunset Orange: `#E87545`
    - Antique Gold: `#D4AD63`
    - Warm Champagne: `#F5E8D0`
    - Midnight Charcoal: `#191820`
    - Muted Rose: `#C77C83`
    - Heritage Green: `#344E42`
    - Implemented both in Tailwind color tokens (`fest.*` and `heritage.*`) and CSS variables in `globals.css` with dedicated utility classes (`sunset-gradient-text`, `fest-glow-gradient`, `glow-sunset`, `royal-arch`).
  - **Interactive Desktop Custom Cursor (`src/components/ui/custom-cursor.tsx`)**:
    - Created a lightweight custom cursor with a central sharp Sunset Orange dot and a smooth trailing spring follower ring that gently expands with an Antique Gold glow when hovering over buttons, links, inputs, and interactive cards.
    - Built with `@media (pointer: fine) and (hover: hover)` media queries so mobile and touch devices retain their native touch behavior with zero interference.
  - **12 Homepage Visual Sections Redesigned with Distinct Visual Identities**:
    1. **Hero (`src/components/home/hero-section.tsx`)**: Fullscreen cinematic campaign introduction with high-resolution UP heritage imagery, expressive Devanagari emblem, overlapping editorial typography ("रंगमंच UP 2026"), animated tagline, floating art badges ("Awadh Royalty", "Kashi Mystique", "Braj Rhythms", "Sports Championship"), live styled countdown timer, glowing magnetic-style CTAs, and a pulsing scroll indicator.
    2. **Announcements (`src/components/home/announcements-banner.tsx`)**: Visually prominent live ticker banner with pulsating "LIVE BULLETIN" indicator, urgent alerts (24/7 Paytm QR processing, registrations closing), and dismiss action.
    3. **About (`src/components/home/about-editorial.tsx`)**: Magazine-style editorial spread with asymmetric columns, layered photography (Rumi Darwaza & Varanasi Ganga Aarti with royal arch frames), pull quotes, and 3 cultural pillars (Classical Virtuosity, Heritage Innovation, Tournament Glory).
    4. **Categories (`src/components/home/category-showcase.tsx`)**: Colorful visual navigation featuring 6 distinct arenas (Dance & Theatre, Music & Sufi, Literary & Debates, Heritage Crafts, Sports Arena, Tech Innovation) with unique gradient corners, Devanagari titles, and prize highlights.
    5. **Events (`src/components/home/featured-events.tsx`)**: Dynamic card grid with interactive filtering tabs (All, Cultural & Dance, Sports Arena, Literary & Poetry, Traditional Crafts, Tech & Innovation), 3D hover tilt, sunset badges, and instant registration CTAs.
    6. **Schedule (`src/components/home/schedule-preview.tsx`)**: Interactive timeline featuring day switcher tabs (Day 1: Awadh Opening, Day 2: Kashi Kala & Innovation, Day 3: Sports & Shaam-e-Awadh, Day 4: Grand Finals & Star Night), illuminated milestone nodes, time badges, and venue tags.
    7. **Cultural Experiences (`src/components/home/cultural-showcase.tsx`)**: Layered Uttar Pradesh heritage storytelling showcasing Lucknow, Varanasi, and Agra/Mathura with high-resolution imagery, regional themes, and GI-tag craft badges.
    8. **Sports Arena Spotlight (`src/components/home/sports-spotlight.tsx`)**: High-energy tournament showcase for the Chhatrapati Shivaji Memorial Trophy featuring live match card previews, penalty/card indicators, top scorers, and tournament entry CTA.
    9. **Previous Editions (`src/components/home/previous-editions-preview.tsx`)**: Cinematic year-wise retrospective cards for 2025, 2024, and 2023 with attendee footfalls, colleges represented, star night headlines, and champions.
    10. **Gallery (`src/components/home/gallery-preview.tsx`)**: Asymmetric masonry visual grid with category pills and interactive full-screen Lightbox Preview Modal when clicking any photograph.
    11. **Sponsors (`src/components/home/sponsors-section.tsx`)**: Infinite scrolling animated marquee tracks for Title Partners, Heritage Patrons, Paytm QR Payments, and state sports federations, accompanied by a sponsorship pitch deck download CTA.
    12. **Footer (`src/components/layout/footer.tsx`)**: Memorable branded ending with Midnight Charcoal & Royal Plum background, Antique Gold lotus emblem, comprehensive site navigation, participant/staff portal shortcuts, secretariat contact details, and Sanskrit peace blessings.
  - **Floating Glassmorphic Navbar (`src/components/layout/navbar.tsx`)**:
    - Elevated navbar with backdrop blur (`backdrop-blur-xl bg-background/85`), glowing lotus emblem in a royal arch silhouette, animated active links with glowing indicator lines, theme toggle, user profile badge with role label, and prominent "Register Now" sunset CTA button.
  - **Catalog & Subpage Visual Alignment**:
    - Updated `/events`, `/events/[slug]`, `/sports`, `/schedule`, `/gallery`, `/previous-editions`, `/heritage`, and `/about` with the new palette and design tokens without breaking any form submission, search filter, or registration workflow.
  - **Rigorous Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npx vitest run`: 12/12 passing across all 5 test files.
    - `npm run build`: 48/48 routes prerendered and statically optimized with exit code 0.

---

### Phase 12: College Cultural Clubs Reorientation & Modern Fest Navbar
- **Status**: Completed
- **Why**: The user clarified that the platform is specifically designed for **organizing college fests driven by cultural college clubs**, and that the previous navbar + top banner looked too much like a bureaucratic government ministry portal.
- **Approach Justification & Implementation Details**:
  - **Eliminated Government-Style Header Strip**:
    - Removed `CulturalRibbon` from `src/app/layout.tsx`, eliminating the NIC/ministry-style top ribbon bar across all pages.
  - **Ultra-Modern College Fest Navbar (`src/components/layout/navbar.tsx`)**:
    - Designed as a floating glassmorphic island container (`backdrop-blur-xl bg-card/85 dark:bg-fest-charcoal/85 border border-fest-gold/30 shadow-xl rounded-2xl`).
    - Replaced the arch-shaped government seal with a dynamic electric festival insignia: flame glyph with sunset/burgundy gradient, modern typography (`रंगमंच '26 Fest`), and college club attribution (`By University Cultural Clubs`).
    - Streamlined navigation: *Competitions*, *College Clubs*, *Fest Schedule*, *Sports Arena*, *Cultural Arts*, *Past Editions*, *Gallery*, *About Fest*.
    - High-energy "Get Fest Pass" CTA with animated sparkles and sunset glow.
  - **Prominent College Cultural Clubs Showcase (`src/components/home/clubs-showcase.tsx`)**:
    - Built a dedicated homepage showcase highlighting the 7 student cultural societies powering the fest:
      1. *Mudra Dance Society* (Kathak Jugalbandi, Mayur Nritya, Western Battles)
      2. *Dhwani Music & Band Society* (Hindustani Vocals, Battle of Sufi Rock Bands)
      3. *Natraj Dramatics Club* (Awadhi Court Plays, Street Plays / Nukkad Natak)
      4. *Kalam Literary & Debating Society* (Youth Parliament, Shaam-e-Awadh Kavi Sammelan)
      5. *Akriti Fine Arts & Crafts Club* (Shilpkar 3D Hackathon, Banarasi Textile Runway)
      6. *Varchasva Sports Council* (Chhatrapati Shivaji Football Trophy, Cricket, Basketball)
      7. *ByteCraft Tech & Innovation Society* (Navotsav AI Tourism, 3D Monument VR, Esports)
    - Featured student club coordinators, contests hosted, and the **Rolling Inter-Collegiate Fest Championship Trophy**.
  - **Club Host Badges Across Contests (`src/components/home/featured-events.tsx` & `src/app/events/page.tsx`)**:
    - Added a clear "Hosted by [Club Name]" badge on each contest card and event detail header.
  - **Collegiate Fest Identity in Hero, About & Footer**:
    - Replaced government/tourism wording with high-energy collegiate festival language: student delegations, club rivalries, rolling trophy, Student Activity Centre (SAC) desk, and club coordinator helplines.
  - **Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npx vitest run`: 12/12 passing.
    - `npm run build`: 48/48 routes prerendered cleanly with code 0.

---

### Phase 13: MongoDB Atlas & Cloudinary Full Integration
- **Status**: Completed
- **Why**: The user requested transition to **MongoDB Atlas** for database persistence and **Cloudinary** for image storage (payment screenshots, QR banners, posters).
- **Approach Justification & Implementation Details**:
  - **MongoDB Atlas Connection Layer (`src/lib/mongodb.ts`)**:
    - Installed official `mongodb` driver.
    - Configured serverless connection caching with `_mongoClientPromise` on `global` in development mode to prevent connection exhaustion during Next.js Hot Module Reloading (HMR).
    - Created typed collection getters: `getUsersCollection`, `getRegistrationsCollection`, `getPaymentsCollection`, `getTicketsCollection`, `getEventsCollection`, `getQrSettingsCollection`.
    - Added `isMongoConnected()` health check helper to verify live cluster ping.
  - **Server-Side Data Synchronization Layer (`src/lib/db-sync.ts`)**:
    - Implemented `syncWithMongo()` to hydrate in-memory cache from Atlas collections on server boot/request.
    - Automatically seeds default users and initial records to Atlas if collections are freshly created.
    - Wired bidirectional persistence: `dataStore.setPersistenceHandler(...)` immediately upserts modified documents (`users`, `registrations`, `payments`, `tickets`, `qr_settings`) to MongoDB Atlas upon any write.
    - Kept `src/lib/data-store.ts` completely decoupled from Node built-ins so client-side React components bundle cleanly without Webpack polyfill errors.
  - **Cloudinary Image Storage SDK & API (`src/lib/cloudinary.ts` & `src/app/api/upload/route.ts`)**:
    - Configured Cloudinary v2 SDK reading `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
    - Created `uploadToCloudinary` and `deleteFromCloudinary` with auto-optimization (`quality: "auto:good"`, `fetch_format: "auto"`).
    - Built POST `/api/upload` supporting both multipart `FormData` and base64 JSON payloads with 8MB size limits.
    - Built GET `/api/upload` endpoint for diagnostic connection health reporting.
  - **Payment Proof Cloudinary Upload UI (`src/app/dashboard/payments/page.tsx`)**:
    - Added direct file drag & drop / file picker widget for payment receipts.
    - Real-time Cloudinary upload progress indicator with spinner.
    - Displays uploaded thumbnail preview with "Stored on Cloudinary CDN" badge and option to remove/replace image.
    - Retains direct URL paste toggle for flexibility.
  - **Admin QR Configuration Cloudinary Integration (`src/app/admin/settings/page.tsx`)**:
    - Added Cloudinary file upload button for official festival Paytm QR banners.
    - Live thumbnail preview and automatic URL population.
  - **Payment Submission API Route (`src/app/api/payments/submit/route.ts`)**:
    - Added dedicated server endpoint for payment proof submissions, updating MongoDB Atlas and data store with UTR uniqueness validation.
  - **Environment Configuration (`.env.example`)**:
    - Documented `MONGODB_URI`, `MONGODB_DB_NAME`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and SMTP variables with clear setup instructions.
  - **Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npx vitest run`: 12/12 tests passing.
    - `npm run build`: 50/50 routes (including new `/api/upload` and `/api/payments/submit`) prerendered cleanly with exit code 0.


