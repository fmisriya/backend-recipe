const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File path for storing recipes
const dataFilePath = path.join('/tmp', 'recipes.json');


// Helper: Read recipes from file
function readRecipes() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]');
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Read error:', err.message);
    return [];
  }
}

// Helper: Write recipes to file
function writeRecipes(recipes) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(recipes, null, 2));
  } catch (err) {
    throw new Error('Failed to write to file');
  }
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Recipe Sharing API!');
});

// GET all recipes
app.get('/api/recipes', (req, res) => {
  const recipes = readRecipes();
  res.json(recipes);
});

// POST a new recipe
app.post('/api/recipes', (req, res) => {
  const { title, ingredients, instructions, cookTime } = req.body;

  // Basic validation
  if (
    typeof title !== 'string' ||
    !Array.isArray(ingredients) ||
    typeof instructions !== 'string' ||
    typeof cookTime !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime
  };

  try {
    const recipes = readRecipes();
    recipes.push(newRecipe);
    writeRecipes(recipes);
    res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
  } catch (err) {
    console.error('Error saving recipe:', err.message);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('Reading from:', dataFilePath);
