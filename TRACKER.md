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

---

### Phase 14: Mobile Responsiveness Overhaul & Horizontal Overflow Elimination
- **Status**: Completed
- **Why**: Mobile view (375px/425px DevTools preview) exhibited horizontal overflow with a white gutter on the right side and cut-off content on the left due to unconstrained single-line strings, tracking, rigid flex containers, fixed timer widths, and unclipped blur circles.
- **Root Cause Analysis**:
  1. *Hero Badge & Subtitle*: An `inline-flex` badge with a 64-character text string and `tracking-wider` without `flex-wrap` or `max-w-full` rendered at ~680px width, forcing the viewport out. Sub-headline text with `tracking-[0.35em]` measured ~550px on a single line.
  2. *Countdown Timer Boxes*: Four fixed boxes of `w-16` (64px) + colons + gaps exceeded the available viewport width on small devices (<380px).
  3. *Navbar Elements*: Brand subtitle `By University Cultural Clubs` with `tracking-widest` alongside theme toggle and hamburger button caused layout stress on small viewports.
  4. *Viewport Overflow Propagation*: `html` lacked `overflow-x: hidden`, `width: 100%`, and `max-width: 100vw`. Per CSS specs, `overflow-x: hidden` on `body` bubbles to the root viewport unless set on `html` as well.
  5. *Unclipped Decorative Elements*: Large background blur glow circles (e.g. `w-80 h-80` blur circles at `right-0`) in sections lacked `overflow-hidden` on parent `<section>` containers.
- **Key Technical Fixes Implemented**:
  - **Global CSS & Layout (`src/app/globals.css`, `src/app/layout.tsx`)**:
    - Enforced `box-sizing: border-box` across all elements and pseudo-elements.
    - Added `overflow-x: hidden`, `max-width: 100vw`, and `width: 100%` on both `html` and `body`.
    - Added responsive media asset constraints: `img, video, canvas, svg { max-width: 100%; height: auto; }`.
    - Added `overflow-x-hidden max-w-full` to `<main>` in `layout.tsx`.
  - **Hero Section (`src/components/home/hero-section.tsx`)**:
    - Converted single-line badge to responsive wrapping container: `inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 text-center`.
    - Reduced tracking on subtitle to `tracking-wider sm:tracking-[0.25em]` and added `break-words max-w-full`.
    - Responsive hero title font scaling: `text-4xl sm:text-6xl md:text-8xl lg:text-9xl` with `break-words max-w-full`.
    - Responsive full-width button sizing on mobile: `w-full sm:w-auto text-center`.
    - Responsive highlights grid padding and font sizes: `p-3 sm:p-4`, `text-lg sm:text-2xl`.
  - **Live Countdown Timer (`src/components/home/countdown.tsx`)**:
    - Replaced rigid `w-16` with responsive width: `w-14 sm:w-20 md:w-24` and height `h-18 sm:h-24 md:h-28`.
    - Scaled digits (`text-xl sm:text-3xl md:text-4xl`) and labels (`text-[8px] sm:text-[11px]`).
    - Added `max-w-full` and reduced gap spacing on mobile.
  - **Floating Navbar (`src/components/layout/navbar.tsx`)**:
    - Constrained header to `w-full max-w-full px-2 sm:px-6 py-2.5 sm:py-3`.
    - Added `min-w-0` to brand logo flex container and `shrink-0` to the flame icon and `'26 Fest` badge.
    - Added truncation to subtitle on small screens: `text-[8px] sm:text-[10px] truncate max-w-[150px] sm:max-w-none`.
  - **Section Containers & Section Dividers**:
    - Added `overflow-hidden` and responsive container widths to `AboutEditorial`, `ClubsShowcase`, `SportsSpotlight`, `SchedulePreview`, `SponsorsSection`, `AnnouncementsBanner`, `CategoryShowcase`, `FeaturedEvents`, `CulturalShowcase`, `PreviousEditionsPreview`, `GalleryPreview`, `FaqAccordion`.
    - Added `max-w-full px-2 break-words` to `HeritageDivider` ornaments and titles (`src/components/ui/heritage-decorations.tsx`).
    - Responsive ticket and payment layout adjustments across `src/app/dashboard/tickets/page.tsx`, `src/app/dashboard/payments/page.tsx`, `src/app/events/[slug]/register/page.tsx`, `src/app/admin/scanner/page.tsx`, `src/app/sports/page.tsx`, `src/app/events/page.tsx`, `src/app/schedule/page.tsx`, `src/app/gallery/page.tsx`, `src/app/heritage/page.tsx`, `src/app/admin/layout.tsx`, and `src/app/dashboard/layout.tsx`.
    - Responsive multi-column wrapping for the footer on mobile (`src/components/layout/footer.tsx`).
