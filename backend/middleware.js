const jwt = require('jsonwebtoken');
const User = require('./models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token string after 'Bearer'
            token = req.headers.authorization.split(' ')[1];

            // Verify token using JWT secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user data from database without password
            req.user = await User.findById(decoded.id).select('-password');

            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
