// Mounted at '/basket' in server.js.

const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

router.get('/', basketController.getAllItems);
router.post('/', basketController.createItem);
router.post('/save-list', basketController.saveList); 
router.put('/:id', basketController.updateItem);
router.delete('/:id', basketController.deleteItem);

module.exports = router;