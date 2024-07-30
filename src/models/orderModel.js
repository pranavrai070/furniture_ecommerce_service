const mongoose = require('mongoose');
const addressSchema = require('./addressSchema');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image:{type:String}
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    address: { type: addressSchema, required: true },
    status: { type: String, default: 'pending' },
    paymentMode: { type: String, default: 'COD' }
});

module.exports = mongoose.model('Order', orderSchema);
