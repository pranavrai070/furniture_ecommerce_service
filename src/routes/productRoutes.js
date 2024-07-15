const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',productController.getProducts);
router.post('/product',productController.getProduct);
router.post('/', authMiddleware.protect, productController.createProduct);

module.exports = router;
