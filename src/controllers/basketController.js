const Basket = require('../models/Basket');

// Get basket for a user
exports.getBasket = async (req, res) => {
    try {
        const basket = await Basket.findOne().populate('items.productId');
        if (!basket) {
            return res.status(404).json({ message: 'Basket not found' });
        }
        res.json(basket);
    } catch (error) {
        console.error('Error fetching basket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add item to basket
exports.addToBasket = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Find the user's basket or create a new one
        let basket = await Basket.findOne();
        if (!basket) {
            basket = new Basket({ items: [] });
        }

        // Check if the item is already in the basket
        const existingItem = basket.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            // If it exists, update the quantity
            existingItem.quantity += (quantity || 1);
        } else {
            // If it doesn't exist, add a new item
            basket.items.push({ productId, quantity });
        }

        // Save the basket
        await basket.save();
        res.status(201).json(basket);
    } catch (error) {
        console.error('Error adding to basket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove item from basket
exports.removeFromBasket = async (req, res) => {
    try {
        const { productId } = req.body;

        // Find the user's basket
        const basket = await Basket.findOne();
        if (!basket) {
            return res.status(404).json({ message: 'Basket not found' });
        }

        // Remove the item from the basket
        basket.items = basket.items.filter(item => item.productId.toString() !== productId);
        await basket.save();
        res.json(basket);
    } catch (error) {
        console.error('Error removing from basket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Find the user's basket
        const basket = await Basket.findOne();
        if (!basket) {
            return res.status(404).json({ message: 'Basket not found' });
        }

        // Update the quantity of the item in the basket
        const item = basket.items.find(item => item.productId.toString() === productId);
        if (item) {
            item.quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Item not found in basket' });
        }

        // Save the updated basket
        await basket.save();
        res.json(basket);
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
