// CRUD handlers for basket items.

const BasketItem = require('../models/BasketItem');

// GET /basket
exports.getAllItems = async (req, res) => {
  try {
    const items = await BasketItem.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching basket items', error: err.message });
  }
};

// POST /basket - body: { name, category, quantity, unit }
exports.createItem = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;
    const newItem = await BasketItem.create({ name, category, quantity, unit });
    res.status(201).json({ message: 'Basket item added', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding basket item', error: err.message });
  }
};

// PUT /basket/:id - body: { quantity }
exports.updateItem = async (req, res) => {
  try {
    const updated = await BasketItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Basket item not found' });
    res.json({ message: 'Basket item updated', item: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating basket item', error: err.message });
  }
};

// DELETE /basket/:id
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await BasketItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Basket item not found' });
    res.json({ message: 'Basket item deleted', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting basket item', error: err.message });
  }
};