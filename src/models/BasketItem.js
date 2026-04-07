// Mongoose model for a basket item.
// Items are standalone entries - not references to pantry items.

const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('BasketItem', basketItemSchema);