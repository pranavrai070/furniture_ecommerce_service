const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: [String], required: true }, // array of strings for description points
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: { type: [String], default: [] }, // array of strings for image URLs
    ratings: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] }, // array of review objects
    sizes: { type: [String], default: [] }, // array for size variants
    colors: { type: [String], default: [] } // array for color variants
});

module.exports = mongoose.model('Product', productSchema);
