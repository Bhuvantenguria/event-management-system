import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  date,
  time,
  jsonb,
  numeric,
  unique,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "super_admin",
  "student",
  "participant",
  "event_admin",
  "finance_admin",
  "sports_admin",
  "gallery_admin",
  "event_coordinator",
  "scanner_staff",
]);

export const participationTypeEnum = pgEnum("participation_type", [
  "individual",
  "team",
  "both",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "upcoming",
  "registration_open",
  "registration_closed",
  "ongoing",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "awaiting_payment",
  "pending_verification",
  "approved",
  "rejected",
  "resubmission_required",
  "cancelled",
]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "confirmed",
  "cancelled",
  "waitlisted",
]);

export const paymentSubmissionStatusEnum = pgEnum("payment_submission_status", [
  "pending",
  "approved",
  "rejected",
  "resubmission_required",
]);

export const sportTypeEnum = pgEnum("sport_type", [
  "football",
  "cricket",
  "basketball",
  "volleyball",
  "custom",
]);

export const tournamentFormatEnum = pgEnum("tournament_format", [
  "knockout",
  "league",
  "group_stage",
]);

export const tournamentStatusEnum = pgEnum("tournament_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const teamStatusEnum = pgEnum("team_status", [
  "registered",
  "confirmed",
  "disqualified",
  "withdrawn",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const galleryTypeEnum = pgEnum("gallery_type", [
  "photos",
  "videos",
  "mixed",
]);

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const sponsorTierEnum = pgEnum("sponsor_tier", [
  "title",
  "gold",
  "silver",
  "bronze",
  "associate",
]);

export const announcementTypeEnum = pgEnum("announcement_type", [
  "info",
  "warning",
  "urgent",
]);

export const emailStatusEnum = pgEnum("email_status", [
  "pending",
  "sent",
  "failed",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "sent",
  "failed",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  college: varchar("college", { length: 255 }),
  studentId: varchar("student_id", { length: 100 }),
  role: userRoleEnum("role").notNull().default("participant"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: varchar("verification_token", { length: 255 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpires: timestamp("reset_token_expires"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const festivals = pgTable("festivals", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  theme: varchar("theme", { length: 255 }),
  description: text("description"),
  logoUrl: varchar("logo_url", { length: 500 }),
  bannerUrl: varchar("banner_url", { length: 500 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  location: varchar("location", { length: 255 }),
  isActive: boolean("is_active").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventCategories = pgTable("event_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 50 }),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => eventCategories.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  rules: text("rules"),
  eligibility: text("eligibility"),
  posterUrl: varchar("poster_url", { length: 500 }),
  participationType: participationTypeEnum("participation_type")
    .notNull()
    .default("individual"),
  minTeamSize: integer("min_team_size").default(1),
  maxTeamSize: integer("max_team_size").default(1),
  registrationFee: numeric("registration_fee", {
    precision: 10,
    scale: 2,
  }).default("0"),
  maxParticipants: integer("max_participants"),
  registeredCount: integer("registered_count").notNull().default(0),
  registrationDeadline: timestamp("registration_deadline"),
  eventDate: date("event_date"),
  eventTime: time("event_time"),
  venue: varchar("venue", { length: 255 }),
  prizes: jsonb("prizes"),
  status: eventStatusEnum("status").notNull().default("draft"),
  isPublished: boolean("is_published").notNull().default(false),
  waitlistEnabled: boolean("waitlist_enabled").notNull().default(false),
  customFormFields: jsonb("custom_form_fields"),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const eventCoordinators = pgTable("event_coordinators", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 100 }).default("coordinator"),
});

export const registrations = pgTable("registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationNumber: varchar("registration_number", { length: 50 })
    .notNull()
    .unique(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  participationType: participationTypeEnum("participation_type")
    .notNull()
    .default("individual"),
  teamName: varchar("team_name", { length: 255 }),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("awaiting_payment"),
  registrationStatus: registrationStatusEnum("registration_status")
    .notNull()
    .default("pending"),
  qrToken: varchar("qr_token", { length: 128 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const registrationMembers = pgTable("registration_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationId: uuid("registration_id")
    .notNull()
    .references(() => registrations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  college: varchar("college", { length: 255 }),
  isCaptain: boolean("is_captain").notNull().default(false),
  memberData: jsonb("member_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentSubmissions = pgTable("payment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationId: uuid("registration_id")
    .notNull()
    .unique()
    .references(() => registrations.id, { onDelete: "cascade" }),
  amountExpected: numeric("amount_expected", { precision: 10, scale: 2 }),
  amountSubmitted: numeric("amount_submitted", { precision: 10, scale: 2 }),
  utrNumber: varchar("utr_number", { length: 100 }).unique(),
  paymentScreenshotUrl: varchar("payment_screenshot_url", { length: 500 }),
  paymentDate: date("payment_date"),
  paymentTime: time("payment_time"),
  notes: text("notes"),
  status: paymentSubmissionStatusEnum("status").notNull().default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const paymentQrSettings = pgTable("payment_qr_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  qrImageUrl: varchar("qr_image_url", { length: 500 }),
  upiId: varchar("upi_id", { length: 255 }),
  upiName: varchar("upi_name", { length: 255 }),
  paymentInstructions: text("payment_instructions"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationId: uuid("registration_id")
    .notNull()
    .unique()
    .references(() => registrations.id, { onDelete: "cascade" }),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  qrToken: varchar("qr_token", { length: 128 }).notNull().unique(),
  isValid: boolean("is_valid").notNull().default(true),
  invalidatedAt: timestamp("invalidated_at"),
  invalidatedReason: text("invalidated_reason"),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  emailedAt: timestamp("emailed_at"),
});

export const scannerSessions = pgTable("scanner_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  scannerUserId: uuid("scanner_user_id")
    .notNull()
    .references(() => users.id),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id),
  registrationId: uuid("registration_id")
    .notNull()
    .references(() => registrations.id),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  scannedBy: uuid("scanned_by")
    .notNull()
    .references(() => users.id),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
  isDuplicate: boolean("is_duplicate").notNull().default(false),
  overrideReason: text("override_reason"),
  entryAllowed: boolean("entry_allowed").notNull().default(true),
});

export const sportsTournaments = pgTable("sports_tournaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  sportType: sportTypeEnum("sport_type").notNull(),
  format: tournamentFormatEnum("format").notNull().default("knockout"),
  status: tournamentStatusEnum("status").notNull().default("upcoming"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tournamentGroups = pgTable("tournament_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id")
    .notNull()
    .references(() => sportsTournaments.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id")
    .notNull()
    .references(() => sportsTournaments.id, { onDelete: "cascade" }),
  groupId: uuid("group_id").references(() => tournamentGroups.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  captainName: varchar("captain_name", { length: 255 }),
  captainContact: varchar("captain_contact", { length: 50 }),
  registrationId: uuid("registration_id").references(() => registrations.id, {
    onDelete: "set null",
  }),
  status: teamStatusEnum("status").notNull().default("registered"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  jerseyNumber: integer("jersey_number"),
  position: varchar("position", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id")
    .notNull()
    .references(() => sportsTournaments.id, { onDelete: "cascade" }),
  groupId: uuid("group_id").references(() => tournamentGroups.id, {
    onDelete: "set null",
  }),
  round: integer("round").notNull().default(1),
  matchNumber: integer("match_number").notNull(),
  team1Id: uuid("team1_id")
    .notNull()
    .references(() => teams.id),
  team2Id: uuid("team2_id")
    .notNull()
    .references(() => teams.id),
  venue: varchar("venue", { length: 255 }),
  scheduledAt: timestamp("scheduled_at"),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const matchResults = pgTable("match_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id")
    .notNull()
    .unique()
    .references(() => matches.id, { onDelete: "cascade" }),
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  winnerId: uuid("winner_id").references(() => teams.id, {
    onDelete: "set null",
  }),
  goals: jsonb("goals"),
  cards: jsonb("cards"),
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  recordedBy: uuid("recorded_by")
    .notNull()
    .references(() => users.id),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const playerStatistics = pgTable("player_statistics", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  teamMemberId: uuid("team_member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  minutesPlayed: integer("minutes_played"),
  extraStats: jsonb("extra_stats"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const galleries = pgTable("galleries", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: galleryTypeEnum("type").notNull().default("photos"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const galleryAlbums = pgTable("gallery_albums", {
  id: uuid("id").primaryKey().defaultRandom(),
  galleryId: uuid("gallery_id")
    .notNull()
    .references(() => galleries.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  isPublished: boolean("is_published").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const galleryMedia = pgTable("gallery_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  albumId: uuid("album_id")
    .notNull()
    .references(() => galleryAlbums.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  type: mediaTypeEnum("type").notNull().default("image"),
  caption: text("caption"),
  isFeatured: boolean("is_featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  cloudinaryId: varchar("cloudinary_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  date: date("date").notNull(),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  venue: varchar("venue", { length: 255 }),
  category: varchar("category", { length: 100 }),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id")
    .notNull()
    .references(() => festivals.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  tier: sponsorTierEnum("tier").notNull().default("associate"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id").references(() => festivals.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: announcementTypeEnum("type").notNull().default("info"),
  isPublished: boolean("is_published").notNull().default(false),
  publishAt: timestamp("publish_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  link: varchar("link", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const emailLogs = pgTable("email_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  status: emailStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  registrationId: uuid("registration_id").references(() => registrations.id, {
    onDelete: "set null",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationJobs = pgTable("notification_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  status: jobStatusEnum("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  module: varchar("module", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

export const paymentProofs = pgTable("payment_proofs", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentSubmissionId: uuid("payment_submission_id")
    .notNull()
    .references(() => paymentSubmissions.id, { onDelete: "cascade" }),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  originalFilename: varchar("original_filename", { length: 255 }),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const culturalCollections = pgTable("cultural_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  festivalId: uuid("festival_id").references(() => festivals.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(), // 'monument', 'craft', 'dance_music', 'ghat_spiritual', 'culinary'
  region: varchar("region", { length: 100 }).notNull(), // 'Varanasi', 'Lucknow', 'Agra', 'Mathura', 'Prayagraj', 'Ayodhya'
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  galleryUrls: jsonb("gallery_urls"),
  displayOrder: integer("display_order").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  culturalTags: jsonb("cultural_tags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
  eventCoordinators: many(eventCoordinators),
  scannerSessions: many(scannerSessions),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const festivalsRelations = relations(festivals, ({ many }) => ({
  eventCategories: many(eventCategories),
  events: many(events),
  registrations: many(registrations),
  paymentQrSettings: many(paymentQrSettings),
  sportsTournaments: many(sportsTournaments),
  galleries: many(galleries),
  schedules: many(schedules),
  sponsors: many(sponsors),
  announcements: many(announcements),
  culturalCollections: many(culturalCollections),
}));

export const eventCategoriesRelations = relations(
  eventCategories,
  ({ one, many }) => ({
    festival: one(festivals, {
      fields: [eventCategories.festivalId],
      references: [festivals.id],
    }),
    events: many(events),
  })
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  festival: one(festivals, {
    fields: [events.festivalId],
    references: [festivals.id],
  }),
  category: one(eventCategories, {
    fields: [events.categoryId],
    references: [eventCategories.id],
  }),
  createdByUser: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  coordinators: many(eventCoordinators),
  registrations: many(registrations),
  schedules: many(schedules),
}));

export const registrationsRelations = relations(
  registrations,
  ({ one, many }) => ({
    festival: one(festivals, {
      fields: [registrations.festivalId],
      references: [festivals.id],
    }),
    event: one(events, {
      fields: [registrations.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [registrations.userId],
      references: [users.id],
    }),
    members: many(registrationMembers),
    paymentSubmission: one(paymentSubmissions),
    ticket: one(tickets),
    attendance: many(attendance),
  })
);

export const sportsTournamentsRelations = relations(
  sportsTournaments,
  ({ one, many }) => ({
    festival: one(festivals, {
      fields: [sportsTournaments.festivalId],
      references: [festivals.id],
    }),
    groups: many(tournamentGroups),
    teams: many(teams),
    matches: many(matches),
  })
);

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(sportsTournaments, {
    fields: [teams.tournamentId],
    references: [sportsTournaments.id],
  }),
  group: one(tournamentGroups, {
    fields: [teams.groupId],
    references: [tournamentGroups.id],
  }),
  members: many(teamMembers),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  tournament: one(sportsTournaments, {
    fields: [matches.tournamentId],
    references: [sportsTournaments.id],
  }),
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
  }),
  result: one(matchResults),
}));

export const galleriesRelations = relations(galleries, ({ one, many }) => ({
  festival: one(festivals, {
    fields: [galleries.festivalId],
    references: [festivals.id],
  }),
  albums: many(galleryAlbums),
}));

export const galleryAlbumsRelations = relations(
  galleryAlbums,
  ({ one, many }) => ({
    gallery: one(galleries, {
      fields: [galleryAlbums.galleryId],
      references: [galleries.id],
    }),
    media: many(galleryMedia),
  })
);

export const culturalCollectionsRelations = relations(
  culturalCollections,
  ({ one }) => ({
    festival: one(festivals, {
      fields: [culturalCollections.festivalId],
      references: [festivals.id],
    }),
  })
);