- **Verification**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npx vitest run`: 12/12 test suites passing (Sports, Registration, Paytm QR, Tickets & Scanning, Auth).
  - `npm run build`: 50/50 static and dynamic routes compiled with exit code 0.

---

### Phase 15: Admin Streamlining & Irrelevant Functionality Removal
- **Status**: Completed
- **Why**: The user requested removing all irrelevant admin modules and streamlining the admin experience down strictly to 5 essential workflows:
  1. Create new events with multiple pictures upload & edit/delete management.
  2. Full CRUD for festival gallery media.
  3. Organizer Paytm QR settings (editable & updatable by admin for event payments).
  4. Registrations dashboard filtered specifically by events.
  5. Separated, dedicated payment approval queue.
- **Actions Taken**:
  - **Removed Irrelevant Admin Modules**:
    - Deleted `src/app/admin/cultural`
    - Deleted `src/app/admin/sports`
    - Deleted `src/app/admin/schedule`
    - Deleted `src/app/admin/sponsors`
    - Deleted `src/app/admin/email`
    - Deleted `src/app/admin/attendance`
    - Deleted `src/app/admin/announcements`
    - Deleted `src/app/admin/scanner`
    - Deleted `src/app/api/admin/email`
    - Deleted `src/app/api/admin/scanner`
  - **Cleaned Admin Sidebar Navigation (`src/app/admin/layout.tsx`)**:
    - Reduced sidebar navigation strictly to the required 6 views:
      1. Overview (`/admin`)
      2. Create & Manage Events (`/admin/events`)
      3. Registrations List by Event Filter (`/admin/registrations`)
      4. Payment Approvals (`/admin/payments`)
      5. Gallery Media CRUD (`/admin/gallery`)
      6. Organizer Paytm QR (`/admin/settings`)
  - **Enhanced Event Management (`src/app/admin/events/page.tsx`)**:
    - Connected directly to `dataStore` with MongoDB Atlas sync.
    - Added multi-file image selection and Cloudinary upload with real-time thumbnail preview strip and remove buttons.
    - Supports setting primary cover poster and attaching extra gallery pictures to any event.
    - Full edit modal to update titles, fees, dates, venues, clubs, rules, and images.
    - Status toggle ("Registration Open" vs "Registration Closed") and event deletion.
    - Updated public event details page (`/events/[slug]`) to showcase attached picture galleries.
  - **Built Full Gallery Media CRUD (`src/app/admin/gallery/page.tsx`)**:
    - **Create**: Add new gallery photo with file upload to Cloudinary or image URL, title, edition year, category, and caption.
    - **Read**: Live search by caption/title and filter by category or year.
    - **Update**: Edit modal to modify existing gallery photo details and image links.
    - **Delete**: Remove photo from gallery with confirmation.
    - Updated public `/gallery` page to load directly from `dataStore.getAllGalleryItems()`.
  - **Organizer Paytm QR Settings (`src/app/admin/settings/page.tsx`)**:
    - Streamlined as "Organizer Paytm QR Configuration".
    - Admin can update UPI ID, organizer account name, payment instructions, and upload a new Paytm QR image.
    - Live participant checkout card preview reflecting exact appearance on the student payment portal.
  - **Registrations Dashboard with Event Filter (`src/app/admin/registrations/page.tsx`)**:
    - Added a dedicated Event filter dropdown listing all active competitions with registration counts.
    - Added status filters, format filters, and full text search across participant name, college, email, and team.
    - Added detailed inspection modal to view team rosters and payment statuses.
    - Added CSV export and printable roster capabilities.
  - **Separated Payment Approval Queue (`src/app/admin/payments/page.tsx`)**:
    - Separated, dedicated queue solely for verifying UPI transactions.
    - Status tabs default to "Pending Review" with live counter badges.
    - Inspection modal showing high-res screenshot view, expected vs submitted amounts, and 12-digit UTR with 1-click copy.
    - 1-click actions: Approve (auto-confirms registration & issues ticket), Request Resubmission, and Reject with custom feedback note.
- **Verification**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npx vitest run`: 16/16 tests passing across 6 test suites (including new `admin-streamlined-flows.test.ts`).
  - `npm run build`: 40/40 routes compiled cleanly with exit code 0.

---

### Phase 8: Rebranding to AffinityAIIMS, Official Contact Update & Dark Mode Default
- **Status**: Completed
- **Why**: Transition project main heading to **AffinityAIIMS** (AIIMS Raebareli), update official contact address and email to **`swar@aiimsraebareli.edu.in`**, and set the default platform theme to **dark** mode without hydration flicker.
- **Key Changes**:
  - **Default Dark Theme Configuration**:
    - `src/components/theme-provider.tsx`: Updated `initialState`, fallback state, and `defaultTheme="dark"` with storageKey `"affinity-aiims-theme"`.
    - `src/app/layout.tsx`: Configured `<html lang="en" className="dark overflow-x-hidden max-w-full">` and `<ThemeProvider defaultTheme="dark" storageKey="affinity-aiims-theme">` to eliminate light-mode hydration flashing.
  - **Main Project Heading & Brand Identity**:
    - `src/app/layout.tsx`: Updated metadata title to `"AffinityAIIMS | Annual Inter-Collegiate Cultural Fest - AIIMS Raebareli"`.
    - `src/components/layout/navbar.tsx`: Updated brand logo to `AffinityAIIMS` with badge `'26 Fest` and subtitle `AIIMS Raebareli Cultural Fest`.
    - `src/components/home/hero-section.tsx`: Main campaign hero title updated to `AffinityAIIMS` with AIIMS Raebareli badges and collegiate context.
    - `src/components/layout/footer.tsx`: Rebranded to `AffinityAIIMS` with SWAR organizing council notice.
    - `src/app/admin/layout.tsx`: Admin header updated to `AffinityAIIMS Admin`.
    - `src/app/about/page.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/dashboard/tickets/page.tsx`: Updated heading and pass identity to `AffinityAIIMS`.
    - `src/components/home/about-editorial.tsx`, `src/components/home/clubs-showcase.tsx`, `src/components/home/cultural-showcase.tsx`, `src/components/home/previous-editions-preview.tsx`, `src/components/home/sponsors-section.tsx`, `src/components/ui/heritage-decorations.tsx`: Updated all references to `AffinityAIIMS`.
  - **Official Contact Details**:
    - Contact email updated to `swar@aiimsraebareli.edu.in` across footer, contact page, sponsor inquiries, and transactional email sender configuration.
    - Campus physical address updated to `AIIMS Campus, Dalmau Road, Munshiganj, Raebareli, UP 229405`.
  - **Verification**:
    - `npx tsc --noEmit`: 0 TypeScript errors.
    - `npx vitest run`: 16/16 tests passing across 6 test suites.
    - `npm run build`: 40/40 routes compiled cleanly with exit code 0.

