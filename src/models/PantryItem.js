// consistent across local (SQLite) and server (MongoDB) storage.

const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    expiryDate: { type: String, default: null }, // ISO date string "YYYY-MM-DD" or null
}, { timestamps: true });

module.exports = mongoose.model('PantryItem', pantryItemSchema);