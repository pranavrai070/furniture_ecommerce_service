require('dotenv').config();
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const jwtUtils = require('../utils/jwtUtils');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASSWORD
    },
    tls:{
      rejectUnauthorized:false
    }
});

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
};

const adminPasskey=process.env.ADMIN_PASSKEY

const signup = async (req, res) => {
    try {
        const { name, email, password, role='user', passkey } = req.body;

        // Check if the user wants to sign up as an admin
        if (role==='admin' && !passkey) {
            return res.status(403).json({ error: 'Passkey is Required for Admin Signup' });
        }else if(role === 'admin' && passkey !== adminPasskey){
            return res.status(403).json({ error: 'Invalid passkey for admin signup' });
        }

        const newUser = new User({ name, email, password, role });

        // Generate OTP
        const otp = generateOTP();
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

        await newUser.save();

        // Send OTP to user's email
        const mailOptions = {
            from: 'pranavrai2070@gmail.com',
            to: email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        
       if(role==='admin'){
        return res.status(201).json({ message: 'Admin created successfully. Check your email for OTP.' });
       }else {
        return res.status(201).json({ message: 'User created successfully. Check your email for OTP.' });
       }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if(!user.otp && user.verified===true){
            return res.status(409).json({error:"User Already Verified"})
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwtUtils.generateToken({ id: user._id, role: user.role });

        return res.status(200).json({ message: 'User verified successfully' ,token});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email} = req.body;
        const user = await User.findOne({ email });

        // Generate OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

        await user.save();

        // Send OTP to user's email
        const mailOptions = {
            from: 'pranavrai2070@gmail.com',
            to: email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}`
        };


        await transporter.sendMail(mailOptions);


        return res.status(200).json({ message: "OTP sent Successfully Check Your Email" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        let isVerified=false;
        let token=null;

        // Check if user exists and password is correct
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the user is verified
        if (user.verified) {
            isVerified = true;
            // Generate token
        token = jwtUtils.generateToken({ id: user._id, role: user.role });
        }

        
        return res.status(200).json({ token,isVerified });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports ={
    signup,
    login,
    verifyOtp,
    sendOtp
}