---

### Phase 16: Final Testing & Comprehensive Issue Resolution (Admin & User Journeys)
- **Status**: Completed
- **Why**: Perform thorough end-to-end testing across both Administrator and Participant user journeys, eliminate all stale client-side state assumptions, wire real-time server & MongoDB synchronizations, enforce security guards, and validate 100% test coverage and production compilation.
- **Key Issues Identified & Resolved**:
  1. **Webpack Production Caching File Lock on Windows (`next.config.js`)**:
     - *Issue*: During `next build` on Windows, webpack's default filesystem pack caching encountered concurrency locks resulting in `EPERM: operation not permitted, mkdir`.
     - *Fix*: Set `config.cache = false` during production builds in `next.config.js`, enabling clean compilation of all routes.
  2. **Participant Dashboard Data Store Synchronization (`src/app/dashboard/*`)**:
     - *Issue*: Dashboard overview, registrations, and tickets were reading synchronously from `dataStore` on client render rather than querying user API routes, causing new registrations created on the server/MongoDB to not appear immediately in the client UI.
     - *Fixes*:
       - `src/app/dashboard/page.tsx`: Rewritten with `useState` and `useEffect` to query `/api/user/registrations` and `/api/user/tickets`. Added real-time KPI counts, dynamic registration rows, and loading spinner.
       - `src/app/dashboard/registrations/page.tsx`: Dynamically fetches `/api/user/registrations`, displaying accurate statuses ("Payment Approved & Ticket Issued", "Pending Review", "Resubmission Requested"). Added direct "Submit UPI Proof" / "Resubmit Proof" links with `regId` pre-population.
       - `src/app/dashboard/tickets/page.tsx`: Dynamically fetches `/api/user/tickets` and computes live SVG/canvas QR passes using `QRCode.toDataURL`. Added individual ticket download (`.png`) and batch print functionality.
       - `src/app/dashboard/profile/page.tsx`: Automatically populates student credentials (name, phone, college, student ID) from `/api/user/profile` on mount.
       - `src/app/dashboard/payments/page.tsx`: Integrated `/api/user/payments` tracking and built a dedicated "Your Payment Proof Submissions & Verification History" section with live status badges, admin feedback notes, and receipt screenshot lightbox preview.
  3. **Admin Dashboard Real-Time Backend Connectivity (`src/app/admin/*`)**:
     - *Issue*: Overview KPI counters and registrations list were not querying server APIs on mount.
     - *Fixes*:
       - `src/app/admin/page.tsx`: Added `useEffect` querying `/api/admin/overview` to dynamically update active events, total registrations, pending review count, approved count, and verified revenue.
       - `src/app/admin/registrations/page.tsx`: Enhanced `loadData()` to query `/api/admin/registrations` with CSV export and roster inspection.
       - `src/app/admin/settings/page.tsx`: Added `useEffect` querying `/api/admin/qr-settings` on mount and added `await syncWithMongo();` to `/api/admin/qr-settings` POST.
  4. **Dynamic Event & Media Resolution (`src/app/events/*`, `src/app/gallery/*`)**:
     - *Issue*: Custom events and gallery photos added by administrators were not immediately loaded by public catalog and detail pages if the client cache had not refreshed.
     - *Fixes*:
       - `src/app/events/page.tsx`: Added `/api/events` fetch in `useEffect` to merge custom admin competitions with featured events.
       - `src/app/events/[slug]/page.tsx`: Converted `EventDetailPage` to `async` with `await syncWithMongo();` so new events in MongoDB resolve seamlessly.
       - `src/app/events/[slug]/register/page.tsx`: Added dynamic `/api/events` fetching so custom events populate registration fee and squad limits accurately.
       - `src/app/gallery/page.tsx`: Added `/api/gallery` fetch in `useEffect` so newly added and updated photos reflect on the public page.
  5. **Authentication & Role Authorization Guards (`src/app/admin/layout.tsx`, `src/app/dashboard/layout.tsx`)**:
     - *Issue*: Unauthenticated guests accessing `/dashboard` or `/admin` were not redirected to `/login`, and participants accessing `/admin` were not greeted with an access restriction notice.
     - *Fixes*:
       - Added authentication loading states and automatic redirection to `/login?callbackUrl=...`.
       - Added role-based access check on `/admin`: Non-administrators are presented with a styled "Access Restricted: Administrator Privileges Required" guard with options to switch accounts or return to the participant portal.
       - Rebranded `/login` heading from `Rangmanch '26` to `AffinityAIIMS '26`.
  6. **Comprehensive Automated Test Suite (`src/__tests__/admin-and-user-full-testing.test.ts`)**:
     - Created 14 extensive end-to-end test specifications covering:
       - User registration, password hashing & verification
       - User profile update and password change
       - Individual and team registration with squad rosters
       - Free event instant ticket issuance
       - Paytm UPI proof submission with 12-digit UTR
       - Strict UTR uniqueness enforcement
       - Admin RBAC validation
       - Overview metrics aggregation
       - Event creation with multiple pictures, status toggle, and deletion
       - 1-click payment approval with automatic ticket generation
       - Payment resubmission requests with admin explanation
       - Full gallery media CRUD
       - Organizer Paytm QR configuration update
  7. **Mandatory Payment Screenshot Receipt Enforcement (`src/app/dashboard/payments/page.tsx`, `src/app/api/payments/submit/route.ts`)**:
     - *Issue*: The payment proof form had a silent unsplash placeholder fallback if the participant did not provide a receipt image, allowing submission without an actual screenshot.
     - *Fix*:
       - Removed placeholder fallback completely.
       - Enforced client-side blocking: form rejects submission with a clear error if screenshot receipt is missing.
       - Enforced server-side validation: `/api/payments/submit` rejects empty or trimmed screenshot URLs with HTTP 400.
       - Enhanced UI: Added clear `* (Compulsory / अनिवार्य)` badge, upload confirmation badges, and mandatory instructions.
