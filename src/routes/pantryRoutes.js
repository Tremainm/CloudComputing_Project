const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

// GET /pantry - fetch all items
// POST /pantry - create a new item
router.get('/', pantryController.getAllItems);
router.post('/', pantryController.createItem);

// GET /pantry/:id - fetch single item
// PUT /pantry/:id - update item
// DELETE /pantry/:id - delete item
router.get('/:id', pantryController.getItemById);
router.put('/:id', pantryController.updateItem);
router.delete('/:id', pantryController.deleteItem);

module.exports = router;