const mongoose = require('mongoose');
const PantryItem = require('../models/PantryItem');

// Helper: returns an ISO date string N days from today
function getDateFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Seed data mirrors the SQLite seed in database.js on the frontend
const SEED_ITEMS = [
  { name: 'Whole Milk', category: 'Dairy', quantity: 1, unit: 'litre', location: 'Fridge', expiryDate: getDateFromNow(2) },
  { name: 'Cheddar Cheese', category: 'Dairy', quantity: 500, unit: 'g', location: 'Fridge', expiryDate: getDateFromNow(12) },
  { name: 'Whole Wheat Bread', category: 'Bakery', quantity: 1, unit: 'loaf', location: 'Pantry', expiryDate: getDateFromNow(5) },
  { name: 'Sourdough Loaf', category: 'Bakery', quantity: 1, unit: 'loaf', location: 'Pantry', expiryDate: getDateFromNow(-1) },
  { name: 'Broccoli', category: 'Produce', quantity: 2, unit: 'heads', location: 'Fridge', expiryDate: getDateFromNow(3) },
  { name: 'Bananas', category: 'Produce', quantity: 6, unit: 'pcs', location: 'Counter', expiryDate: getDateFromNow(6) },
  { name: 'Greek Yogurt', category: 'Dairy', quantity: 150, unit: 'ml', location: 'Fridge', expiryDate: getDateFromNow(8) },
  { name: 'Orange Juice', category: 'Drinks', quantity: 1, unit: 'litre', location: 'Fridge', expiryDate: getDateFromNow(7) },
  { name: 'Pasta', category: 'Dry Goods', quantity: 500, unit: 'g', location: 'Pantry', expiryDate: getDateFromNow(180) },
  { name: 'Tinned Tomatoes', category: 'Dry Goods', quantity: 3, unit: 'cans', location: 'Pantry', expiryDate: null },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB');

    // Seed only on first launch - skip if data already exists
    const count = await PantryItem.countDocuments();
    if (count === 0) {
      await PantryItem.insertMany(SEED_ITEMS);
      console.log('🟢 Seeded initial pantry items');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;