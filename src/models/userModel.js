const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    buildingNumber: { type: String,required: true},
    streetName: { type: String,required: true},
    landMark: { type: String,required: true},
    state: { type: String , required: true},
    city: { type: String, required: true},
    pincode: { type: String, required: true},
    addressName:{ type: String, required: true},
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'],default: 'user' },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    address: { type: [addressSchema], default: [] }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
