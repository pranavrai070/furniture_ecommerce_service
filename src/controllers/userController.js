const User = require('../models/userModel');


const getUserAddresses = async (req, res) => {
    try {
        const {userId}= req.body; // Assuming you have the user ID from a middleware (e.g., JWT)

        // Find the user by ID
        const user = await User.findById(userId).select('address');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the user's addresses
        res.status(200).json({ addresses: user.address });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Function to add a new address to the user's address array
const addUserAddress = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const {userId, buildingNumber, streetName,landMark, state, city, pincode,phoneNumber, addressName } = req.body;

        // Create a new address object
        const newAddress = {
            buildingNumber,
            streetName,
            landMark,
            state,
            city,
            pincode,
            phoneNumber,
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

// Function to delete an address from the user's address array
const deleteUserAddress = async (req, res) => {
    try {
        // const userId = req.user.id; // Assuming you have the user ID from a middleware (e.g., JWT)
        const { userId,addressId } = req.body; // Assuming the addressId is passed in the request body

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the address to delete
        const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Remove the address from the array
        user.address.splice(addressIndex, 1);

        // Save the user document
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully', address: user.address });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress
};
