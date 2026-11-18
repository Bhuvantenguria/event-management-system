import bcrypt from "bcryptjs";

/**
 * Robustly parses festival & event date/time strings into valid ISO format for countdown timers.
 * Handles formats like:
 * - "13 March 2026" + "05:00 PM"
 * - "12–15 March 2026" + "08:00 AM" (takes first start date)
 * - "2026-03-12" + "10:00"
 */
export function parseEventDateTimeToIso(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return "2026-03-12T09:00:00.000Z";

  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  // Handle date ranges like "12–15 March 2026" or "12-15 March 2026"
  let cleanDate = dateStr.replace(/[–—]/g, "-").trim();
  if (cleanDate.match(/^\d{1,2}\s*-\s*\d{1,2}\s+/)) {
    cleanDate = cleanDate.replace(/^(\d{1,2})\s*-\s*\d{1,2}\s+/, "$1 ");
  }

  // Parse time
  let hours = 9;
  let minutes = 0;
  if (timeStr) {
    const match12 = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const meridiem = match12[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      hours = h;
      minutes = m;
    }
  }

  const parsed = new Date(cleanDate);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(hours, minutes, 0, 0);
    return parsed.toISOString();
  }

  // Fallback anchor
  return "2026-03-12T09:00:00.000Z";
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  phone?: string;
  college?: string;
  studentId?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface StoredRegistration {
  id: string;
  registrationNumber: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  college: string;
  participationType: "individual" | "team";
  teamName?: string;
  teamMembers?: Array<{ name: string; email: string; phone?: string; isCaptain?: boolean }>;
  amount: number;
  paymentStatus: "awaiting_payment" | "pending_verification" | "approved" | "rejected" | "resubmission_required" | "cancelled";
  registrationStatus: "pending" | "confirmed" | "cancelled";
  qrToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPaymentSubmission {
  id: string;
  registrationId: string;
  amountExpected: number;
  amountSubmitted: number;
  utrNumber: string;
  paymentScreenshotUrl: string;
  paymentDate: string;
  paymentTime?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "resubmission_required";
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface StoredTicket {
  id: string;
  registrationId: string;
  ticketNumber: string;
  qrToken: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  participantName: string;
  participantEmail: string;
  college: string;
  teamName?: string;
  isValid: boolean;
  generatedAt: string;
  isScanned?: boolean;
  scannedAt?: string;
  scannedBy?: string;
}

export interface StoredEvent {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryKey: string;
  club?: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  registrationFee: number;
  teamSize: string;
  prizePool: string;
  poster: string;
  images?: string[]; // Multiple pictures uploaded for the event
  status: "Registration Open" | "Registration Closed";
  isPrimary?: boolean; // Primary Flagship Event shown on Homepage countdown clock & hero
  rules?: string[];
  eligibility?: string[];
  prizes?: Array<{ rank: string; amount: string }>;
  coordinators?: Array<{ name: string; phone: string; email: string }>;
  participationType?: "individual" | "team" | "both";
  minTeamSize?: number;
  maxTeamSize?: number;
  createdAt: string;
}

export interface StoredGalleryItem {
  id: string;
  title: string;
  category: string;
  year: string;
  location?: string;
  image: string;
  caption?: string;
  createdAt: string;
}

export interface StoredClub {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  motto?: string;
  badge?: string;
  coordinator?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  logoUrl?: string;
  bannerUrl?: string;
  color?: string; // Tailwind gradient CSS e.g. "from-fest-sunset to-fest-burgundy"
  eventsHosted?: string[];
  eventCount?: string;
  prizes?: string;
  href?: string;
  createdAt: string;
  updatedAt: string;
}

export type PersistenceHandler = (
  collection: "users" | "registrations" | "payments" | "tickets" | "qr_settings" | "events" | "gallery" | "clubs",
  filter: Record<string, any>,
  data: Record<string, any>,
  action?: "upsert" | "delete"
) => Promise<void>;

// In-Memory Global Store with Server Persistence Handlers (MongoDB Atlas)
class DataStore {
  private users: StoredUser[] = [];
  private registrations: StoredRegistration[] = [];
  private payments: StoredPaymentSubmission[] = [];
  private tickets: StoredTicket[] = [];
  private events: StoredEvent[] = [];
  private gallery: StoredGalleryItem[] = [];
  private clubs: StoredClub[] = [];
  private qrSettings = {
    upiId: "swar.aiims@paytm",
    upiName: "SWAR AIIMS Raebareli",
    qrImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    paymentInstructions:
      "1. Scan the Paytm UPI QR code using any UPI app (Paytm, GPay, PhonePe).\n2. Verify beneficiary name: 'SWAR AIIMS Raebareli'.\n3. Enter exact event fee.\n4. Save the payment receipt screenshot and copy the 12-digit UTR/UPI Reference Number.",
    isEnabled: true,
  };

  private persistenceHandler: PersistenceHandler | null = null;
  private pendingWrites: Promise<void>[] = [];

  constructor() {
    this.seedInitialData();
  }

  public setPersistenceHandler(handler: PersistenceHandler) {
    this.persistenceHandler = handler;
  }

  public async flushPending(): Promise<void> {
    if (this.pendingWrites.length === 0) return;
    const current = [...this.pendingWrites];
    this.pendingWrites = [];
    await Promise.allSettled(current);
  }

  private persist(
    collection: "users" | "registrations" | "payments" | "tickets" | "qr_settings" | "events" | "gallery" | "clubs",
    filter: Record<string, any>,
    data: Record<string, any>,
    action: "upsert" | "delete" = "upsert"
  ): Promise<void> {
    if (!this.persistenceHandler) return Promise.resolve();
    const p = this.persistenceHandler(collection, filter, data, action).catch((err) => {
      console.error(`MongoDB sync error for ${collection}:`, err);
    });
    this.pendingWrites.push(p);
    return p;
  }

  private seedInitialData() {
    const hashedAdmin = bcrypt.hashSync("Admin@1234", 10);

    // Essential Admin Accounts only (No dummy test participants or mock records)
    this.users = [
      {
        id: "usr-admin-1",
        email: "admin@aiimsraebareli.edu.in",
        name: "Fest Administrator",
        passwordHash: hashedAdmin,
        role: "admin",
        phone: "+91 98765 00001",
        college: "Festival Central Committee",
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-admin-2",
        email: "admin@rangmanchfest.in",
        name: "Super Administrator",
        passwordHash: hashedAdmin,
        role: "super_admin",
        phone: "+91 98765 00002",
        college: "Rangmanch UP Cultural Secretariat",
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-admin-3",
        email: "admin@admin.com",
        name: "Administrator",
        passwordHash: hashedAdmin,
        role: "super_admin",
        phone: "+91 98765 00003",
        college: "Festival Central Secretariat",
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Clean Production State: No dummy registrations, payments, or tickets
    this.registrations = [];
    this.payments = [];
    this.tickets = [];

    // Official Collegiate Cultural Clubs
    this.clubs = [
      {
        id: "club-mudra",
        name: "Mudra Dance Society",
        slug: "mudra-dance-society",
        category: "Dance & Performing Arts",
        motto: "Rhythms of Kathak & Classical Grace",
        badge: "Est. 2012 • 45 Active Dancers",
        coordinator: "Ananya Mishra",
        coordinatorEmail: "dance@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43210",
        color: "from-fest-sunset to-fest-burgundy",
        eventsHosted: ["Kathak Jugalbandi", "Braj Mayur Nritya", "Western Choreo Night"],
        eventCount: "6 Contests",
        prizes: "₹1,25,000",
        href: "/events?category=cultural",
        description: "Official collegiate dance society curating classical Gharana repertoires, contemporary choreography, and folk traditions.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-dhwani",
        name: "Dhwani Music & Band Society",
        slug: "dhwani-music-society",
        category: "Music & Band Battles",
        motto: "Hindustani Vocals to Electric Sufi Riffs",
        badge: "Campus Band & Choir",
        coordinator: "Kabir Sengupta",
        coordinatorEmail: "music@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43211",
        color: "from-fest-burgundy to-fest-plum",
        eventsHosted: ["Roohaniyat Sufi Rock", "Kashi Raga Solo", "Unplugged Acoustic"],
        eventCount: "8 Contests",
        prizes: "₹95,000",
        href: "/events?category=music",
        description: "Campus vocal and instrumental society organizing pan-India collegiate battle of the bands and classical concerts.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-natraj",
        name: "Natraj Dramatics Club",
        slug: "natraj-dramatics-club",
        category: "Theatre & Dramatics",
        motto: "Street Nukkad Natak to Awadhi Court Plays",
        badge: "State Award Winning Troupe",
        coordinator: "Devendra Rathore",
        coordinatorEmail: "theatre@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43212",
        color: "from-fest-plum to-fest-charcoal",
        eventsHosted: ["Nukkad Natak (Street Play)", "Stage Play Competition", "Mono-Acting"],
        eventCount: "5 Contests",
        prizes: "₹80,000",
        href: "/events?category=cultural",
        description: "The theatrical heart of campus presenting socially conscious street plays and dramatic stage productions.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-kalam",
        name: "Kalam Literary & Debating Society",
        slug: "kalam-literary-society",
        category: "Literary, Poetry & Debates",
        motto: "Shaam-e-Awadh Shayari to Parliamentary Debates",
        badge: "Official College MUN & Lit Wing",
        coordinator: "Divya Pandey",
        coordinatorEmail: "literary@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43213",
        color: "from-fest-rose to-fest-burgundy",
        eventsHosted: ["Shaam-e-Awadh Kavi Sammelan", "All-India Youth Parliament", "Turncoat Debate"],
        eventCount: "7 Contests",
        prizes: "₹65,000",
        href: "/events?category=literary",
        description: "Promoting Hindi poetry, Urdu ghazals, English forensics, and competitive parliamentary debating.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-akriti",
        name: "Akriti Fine Arts & Heritage Crafts Club",
        slug: "akriti-fine-arts-club",
        category: "Fine Arts & Design",
        motto: "Preserving Banarasi Weaves & Chikankari Design",
        badge: "Craft Guild Partners",
        coordinator: "Aditya Sharma",
        coordinatorEmail: "arts@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43214",
        color: "from-fest-gold to-fest-sunset",
        eventsHosted: ["Shilpkar 3D Design Challenge", "Live Clay Pottery", "Couture Runway"],
        eventCount: "8 Contests",
        prizes: "₹70,000",
        href: "/events?category=heritage_arts",
        description: "Dedicated to the living visual traditions, textile craftsmanship, and modern installation arts of Uttar Pradesh.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-varchasva",
        name: "Varchasva Sports Council",
        slug: "varchasva-sports-council",
        category: "Sports Tournaments",
        motto: "Pride, Passion & Varsity Athletics",
        badge: "University Athletics Wing",
        coordinator: "Capt. Vikramaditya Singh",
        coordinatorEmail: "sports@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43215",
        color: "from-fest-green to-fest-charcoal",
        eventsHosted: ["Chhatrapati Shivaji Football Cup", "Major Dhyan Chand Cricket", "Awadh Basketball"],
        eventCount: "6 Tournaments",
        prizes: "₹1,50,000",
        href: "/sports",
        description: "Official campus sports council orchestrating university football, cricket, basketball, and athletics championships.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "club-bytecraft",
        name: "ByteCraft Tech & Innovation Club",
        slug: "bytecraft-tech-society",
        category: "Tech & Hackathons",
        motto: "Coding Solutions for India's Heritage",
        badge: "Developer Student Society",
        coordinator: "Neha Verma",
        coordinatorEmail: "tech@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 43216",
        color: "from-fest-champagne to-fest-charcoal",
        eventsHosted: ["Navotsav AI Tourism Hackathon", "Speed Circuit Design", "Algorithmic Clash"],
        eventCount: "4 Contests",
        prizes: "₹85,000",
        href: "/events?category=technical",
        description: "Empowering developers to build AI, IoT, and digital solutions honoring local culture and healthcare innovation.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Seed Events
    this.events = [
      {
        id: "kathak-jugalbandi",
        slug: "kathak-jugalbandi",
        title: "Kathak Jugalbandi – Classical Dance Confluence",
        categoryKey: "cultural",
        category: "Dance & Choreo",
        club: "Mudra Dance Society",
        description: "A celebration of the Lucknow & Banaras Gharana rhythms with live tabla accompaniment and footwork precision.",
        date: "13 March 2026",
        time: "05:00 PM",
        venue: "Nawab Wajid Ali Shah Auditorium",
        registrationFee: 300,
        teamSize: "1–2 Dancers",
        prizePool: "₹35,000",
        isPrimary: true, // Primary Flagship Event driving homepage live timeclock and direct registration pass!
        poster: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
        ],
        status: "Registration Open",
        rules: ["Time limit: 10 minutes", "Classical costumes with ghungroos mandatory", "Live or recorded music permitted"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "royal-up-football-cup",
        slug: "royal-up-football-cup",
        title: "Chhatrapati Shivaji Memorial Football Cup",
        categoryKey: "sports",
        category: "Sports Tournaments",
        club: "Varchasva Sports Council",
        description: "11-a-side knockout collegiate championship with group fixtures, live stats tracking, and golden boot awards.",
        date: "12–15 March 2026",
        time: "08:00 AM",
        venue: "Main Stadium Turf",
        registrationFee: 1500,
        teamSize: "11 + 5 Substitutes",
        prizePool: "₹75,000",
        poster: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1489944445391-11dd35366456?q=80&w=800&auto=format&fit=crop",
        ],
        status: "Registration Open",
        rules: ["FIFA rules apply", "Team squad: 11 on pitch + 5 bench", "Valid student ID mandatory"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "sufi-rock-night",
        slug: "sufi-rock-night",
        title: "Roohaniyat: Pan-India Battle of Sufi Bands",
        categoryKey: "music",
        category: "Music & Bands",
        club: "Dhwani Music Society",
        description: "Electric guitars meet harmonium and tabla in an electrifying battle of bands between top collegiate squads.",
        date: "14 March 2026",
        time: "07:30 PM",
        venue: "Main Festival Arena",
        registrationFee: 800,
        teamSize: "3–8 Musicians",
        prizePool: "₹50,000",
        poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        ],
        status: "Registration Open",
        rules: ["Performance time: 15 mins", "Instruments provided: standard drumkit", "Own guitars/keyboards allowed"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "ai-heritage-hackathon",
        slug: "ai-heritage-hackathon",
        title: "Navotsav: AI for UP Tourism & Heritage",
        categoryKey: "technical",
        category: "Tech & Hackathons",
        club: "ByteCraft Tech Society",
        description: "36-hour hackathon building generative AI tour guides, VR ghat experiences, and handicraft authenticity verification.",
        date: "13–14 March 2026",
        time: "09:00 AM",
        venue: "Turing Tech Pavilion",
        registrationFee: 500,
        teamSize: "2–4 Hackers",
        prizePool: "₹60,000",
        poster: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        ],
        status: "Registration Open",
        rules: ["36-hour sprint", "Code must be open-sourced during judging", "Mentors available round-the-clock"],
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed Gallery Items
    this.gallery = [
      {
        id: "gal-1",
        title: "Varanasi Maha Aarti Twilight Ceremony",
        category: "Heritage Evenings",
        year: "2025",
        location: "Kashi Amphitheatre",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
        caption: "1,008 illuminated brass lamps reflected along Dashashwamedh Ghat at sunset.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-2",
        title: "Lucknow Kathak Jugalbandi",
        category: "Performing Arts",
        year: "2025",
        location: "Nawab Wajid Ali Shah Auditorium",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
        caption: "Maestros performing classical footwork and chakkars under royal arches.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-3",
        title: "Football Championship Final",
        category: "Sports Arena",
        year: "2025",
        location: "Main Stadium",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
        caption: "High-octane header deciding the Chhatrapati Shivaji Trophy.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-4",
        title: "Shaam-e-Awadh Ghazal & Kavi Sammelan",
        category: "Literary Evenings",
        year: "2025",
        location: "Heritage Lawns",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        caption: "Courtyard gathering under illuminated chandeliers and candle lanterns.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-5",
        title: "Shilpkar: Living Crafts Exhibition",
        category: "Arts & Crafts",
        year: "2024",
        location: "Heritage Quadrangle",
        image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop",
        caption: "Traditional master weavers displaying Banarasi silk handlooms.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-6",
        title: "Star Night Headline Concert",
        category: "Celebrity Nights",
        year: "2024",
        location: "Grand Star Arena",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
        caption: "10,000 students singing in unison under fireworks and stage lights.",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // Users
  getUserByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): StoredUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(user: Omit<StoredUser, "id" | "createdAt">): StoredUser {
    const newUser: StoredUser = {
      ...user,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.persist("users", { id: newUser.id }, newUser);
    return newUser;
  }

  updateUserProfile(id: string, updates: Partial<StoredUser>): StoredUser | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.persist("users", { id }, user);
    return user;
  }

  getAllUsers(): StoredUser[] {
    return this.users;
  }

  loadUsersFromMongo(users: StoredUser[]) {
    for (const u of users) {
      const idx = this.users.findIndex((x) => x.id === u.id || x.email.toLowerCase() === u.email.toLowerCase());
      if (idx >= 0) {
        this.users[idx] = u;
      } else {
        this.users.push(u);
      }
    }
  }

  // Registrations
  getRegistrationsByUser(userIdOrEmail: string): StoredRegistration[] {
    if (!userIdOrEmail) return [];
    const term = userIdOrEmail.toLowerCase();
    return this.registrations.filter(
      (r) => r.userId === userIdOrEmail || (r.userEmail && r.userEmail.toLowerCase() === term)
    );
  }

  getAllRegistrations(): StoredRegistration[] {
    return this.registrations;
  }

  getRegistrationById(id: string): StoredRegistration | undefined {
    return this.registrations.find((r) => r.id === id);
  }

  createRegistration(data: Omit<StoredRegistration, "id" | "registrationNumber" | "qrToken" | "createdAt" | "updatedAt">): StoredRegistration {
    const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const token = `RNG-TKT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newReg: StoredRegistration = {
      ...data,
      id,
      registrationNumber: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      qrToken: token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.registrations.push(newReg);
    this.persist("registrations", { id: newReg.id }, newReg);
    return newReg;
  }

  updateRegistrationStatus(
    id: string,
    status: StoredRegistration["paymentStatus"],
    registrationStatus: StoredRegistration["registrationStatus"] = "pending"
  ) {
    const reg = this.getRegistrationById(id);
    if (!reg) return;
    reg.paymentStatus = status;
    reg.registrationStatus = registrationStatus;
    reg.updatedAt = new Date().toISOString();
    this.persist("registrations", { id }, reg);
  }

  loadRegistrationsFromMongo(regs: StoredRegistration[]) {
    for (const r of regs) {
      const idx = this.registrations.findIndex((x) => x.id === r.id);
      if (idx >= 0) {
        this.registrations[idx] = r;
      } else {
        this.registrations.push(r);
      }
    }
  }

  // Payments
  getPaymentByRegistrationId(regId: string): StoredPaymentSubmission | undefined {
    return this.payments.find((p) => p.registrationId === regId);
  }

  getAllPayments(): StoredPaymentSubmission[] {
    return this.payments;
  }

  isUtrUnique(utrNumber: string, excludeSubmissionId?: string): boolean {
    const existing = this.payments.find(
      (p) => p.utrNumber.trim().toLowerCase() === utrNumber.trim().toLowerCase() && p.id !== excludeSubmissionId
    );
    return !existing;
  }

  submitPaymentProof(data: {
    registrationId: string;
    amountSubmitted: number;
    amountExpected: number;
    utrNumber: string;
    paymentScreenshotUrl: string;
    paymentDate: string;
    paymentTime?: string;
    notes?: string;
  }): StoredPaymentSubmission {
    const existing = this.getPaymentByRegistrationId(data.registrationId);
    if (existing) {
      existing.amountSubmitted = data.amountSubmitted;
      existing.utrNumber = data.utrNumber;
      existing.paymentScreenshotUrl = data.paymentScreenshotUrl;
      existing.paymentDate = data.paymentDate;
      existing.paymentTime = data.paymentTime;
      existing.notes = data.notes;
      existing.status = "pending";
      existing.rejectionReason = undefined;

      this.updateRegistrationStatus(data.registrationId, "pending_verification", "pending");
      this.persist("payments", { id: existing.id }, existing);
      return existing;
    }

    const newPayment: StoredPaymentSubmission = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.payments.push(newPayment);
    this.updateRegistrationStatus(data.registrationId, "pending_verification", "pending");
    this.persist("payments", { id: newPayment.id }, newPayment);
    return newPayment;
  }

  reviewPayment(
    paymentId: string,
    reviewerId: string,
    action: "approve" | "reject" | "resubmit",
    rejectionReason?: string
  ): boolean {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return false;

    payment.reviewedBy = reviewerId;
    payment.reviewedAt = new Date().toISOString();

    if (action === "approve") {
      payment.status = "approved";
      payment.rejectionReason = undefined;
      this.updateRegistrationStatus(payment.registrationId, "approved", "confirmed");

      // Generate Ticket if not exists
      const reg = this.getRegistrationById(payment.registrationId);
      if (reg && !this.getTicketByRegistrationId(reg.id)) {
        this.createTicketForRegistration(reg);
      }
    } else if (action === "reject") {
      payment.status = "rejected";
      payment.rejectionReason = rejectionReason || "Payment verification failed. Invalid transaction.";
      this.updateRegistrationStatus(payment.registrationId, "rejected", "cancelled");
    } else if (action === "resubmit") {
      payment.status = "resubmission_required";
      payment.rejectionReason = rejectionReason || "Please upload a clearer screenshot or check UTR number.";
      this.updateRegistrationStatus(payment.registrationId, "resubmission_required", "pending");
    }

    this.persist("payments", { id: payment.id }, payment);
    return true;
  }

  loadPaymentsFromMongo(pays: StoredPaymentSubmission[]) {
    for (const p of pays) {
      const idx = this.payments.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        this.payments[idx] = p;
      } else {
        this.payments.push(p);
      }
    }
  }

  // QR Settings
  getQrSettings() {
    return this.qrSettings;
  }

  updateQrSettings(updates: Partial<typeof this.qrSettings>) {
    Object.assign(this.qrSettings, updates);
    this.persist(
      "qr_settings",
      { id: "global_qr_settings" },
      { id: "global_qr_settings", ...this.qrSettings }
    );
    return this.qrSettings;
  }

  setQrSettings(settings: typeof this.qrSettings) {
    this.qrSettings = settings;
  }

  // Tickets
  createTicketForRegistration(reg: StoredRegistration): StoredTicket {
    const ticketNumber = `TKT-UP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: StoredTicket = {
      id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      registrationId: reg.id,
      ticketNumber,
      qrToken: reg.qrToken,
      eventTitle: reg.eventTitle,
      eventDate: "13 March 2026",
      eventVenue: "Heritage Grounds",
      participantName: reg.userName,
      participantEmail: reg.userEmail,
      college: reg.college,
      teamName: reg.teamName,
      isValid: true,
      isScanned: false,
      generatedAt: new Date().toISOString(),
    };
    this.tickets.push(newTicket);
    this.persist("tickets", { id: newTicket.id }, newTicket);
    return newTicket;
  }

  getTicketsByUser(userEmail: string): StoredTicket[] {
    return this.tickets.filter((t) => t.participantEmail.toLowerCase() === userEmail.toLowerCase());
  }

  getTicketByToken(qrToken: string): StoredTicket | undefined {
    return this.tickets.find((t) => t.qrToken === qrToken);
  }

  getTicketByRegistrationId(regId: string): StoredTicket | undefined {
    return this.tickets.find((t) => t.registrationId === regId);
  }

  getAllTickets(): StoredTicket[] {
    return this.tickets;
  }

  loadTicketsFromMongo(tickets: StoredTicket[]) {
    for (const t of tickets) {
      const idx = this.tickets.findIndex((x) => x.id === t.id);
      if (idx >= 0) {
        this.tickets[idx] = t;
      } else {
        this.tickets.push(t);
      }
    }
  }

  scanTicket(qrToken: string, scannerId: string): {
    success: boolean;
    ticket?: StoredTicket;
    message: string;
    alreadyScanned?: boolean;
  } {
    const ticket = this.getTicketByToken(qrToken);
    if (!ticket) {
      return { success: false, message: "Invalid or unrecognized ticket token." };
    }

    if (!ticket.isValid) {
      return { success: false, ticket, message: "Ticket has been invalidated or cancelled." };
    }

    if (ticket.isScanned) {
      return {
        success: false,
        ticket,
        alreadyScanned: true,
        message: `ALREADY SCANNED on ${new Date(ticket.scannedAt!).toLocaleTimeString()} by staff #${ticket.scannedBy}`,
      };
    }

    // Atomic entry check-in
    ticket.isScanned = true;
    ticket.scannedAt = new Date().toISOString();
    ticket.scannedBy = scannerId;

    this.persist("tickets", { id: ticket.id }, ticket);

    return {
      success: true,
      ticket,
      message: `Verified entry approved for ${ticket.participantName}. Welcome to Rangmanch UP 2026!`,
    };
  }

  // Events Management (Supports multiple pictures upload)
  getAllEvents(): StoredEvent[] {
    return this.events;
  }

  getEventById(id: string): StoredEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  getEventBySlug(slug: string): StoredEvent | undefined {
    return this.events.find((e) => e.slug === slug || e.id === slug);
  }

  createEvent(event: Omit<StoredEvent, "id" | "createdAt">): StoredEvent {
    const id = event.slug || `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    // If marked primary, unset primary on all other events
    if (event.isPrimary) {
      for (const e of this.events) {
        if (e.isPrimary) {
          e.isPrimary = false;
          this.persist("events", { id: e.id }, e, "upsert");
        }
      }
    }
    const newEvent: StoredEvent = {
      ...event,
      id,
      images: event.images && event.images.length > 0 ? event.images : [event.poster],
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(newEvent);
    this.persist("events", { id: newEvent.id }, newEvent, "upsert");
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<StoredEvent>): StoredEvent | undefined {
    const event = this.getEventById(id);
    if (!event) return undefined;
    if (updates.isPrimary) {
      for (const e of this.events) {
        if (e.id !== id && e.isPrimary) {
          e.isPrimary = false;
          this.persist("events", { id: e.id }, e, "upsert");
        }
      }
    }
    Object.assign(event, updates);
    this.persist("events", { id }, event, "upsert");
    return event;
  }

  deleteEvent(id: string): boolean {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    const removed = this.events.splice(idx, 1)[0];
    this.persist("events", { id: removed.id }, removed, "delete");
    return true;
  }

  loadEventsFromMongo(events: StoredEvent[]) {
    for (const e of events) {
      const idx = this.events.findIndex((x) => x.id === e.id);
      if (idx >= 0) {
        this.events[idx] = e;
      } else {
        this.events.push(e);
      }
    }
  }

  // Gallery Management (Full CRUD)
  getAllGalleryItems(): StoredGalleryItem[] {
    return this.gallery;
  }

  getGalleryItemById(id: string): StoredGalleryItem | undefined {
    return this.gallery.find((g) => g.id === id);
  }

  createGalleryItem(item: Omit<StoredGalleryItem, "id" | "createdAt">): StoredGalleryItem {
    const id = `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: StoredGalleryItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
    };
    this.gallery.unshift(newItem);
    this.persist("gallery", { id: newItem.id }, newItem, "upsert");
    return newItem;
  }

  updateGalleryItem(id: string, updates: Partial<StoredGalleryItem>): StoredGalleryItem | undefined {
    const item = this.getGalleryItemById(id);
    if (!item) return undefined;
    Object.assign(item, updates);
    this.persist("gallery", { id }, item, "upsert");
    return item;
  }

  deleteGalleryItem(id: string): boolean {
    const idx = this.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    const removed = this.gallery.splice(idx, 1)[0];
    this.persist("gallery", { id: removed.id }, removed, "delete");
    return true;
  }

  loadGalleryFromMongo(items: StoredGalleryItem[]) {
    for (const g of items) {
      const idx = this.gallery.findIndex((x) => x.id === g.id);
      if (idx >= 0) {
        this.gallery[idx] = g;
      } else {
        this.gallery.push(g);
      }
    }
  }

  // ==========================================
  // Clubs Management (Full CRUD)
  // ==========================================
  getAllClubs(): StoredClub[] {
    return this.clubs;
  }

  getClubById(id: string): StoredClub | undefined {
    return this.clubs.find((c) => c.id === id);
  }

  getClubBySlug(slug: string): StoredClub | undefined {
    return this.clubs.find((c) => c.slug === slug || c.id === slug);
  }

  createClub(club: Omit<StoredClub, "id" | "createdAt" | "updatedAt">): StoredClub {
    const slug = club.slug || club.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `club-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newClub: StoredClub = {
      ...club,
      id,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clubs.push(newClub);
    this.persist("clubs", { id: newClub.id }, newClub, "upsert");
    return newClub;
  }

  updateClub(id: string, updates: Partial<StoredClub>): StoredClub | undefined {
    const club = this.getClubById(id);
    if (!club) return undefined;
    Object.assign(club, updates, { updatedAt: new Date().toISOString() });
    this.persist("clubs", { id }, club, "upsert");
    return club;
  }

  deleteClub(id: string): boolean {
    const idx = this.clubs.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const removed = this.clubs.splice(idx, 1)[0];
    this.persist("clubs", { id: removed.id }, removed, "delete");
    return true;
  }

  loadClubsFromMongo(clubs: StoredClub[]) {
    for (const c of clubs) {
      const idx = this.clubs.findIndex((x) => x.id === c.id || x.slug === c.slug);
      if (idx >= 0) {
        this.clubs[idx] = c;
      } else {
        this.clubs.push(c);
      }
    }
  }

  // ==========================================
  // Primary Event & Homepage Timeclock Sync
  // ==========================================
  getPrimaryEvent(): StoredEvent | undefined {
    const primary = this.events.find((e) => e.isPrimary);
    if (primary) return primary;
    if (this.events.length > 0) return this.events[0];
    return undefined;
  }

  setPrimaryEvent(id: string): boolean {
    const event = this.getEventById(id);
    if (!event) return false;
    for (const e of this.events) {
      const isTarget = e.id === id || e.slug === id;
      if (e.isPrimary !== isTarget) {
        e.isPrimary = isTarget;
        this.persist("events", { id: e.id }, e, "upsert");
      }
    }
    return true;
  }

  /**
   * Resolves the primary target countdown date and details for the homepage timeclock.
   * Directly synchronized with the Primary Event designated by Admin.
   * Under the homepage countdown, the registration CTA directly redirects to that event's registration page.
   */
  getPrimaryEventCountdown(): {
    success: boolean;
    primaryEvent: StoredEvent;
    targetDate: string;
    registrationUrl: string;
    title: string;
    venue: string;
    club?: string;
    date: string;
    time: string;
    prizePool: string;
    registrationFee: number;
    category: string;
    status: string;
    poster: string;
  } {
    const primaryEvent = this.getPrimaryEvent() || this.events[0];
    const targetDate = parseEventDateTimeToIso(primaryEvent?.date, primaryEvent?.time);
    const registrationUrl = primaryEvent ? `/events/${primaryEvent.slug}/register` : "/events";

    return {
      success: true,
      primaryEvent,
      targetDate,
      registrationUrl,
      title: primaryEvent?.title || "Kathak Jugalbandi – Classical Dance Confluence",
      venue: primaryEvent?.venue || "Nawab Wajid Ali Shah Auditorium, AIIMS Raebareli",
      club: primaryEvent?.club || "Mudra Dance Society",
      date: primaryEvent?.date || "13 March 2026",
      time: primaryEvent?.time || "05:00 PM",
      prizePool: primaryEvent?.prizePool || "₹35,000",
      registrationFee: primaryEvent?.registrationFee || 300,
      category: primaryEvent?.category || "Dance & Choreo",
      status: primaryEvent?.status || "Registration Open",
      poster: primaryEvent?.poster || "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    };
  }

  // ==========================================
  // Database Maintenance: Purge All Dummy Data
  // ==========================================
  cleanDummyData(): {
    purgedUsers: number;
    purgedRegistrations: number;
    purgedPayments: number;
    purgedTickets: number;
  } {
    // 1. Purge dummy non-admin student users
    const initialUsersCount = this.users.length;
    this.users = this.users.filter(
      (u) =>
        u.role === "admin" ||
        u.role === "super_admin" ||
        (!u.id.startsWith("usr-student") && u.email !== "student@example.com")
    );
    const purgedUsers = initialUsersCount - this.users.length;

    // 2. Purge dummy registrations
    const initialRegsCount = this.registrations.length;
    this.registrations = this.registrations.filter(
      (r) => !r.id.startsWith("reg-demo") && r.userId !== "usr-student-1" && r.userEmail !== "student@example.com"
    );
    const purgedRegistrations = initialRegsCount - this.registrations.length;

    // 3. Purge dummy payments
    const initialPaymentsCount = this.payments.length;
    this.payments = this.payments.filter(
      (p) => !p.id.startsWith("pay-100") && p.registrationId !== "reg-demo-1001" && p.registrationId !== "reg-demo-1002"
    );
    const purgedPayments = initialPaymentsCount - this.payments.length;

    // 4. Purge dummy tickets
    const initialTicketsCount = this.tickets.length;
    this.tickets = this.tickets.filter(
      (t) => !t.id.startsWith("tkt-100") && t.registrationId !== "reg-demo-1001" && t.participantEmail !== "student@example.com"
    );
    const purgedTickets = initialTicketsCount - this.tickets.length;

    return {
      purgedUsers,
      purgedRegistrations,
      purgedPayments,
      purgedTickets,
    };
  }
}

// Global singleton
declare global {
  // eslint-disable-next-line no-var
  var __globalStore: DataStore | undefined;
}

export const dataStore = global.__globalStore || new DataStore();
global.__globalStore = dataStore;