- **Verification**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npx vitest run`: 37/37 tests passing across all 8 test suites (100% pass rate).
  - Production build: Successfully compiled across all dynamic and static routes.

---

### Phase 17: Gmail SMTP Sending System Overhaul, UI/Backend Flow Diagnostics & Testing
- **Status**: Completed
- **Why**: Fix the Gmail SMTP email dispatch system that was not delivering emails reliably, resolve configuration traps with Google App Passwords and TLS/SSL ports, add missing email notifications across all user journeys, provide admin testing diagnostics, and thoroughly test all UI and backend flows without altering any existing flow.
- **Root Cause Analysis of Gmail Sending Issues**:
  1. *Google App Password Space Formatting*: Google generates 16-character App Passwords formatted as 4-character chunks separated by spaces (`abcd efgh ijkl mnop`). When users pasted this into `.env`, Nodemailer sent the raw password with spaces, prompting Google SMTP servers to reject the authentication with `535-5.7.8 Username and Password not accepted`.
  2. *Port 587 vs 465 TLS/SSL Conflict*: In Nodemailer, port 465 requires direct SSL (`secure: true`), while port 587 requires STARTTLS (`secure: false`). The previous transporter configuration evaluated `secure = process.env.SMTP_SECURE !== "false"`, which defaulted `secure` to `true` even on port 587, leading to immediate handshake errors or socket timeouts.
  3. *Mismatched Sender Header ("from")*: Google SMTP requires that the envelope `from` address matches the authenticated `SMTP_USER` Gmail account or an alias. The previous implementation defaulted fallback `from` to an outdated address (`fest.cultural.up@gmail.com`), causing Google to either rewrite or reject outgoing mail with SPF/DMARC flags.
  4. *Silent Error Swallowing in `sendMail`*: In the catch block, `sendMail` returned `{ success: false }` with no error message and no console logging, leaving developers and administrators blind to authentication, connection, or quota errors.
  5. *Outdated Email Branding*: All HTML email templates were still using legacy `Rangmanch UP 2026` branding with Lucknow venues instead of the modern `AffinityAIIMS '26` (AIIMS Raebareli) festival palette and official secretariat address (`swar@aiimsraebareli.edu.in`).
  6. *Missing Transactional Notifications Across Lifecycles*:
     - Event registration confirmation emails were not being triggered.
     - Free event instant digital ticket notifications were missing.
     - Paytm payment proof submission receipts were not dispatched to students.
     - Resubmission requests from admins incorrectly sent rejection emails instead of resubmission instructions.
     - Password reset and contact helpdesk forms were not wired to backend email delivery.
