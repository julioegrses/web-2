import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull().default("Full-time"),
  description: text("description").notNull(),
  contactEmail: text("contact_email").notNull(),
  aslFriendly: boolean("asl_friendly").notNull().default(true),
  remote: boolean("remote").notNull().default(false),
  applyUrl: text("apply_url"),
  salary: text("salary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  preferredContact: text("preferred_contact").notNull().default("Email"),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
