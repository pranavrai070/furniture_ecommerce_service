const Product = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, ratings, reviews, sizes, colors } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            images: [], // Leave images array empty for now
            ratings: ratings || 0, // Default ratings to 0 if not provided
            reviews: reviews || [], // Default reviews to an empty array if not provided
            sizes: sizes || [], // Default sizes to an empty array if not provided
            colors: colors || [] // Default colors to an empty array if not provided
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



module.exports={
    getProducts,
    createProduct
}