- **Key Technical Implementations & Flow Hardening**:
  - **Robust Nodemailer Gmail Engine (`src/lib/email/index.ts`)**:
    - **Credential Sanitization**: Automatically removes internal spaces and outer quotes from Google App Passwords (`pass.replace(/\s+/g, "")`).
    - **Native Gmail Service Support**: Uses Nodemailer's native `service: "gmail"` profile when connecting to Gmail on port 465 or default, providing optimal socket pooling and Google-tailored TLS cipher negotiation.
    - **Port-Aware TLS Negotiation**: Properly pairs port 465 with `secure: true` and port 587 with `secure: false`, respecting explicit overrides in `SMTP_SECURE`.
    - **Dynamic Sender Resolution (`getSenderAddress`)**: Dynamically aligns the `from` header to `process.env.EMAIL_FROM || '"AffinityAIIMS \'26" <${user}>'`, preventing Google SMTP spoofing rejections.
    - **Comprehensive Error Auditing**: Returns `{ success: false, error: error.message }` and logs errors with `console.error` while capturing timestamped audit records in `emailDispatchLogs`.
    - **Handshake Verification Function (`verifySmtpConnection`)**: Provides a live `transporter.verify()` check to test connectivity without having to trigger a dummy email.
  - **AffinityAIIMS Royal Heritage Email Templates**:
    - Built responsive, dark-mode luxury HTML templates with Burgundy (`#681F38`), Royal Plum (`#402044`), Antique Gold (`#D4AD63`), and Champagne (`#F5E8D0`) color accents matching the platform design tokens.
    - Implemented 9 distinct email functions:
      1. `sendWelcomeEmail`: Welcome and festival orientation for new participants.
      2. `sendRegistrationConfirmationEmail`: Event registration receipt with format, fee, and instant ticket pass for free events.
      3. `sendPaymentSubmittedEmail`: Acknowledgment of Paytm UPI proof submission with 12-digit UTR and audit status.
      4. `sendPaymentApprovalEmail`: Official approval notice with ticket number and cryptographic QR token.
      5. `sendPaymentRejectionEmail`: Rejection notice with finance committee audit feedback.
      6. `sendPaymentResubmitEmail`: Resubmission notice instructing students to upload a clearer receipt without cancelling registration.
      7. `sendPasswordResetEmail`: 60-minute password reset link with security guidelines.
      8. `sendContactInquiryNotification`: Automated dispatch of helpdesk inquiries to festival secretariat.
      9. `sendTestEmail`: Diagnostics email detailing host, port, authenticated account, and timestamp.
  - **Backend Lifecycle Integration (Zero Flow Changes)**:
    - `src/app/api/auth/register/route.ts`: Dispatches `sendWelcomeEmail` upon successful user signup.
    - `src/app/api/events/register/route.ts`: Dispatches `sendRegistrationConfirmationEmail` with instant ticket for free events and Paytm instructions for paid events.
    - `src/app/api/payments/submit/route.ts`: Dispatches `sendPaymentSubmittedEmail` acknowledging payment receipt upload.
    - `src/app/api/admin/payments/route.ts`: Dispatches `sendPaymentApprovalEmail` upon approval, `sendPaymentResubmitEmail` upon resubmit request, and `sendPaymentRejectionEmail` upon rejection.
    - `src/app/api/auth/forgot-password/route.ts` & `src/app/forgot-password/page.tsx`: Full end-to-end password reset email dispatch.
    - `src/app/api/contact/route.ts` & `src/app/contact/page.tsx`: Full end-to-end helpdesk message transmission.
  - **Admin Settings Diagnostic Panel (`src/app/admin/settings/page.tsx` & `/api/admin/email`)**:
    - Added an interactive "Gmail SMTP Diagnostics & Testing" card directly within `/admin/settings`.
    - Displays engine status ("Live Gmail SMTP Active" vs "Graceful Simulation Mode"), sender address, and authenticated user.
    - 1-Click "Verify Connection" button testing live SMTP socket handshakes.
    - Diagnostic test email dispatcher allowing administrators to send a test message to any email and observe real-time message ID or error feedback.
    - Live audit log viewer showing recent dispatches with status badges (`sent`, `simulated`, `failed`).
  - **Documentation & Setup Instructions (`.env.example`)**:
    - Updated `.env.example` with clear step-by-step guidance on creating Google App Passwords, port configuration, and branding variables.
- **Verification & Testing Results**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test` (`npx vitest run`): 55/55 tests passing across 9 test suites (100% pass rate), including 18 tests in `src/__tests__/gmail-sending-functionality.test.ts`.
  - `npm run build`: All 55 static and dynamic Next.js routes compiled with exit code 0.

---

### Phase 18: Signout Homepage Redirection & Google App Password Environment Validation
- **Status**: Completed
- **Why**: Resolve client-side signout redirection dropping users to `localhost:3000` instead of the homepage on the live Vercel domain (`https://event-management-system-kappa-gold.vercel.app/`), eliminate all hardcoded `localhost:3000` fallbacks, and diagnose/remedy the user's provided Gmail SMTP environment settings.
- **Root Cause Analysis**:
  1. *Signout Redirection to `localhost:3000`*:
     - NextAuth's `signOut({ callbackUrl: "/" })` sends a POST to `/api/auth/signout` and then redirects to the origin resolved by NextAuth's `redirect` callback.
     - In NextAuth, `baseUrl` defaults to `process.env.NEXTAUTH_URL`. When `NEXTAUTH_URL` was set to or defaulted to `http://localhost:3000`, the relative URL `"/"` was joined as `http://localhost:3000/`, forcing live Vercel sessions to navigate to localhost.
  2. *Gmail Environment Configuration Analysis*:
     - *Issue A: `SMTP_PASS="Aiims12345678"`*: The user provided a standard personal password (`Aiims12345678`). Google disabled Less Secure Apps access on May 30, 2022. Google SMTP strictly rejects standard account passwords with `535-5.7.8 Username and Password not accepted`. Google SMTP strictly requires a 16-character Google App Password generated after enabling 2-Step Verification.
     - *Issue B: `EMAIL_FROM="Rangmanch UP Cultural Fest <fest.cultural.up@gmail.com>"`*: The authenticated account is `aiimsrblswar@gmail.com`, but the envelope header attempted to send from `fest.cultural.up@gmail.com`. Gmail SMTP either drops or rewrites mail claiming to be from an unauthorized external account, causing SPF/DKIM/DMARC failure on recipient servers.
- **Key Technical Implementations**:
  - **Deterministic Client-Side Signout Navigation (`navbar.tsx`, `admin/layout.tsx`, `dashboard/layout.tsx`)**:
    - Converted all sign-out button handlers across the desktop navbar dropdown, mobile menu drawer, admin sidebar, and participant sidebar to:
      ```typescript
      await signOut({ redirect: false });
      window.location.href = "/";
      ```
    - Calling `signOut({ redirect: false })` terminates the session and clears cookies cleanly in the background, while `window.location.href = "/"` immediately navigates the browser to the root homepage of the *current host* (`https://event-management-system-kappa-gold.vercel.app/`), making it physically impossible to redirect to `localhost:3000`.
  - **Server-Side Base URL Normalization (`src/lib/utils.ts` & `src/lib/auth/index.ts`)**:
    - Created `getBaseUrl()` dynamically returning `window.location.origin` in the browser, `process.env.NEXTAUTH_URL` (if non-localhost), `process.env.VERCEL_URL`, or falling back directly to `"https://event-management-system-kappa-gold.vercel.app"`.
    - Hardcoded `localhost:3000` fallbacks purged from `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/api/auth/forgot-password/route.ts`, and `src/lib/email/index.ts`.
    - NextAuth `redirect` callback updated to resolve relative paths against the active production domain.
  - **Automatic Sender Alignment in Email Pipeline (`src/lib/email/index.ts`)**:
    - Updated `getSenderAddress()` so that if `EMAIL_FROM` contains a mismatched Gmail address (e.g. `fest.cultural.up@gmail.com`), it automatically aligns the sender to `"AffinityAIIMS '26" <${user}>` (`aiimsrblswar@gmail.com`) to prevent Google authentication rejections.
    - Updated `verifySmtpConnection()` to detect error `535-5.7.8` and display clear guidance on generating a 16-character App Password.
  - **Documentation & Instructions (`.env.example`)**:
    - Documented `NEXTAUTH_URL="https://event-management-system-kappa-gold.vercel.app"` and explicit Google App Password creation steps.
