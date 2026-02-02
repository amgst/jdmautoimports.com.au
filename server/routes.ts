import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import multer from "multer";
import { storage } from "./storage";
import { insertCarSchema } from "@shared/schema";
import { z } from "zod";
import { upload, getImageUrl, extractFilenameFromUrl } from "./upload";

export async function registerRoutes(app: Express): Promise<Server | void> {
  // Serve attached_assets folder statically (includes uploads and generated_images)
  // Only in non-serverless environments (local dev)
  if (process.env.VERCEL !== "1") {
    const assetsPath = path.resolve(import.meta.dirname, "..", "attached_assets");
    app.use("/attached_assets", express.static(assetsPath));
  }

  // Test endpoint to verify route registration
  app.get("/api/upload/test", (req, res) => {
    res.json({ message: "Upload route is working" });
  });

  // Upload single image endpoint
  app.post("/api/upload/image", (req, res, next) => {
    console.log("Upload route hit - Content-Type:", req.headers['content-type']);
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Maximum size is 5MB" });
          }
          return res.status(400).json({ error: err.message });
        }
        if (err) {
          return res.status(400).json({ error: err.message || "Upload failed" });
        }
        return next(err);
      }
      
      try {
        if (!req.file) {
          console.log("No file in request");
          return res.status(400).json({ error: "No image file provided" });
        }
        console.log("File uploaded successfully:", req.file.filename || "in-memory");
        const imageUrl = await getImageUrl(req.file.filename || req.file.buffer, req.file);
        const filename = req.file.filename || extractFilenameFromUrl(imageUrl) || "unknown";
        res.json({ url: imageUrl, filename });
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        res.status(500).json({ error: errorMessage });
      }
    });
  });

  // Upload multiple images endpoint
  app.post("/api/upload/images", async (req, res, next) => {
    upload.array("images", 10)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Maximum size is 5MB" });
          }
          if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ error: "Too many files. Maximum is 10 files" });
          }
          return res.status(400).json({ error: err.message });
        }
        if (err) {
          return res.status(400).json({ error: err.message || "Upload failed" });
        }
        return next(err);
      }
      
      try {
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
          return res.status(400).json({ error: "No image files provided" });
        }
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const urls = await Promise.all(
          files.map(async (file) => {
            const url = await getImageUrl(file.filename || file.buffer, file);
            const filename = file.filename || extractFilenameFromUrl(url) || "unknown";
            return { url, filename };
          })
        );
        res.json({ urls });
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload images";
        res.status(500).json({ error: errorMessage });
      }
    });
  });

  app.get("/api/cars", async (_req, res) => {
    try {
      const cars = await storage.getAllCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/by-slug/:slug", async (req, res) => {
    try {
      const car = await storage.getCarBySlug(req.params.slug);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      const car = await storage.createCar(validatedData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid car data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create car" });
    }
  });

  app.patch("/api/cars/:id", async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      const car = await storage.updateCar(req.params.id, validatedData);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid car data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const success = await storage.deleteCar(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  // Only create HTTP server in non-serverless environments
  if (process.env.VERCEL !== "1") {
    const httpServer = createServer(app);
    return httpServer;
  }
  // For Vercel, just return void
  return;
}
