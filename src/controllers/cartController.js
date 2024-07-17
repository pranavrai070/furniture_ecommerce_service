const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const { userId,productId, quantity } = req.body;

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the cart by user ID
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [], totalValue: 0 });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (existingProductIndex >= 0) {
            // Update quantity if product already exists
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({ product: productId, quantity, price: product.price });
        }

        // Update total value
        cart.totalValue = cart.products.reduce((total, item) => total + (item.quantity * item.price), 0);

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const {userId,productId } = req.body;

        // Find the cart by user ID
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product index in the cart
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Update total value
        cart.totalValue = cart.products.reduce((total, item) => total + (item.quantity * item.price), 0);

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const emptyCart = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)

        const {userId}=req.body;

        // Find the cart by user ID
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Empty the cart
        cart.products = [];
        cart.totalValue = 0;

        await cart.save();
        res.status(200).json({ message: 'Cart emptied', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const { userId,productId, quantity } = req.body;

        // Find the cart by user ID
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Update the quantity
        cart.products[productIndex].quantity = quantity;

        // Update total value
        cart.totalValue = cart.products.reduce((total, item) => total + (item.quantity * item.price), 0);

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    emptyCart,
    updateCartQuantity
};
