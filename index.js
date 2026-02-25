const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// --- DATABASE QUOTE SCHEMA ---
const QuoteSchema = new mongoose.Schema({
  text: String,
  quote: String,
  createdAt: { type: Date, default: Date.now }
});
const Quote = mongoose.model('Quote', QuoteSchema);

// --- DATABASE PRODUCT SCHEMA ---
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// Existing Status Route
app.get('/api/status', (req, res) => {
  res.json({ 
    status: "Online",
    message: "AWS Backend is reachable!",
    owner: "Tremain", // Change this to your name!!!
    timestamp: new Date()
  });
});

// --- PRODUCT ROUTES ---
// Lab task: CREATE a new product
app.post('/products', async (req, res) => {
  try{
    const newEntry = await Product.create({ name, price, description });

    console.log("📥 Data saved to MongoDB:", newEntry);
    res.status(201).json({ message: "Saved successfully!", data: newEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
    
});

// Lab task: READ all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// UPDATE a product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// DELETE a product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});


// --- QUOTE ROUTES ---
// NEW: Route to save data to MongoDB
app.post('/api/save-quote', async (req, res) => {
  try {
    // Adding default values in case one is missing
    const { text = "No text", quote = "No quote" } = req.body;

    const newEntry = await Quote.create({ text, quote });

    // alternative method for create
    // const newEntry = new Quote({ text, quote });
    // await newEntry.save();

    console.log("📥 Data saved to MongoDB:", newEntry);
    res.status(201).json({ message: "Saved successfully!", data: newEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all saved quotes (newest first)
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });