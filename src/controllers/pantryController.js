// Routes handled:
//   GET /pantry - getAllItems
//   GET /pantry/:id - getItemById
//   POST /pantry - createItem
//   PUT /pantry/:id - updateItem
//   DELETE /pantry/:id - deleteItem

const PantryItem = require('../models/PantryItem');

// GET /pantry
// Returns all pantry items sorted by name.
exports.getAllItems = async (req, res) => {
  try {
    const items = await PantryItem.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pantry items', error: err.message });
  }
};

// GET /pantry/:id
exports.getItemById = async (req, res) => {
  try {
    const item = await PantryItem.findOne({ clientId: req.params.id });
    if (!item) return res.status(404).json({ message: 'Pantry item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pantry item', error: err.message });
  }
};

// POST /pantry
// Body: { name, category, quantity, unit, location, expiryDate? }
exports.createItem = async (req, res) => {
  try {
    const { clientId, name, category, quantity, unit, location, expiryDate } = req.body;
    const newItem = await PantryItem.create({
      clientId,
      name,
      category,
      quantity,
      unit,
      location,
      expiryDate: expiryDate ?? null,
    });
    res.status(201).json({ message: 'Pantry item added successfully', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding pantry item', error: err.message });
  }
};

// PUT /pantry/:id
// Body: any subset of { name, category, quantity, unit, location, expiryDate }
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await PantryItem.findOneAndUpdate(
      { clientId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Pantry item not found' });
    res.json({ message: 'Pantry item updated', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: 'Error updating pantry item', error: err.message });
  }
};

// DELETE /pantry/:id
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await PantryItem.findOneAndDelete({ clientId: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Pantry item not found' });
    res.json({ message: 'Pantry item deleted', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pantry item', error: err.message });
  }
};