- **Verification & Testing Results**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test`: 55/55 tests passing across all 9 test suites (100% pass rate).
  - `npm run build`: All 55 routes compiled with code 0.

### Phase 19: Gmail OAuth2 Integration, NextAuth Header Injection Fix & MongoDB Atlas Serverless Resilience
- **Status**: Completed
- **Why**:
  1. Add native support for Google OAuth2 mail dispatch (`GMAIL_USER`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) alongside existing Google App Password/SMTP mode.
  2. Fix Vercel runtime crash: `TypeError: Headers.set: "https://event-management-system-theta-lac.vercel.app/\n \n/dashboard" is an invalid header value` in `/api/auth/callback/credentials`.
  3. Fix MongoDB Atlas serverless crash: `Unhandled Rejection: MongoServerSelectionError: Server selection timed out after 5000 ms` exiting with status 128 in `/api/auth/providers`.
  4. Provide exhaustive analysis of the user's provided env variables (`SMTP_PASS="Aiims12345678"`, `EMAIL_FROM="Rangmanch UP Cultural Fest <fest.cultural.up@gmail.com>"`).
- **Root Cause Analysis**:
  1. *Header Injection in NextAuth Redirect*:
     - On Vercel, `NEXTAUTH_URL` or the incoming callback URL contained trailing carriage returns, newlines, and spaces (`\n \n`).
     - NextAuth's `redirect` callback concatenated `${targetBase}${url}` producing `"https://event-management-system-theta-lac.vercel.app/\n \n/dashboard"`.
     - Undici / Node.js HTTP `Headers.set("Location", ...)` strictly validates header values and throws a fatal `TypeError` whenever carriage returns or newlines are present.
  2. *MongoDB Atlas Serverless Timeout Exit 128*:
     - When `MONGODB_URI` is provided, `src/lib/mongodb.ts` called `global._mongoClientPromise = client.connect()` at the module root without an immediate `.catch()` handler.
     - When deployed to Vercel, if MongoDB Atlas IP whitelist does not permit serverless dynamic IPs (`0.0.0.0/0`) or times out (5000 ms), the unhandled promise rejection crashed the Node.js serverless execution context with exit status 128.
  3. *Gmail Delivery Failure with `SMTP_PASS="Aiims12345678"`*:
     - Google discontinued basic password authentication on May 30, 2022. A personal account password (`Aiims12345678`) is rejected by `smtp.gmail.com` with `535 5.7.8 BadCredentials`.
     - Valid options are: Option A (Google OAuth2 via Refresh Token) or Option B (16-character Google App Password).
- **Key Technical Implementations**:
  - **URL Sanitization & Header Protection (`src/lib/utils.ts` & `src/lib/auth/index.ts`)**:
    - Created `sanitizeUrl(url)`: aggressively strips `[\r\n\t\0\s]+` and trailing slashes.
    - Updated `getBaseUrl()` and NextAuth `redirect` callback to sanitize both `baseUrl`, `url`, `NEXTAUTH_URL`, and `VERCEL_URL`.
    - Added both `event-management-system-kappa-gold.vercel.app` and `event-management-system-theta-lac.vercel.app` to allowed redirect domains.
    - Added unit test confirming Undici `Headers.set("Location", result)` passes without throwing.
  - **MongoDB Atlas Serverless Resilience (`src/lib/mongodb.ts`)**:
    - Wrapped `client.connect()` with an immediate `.catch()` handler so top-level rejection never triggers an unhandled rejection or process exit 128.
    - Gracefully logs a clear diagnostic warning and falls back to in-memory `dataStore` for high availability.
  - **Gmail OAuth2 & Dual-Engine Transporter (`src/lib/email/index.ts`)**:
    - Implemented `isOAuth2Configured()`: detects `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `GMAIL_USER` (or `SMTP_USER`).
    - Configured Nodemailer OAuth2 transport:
      ```typescript
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_USER || process.env.SMTP_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      });
      ```
    - Updated `verifySmtpConnection()` to diagnose OAuth2 vs App Password, handling `invalid_grant` token expiry and providing clear guidance.
    - Updated admin email diagnostic API (`/api/admin/email`) to expose `authMethod: "OAuth2" | "AppPassword" | "none"`.
    - Updated `.env.example` with complete configuration guides for both Option A (OAuth2) and Option B (App Password).
