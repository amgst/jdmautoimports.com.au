import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  images: text("images").array().default(sql`'{}'`),
  pricePerDay: integer("price_per_day").notNull(),
  seats: integer("seats").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuel_type").notNull(),
  luggage: integer("luggage").notNull(),
  doors: integer("doors").notNull(),
  year: integer("year").notNull(),
  hasGPS: boolean("has_gps").notNull().default(false),
  hasBluetooth: boolean("has_bluetooth").notNull().default(false),
  hasAC: boolean("has_ac").notNull().default(true),
  hasUSB: boolean("has_usb").notNull().default(false),
  available: boolean("available").notNull().default(true),
});

// Custom URL validator that accepts both full URLs and relative paths
const urlOrPath = z.string().refine(
  (val) => {
    if (!val || val.trim() === "") return true; // Allow empty strings
    // Check if it's a valid URL (http/https) or a valid relative path (starts with /)
    try {
      new URL(val);
      return true; // Valid absolute URL
    } catch {
      // Not a valid absolute URL, check if it's a valid relative path
      return val.startsWith("/") || val.startsWith("./") || val.startsWith("../");
    }
  },
  {
    message: "Must be a valid URL or relative path (starting with /)",
  }
);

// Create a custom schema that extends the generated one to properly handle images
export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  slug: true,
}).extend({
  image: urlOrPath,
  images: z.array(urlOrPath).optional().nullable().default([]),
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Booking schema
export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const insertBookingSchema = z.object({
  carId: z.string().min(1, "Car ID is required"),
  carName: z.string().min(1, "Car name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  totalPrice: z.number().min(0),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;

export const bookingSchema = insertBookingSchema.extend({
  id: z.string().min(1),
  status: bookingStatusSchema.default("pending"),
  createdAt: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;