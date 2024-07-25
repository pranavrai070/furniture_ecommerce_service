const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');

const placeOrder = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const { userId,addressId } = req.body; // Assuming the addressId is passed in the request body

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Find the user and get the address
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const address = user.address.id(addressId);
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Create order items based on cart
        const orderItems = cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price
        }));

        // Create a new order
        const newOrder = new Order({
            user: userId,
            products: orderItems,
            totalAmount: cart.totalValue,
            address: address.toObject(), // Using the address schema from user model
            paymentMode: 'COD' // As COD is the only mode of payment available
        });

        await newOrder.save();

        // Clear the cart
        cart.products = [];
        cart.totalValue = 0;
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getOrders = async (_req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getuserOrders = async (req, res) => {
    try {
        
        const {userId}=req.body;
        const oneUser= await User.findById(userId);
        if(!oneUser){
            return res.status(404).json({message:"No user Found"});
        }
        const orders = await Order.find({user: userId});
        if (orders.length==0) {
            return res.status(404).json({ message: 'No Orders Found' });
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




module.exports={
    getOrders,
    placeOrder,
    getuserOrders
}
