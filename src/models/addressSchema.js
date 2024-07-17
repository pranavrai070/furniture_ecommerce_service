const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    buildingNumber: { type: String, required: true },
    streetName: { type: String, required: true },
    landMark: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressName: { type: String, required: true },
});

module.exports = addressSchema;
