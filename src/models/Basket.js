const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 }
});

const basketSchema = new mongoose.Schema({
    items: [basketItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Basket', basketSchema);