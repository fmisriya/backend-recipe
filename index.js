import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const filePath = "./recipes.json"; // recipes.json must be in same folder as index.js

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Recipe API 🚀 Use /api/recipes to access recipes.");
});

// GET all recipes
app.get("/api/recipes", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data" });
    }
    try {
      const recipes = JSON.parse(data || "[]");
      res.json(recipes);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON format in recipes.json" });
    }
  });
});

// POST a new recipe
app.post("/api/recipes", (req, res) => {
  const newRecipe = req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    let recipes = [];
    try {
      recipes = JSON.parse(data || "[]");
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON format in recipes.json" });
    }

    recipes.push(newRecipe);

    fs.writeFile(filePath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save data" });
      }
      res.status(201).json(newRecipe);
    });
  });
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