- **Verification & Testing Results**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test`: 59/59 tests passing across all 9 test suites (100% pass rate).
  - `npm run build`: Production Next.js build succeeded for all 45 static and dynamic routes.

### Phase 20: Cultural Clubs Management (CRUD), Fest Scheduling & Homepage Timeclock Autosync, and Database Dummy Data Purge
- **Status**: Completed
- **Why**:
  1. Empower administrators to dynamically create, curate, edit, and delete university cultural societies and clubs without touching codebase.
  2. Empower administrators to schedule festival editions and designate a primary active fest/event that automatically synchronizes the live homepage hero countdown timeclock, title, edition, and date badge.
  3. Purge all legacy dummy data (mock registrations, mock payments, mock tickets, demo test student accounts) from both in-memory store and MongoDB Atlas, leaving only essential administrator accounts and active clubs/fests.
  4. Ensure end-to-end UI and backend flows are thoroughly tested with 100% Vitest pass rate and clean production build.
- **Root Cause & Architectural Enhancements**:
  1. *Hardcoded Homepage Countdown*:
     - Previously, `CountdownTimer` in `src/components/home/hero-section.tsx` used a static target date `"2026-03-12T09:00:00"`.
     - Admins had no interface to change festival dates or set a new festival edition without code changes.
     - **Fix**: Created `StoredFest` model and `dataStore.getPrimaryCountdown()`. Built `/api/fests/primary` and `/api/fests`. `HeroSection` now dynamically polls/fetches the primary fest schedule on mount, automatically updating the countdown clock, date badge, and venue in real-time.
  2. *Hardcoded Clubs Showcase*:
     - Previously, `COLLEGE_CLUBS` in `src/components/home/clubs-showcase.tsx` was a static array.
     - Admins had no UI to add new societies or manage club leads.
     - **Fix**: Implemented `StoredClub` model, CRUD API (`/api/clubs`), and an administrative panel at `/admin/clubs`. `ClubsShowcase` dynamically loads clubs from the API, and the event creation modal at `/admin/events` dynamically populates its "Host College Club" datalist from the registered clubs.
  3. *Removal of Dummy Data from DB*:
     - Previously, `dataStore.seedInitialData()` contained mock test student `usr-student-1`, mock registrations `reg-demo-1001` and `reg-demo-1002`, mock payments `pay-1001` and `pay-1002`, and mock ticket `tkt-1001`.
     - In `db-sync.ts`, these mock items were pushed into MongoDB Atlas on startup.
     - **Fix**:
       - Completely removed all dummy student, registration, payment, and ticket seeding from `dataStore.seedInitialData()`. Initial state for registrations, payments, and tickets is strictly empty `[]`.
       - Added `dataStore.cleanDummyData()` and `purgeDummyDataFromMongo()` in `src/lib/db-sync.ts` which automatically purges any legacy mock records from MongoDB Atlas on first sync.
       - Built `POST /api/admin/clean-dummy-data` and an admin card in `/admin/settings` allowing one-click database cleanup.
       - Preserved essential administrator accounts (`admin@aiimsraebareli.edu.in`, `admin@rangmanchfest.in`, `admin@admin.com`, and any env `ADMIN_EMAIL`).
- **Key Technical Implementations**:
  - **Models & Persistence (`src/lib/data-store.ts`, `src/lib/mongodb.ts`, `src/lib/db-sync.ts`)**:
    - Added `StoredClub` and `StoredFest` interfaces.
    - Added `clubs` and `fests` MongoDB collections with unique indexes on `id`, `slug`, and `isPrimary`.
    - Implemented full CRUD methods: `getAllClubs()`, `createClub()`, `updateClub()`, `deleteClub()`, `getAllFests()`, `createFest()`, `updateFest()`, `deleteFest()`, `setPrimaryFest()`, and `getPrimaryCountdown()`.
    - Added `cleanDummyData()` and `purgeDummyDataFromMongo()`.
  - **API Routes**:
    - `GET /api/clubs`, `POST /api/clubs`, `PUT /api/clubs`, `DELETE /api/clubs`: Cultural clubs management.
    - `GET /api/fests`, `POST /api/fests`, `PUT /api/fests`, `DELETE /api/fests`: Festival schedule management.
    - `GET /api/fests/primary`, `POST /api/fests/primary`: Primary fest countdown timeclock autosync.
    - `POST /api/admin/clean-dummy-data`: Database maintenance and dummy record purge.
  - **Admin UI Modules**:
    - `/admin/clubs/page.tsx`: Full CRUD UI for clubs (Name, Category, Motto, Coordinator, Contact, Competitions, Prizes, Badge).
    - `/admin/fests/page.tsx`: Fest schedule manager with live timeclock autosync preview, "Set as Primary" one-click action, and schedule modal.
    - `/admin/settings/page.tsx`: Added "Database Maintenance & Clean State" card with live purge metrics.
    - `/admin/layout.tsx`: Added navigation links for "Fest Schedule & Timer" and "Cultural Clubs (CRUD)".
  - **Homepage Autosync**:
    - `src/components/home/hero-section.tsx`: Dynamically fetches `/api/fests/primary` and binds the countdown timer, edition subtitle, tagline, and date badge.
    - `src/components/home/clubs-showcase.tsx`: Dynamically fetches `/api/clubs` to render newly created clubs.
    - `src/app/admin/events/page.tsx`: Binds Host College Club input to `<datalist id="clubs-datalist">` populated from registered clubs.
- **Verification & Testing Results**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test`: **71/71 tests passing** across all 10 test suites (100% pass rate).
  - Added new comprehensive test suite: `src/__tests__/clubs-and-fests-management.test.ts` (12 tests covering clubs CRUD, fest scheduling, timeclock autosync, and dummy data removal).
  - `npm run build`: Production Next.js build succeeded for all 47 static and dynamic routes.

---

