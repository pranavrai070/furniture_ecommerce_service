const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    image:{type:String},
    price: { type: Number, required: true } // Store price at the time of adding to cart
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [cartItemSchema], default: [] },
    totalValue: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);
