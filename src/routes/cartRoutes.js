const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add-to-cart',authMiddleware.protect, cartController.addToCart);
router.post('/remove-from-cart',authMiddleware.protect, cartController.removeFromCart);
router.post('/empty-cart',authMiddleware.protect, cartController.emptyCart);
router.post('/update-cart',authMiddleware.protect, cartController.updateCartQuantity);

module.exports = router;