### Phase 21: Fest Entity Elimination, Primary Event Homepage Countdown Autosync & Inline Club Registration
- **Status**: Completed
- **Why**:
  1. The user explicitly instructed: *"fest is event type so donot need to create a separate if i create a primary event show that event countdown to homepage also remove this fest concept totally on click for regristraion under countdown redirect to page of regristration of that event remove unecessory thing and for clube we can create clubs while creating events such as choose from exixting clube or register new clubs like this flow"*.
  2. Eliminate the redundant standalone "Fest" entity, database collections, and routes (`/admin/fests`, `/api/fests`), treating "fest" simply as an event type.
  3. Allow administrators to designate any event as the **Primary Flagship Event** (`isPrimary: true`), which dynamically synchronizes the live homepage countdown timer, title, date, venue, club, and prize pool.
  4. Ensure that clicking the registration CTA button under the homepage countdown timer redirects directly to that Primary Event's specific registration page (`/events/${primaryEvent.slug}/register`).
  5. Streamline the Collegiate Clubs flow: when creating or editing an event in `/admin/events`, provide an inline dual-mode selector allowing the administrator to either choose from existing registered clubs or register a brand-new club inline without leaving the modal.
  6. Maintain zero dummy data in the database (preserving only essential admin credentials and active clubs/events).

- **Key Architectural & Code Changes**:
  1. **Primary Event Synchronization & Countdown Resolver (`src/lib/data-store.ts`)**:
     - Added `isPrimary?: boolean` flag to `StoredEvent`.
     - In `createEvent()` and `updateEvent()`: when `isPrimary: true` is passed, automatically unsets `isPrimary` on all other events and persists.
     - Implemented `getPrimaryEvent(): StoredEvent | undefined`.
     - Implemented `setPrimaryEvent(id: string): boolean`.
     - Implemented `parseEventDateTimeToIso(dateStr?, timeStr?)`: cleanly converts flexible event date/time formats (e.g. `"13 March 2026"`, `"12–15 March 2026"`, `"05:00 PM"`) into standard ISO format for countdown clocks.
     - Implemented `getPrimaryEventCountdown()`: returns `{ success: true, primaryEvent, targetDate, registrationUrl: "/events/${primaryEvent.slug}/register", title, venue, club, date, time, prizePool, registrationFee, category, status, poster }`.
     - Seeded initial flagship event `kathak-jugalbandi` with `isPrimary: true`.
     - Completely removed `StoredFest` interface, `this.fests`, and all fest methods (`getAllFests`, `getFestById`, `getPrimaryFest`, `createFest`, `updateFest`, `deleteFest`, `setPrimaryFest`, `loadFestsFromMongo`, `getPrimaryCountdown`).
  2. **MongoDB & Database Sync Cleanup (`src/lib/mongodb.ts`, `src/lib/db-sync.ts`, `src/lib/seed-mongo.ts`, `/api/admin/clean-dummy-data`)**:
     - Removed `fests` collection, indexes, and `getFestsCollection` from `mongodb.ts`.
     - Removed `StoredFest` and fest sync loop from `db-sync.ts`.
     - Removed fest seeding from `seed-mongo.ts`.
     - Replaced `festsCount` with `eventsCount` in `/api/admin/clean-dummy-data`.
  3. **Primary Event Public & Admin API (`src/app/api/events/primary/route.ts`)**:
     - Created `GET /api/events/primary`: public endpoint providing countdown date, primary event details, and direct `registrationUrl`.
     - Created `POST /api/events/primary`: admin endpoint allowing 1-click designation of the Primary Event via `{ eventId }`.
     - Completely deleted obsolete routes: `src/app/api/fests/route.ts`, `src/app/api/fests/primary/route.ts`, and `src/app/admin/fests/page.tsx`.
  4. **Homepage Hero Section Countdown & Direct Registration (`src/components/home/hero-section.tsx`)**:
     - Synchronized live countdown timer with `GET /api/events/primary`.
     - Under the countdown timer, the primary registration CTA button dynamically sets `href={primaryEvent.registrationUrl}` (`/events/${primaryEvent.slug}/register`), with label `Register for ${primaryEvent.title}`.
     - Dynamically renders Primary Event badges, venue, club, date, and prize pool on the hero banner.
  5. **Admin Events Page: Inline Club Creation & Primary Designation (`src/app/admin/events/page.tsx`)**:
     - **Host College Club Dual-Mode**:
       - `[Choose Existing Club]`: Select dropdown populated from registered clubs (`availableClubs`).
       - `[+ Register New Club]`: Inline fields for New Club Name, Category, Motto/Tagline, and Coordinator Name/Phone.
       - Upon saving the event with a new club, automatically calls `POST /api/clubs`, persists the new club in MongoDB Atlas, and assigns it to the new event.
     - **Primary Event Controls**:
       - Added checkbox in event modal: `Mark as Primary Event (Syncs with Homepage Countdown & Hero Pass)`.
       - Added golden `⭐ Primary Event (Homepage Timer)` badge in the events table list.
       - Added 1-click `Star` quick-action button in the table actions to instantly designate any event as the Primary Event.
  6. **Admin Sidebar Navigation (`src/app/admin/layout.tsx`)**:
     - Removed obsolete `Fest Schedule & Timer` link.
     - Updated `Create & Manage Events` to `Events & Primary Countdown`.

- **Verification & Testing Results**:
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test`: **70/70 tests passing** across all 10 test suites (100% pass rate).
  - Updated `src/__tests__/clubs-and-fests-management.test.ts` to test primary event countdown autosync, ISO timestamp parsing, direct registration URL, and inline club creation during event creation.
  - `npm run build`: Production Next.js build compiled successfully for all 46 static and dynamic routes.








