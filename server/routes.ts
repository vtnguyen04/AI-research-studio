import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertConceptSchema, insertTheoryContentSchema, insertCodeImplementationSchema, insertExperimentSchema, insertPaperSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for concepts
  app.get("/api/concepts", async (req, res) => {
    try {
      const concepts = await storage.getAllConcepts();
      res.json(concepts);
    } catch (error) {
      console.error("Error fetching concepts:", error);
      res.status(500).json({ message: "Failed to fetch concepts" });
    }
  });

  app.get("/api/concepts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const concepts = await storage.getConceptsByCategory(category);
      res.json(concepts);
    } catch (error) {
      console.error(`Error fetching concepts by category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch concepts by category" });
    }
  });

  app.get("/api/concepts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const concept = await storage.getConceptBySlug(slug);
      
      if (!concept) {
        return res.status(404).json({ message: "Concept not found" });
      }
      
      const theory = await storage.getTheoryByConceptId(concept.id);
      const codeImplementations = await storage.getCodeImplementationsByConceptId(concept.id);
      const experiments = await storage.getExperimentsByConceptId(concept.id);
      
      res.json({
        concept,
        theory,
        codeImplementations,
        experiments
      });
    } catch (error) {
      console.error(`Error fetching concept ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch concept" });
    }
  });

  app.post("/api/concepts", async (req, res) => {
    try {
      const validatedData = insertConceptSchema.parse(req.body);
      const concept = await storage.createConcept(validatedData);
      res.status(201).json(concept);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid concept data", errors: error.errors });
      }
      console.error("Error creating concept:", error);
      res.status(500).json({ message: "Failed to create concept" });
    }
  });

  // API routes for theory content
  app.get("/api/theory/:conceptId", async (req, res) => {
    try {
      const conceptId = parseInt(req.params.conceptId);
      const theory = await storage.getTheoryByConceptId(conceptId);
      
      if (!theory) {
        return res.status(404).json({ message: "Theory content not found" });
      }
      
      res.json(theory);
    } catch (error) {
      console.error(`Error fetching theory for concept ${req.params.conceptId}:`, error);
      res.status(500).json({ message: "Failed to fetch theory content" });
    }
  });

  app.post("/api/theory", async (req, res) => {
    try {
      const validatedData = insertTheoryContentSchema.parse(req.body);
      const theory = await storage.createTheoryContent(validatedData);
      res.status(201).json(theory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid theory content data", errors: error.errors });
      }
      console.error("Error creating theory content:", error);
      res.status(500).json({ message: "Failed to create theory content" });
    }
  });

  // API routes for code implementations
  app.get("/api/code/:conceptId", async (req, res) => {
    try {
      const conceptId = parseInt(req.params.conceptId);
      const implementations = await storage.getCodeImplementationsByConceptId(conceptId);
      res.json(implementations);
    } catch (error) {
      console.error(`Error fetching code implementations for concept ${req.params.conceptId}:`, error);
      res.status(500).json({ message: "Failed to fetch code implementations" });
    }
  });

  app.post("/api/code", async (req, res) => {
    try {
      const validatedData = insertCodeImplementationSchema.parse(req.body);
      const implementation = await storage.createCodeImplementation(validatedData);
      res.status(201).json(implementation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid code implementation data", errors: error.errors });
      }
      console.error("Error creating code implementation:", error);
      res.status(500).json({ message: "Failed to create code implementation" });
    }
  });

  // API routes for experiments
  app.get("/api/experiments/:conceptId", async (req, res) => {
    try {
      const conceptId = parseInt(req.params.conceptId);
      const experiments = await storage.getExperimentsByConceptId(conceptId);
      res.json(experiments);
    } catch (error) {
      console.error(`Error fetching experiments for concept ${req.params.conceptId}:`, error);
      res.status(500).json({ message: "Failed to fetch experiments" });
    }
  });

  app.post("/api/experiments", async (req, res) => {
    try {
      const validatedData = insertExperimentSchema.parse(req.body);
      const experiment = await storage.createExperiment(validatedData);
      res.status(201).json(experiment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid experiment data", errors: error.errors });
      }
      console.error("Error creating experiment:", error);
      res.status(500).json({ message: "Failed to create experiment" });
    }
  });

  // API routes for papers
  app.get("/api/papers", async (req, res) => {
    try {
      const papers = await storage.getAllPapers();
      res.json(papers);
    } catch (error) {
      console.error("Error fetching papers:", error);
      res.status(500).json({ message: "Failed to fetch papers" });
    }
  });

  app.get("/api/papers/:id", async (req, res) => {
    try {
      const paperId = parseInt(req.params.id);
      const paper = await storage.getPaperById(paperId);
      
      if (!paper) {
        return res.status(404).json({ message: "Paper not found" });
      }
      
      res.json(paper);
    } catch (error) {
      console.error(`Error fetching paper ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch paper" });
    }
  });

  app.post("/api/papers", async (req, res) => {
    try {
      const validatedData = insertPaperSchema.parse(req.body);
      const paper = await storage.createPaper(validatedData);
      res.status(201).json(paper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid paper data", errors: error.errors });
      }
      console.error("Error creating paper:", error);
      res.status(500).json({ message: "Failed to create paper" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
