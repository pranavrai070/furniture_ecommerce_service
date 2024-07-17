const Order = require('../models/orderModel');
const User = require('../models/userModel');

// Function to add a new address to the user's address array
const addUserAddress = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const {userId, buildingNumber, streetName,landMark, state, city, pincode, addressName } = req.body;

        // Create a new address object
        const newAddress = {
            buildingNumber,
            streetName,
            landMark,
            state,
            city,
            pincode,
            addressName
        };

        // Find the user by ID and add the new address
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.address.push(newAddress);
        await user.save();

        res.status(200).json({ message: 'Address added successfully', address: user.address });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Function to update an existing address in the user's address array
const updateUserAddress = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const {userId,addressId, ...updatedFields} = req.body; // Extract addressId and the rest of the fields

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the address to update
        const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Update only the fields provided
        Object.keys(updatedFields).forEach(key => {
            user.address[addressIndex][key] = updatedFields[key];
        });

        await user.save();

        res.status(200).json({ message: 'Address updated successfully', address: user.address });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    addUserAddress,
    updateUserAddress
};
