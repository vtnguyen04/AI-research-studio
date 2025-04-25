import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Concept model (for different learning concepts)
export const concepts = pgTable("concepts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // e.g., 'semi-supervised', 'self-supervised'
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Theory content model
export const theoryContent = pgTable("theory_content", {
  id: serial("id").primaryKey(),
  conceptId: integer("concept_id").notNull(),
  content: text("content").notNull(), // Markdown content including LaTeX
  references: text("references"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code implementation model
export const codeImplementations = pgTable("code_implementations", {
  id: serial("id").primaryKey(),
  conceptId: integer("concept_id").notNull(),
  title: text("title").notNull(), 
  language: text("language").notNull(), // e.g., 'python', 'cpp', 'jupyter'
  code: text("code").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Experiment model
export const experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  conceptId: integer("concept_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  setup: text("setup"), // Experiment configuration
  results: json("results"), // JSON format of results
  metrics: json("metrics"), // Training metrics
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Research paper model
export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  year: integer("year").notNull(),
  conference: text("conference"),
  link: text("link"), // URL to original paper
  abstract: text("abstract"),
  key_points: text("key_points"),
  concepts: text("concepts").array(), // Related concepts
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define insertion schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  isAdmin: true,
});

export const insertConceptSchema = createInsertSchema(concepts).pick({
  slug: true,
  title: true,
  description: true,
  category: true,
});

export const insertTheoryContentSchema = createInsertSchema(theoryContent).pick({
  conceptId: true,
  content: true,
  references: true,
});

export const insertCodeImplementationSchema = createInsertSchema(codeImplementations).pick({
  conceptId: true,
  title: true,
  language: true,
  code: true,
  description: true,
});

export const insertExperimentSchema = createInsertSchema(experiments).pick({
  conceptId: true,
  title: true,
  description: true,
  setup: true,
  results: true,
  metrics: true,
});

export const insertPaperSchema = createInsertSchema(papers).pick({
  title: true,
  authors: true,
  year: true,
  conference: true,
  link: true,
  abstract: true,
  key_points: true,
  concepts: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Concept = typeof concepts.$inferSelect;
export type InsertConcept = z.infer<typeof insertConceptSchema>;

export type TheoryContent = typeof theoryContent.$inferSelect;
export type InsertTheoryContent = z.infer<typeof insertTheoryContentSchema>;

export type CodeImplementation = typeof codeImplementations.$inferSelect;
export type InsertCodeImplementation = z.infer<typeof insertCodeImplementationSchema>;

export type Experiment = typeof experiments.$inferSelect;
export type InsertExperiment = z.infer<typeof insertExperimentSchema>;

export type Paper = typeof papers.$inferSelect;
export type InsertPaper = z.infer<typeof insertPaperSchema>;
