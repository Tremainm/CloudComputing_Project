const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

// Get basket for a user
router.get('/', basketController.getBasket);
router.post('/', basketController.addToBasket);
router.delete('/', basketController.removeFromBasket);
router.put('/', basketController.updateQuantity);

module.exports = router;
