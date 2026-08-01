const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Signup / Register User
const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        email = email.trim().toLowerCase();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
