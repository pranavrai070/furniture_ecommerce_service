const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add_address',authMiddleware.protect, userController.addUserAddress);
router.post('/update_address',authMiddleware.protect, userController.updateUserAddress);

module.exports = router;
