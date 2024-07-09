const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        let totalAmount = 0;

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.user.id,
            products,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports={
    getOrders,
    createOrder
}
