const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/get_address',authMiddleware.protect, userController.getUserAddresses);
router.post('/add_address',authMiddleware.protect, userController.addUserAddress);
router.post('/update_address',authMiddleware.protect, userController.updateUserAddress);
router.post('/delete_address',authMiddleware.protect, userController.deleteUserAddress);
router.post('/get_user_cart',authMiddleware.protect, userController.getUserCart);

module.exports = router;
