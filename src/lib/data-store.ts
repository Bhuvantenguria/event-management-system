import bcrypt from "bcryptjs";

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

export type PersistenceHandler = (
  collection: "users" | "registrations" | "payments" | "tickets" | "qr_settings" | "events" | "gallery",
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
    collection: "users" | "registrations" | "payments" | "tickets" | "qr_settings" | "events" | "gallery",
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
    const hashedStudent = bcrypt.hashSync("Student@1234", 10);

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
      {
        id: "usr-student-1",
        email: "student@example.com",
        name: "Aditi Sharma",
        passwordHash: hashedStudent,
        role: "student",
        phone: "+91 94512 34567",
        college: "AIIMS Raebareli",
        studentId: "AIIMS-2024-8891",
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed one completed registration with approved ticket
    const regId1 = "reg-demo-1001";
    const token1 = "RNG-TKT-778899-KATHAK";

    this.registrations.push({
      id: regId1,
      registrationNumber: "REG-2026-1001",
      eventId: "kathak-jugalbandi",
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      userId: "usr-student-1",
      userName: "Aditi Sharma",
      userEmail: "student@example.com",
      college: "Lucknow University",
      participationType: "individual",
      amount: 300,
      paymentStatus: "approved",
      registrationStatus: "confirmed",
      qrToken: token1,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    });

    this.payments.push({
      id: "pay-1001",
      registrationId: regId1,
      amountExpected: 300,
      amountSubmitted: 300,
      utrNumber: "407512889912",
      paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
      paymentDate: "2026-03-01",
      status: "approved",
      reviewedBy: "usr-finance-admin-1",
      reviewedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    });

    this.tickets.push({
      id: "tkt-1001",
      registrationId: regId1,
      ticketNumber: "TKT-UP-2026-0042",
      qrToken: token1,
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      eventDate: "13 March 2026, 05:00 PM",
      eventVenue: "Nawab Wajid Ali Shah Auditorium",
      participantName: "Aditi Sharma",
      participantEmail: "student@example.com",
      college: "Lucknow University",
      isValid: true,
      isScanned: false,
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
    });

    // Seed a pending payment registration
    const regId2 = "reg-demo-1002";
    this.registrations.push({
      id: regId2,
      registrationNumber: "REG-2026-1002",
      eventId: "royal-up-football-cup",
      eventTitle: "Chhatrapati Shivaji Memorial Football Cup",
      userId: "usr-student-1",
      userName: "Aditi Sharma",
      userEmail: "student@example.com",
      college: "Lucknow University",
      participationType: "team",
      teamName: "Awadh Strikers FC",
      teamMembers: [
        { name: "Aditi Sharma", email: "student@example.com", isCaptain: true },
        { name: "Kabir Khan", email: "kabir@example.com" },
        { name: "Aryan Yadav", email: "aryan@example.com" },
      ],
      amount: 1500,
      paymentStatus: "pending_verification",
      registrationStatus: "pending",
      qrToken: "RNG-TKT-991122-FOOTBALL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.payments.push({
      id: "pay-1002",
      registrationId: regId2,
      amountExpected: 1500,
      amountSubmitted: 1500,
      utrNumber: "407519992341",
      paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
      paymentDate: "2026-03-02",
      notes: "Paid via Paytm UPI from HDFC Bank",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

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
  getRegistrationsByUser(userId: string): StoredRegistration[] {
    return this.registrations.filter((r) => r.userId === userId);
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
}

// Global singleton
declare global {
  // eslint-disable-next-line no-var
  var __globalStore: DataStore | undefined;
}

export const dataStore = global.__globalStore || new DataStore();
global.__globalStore = dataStore;
